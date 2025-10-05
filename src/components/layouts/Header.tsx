import React, { useId } from "react";

interface HeaderProps {
  backElement?: React.ReactNode;
  title?: string;
}

export const Header = ({ backElement, title = "STR Invest" }: HeaderProps) => {
  const skipId = useId();
  return (
    <>
      {/* Accessible skip link */}
      <a href={`#${skipId}`} className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow" />
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>

          <div>{backElement}</div>
        </div>
      </header>

      {/* Landmark target for skip link */}
      <div id={skipId} />
    </>
  );
};

export default Header;
