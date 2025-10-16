'use client';

import React, { useState } from 'react';

interface SearchResult {
  file: string;
  line: number;
  content: string;
  match: string;
}

interface SearchPanelProps {
  onResultClick?: (file: string, line: number) => void;
}

export default function SearchPanel({ onResultClick }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // This would call a backend search API
      // For now, it's a placeholder
      const mockResults: SearchResult[] = [
        {
          file: 'example.ts',
          line: 12,
          content: 'export class UserService {',
          match: 'UserService'
        },
      ];
      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReplace = async (file: string, line: number) => {
    // Implement replace logic
    console.log('Replace in', file, 'at line', line);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800 space-y-3">
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search..."
            className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="text"
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            placeholder="Replace..."
            className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded"
            />
            <span>Case sensitive</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="rounded"
            />
            <span>Regex</span>
          </label>
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No results found' : 'Enter a search query'}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-800 cursor-pointer"
                onClick={() => onResultClick?.(result.file, result.line)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blue-400">{result.file}</span>
                  <span className="text-xs text-gray-500">Line {result.line}</span>
                </div>
                <div className="text-sm text-gray-300 font-mono">
                  {result.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
