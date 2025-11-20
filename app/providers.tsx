"use client"; // This component MUST be a client component

import { ThemeProvider } from "@/components/theme-provide";
import { SessionProvider } from "next-auth/react";
import { MenuBar } from "../components/menuBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
