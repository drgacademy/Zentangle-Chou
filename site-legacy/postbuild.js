/**
 * Post-build script: prepend /Zentangle-Chou to absolute paths in dist/
 * This is needed because the site is deployed to a GitHub Pages subdirectory.
 */
import fs from 'fs';
import path from 'path';

const DIST_DIR = './dist';
const BASE = '/Zentangle-Chou';

// Patterns to replace: absolute paths that don't already have the base
const REPLACEMENTS = [
  // href="/..." -> href="/Zentangle-Chou/..."
  { regex: /href="\/(?!Zentangle-Chou)/g, replacement: `href="${BASE}/` },
  // href='/...' -> href='/Zentangle-Chou/...'
  { regex: /href='\/(?!Zentangle-Chou)/g, replacement: `href='${BASE}/` },
  // src="/..." -> src="/Zentangle-Chou/..."
  { regex: /src="\/(?!Zentangle-Chou)/g, replacement: `src="${BASE}/` },
  // src='/...' -> src='/Zentangle-Chou/...'
  { regex: /src='\/(?!Zentangle-Chou)/g, replacement: `src='${BASE}/` },
  // content="/..." -> content="/Zentangle-Chou/..." (for og:url etc)
  { regex: /content="https:\/\/drgacademy\.github\.io\/Zentangle-Chou/g, replacement: 'content="https://drgacademy.github.io/Zentangle-Chou' },
  // url(/... -> url(/Zentangle-Chou/...
  { regex: /url\(\/(?!Zentangle-Chou)/g, replacement: `url(${BASE}/` },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  for (const { regex, replacement } of REPLACEMENTS) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
    // Reset lastIndex for global regex
    regex.lastIndex = 0;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ ${path.relative(DIST_DIR, filePath)}`);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.css') || entry.name.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

console.log('Post-build: patching absolute paths with base /Zentangle-Chou...');
walkDir(DIST_DIR);
console.log('Done.');
