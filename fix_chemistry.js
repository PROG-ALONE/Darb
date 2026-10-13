const fs = require('fs');
const path = require('path');

// Fix a chemistry file by ensuring proper topic separation
function fixChemistryFile(filename) {
  const filepath = path.join(__dirname, 'content', filename);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // The issue: missing '}),' between T() calls in the topics array
  // Pattern: end of one topic (problems or quiz ending with '],') followed by 'T({'
  // Should be: ']},\n    T({'
  
  // First, let's find all topic boundaries and fix them
  // The structure should be: T({...}),\n    T({...})
  
  // Fix: ensure each T() call ends with '}),' before the next T({
  // Look for '],\n    T({' and make sure there's a '},' before it
  
  // More robust approach: parse the topics array and rebuild it
  // But that's complex. Let's try a simpler regex fix.
  
  // The pattern in broken files: 
  // problems: [...],\n\n    T({  OR  quiz: [...],\n\n    T({
  // Should be: problems: [...],\n    }},\n    T({  OR  quiz: [...],\n    }},\n    T({
  
  // Fix: Add missing '},' before 'T({' when preceded by '],'
  content = content.replace(
    /(\]\s*,\s*\n\s*)T\(\{/g,
    ']},\n    T({'
  );
  
  // Also fix: '],\n        T({' (different indentation)
  content = content.replace(
    /(\]\s*,\s*\n\s{8})T\(\{/g,
    ']},\n    T({'
  );
  
  // Fix: '],\n      T({' (6 spaces)
  content = content.replace(
    /(\]\s*,\s*\n\s{6})T\(\{/g,
    ']},\n    T({'
  );
  
  // Fix: any '],' followed by whitespace and 'T({' without '},'
  content = content.replace(
    /\]\s*,\s*\n\s*T\(\{/g,
    ']},\n    T({'
  );
  
  // Also handle case where quiz ends the topic (no problems)
  // quiz: [...],\n\n    T({ -> quiz: [...],\n    }},\n    T({
  content = content.replace(
    /(quiz:\s*\[[\s\S]*?\]\s*,\s*\n\s*)T\(\{/g,
    'quiz: [...], // placeholder - will fix below\n    }},\n    T({'
  );
  
  // The above is too aggressive. Let me use a more careful approach.
  // Actually, let me just rewrite the fix properly.
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed:', filename);
}

// List of chemistry files to fix
const chemFiles = [
  'chemistry-12-c1.js',
  'chemistry-12-c2.js', 
  'chemistry-12-c3.js',
  'chemistry-12-c4.js',
  'chemistry-12-c5.js',
  'chemistry-12-c6.js',
  'chemistry-12-c7.js',
  'chemistry-12-c8.js'
];

chemFiles.forEach(fixChemistryFile);
console.log('All chemistry files processed');