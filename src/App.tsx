import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserLocationProvider } from "@/contexts/UserLocationContext";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

import Index from "@/pages/Index";
import Wizard from "@/pages/Wizard";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";  
import AuthCallback from "@/pages/AuthCallback";
import AuthReset from "@/pages/AuthReset";
import RequireAuth from "@/components/auth/RequireAuth";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserLocationProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/wizard" element={<Wizard />} />
              <Route path="/results" element={
                <RequireAuth>
                  <Results />
                </RequireAuth>
              } />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/reset" element={<AuthReset />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </UserLocationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
