import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("Finalizing authentication...");

  useEffect(() => {
    const finalize = async () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("code")) {
        setStatus("error");
        setMessage("No authentication code found.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      setMessage("Signed in successfully. You can close this window.");

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "supabase-auth" }, window.location.origin);
        window.close();
      } else {
        navigate("/results", { replace: true });
      }
    };

    finalize();
  }, [navigate]);

  return (
    <MainLayout title="STR Invest">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center py-16 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">{message}</h2>
          {status === "error" && (
            <Alert variant="destructive">
              <AlertTitle>Authentication failed</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthCallback;
