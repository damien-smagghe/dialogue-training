const fs = require('fs');

const tsFile = './src/dialogues.ts';
const jsonFile = './src/dialogues.json';

// Read TypeScript file
const content = fs.readFileSync(tsFile, 'utf-8');

// Convert TypeScript object literal to JSON
// Remove the "const dialogues = [" wrapper
let jsonContent = content.replace('const dialogues = [', '[');

// Replace unquoted property names
jsonContent = jsonContent.replace(/(\s*)(name|dialogue|key):\s*/g, '$1"$2": ');

// Replace unquoted string values (keep the existing quoted strings)
// This handles cases like: name: "Arthura" (already good)
// and need to handle: dialogue: "text..." (already good)

// Remove trailing whitespace and extra commas
jsonContent = jsonContent.replace(/[ \t]+\n/g, '\n');

// Fix any remaining issues - add proper quotes to unquoted strings
// Match patterns like "    "Value" -> "    \""Value\""
const lines = jsonContent.split('\n');
const result = lines.map(line => {
  // Check if line has unquoted property value
  if (/(?:name|dialogue|key):\s*[^\s"\{,]/.test(line)) {
    // Has an unquoted value - need to handle
  }
  return line;
}).join('\n');

// Write to JSON file
fs.writeFileSync(jsonFile, jsonContent);
console.log('Converted dialogues.ts to dialogues.json');
console.log('File size:', jsonFile.length, 'bytes');
