'use client';

import React, { useState, useEffect } from 'react';

interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  modified: string[];
  created: string[];
  deleted: string[];
  staged: string[];
}

interface CommitLog {
  hash: string;
  date: string;
  message: string;
  author_name: string;
}

export default function GitPanel() {
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [commitLog, setCommitLog] = useState<CommitLog[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);

  useEffect(() => {
    loadGitStatus();
    loadCommitLog();
  }, []);

  const loadGitStatus = async () => {
    try {
      const response = await fetch('/api/git?action=status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Error loading git status:', error);
    }
  };

  const loadCommitLog = async () => {
    try {
      const response = await fetch('/api/git?action=log&count=5');
      const data = await response.json();
      
      if (data.success) {
        setCommitLog(data.log);
      }
    } catch (error) {
      console.error('Error loading commit log:', error);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;

    setIsCommitting(true);
    try {
      const response = await fetch('/api/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setCommitMessage('');
        await loadGitStatus();
        await loadCommitLog();
      }
    } catch (error) {
      console.error('Error committing:', error);
    } finally {
      setIsCommitting(false);
    }
  };

  const changedFiles = [
    ...(status?.modified || []),
    ...(status?.created || []),
    ...(status?.deleted || []),
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Git</h2>
        {status && (
          <p className="text-sm text-gray-400">
            Branch: <span className="text-blue-400">{status.branch}</span>
          </p>
        )}
      </div>

      {/* Changes */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            Changes ({changedFiles.length})
          </h3>
          
          {changedFiles.length === 0 ? (
            <p className="text-sm text-gray-500">No changes</p>
          ) : (
            <div className="space-y-1">
              {changedFiles.map((file, index) => (
                <div key={index} className="text-sm flex items-center gap-2">
                  <span className="text-yellow-400">M</span>
                  <span className="text-gray-300">{file}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commit Section */}
        {changedFiles.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Commit</h3>
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message..."
              className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={handleCommit}
              disabled={!commitMessage.trim() || isCommitting}
              className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCommitting ? 'Committing...' : 'Commit Changes'}
            </button>
          </div>
        )}

        {/* Recent Commits */}
        <div className="p-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Commits</h3>
          {commitLog.length === 0 ? (
            <p className="text-sm text-gray-500">No commits yet</p>
          ) : (
            <div className="space-y-2">
              {commitLog.map((commit) => (
                <div key={commit.hash} className="text-xs">
                  <p className="text-gray-300 font-mono">{commit.message}</p>
                  <p className="text-gray-500">
                    {commit.hash.substring(0, 7)} • {commit.author_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
