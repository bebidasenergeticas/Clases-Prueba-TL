// Renderiza index.html a MP4 1080p/30fps (60 s) con Playwright + ffmpeg.
// Uso: node render.mjs [salida.mp4] [fps]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(dir, 'tech-workspace-60s.mp4');
const FPS = Number(process.argv[3] || 30), DUR = 60;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(path.join(dir, 'index.html')).href + '?render=1');

const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', out],
  { stdio: ['pipe', 'ignore', 'inherit'] });

for (let i = 0; i < DUR * FPS; i++) {
  // Exporta el canvas a resolución nativa (1920x1080), independiente del viewport.
  const b64 = await page.evaluate(t => { window.renderFrame(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, i / FPS);
  if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  if (i % FPS === 0) process.stdout.write(`\r${i / FPS}s / ${DUR}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`\nListo: ${out}`);
