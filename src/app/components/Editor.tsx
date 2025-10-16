'use client';

import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  theme?: string;
  fontSize?: number;
  minimap?: boolean;
  lineNumbers?: boolean;
  wordWrap?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  height = '100%',
  theme = 'vs-dark',
  fontSize = 14,
  minimap = true,
  lineNumbers = true,
  wordWrap = false,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Map custom theme names to Monaco theme names
  const getMonacoTheme = (theme: string) => {
    const themeMap: Record<string, string> = {
      'dark': 'vs-dark',
      'light': 'vs',
      'monokai': 'vs-dark', // Monaco doesn't have monokai built-in, use vs-dark
      'dracula': 'vs-dark', // Monaco doesn't have dracula built-in, use vs-dark
    };
    return themeMap[theme] || 'vs-dark';
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: minimap },
      fontSize: fontSize,
      lineNumbers: lineNumbers ? 'on' : 'off',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly,
      automaticLayout: true,
      wordWrap: wordWrap ? 'on' : 'off',
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={getMonacoTheme(theme)}
        options={{
          readOnly,
          automaticLayout: true,
          minimap: { enabled: minimap },
          fontSize: fontSize,
          lineNumbers: lineNumbers ? 'on' : 'off',
          wordWrap: wordWrap ? 'on' : 'off',
        }}
      />
    </div>
  );
}
