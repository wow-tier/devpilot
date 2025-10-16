'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'output', content: 'AI Code Agent Terminal v0.1.0' },
    { id: '2', type: 'output', content: 'Type "help" for available commands' },
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

    // Execute command
    try {
      if (trimmedCmd === 'help') {
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: `Available commands:
  help          - Show this help message
  clear         - Clear terminal
  ls            - List files in current directory
  git status    - Show git status
  git log       - Show git log
  npm run dev   - Start development server
  npm install   - Install dependencies`
        }]);
      } else if (trimmedCmd === 'clear') {
        setLines([]);
      } else if (trimmedCmd === 'ls') {
        const response = await fetch('/api/files?directory=.');
        const data = await response.json();
        const fileList = data.files.map((f: any) => f.name).join('  ');
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: fileList
        }]);
      } else if (trimmedCmd.startsWith('git ')) {
        const gitCmd = trimmedCmd.substring(4);
        const action = gitCmd.split(' ')[0];
        const response = await fetch(`/api/git?action=${action}`);
        const data = await response.json();
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: JSON.stringify(data, null, 2)
        }]);
      } else {
        setLines(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'error',
          content: `Command not found: ${trimmedCmd}. Type "help" for available commands.`
        }]);
      }
    } catch (error) {
      setLines(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
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
