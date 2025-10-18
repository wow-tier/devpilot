'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2, Code2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = searchParams?.get('signup') === 'true';

  const [isSignupMode, setIsSignupMode] = useState(isSignup);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isSignupMode ? '/api/auth/signup' : '/api/auth/signin';
      const body = isSignupMode 
        ? formData 
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Store ONLY the token and user ID in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        }));
        
        // Clear any old localStorage data
        localStorage.removeItem('repositories');
        localStorage.removeItem('currentRepo');

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] relative overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#58a6ff]/30">
            <span className="text-3xl">💻</span>
          </div>
          <h1 className="text-3xl font-bold text-[#c9d1d9] mb-2">
            {isSignupMode ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-[#8b949e]">
            {isSignupMode ? 'Start coding with AI' : 'Continue your AI coding journey'}
          </p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-[#da3633]/10 border border-[#da3633]/50 rounded-lg text-[#f85149] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignupMode && (
              <div>
                <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7681]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                    placeholder="John Doe"
                    required={isSignupMode}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7681]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7681]" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-all font-medium shadow-lg shadow-[#238636]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSignupMode ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignupMode ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignupMode(!isSignupMode);
                setError('');
              }}
              className="text-[#58a6ff] hover:text-[#79c0ff] transition-colors text-sm"
              disabled={isLoading}
            >
              {isSignupMode 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#58a6ff] animate-spin" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
