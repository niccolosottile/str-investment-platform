import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthError, Provider, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  displayName: string | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithOAuth: (provider: Provider, preferPopup: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getDisplayName = (user: User | null): string | null => {
  if (!user) return null;
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const possible = [
    metadata.full_name,
    metadata.name,
    metadata.preferred_username,
    metadata.user_name,
  ].filter(Boolean);

  if (possible.length > 0) {
    const fullName = String(possible[0]).trim();
    if (fullName.length > 0) {
      return fullName.split(/\s+/)[0];
    }
  }

  if (user.email) {
    const emailName = user.email.split("@")[0];
    return emailName || user.email;
  }

  return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "supabase-auth") return;

      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setLoading(false);
      });
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const signInWithOAuth = useCallback(async (provider: Provider, preferPopup: boolean) => {
    const redirectTo = `${window.location.origin}/auth/callback`;

    if (preferPopup) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      const popup = window.open(
        data.url,
        "supabase-oauth",
        "popup=yes,width=500,height=700,menubar=no,toolbar=no,location=no,status=no"
      );

      if (!popup) {
        const { error: redirectError } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo },
        });
        if (redirectError) {
          throw redirectError;
        }
      } else {
        popup.focus();
      }

      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, []);

  const displayName = useMemo(() => getDisplayName(user), [user]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    displayName,
    loading,
    signInWithPassword,
    signUpWithPassword,
    signInWithOAuth,
    signOut,
  }), [
    session,
    user,
    displayName,
    loading,
    signInWithPassword,
    signUpWithPassword,
    signInWithOAuth,
    signOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export type { AuthError };
