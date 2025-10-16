'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Code2, Zap, GitBranch, Terminal, Sparkles, Lock,
  ArrowRight, Play, Check
} from 'lucide-react';
import { GlassPanel, AccentButton } from '../components/ui';

export default function LandingPage() {
  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI-Powered Coding',
      description: 'Natural language to production-ready code. Intelligent refactoring and optimization.'
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: 'Professional IDE',
      description: 'Monaco editor, multi-tab support, IntelliSense, and advanced code navigation.'
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: 'Git Integration',
      description: 'Built-in version control with AI-generated commit messages and branch management.'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Lightning Fast',
      description: 'Instant hot reload, optimized performance, and seamless development experience.'
    },
    {
      icon: <Terminal className="w-5 h-5" />,
      title: 'Integrated Terminal',
      description: 'Execute commands, run scripts, and manage your environment seamlessly.'
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted connections and private workspaces.'
    },
  ];

  return (
    <div className="min-h-screen bg-cursor-base relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-cursor-border bg-cursor-surface/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent-gradient rounded-cursor-md flex items-center justify-center shadow-cursor-md">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-cursor-text">AI Code Agent</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="px-4 py-2 text-cursor-text-muted hover:text-cursor-text transition-colors font-medium text-sm"
              >
                Sign In
              </Link>
              <Link href="/login?signup=true">
                <AccentButton icon={<ArrowRight className="w-4 h-4" />}>
                  Get Started Free
                </AccentButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-accent-blue text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Development Platform
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-cursor-text mb-6 tracking-tight leading-tight">
              Code with AI,
              <span className="block text-accent-blue">
                Ship 10x Faster
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-cursor-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
              The professional IDE that understands natural language. Build, refactor, and deploy code with intelligent AI assistance.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/login?signup=true">
                <AccentButton 
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />}
                >
                  Start Coding Now
                </AccentButton>
              </Link>
              <Link href="#features">
                <AccentButton 
                  variant="secondary"
                  size="lg"
                  icon={<Play className="w-5 h-5" />}
                >
                  View Features
                </AccentButton>
              </Link>
            </div>
          </div>

          {/* Screenshot/Demo */}
          <GlassPanel className="relative overflow-hidden">
            <div className="bg-cursor-surface-hover px-4 py-3 border-b border-cursor-border flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
              <span className="text-sm text-cursor-text-muted font-mono">workspace/example.ts</span>
            </div>
            <div className="bg-cursor-base p-6 md:p-8 font-mono text-sm overflow-x-auto">
              <div className="text-success mb-2">{'// AI: Adding error handling...'}</div>
              <div className="text-cursor-text-secondary">
                <span className="text-accent-purple">export class</span>{' '}
                <span className="text-yellow-400">UserService</span>{' {'}
                <div className="ml-4 text-accent-blue">
                  async <span className="text-yellow-400">getUser</span>(id: string) {'{'}
                </div>
                <div className="ml-8 text-accent-purple">try {'{'}</div>
                <div className="ml-12">
                  <span className="text-accent-purple">return await</span> db.user.findById(id);
                </div>
                <div className="ml-8">
                  {'}'} <span className="text-accent-purple">catch</span> (error) {'{'}
                </div>
                <div className="ml-12">
                  logger.error(<span className="text-success">&apos;Failed to fetch user&apos;</span>, error);
                </div>
                <div className="ml-12">
                  <span className="text-accent-purple">throw new</span>{' '}
                  <span className="text-yellow-400">UserNotFoundError</span>(id);
                </div>
                <div className="ml-8">{'}'}</div>
                <div className="ml-4">{'}'}</div>
                <div>{'}'}</div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-cursor-text mb-4">Everything You Need</h3>
            <p className="text-lg md:text-xl text-cursor-text-secondary">Professional tools for modern development</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <GlassPanel key={i} hover className="p-6">
                <div className="w-12 h-12 bg-accent-blue/10 rounded-cursor-md flex items-center justify-center mb-4 text-accent-blue group-hover:bg-accent-blue/20 transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-cursor-text mb-2">{feature.title}</h4>
                <p className="text-sm text-cursor-text-secondary leading-relaxed">{feature.description}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6 py-20 md:py-32">
          <h3 className="text-3xl md:text-4xl font-bold text-cursor-text mb-6">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-lg md:text-xl text-cursor-text-secondary mb-10">
            Join developers building better software with AI assistance.
          </p>
          <Link href="/login?signup=true">
            <AccentButton 
              size="lg"
              icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />}
            >
              Start Free Today
            </AccentButton>
          </Link>
          
          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
            {['No credit card required', 'Free forever', 'Cancel anytime'].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-cursor-text-muted">
                <Check className="w-4 h-4 text-accent-blue" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cursor-border bg-cursor-surface/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent-gradient rounded-cursor-md flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-cursor-text">AI Code Agent</span>
              </div>
              <p className="text-cursor-text-muted text-sm">
                The AI-powered IDE for modern developers.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-cursor-text mb-4 text-sm">Product</h5>
              <ul className="space-y-2 text-sm text-cursor-text-muted">
                <li><a href="#features" className="hover:text-cursor-text transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cursor-text transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cursor-text transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-cursor-text mb-4 text-sm">Company</h5>
              <ul className="space-y-2 text-sm text-cursor-text-muted">
                <li><a href="#" className="hover:text-cursor-text transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cursor-text transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cursor-text transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-cursor-text mb-4 text-sm">Legal</h5>
              <ul className="space-y-2 text-sm text-cursor-text-muted">
                <li><a href="#" className="hover:text-cursor-text transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-cursor-text transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-cursor-text transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cursor-border mt-12 pt-8 text-center text-sm text-cursor-text-muted">
            <p>© 2025 AI Code Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
