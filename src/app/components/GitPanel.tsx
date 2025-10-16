'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, Clock, CheckCircle } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-slate-900 text-white border-t border-slate-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-blue-400" />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">Source Control</h2>
            {status && (
              <p className="text-xs text-slate-400">
                {status.branch}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Changes */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Changes ({changedFiles.length})
        </h3>
        
        {changedFiles.length === 0 ? (
          <p className="text-sm text-slate-500">No changes</p>
        ) : (
          <div className="space-y-1">
            {changedFiles.map((file, index) => (
              <div key={index} className="text-sm flex items-center gap-2 text-slate-300 py-1">
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <span className="truncate">{file}</span>
              </div>
            ))}
          </div>
        )}

        {/* Commit Section */}
        {changedFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Commit</h3>
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message..."
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 resize-none"
              rows={3}
            />
            <button
              onClick={handleCommit}
              disabled={!commitMessage.trim() || isCommitting}
              className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isCommitting ? 'Committing...' : 'Commit Changes'}
            </button>
          </div>
        )}

        {/* Recent Commits */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Recent Commits</h3>
          {commitLog.length === 0 ? (
            <p className="text-sm text-slate-500">No commits yet</p>
          ) : (
            <div className="space-y-3">
              {commitLog.map((commit) => (
                <div key={commit.hash} className="text-xs">
                  <div className="flex items-start gap-2">
                    <GitCommit className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 font-medium truncate">{commit.message}</p>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span className="font-mono">{commit.hash.substring(0, 7)}</span>
                        <span>•</span>
                        <span>{commit.author_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
