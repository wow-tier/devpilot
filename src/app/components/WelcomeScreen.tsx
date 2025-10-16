'use client';

import React from 'react';
import { Code2, Sparkles, GitBranch } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex items-center justify-center h-full bg-slate-950">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Code2 className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to AI Code Agent
        </h1>
        <p className="text-xl text-slate-400 mb-12">
          Your intelligent coding companion. Write, refactor, and optimize code using natural language.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <Sparkles className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
            <p className="text-slate-400 text-sm">
              Natural language to production code
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <Code2 className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">Professional IDE</h3>
            <p className="text-slate-400 text-sm">
              Full Monaco editor with all features
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <GitBranch className="w-8 h-8 text-green-400 mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">Git Integrated</h3>
            <p className="text-slate-400 text-sm">
              Automatic commits and version control
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Quick Examples</h3>
          <div className="text-left space-y-2 text-sm text-slate-300">
            <p className="font-mono bg-slate-900/50 px-3 py-2 rounded">Add error handling to the UserService class</p>
            <p className="font-mono bg-slate-900/50 px-3 py-2 rounded">Create a React component for user profiles</p>
            <p className="font-mono bg-slate-900/50 px-3 py-2 rounded">Refactor this code to use async/await</p>
          </div>
        </div>

        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50"
        >
          Get Started
        </button>

        <p className="mt-6 text-slate-500 text-sm">
          Select a file from the explorer to begin editing
        </p>
      </div>
    </div>
  );
}
