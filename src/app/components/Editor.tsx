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
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly,
      automaticLayout: true,
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
        theme={theme}
        options={{
          readOnly,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
