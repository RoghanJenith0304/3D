#!/usr/bin/env node

/**
 * JS Comment Stripper CLI
 * Usage: node cli.js <input_file> [output_file]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node cli.js <input_file> [output_file]');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace(/\.js$/, '.clean.js');

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

const code = fs.readFileSync(inputFile, 'utf8');

const removeComments = (code) => {
  const regex = /\/\*[\s\S]*?\*\/|(?:\/\/.*)|("(?:\\.|[^\\"])*")|('(?:\\.|[^\\'])*')|(`(?:\\.|[^\\`])*`)/g;
  
  return code.replace(regex, (match, g1, g2, g3) => {
    if (g1 || g2 || g3) return match;
    return "";
  }).replace(/\n\s*\n/g, '\n');
};

const cleaned = removeComments(code);

fs.writeFileSync(outputFile, cleaned, 'utf8');

console.log(`Successfully cleaned ${inputFile}`);
console.log(`Output saved to ${outputFile}`);
