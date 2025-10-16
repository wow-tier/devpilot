'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <h1 className="text-2xl font-bold text-white">AI Code Agent</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/login?signup=true" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-6xl font-bold text-white mb-6">
            Code with AI,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Ship Faster
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            The AI-powered IDE that understands natural language. Build, modify, and deploy code 10x faster with intelligent AI assistance.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/login?signup=true"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors hover-lift"
            >
              Start Coding Now →
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-gray-800 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              See Features
            </Link>
          </div>
        </div>

        {/* Screenshot/Demo */}
        <div className="relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl animate-fade-in">
          <div className="bg-gray-900 p-3 border-b border-gray-800 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-gray-400">workspace/example.ts</span>
          </div>
          <div className="bg-gray-950 p-8 text-gray-300 font-mono text-sm">
            <div className="text-green-400">// AI: Adding error handling...</div>
            <div className="mt-2">
              <span className="text-purple-400">export class</span> <span className="text-yellow-400">UserService</span> {'{'}
            </div>
            <div className="ml-4 text-blue-400">  async getUser(id: string) {'{'}</div>
            <div className="ml-8">    <span className="text-purple-400">try</span> {'{'}</div>
            <div className="ml-12">      <span className="text-purple-400">return await</span> db.user.findById(id);</div>
            <div className="ml-8">    {'}'} <span className="text-purple-400">catch</span> (error) {'{'}</div>
            <div className="ml-12">      logger.error(<span className="text-green-400">&apos;Failed to fetch user&apos;</span>, error);</div>
            <div className="ml-12">      <span className="text-purple-400">throw new</span> <span className="text-yellow-400">UserNotFoundError</span>(id);</div>
            <div className="ml-8">    {'}'}</div>
            <div className="ml-4">  {'}'}</div>
            <div>{'}'}</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-center text-white mb-12">
          Everything You Need to Code
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🤖',
              title: 'AI-Powered Coding',
              description: 'Describe what you want in plain English. AI writes production-ready code instantly.'
            },
            {
              icon: '💻',
              title: 'Professional IDE',
              description: 'Full Monaco editor with multi-tab support, git integration, and terminal.'
            },
            {
              icon: '🔀',
              title: 'Git Built-in',
              description: 'Branch, commit, and push with AI-generated messages. Version control made easy.'
            },
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Turbopack compilation, instant hot reload. No waiting around.'
            },
            {
              icon: '🎨',
              title: 'Beautiful UI',
              description: 'Modern design with smooth animations. Themes for every preference.'
            },
            {
              icon: '🔐',
              title: 'Secure & Private',
              description: 'Your code stays private. Enterprise-grade security built-in.'
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl hover-lift transition-smooth">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to code smarter?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers using AI to build better software faster.
          </p>
          <Link
            href="/login?signup=true"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors hover-lift"
          >
            Start Free Today →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <span className="text-lg font-bold text-white">AI Code Agent</span>
              </div>
              <p className="text-gray-400">
                The AI-powered IDE for modern developers.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 AI Code Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
