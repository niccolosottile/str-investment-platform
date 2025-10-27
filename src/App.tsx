import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { UserLocationProvider } from "@/contexts/UserLocationContext";

const queryClient = new QueryClient();

import Index from "@/pages/Index";
import Wizard from "@/pages/Wizard";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";  

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserLocationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/results" element={<Results />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserLocationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
