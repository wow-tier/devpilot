'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
}

interface TerminalProps {
  repositoryId: string;
  repoPath?: string;
}

export default function Terminal({ repositoryId }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'output', content: 'AI Code Agent Terminal v0.1.0' },
    { id: '2', type: 'output', content: `Working directory: Repository #${repositoryId.slice(0, 8)}` },
    { id: '3', type: 'output', content: '⚠️  Commands are restricted to your repository directory' },
    { id: '4', type: 'output', content: 'Type "help" for available commands' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add command to history
    setHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Add input line
    setLines(prev => [...prev, {
      id: Date.now().toString(),
      type: 'input',
      content: `$ ${trimmedCmd}`
    }]);

    // Handle clear command locally
    if (trimmedCmd === 'clear') {
      setLines([
        { id: '1', type: 'output', content: 'AI Code Agent Terminal v0.1.0' },
        { id: '2', type: 'output', content: `Working directory: Repository #${repositoryId.slice(0, 8)}` },
        { id: '3', type: 'output', content: '⚠️  Commands are restricted to your repository directory' },
      ]);
      setInput('');
      return;
    }

    // Execute real command via API
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          command: trimmedCmd,
          repositoryId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add output
        if (data.output) {
          setLines(prev => [...prev, {
            id: Date.now().toString(),
            type: 'output',
            content: data.output
          }]);
        }
        
        // Add error output (stderr can contain warnings, not just errors)
        if (data.error) {
          setLines(prev => [...prev, {
            id: Date.now().toString(),
            type: data.exitCode === 0 ? 'output' : 'error',
            content: data.error
          }]);
        }

        // If no output at all
        if (!data.output && !data.error && data.exitCode === 0) {
          setLines(prev => [...prev, {
            id: Date.now().toString(),
            type: 'output',
            content: 'Command completed successfully'
          }]);
        }
      } else {
        setLines(prev => [...prev, {
          id: Date.now().toString(),
          type: 'error',
          content: data.error || 'Failed to execute command'
        }]);
      }
    } catch (error) {
      setLines(prev => [...prev, {
        id: Date.now().toString(),
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to execute command'}`
      }]);
    }

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-100 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <h3 className="text-sm font-semibold">Terminal</h3>
        <button
          onClick={() => setLines([])}
          className="text-xs text-gray-400 hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`${
              line.type === 'input'
                ? 'text-blue-400'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-gray-300'
            }`}
          >
            <pre className="whitespace-pre-wrap">{line.content}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-t border-gray-800">
        <span className="text-blue-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent focus:outline-none text-gray-100"
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
}
