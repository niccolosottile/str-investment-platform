import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

export type AuthMode = "signin" | "signup";

interface AuthPanelProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  title?: string;
  subtitle?: string;
}

const providers = [
  { id: "google", label: "Google", icon: Chrome },
] as const;

export const AuthPanel = ({
  initialMode = "signin",
  onSuccess,
  onForgotPassword,
  title = "Welcome back",
  subtitle = "Sign in to unlock your results",
}: AuthPanelProps) => {
  const { signInWithPassword, signUpWithPassword, signInWithOAuth } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const header = useMemo(() => {
    if (mode === "signup") {
      return {
        title: "Create your account",
        subtitle: "Save your progress and access insights",
      };
    }

    return { title, subtitle };
  }, [mode, title, subtitle]);

  const handleFieldChange = (field: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await signUpWithPassword(formState.email, formState.password, formState.fullName.trim());
        toast("Check your inbox", {
          description: "Confirm your email to finish creating your account.",
        });
      } else {
        await signInWithPassword(formState.email, formState.password);
      }

      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (providerId: typeof providers[number]["id"]) => {
    setError(null);
    setOauthLoading(providerId);

    try {
      await signInWithOAuth(providerId, true);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "OAuth sign in failed";
      setError(message);
      setOauthLoading(null);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-border/60 bg-gradient-to-b from-background via-background to-muted/30 p-4 shadow-lg shadow-black/5">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">{header.title}</h2>
        <p className="text-sm text-muted-foreground">{header.subtitle}</p>
      </div>

      <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="space-y-4 rounded-md border border-border/60 bg-background/90 p-4 shadow-md shadow-black/5 ring-1 ring-border/40">
          <form className="space-y-4" onSubmit={handleEmailAuth}>
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-foreground">Email</Label>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                required
                className="border-border/80 bg-background/90 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30"
                value={formState.email}
                onChange={handleFieldChange("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-foreground">Password</Label>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                required
                className="border-border/80 bg-background/90 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30"
                value={formState.password}
                onChange={handleFieldChange("password")}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <Button
              variant="link"
              className="px-0"
              type="button"
              asChild
              onClick={onForgotPassword}
            >
              <Link to="/auth/reset">Forgot password?</Link>
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4 rounded-md border border-border/60 bg-background/90 p-4 shadow-md shadow-black/5 ring-1 ring-border/40">
          <form className="space-y-4" onSubmit={handleEmailAuth}>
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-foreground">Full name</Label>
              <Input
                id="signup-name"
                type="text"
                autoComplete="name"
                required
                className="border-border/80 bg-background/90 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30"
                value={formState.fullName}
                onChange={handleFieldChange("fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-foreground">Email</Label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                className="border-border/80 bg-background/90 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30"
                value={formState.email}
                onChange={handleFieldChange("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-foreground">Password</Label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                required
                className="border-border/80 bg-background/90 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30"
                value={formState.password}
                onChange={handleFieldChange("password")}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 rounded-md border border-border/60 bg-muted/40 p-4 shadow-md shadow-black/5 ring-1 ring-border/30">
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">or continue with</span>
          <Separator className="flex-1" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {providers.map((provider) => {
            const Icon = provider.icon;
            const isLoading = oauthLoading === provider.id;
            return (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => handleOAuth(provider.id)}
                disabled={isLoading}
              >
                <Icon className="h-4 w-4" />
                {isLoading ? `Connecting ${provider.label}...` : provider.label}
              </Button>
            );
          })}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Authentication error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AuthPanel;
