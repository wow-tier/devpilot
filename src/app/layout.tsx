import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "AI Code Agent - Intelligent Development Workspace",
  description: "An AI-powered code development workspace that helps you build and modify code through natural language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
