import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";

const AuthReset = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"request" | "reset">("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = useMemo(() => `${window.location.origin}/auth/reset`, []);

  useEffect(() => {
    const prepare = async () => {
      const params = new URLSearchParams(window.location.search);
      const hasCode = params.has("code");
      const hash = window.location.hash.replace(/^#/, "");
      const hashParams = new URLSearchParams(hash);
      const hasTokens = hashParams.has("access_token") && hashParams.has("refresh_token");

      if (hasCode) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (exchangeError) {
          setError(exchangeError.message);
          setMode("request");
          return;
        }
        setMode("reset");
        return;
      }

      if (hasTokens) {
        const accessToken = hashParams.get("access_token") ?? "";
        const refreshToken = hashParams.get("refresh_token") ?? "";
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) {
          setError(sessionError.message);
          setMode("request");
          return;
        }
        setMode("reset");
      }
    };

    prepare();
  }, []);

  const handleRequestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    toast("Reset email sent", {
      description: "Check your inbox for the password reset link.",
    });
    setLoading(false);
  };

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    toast("Password updated", {
      description: "You are now signed in with your new password.",
    });
    setLoading(false);
    navigate("/results", { replace: true });
  };

  return (
    <MainLayout title="STR Invest">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 py-10">
        <Card className="border-border/70 bg-gradient-to-b from-card via-muted/10 to-muted/40 shadow-xl shadow-black/15 ring-1 ring-border/50">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground">
                {mode === "reset" ? "Set a new password" : "Reset your password"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === "reset"
                  ? "Choose a new password to finish your reset."
                  : "Enter your email and we will send you a reset link."}
              </p>
            </div>

            {mode === "request" ? (
              <form className="space-y-4" onSubmit={handleRequestReset}>
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-foreground">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    className="border-border/80 bg-background/90 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Sending link..." : "Send reset link"}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleUpdatePassword}>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-foreground">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="border-border/80 bg-background/90 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update password"}
                </Button>
              </form>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Reset failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuthReset;
