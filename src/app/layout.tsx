import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body 
        className={`min-h-screen bg-cursor-base text-cursor-text antialiased ${inter.className}`}
        suppressHydrationWarning
      >
        <nav>
          <ul>
            <li><a href="/admin">Admin</a></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}