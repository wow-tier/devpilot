import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import "./styles/animations.css";
import "./styles/github.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Code Agent",
  description: "AI-powered IDE for modern developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/uploads/site/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
