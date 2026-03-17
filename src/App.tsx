/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trash2, Copy, Download, Upload, Check, Code2, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const removeComments = (code: string): string => {
    const regex = /\/\*[\s\S]*?\*\/|(?:\/\/.*)|("(?:\\.|[^\\"])*")|('(?:\\.|[^\\'])*')|(`(?:\\.|[^\\`])*`)/g;
    return code.replace(regex, (match, g1, g2, g3) => {
      if (g1 || g2 || g3) return match;
      return "";
    }).replace(/\n\s*\n/g, '\n');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setInputCode(event.target?.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-neon selection:text-brutal-black">
      {/* Marquee Header */}
      <div className="bg-brutal-black text-neon py-2 overflow-hidden border-b-4 border-brutal-black">
        <div className="animate-marquee whitespace-nowrap flex gap-12 font-mono text-xs font-bold tracking-tighter">
          {[...Array(10)].map((_, i) => (
            <span key={i}>STRIP_COMMENTS_V1.0 // REGEX_ENGINE_ACTIVE // NO_MOCK_DATA // CLEAN_CODE_ONLY</span>
          ))}
        </div>
      </div>

      {/* Main Title Section */}
      <header className="p-8 md:p-12 border-b-4 border-brutal-black flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-neon p-2 border-2 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Code2 className="w-8 h-8" />
            </div>
            <span className="font-mono text-sm font-bold uppercase tracking-widest">Tool_01</span>
          </div>
          <h1 className="font-display text-7xl md:text-9xl uppercase leading-none tracking-tighter">
            STRIP<br />
            <span className="text-neon stroke-black" style={{ WebkitTextStroke: '2px black' }}>COMMENTS</span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-4">
          <p className="font-mono text-sm max-w-xs leading-tight">
            A BRUTALIST UTILITY FOR REMOVING JAVASCRIPT COMMENTS WITHOUT BREAKING YOUR STRINGS OR REGEX.
          </p>
          <div className="flex gap-2">
            <label className="cursor-pointer bg-brutal-white border-2 border-brutal-black px-4 py-2 font-bold uppercase text-xs hover:bg-neon transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button 
              onClick={() => { setInputCode(''); setOutputCode(''); }}
              className="bg-brutal-white border-2 border-brutal-black px-4 py-2 font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Input Column */}
        <section className="border-r-0 lg:border-r-4 border-brutal-black flex flex-col min-h-[500px]">
          <div className="p-6 border-b-4 border-brutal-black bg-neon flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl">01</span>
              <span className="font-bold uppercase tracking-widest text-sm">Input_Source</span>
            </div>
          </div>
          <div className="flex-1 p-0 relative">
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="PASTE_CODE_HERE..."
              className="w-full h-full p-8 font-mono text-lg bg-transparent resize-none focus:outline-none placeholder:text-brutal-black/20"
            />
          </div>
          <div className="p-8 border-t-4 border-brutal-black bg-brutal-white flex justify-center">
            <button
              onClick={handleProcess}
              disabled={!inputCode || isProcessing}
              className="w-full py-6 bg-brutal-black text-neon font-display text-4xl uppercase hover:bg-neon hover:text-brutal-black transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
            >
              {isProcessing ? "Processing..." : "Execute_Strip"}
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>

        {/* Output Column */}
        <section className="flex flex-col min-h-[500px] bg-neon/10">
          <div className="p-6 border-b-4 border-brutal-black bg-brutal-black text-neon flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl">02</span>
              <span className="font-bold uppercase tracking-widest text-sm">Clean_Output</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleCopy}
                disabled={!outputCode}
                className="bg-neon text-brutal-black p-2 border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
              >
                {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleDownload}
                disabled={!outputCode}
                className="bg-neon text-brutal-black p-2 border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-0 relative">
            <textarea
              readOnly
              value={outputCode}
              placeholder="WAITING_FOR_INPUT..."
              className="w-full h-full p-8 font-mono text-lg bg-transparent resize-none focus:outline-none placeholder:text-brutal-black/20"
            />
            <AnimatePresence>
              {isCopied && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className="absolute top-8 right-8 bg-brutal-black text-neon px-6 py-3 font-bold uppercase tracking-tighter border-2 border-neon"
                >
                  Copied_To_Clipboard
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-8 border-t-4 border-brutal-black bg-brutal-black text-brutal-white flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${outputCode ? 'bg-neon animate-pulse' : 'bg-red-500'}`} />
              <span>STATUS: {outputCode ? 'READY' : 'IDLE'}</span>
            </div>
            <span>CHAR_COUNT: {outputCode.length}</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t-4 border-brutal-black bg-brutal-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <span className="font-display text-2xl">JS_STRIPPER</span>
          <span className="font-mono text-[10px] uppercase opacity-50">©2026_BRUTAL_TOOLS_INC</span>
        </div>
        <div className="flex gap-8 font-mono text-[10px] uppercase font-bold">
          <span className="hover:text-neon cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-neon cursor-pointer transition-colors">Github</span>
          <span className="hover:text-neon cursor-pointer transition-colors">API_Access</span>
        </div>
      </footer>
    </div>
  );
}
