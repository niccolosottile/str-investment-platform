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
      <Card>
        <CardContent className="space-y-6 pt-6">
          <AuthPanel title={title} subtitle={subtitle} onSuccess={onSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGate;
