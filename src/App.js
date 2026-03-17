import React, { useState } from 'react';
import { Trash2, Copy, Download, Upload, Check, Code2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const removeComments = (code) => {
    const regex = /\/\*[\s\S]*?\*\/|(?:\/\/.*)|("(?:\\.|[^\\"])*")|('(?:\\.|[^\\'])*')|(`(?:\\.|[^\\`])*`)/g;
    return code
      .replace(regex, (match, g1, g2, g3) => {
        if (g1 || g2 || g3) return match;
        return "";
      })
      .replace(/\n\s*\n/g, '\n');
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const cleaned = removeComments(inputCode);
      setOutputCode(cleaned);
      setIsProcessing(false);
    }, 400);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setInputCode(event.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b">
        <h1>STRIP COMMENTS</h1>
      </header>

      <main className="flex flex-col lg:flex-row flex-1">
        {/* Input */}
        <section className="flex-1 p-4">
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste code here..."
            className="w-full h-64 border p-2"
          />

          <button onClick={handleProcess} disabled={!inputCode || isProcessing}>
            {isProcessing ? "Processing..." : "Run"}
          </button>
        </section>

        {/* Output */}
        <section className="flex-1 p-4">
          <textarea
            readOnly
            value={outputCode}
            placeholder="Output..."
            className="w-full h-64 border p-2"
          />

          <button onClick={handleCopy} disabled={!outputCode}>
            {isCopied ? "Copied!" : "Copy"}
          </button>

          <button onClick={handleDownload} disabled={!outputCode}>
            Download
          </button>
        </section>
      </main>
    </div>
  );
}