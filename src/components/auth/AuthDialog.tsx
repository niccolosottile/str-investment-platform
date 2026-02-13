import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuthPanel } from "@/components/auth/AuthPanel";

interface AuthDialogProps {
  triggerLabel?: string;
  title?: string;
  subtitle?: string;
}

export const AuthDialog = ({
  triggerLabel = "Sign in",
  title = "Welcome back",
  subtitle = "Sign in to continue",
}: AuthDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <AuthPanel
          onSuccess={() => setOpen(false)}
          onForgotPassword={() => setOpen(false)}
          title={title}
          subtitle={subtitle}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
