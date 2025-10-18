'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthNavigationProps {
  transparent?: boolean;
}

interface SiteSettings {
  siteName: string;
  logoUrl: string | null;
  logoWidth: number;
  logoHeight: number;
}

export default function AuthNavigation({ }: AuthNavigationProps) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ 
    siteName: 'AI Code Agent', 
    logoUrl: null,
    logoWidth: 48,
    logoHeight: 48
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/site-settings');
        const data = await res.json();
        if (data.settings) {
          setSiteSettings(data.settings);
        }
      } catch (error) {
        console.error('Failed to load site settings:', error);
      }
    };
    loadSettings();
    // Only load once on mount, no polling needed
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-[#010409] border-b border-[#30363d] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-[64px]">
          <div className="flex items-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {siteSettings.logoUrl ? (
                <Image 
                  src={siteSettings.logoUrl} 
                  alt={siteSettings.siteName}
                  width={32}
                  height={32}
                  className="rounded-md"
                  unoptimized
                  key={siteSettings.logoUrl}
                />
              ) : (
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-black" />
                </div>
              )}
              <span className="text-[15px] font-semibold text-white">{siteSettings.siteName}</span>
            </Link>
            {!loading && !isAuthenticated && (
              <div className="hidden md:flex items-center gap-1 ml-4">
                <a href="#features" className="px-3 py-2 text-[13px] font-medium text-[#7d8590] hover:text-white transition-colors">
                  Features
                </a>
                <Link href="/pricing" className="px-3 py-2 text-[13px] font-medium text-[#7d8590] hover:text-white transition-colors">
                  Pricing
                </Link>
                <a href="#" className="px-3 py-2 text-[13px] font-medium text-[#7d8590] hover:text-white transition-colors">
                  Docs
                </a>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-6 h-6 border-2 border-[#7d8590] border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated && user ? (
              <>
                <button className="p-2 text-[#7d8590] hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-[13px] font-medium text-[#c9d1d9] hover:text-white transition-colors"
                  title="Dashboard"
                >
                  Dashboard
                </Link>
                
                <Link
                  href="/settings"
                  className="px-3 py-1.5 text-[13px] font-medium text-[#7d8590] hover:text-white transition-colors"
                  title="Settings"
                >
                  Settings
                </Link>
                
                <div className="w-px h-6 bg-[#21262d] mx-2"></div>

                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt="Profile" 
                      width={32}
                      height={32}
                      className="rounded-full object-cover border-2 border-[#21262d]"
                      unoptimized
                      key={user.avatar}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
                
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-[13px] font-medium text-[#7d8590] hover:text-white transition-colors"
                  title="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-1.5 text-[13px] font-medium text-white hover:opacity-80 transition-opacity"
                >
                  Sign in
                </Link>
                <Link href="/login?signup=true" className="ml-2 px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-[13px] font-medium rounded-md transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
