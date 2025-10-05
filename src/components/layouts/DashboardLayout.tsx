import React from "react";
import MainLayout from "@/components/layouts/MainLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
  backElement?: React.ReactNode;
}

export const DashboardLayout = ({ children, backElement }: DashboardLayoutProps) => {
  return (
    <MainLayout backElement={backElement}>
      <div className="max-w-6xl mx-auto space-y-8">{children}</div>
    </MainLayout>
  );
};

export default DashboardLayout;
