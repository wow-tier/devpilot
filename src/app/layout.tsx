import './styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'DevPilot',
  description: 'AI-powered development assistant',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
