import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-cursor-base">
      {children}
    </div>
  );
}
