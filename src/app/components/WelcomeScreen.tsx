'use client';

import React from 'react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-950">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to AI Code Agent
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your intelligent coding companion powered by AI
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-white font-semibold mb-2">Chat with AI</h3>
            <p className="text-gray-400 text-sm">
              Describe what you want to build in natural language
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-3xl mb-3">✏️</div>
            <h3 className="text-white font-semibold mb-2">Modify Code</h3>
            <p className="text-gray-400 text-sm">
              AI understands your code and makes intelligent changes
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-white font-semibold mb-2">Git Integration</h3>
            <p className="text-gray-400 text-sm">
              Automatic commits with AI-generated messages
            </p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mb-8">
          <h3 className="text-white font-semibold mb-3">Quick Start Examples</h3>
          <div className="text-left space-y-2 text-sm text-gray-300">
            <p>💡 &quot;Add error handling to the UserService class&quot;</p>
            <p>💡 &quot;Create a new React component for user profiles&quot;</p>
            <p>💡 &quot;Refactor this code to use async/await&quot;</p>
            <p>💡 &quot;Add TypeScript types to all functions&quot;</p>
          </div>
        </div>

        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Started →
        </button>

        <div className="mt-8 text-gray-500 text-sm">
          <p>Open a file from the explorer on the left to begin</p>
        </div>
      </div>
    </div>
  );
}
