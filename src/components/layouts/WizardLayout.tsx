import React from "react";
import MainLayout from "@/components/layouts/MainLayout";

interface WizardLayoutProps {
  children: React.ReactNode;
  backElement?: React.ReactNode;
}

export const WizardLayout = ({ children, backElement }: WizardLayoutProps) => {
  return (
    <MainLayout backElement={backElement}>
      <div className="max-w-4xl mx-auto space-y-8">{children}</div>
    </MainLayout>
  );
};

export default WizardLayout;
