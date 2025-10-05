import React from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  backElement?: React.ReactNode;
  className?: string;
  title?: string;
}

export const MainLayout = ({ children, backElement, className = "", title }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header backElement={backElement} title={title} />

      <main className={`container mx-auto px-4 py-8 ${className}`}>{children}</main>
    </div>
  );
};

export default MainLayout;
