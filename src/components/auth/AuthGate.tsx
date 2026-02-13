import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthPanel } from "@/components/auth/AuthPanel";

interface AuthGateProps {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

export const AuthGate = ({
  title = "Sign in to see your results",
  subtitle = "Create a free account to unlock the full analysis.",
  onSuccess,
}: AuthGateProps) => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Card className="border-border/70 bg-gradient-to-b from-card via-muted/10 to-muted/40 shadow-xl shadow-black/15 ring-1 ring-border/50">
        <CardContent className="space-y-6 pt-6">
          <AuthPanel title={title} subtitle={subtitle} onSuccess={onSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGate;
