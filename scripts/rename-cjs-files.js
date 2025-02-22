import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function updateFileContents(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Update relative imports/requires from .js to .cjs
  const updatedContent = content
    .replace(/from ['"]\.\/(.+?)\.js['"]/g, "from './$1.cjs'")
    .replace(/from ['"]\.\.\/(.+?)\.js['"]/g, "from '../$1.cjs'")
    .replace(/require\(['"]\.\/(.+?)\.js['"]\)/g, "require('./$1.cjs')")
    .replace(/require\(['"]\.\.\/(.+?)\.js['"]\)/g, "require('../$1.cjs')");

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
  }
}

function renameFilesInDir(dir) {
  const files = fs.readdirSync(dir);

  // First update the contents of all files
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      renameFilesInDir(filePath);
    } else if (file.endsWith('.js')) {
      updateFileContents(filePath);
    }
  });

  // Then rename the files
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Directory was already processed in the first pass
    } else if (file.endsWith('.js')) {
      const newPath = filePath.replace(/\.js$/, '.cjs');
      fs.renameSync(filePath, newPath);
    }
  });
}

const cjsDir = path.join(__dirname, '../dist/cjs');
renameFilesInDir(cjsDir);
