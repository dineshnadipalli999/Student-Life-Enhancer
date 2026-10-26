import type { Metadata } from "next";
import "./globals.css";
import ClientAppShell from "@/components/layout/ClientAppShell";

export const metadata: Metadata = {
  title: "Student Life Enhancer+",
  description:
    "AI-driven career, learning and opportunity intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientAppShell>{children}</ClientAppShell>
      </body>
    </html>
  );
}