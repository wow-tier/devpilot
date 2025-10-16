'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, Zap, GitBranch, Terminal, Sparkles, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">AI Code Agent</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-300 hover:text-white transition-colors font-medium">
                Sign In
              </Link>
              <Link 
                href="/login?signup=true" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/50 font-medium"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Development Platform
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Code with AI,
            <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Ship 10x Faster
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            The professional IDE that understands natural language. Build, refactor, and deploy code with intelligent AI assistance.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/login?signup=true"
              className="group px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-500/50 flex items-center gap-2"
            >
              Start Coding Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-slate-800 text-white text-lg font-semibold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
            >
              View Features
            </Link>
          </div>
        </div>

        {/* Screenshot/Demo */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-slate-400 font-mono">workspace/example.ts</span>
          </div>
          <div className="bg-slate-950 p-8 font-mono text-sm">
            <div className="text-green-400 mb-2">// AI: Adding error handling...</div>
            <div className="text-slate-300">
              <span className="text-purple-400">export class</span>{' '}
              <span className="text-yellow-400">UserService</span>{' {'}
              <div className="ml-4 text-blue-400">
                async <span className="text-yellow-400">getUser</span>(id: string) {'{'}
              </div>
              <div className="ml-8 text-purple-400">try {'{'}</div>
              <div className="ml-12">
                <span className="text-purple-400">return await</span> db.user.findById(id);
              </div>
              <div className="ml-8">
                {'}'} <span className="text-purple-400">catch</span> (error) {'{'}
              </div>
              <div className="ml-12">
                logger.error(<span className="text-green-400">'Failed to fetch user'</span>, error);
              </div>
              <div className="ml-12">
                <span className="text-purple-400">throw new</span>{' '}
                <span className="text-yellow-400">UserNotFoundError</span>(id);
              </div>
              <div className="ml-8">{'}'}</div>
              <div className="ml-4">{'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Everything You Need</h3>
          <p className="text-xl text-slate-400">Professional tools for modern development</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: 'AI-Powered Coding',
              description: 'Natural language to production-ready code. Intelligent refactoring and optimization.'
            },
            {
              icon: <Code2 className="w-6 h-6" />,
              title: 'Professional IDE',
              description: 'Monaco editor, multi-tab support, IntelliSense, and advanced code navigation.'
            },
            {
              icon: <GitBranch className="w-6 h-6" />,
              title: 'Git Integration',
              description: 'Built-in version control with AI-generated commit messages and branch management.'
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Lightning Fast',
              description: 'Turbopack compilation, instant hot reload, and optimized performance.'
            },
            {
              icon: <Terminal className="w-6 h-6" />,
              title: 'Integrated Terminal',
              description: 'Execute commands, run scripts, and manage your environment seamlessly.'
            },
            {
              icon: <Lock className="w-6 h-6" />,
              title: 'Secure & Private',
              description: 'Enterprise-grade security with encrypted connections and private workspaces.'
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group p-8 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6 py-24">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xl text-slate-400 mb-10">
            Join thousands of developers building better software with AI.
          </p>
          <Link
            href="/login?signup=true"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 text-lg font-semibold rounded-xl hover:bg-slate-100 transition-all hover:shadow-xl"
          >
            Start Free Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">AI Code Agent</span>
              </div>
              <p className="text-slate-400 text-sm">
                The AI-powered IDE for modern developers.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 AI Code Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
