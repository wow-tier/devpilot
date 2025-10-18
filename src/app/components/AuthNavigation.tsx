'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, ArrowRight, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { AccentButton } from './ui';
import { useAuth } from '../hooks/useAuth';

interface AuthNavigationProps {
  transparent?: boolean;
}

export default function AuthNavigation({ transparent = false }: AuthNavigationProps) {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`border-b border-cursor-border sticky top-0 z-50 backdrop-blur-xl ${
      transparent ? 'bg-cursor-surface/80' : 'bg-cursor-surface'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent-gradient rounded-cursor-md flex items-center justify-center shadow-cursor-md">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-cursor-text">AI Code Agent</h1>
            </Link>
            {!loading && !isAuthenticated && (
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm font-medium text-cursor-text-muted hover:text-cursor-text transition-colors">
                  Features
                </a>
                <Link href="/pricing" className="text-sm font-medium text-cursor-text-muted hover:text-cursor-text transition-colors">
                  Pricing
                </Link>
                <a href="#" className="text-sm font-medium text-cursor-text-muted hover:text-cursor-text transition-colors">
                  Docs
                </a>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cursor-surface-hover rounded-cursor-sm border border-cursor-border">
                  {user.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt="Profile" 
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-accent-gradient rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-cursor-text">
                    {user.name || user.email}
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  className="p-2 text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover rounded-cursor-sm transition-all"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
                
                <Link
                  href="/settings"
                  className="p-2 text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover rounded-cursor-sm transition-all"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover rounded-cursor-sm transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-cursor-text-muted hover:text-cursor-text transition-colors font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link href="/login?signup=true">
                  <AccentButton icon={<ArrowRight className="w-4 h-4" />}>
                    Get Started
                  </AccentButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
