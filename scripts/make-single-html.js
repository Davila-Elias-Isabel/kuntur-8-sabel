import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const htmlPath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('dist/index.html does not exist. Run npm run build first.');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// Find JS script tag: <script type="module" crossorigin src="/assets/index-XXXX.js"></script>
const scriptMatch = html.match(/<script[^>]+src=["']\/assets\/([^"']+\.js)["'][^>]*><\/script>/i);
if (scriptMatch) {
  const jsFileName = scriptMatch[1];
  const jsFilePath = path.resolve(distDir, 'assets', jsFileName);
  if (fs.existsSync(jsFilePath)) {
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');
    // Replace script tag with inline script (using function to avoid $` and $' corruption)
    const safeJs = jsContent.replace(/<\/script>/gi, '<\\/script>');
    html = html.replace(scriptMatch[0], () => `<script type="module">\n${safeJs}\n</script>`);
    console.log(`Inlined JS asset: ${jsFileName} (${(jsContent.length / 1024).toFixed(1)} KB)`);
  }
}

// Find CSS link tag: <link rel="stylesheet" crossorigin href="/assets/index-XXXX.css">
const cssMatch = html.match(/<link[^>]+href=["']\/assets\/([^"']+\.css)["'][^>]*>/i);
if (cssMatch) {
  const cssFileName = cssMatch[1];
  const cssFilePath = path.resolve(distDir, 'assets', cssFileName);
  if (fs.existsSync(cssFilePath)) {
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    html = html.replace(cssMatch[0], () => `<style>\n${cssContent}\n</style>`);
    console.log(`Inlined CSS asset: ${cssFileName} (${(cssContent.length / 1024).toFixed(1)} KB)`);
  }
}

// Write to dist/kuntur.html and public/kuntur.html
const distKunturPath = path.resolve(distDir, 'kuntur.html');
const publicDir = path.resolve(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const publicKunturPath = path.resolve(publicDir, 'kuntur.html');

fs.writeFileSync(distKunturPath, html, 'utf8');
fs.writeFileSync(publicKunturPath, html, 'utf8');

console.log(`Successfully generated standalone single-file HTML at:`);
console.log(`- ${distKunturPath}`);
console.log(`- ${publicKunturPath}`);
