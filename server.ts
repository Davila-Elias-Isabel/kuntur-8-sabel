import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Healthcheck endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API routes
app.get('/api/status', (_req, res) => {
  res.json({ app: 'kuntur-isabel', ready: true });
});

// Download standalone single-file HTML
app.get(['/descargar-html', '/kuntur.html'], (req, res) => {
  const distFile = path.resolve(__dirname, 'dist', 'kuntur.html');
  const publicFile = path.resolve(__dirname, 'public', 'kuntur.html');
  const targetFile = fs.existsSync(distFile) ? distFile : publicFile;

  if (fs.existsSync(targetFile)) {
    if (req.path === '/descargar-html') {
      res.download(targetFile, 'kuntur_juego.html');
    } else {
      res.sendFile(targetFile);
    }
  } else {
    res.status(404).send('Archivo HTML autónomo no encontrado.');
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev middleware not loaded, attempting static fallback:', err);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.resolve(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KUNTUR server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
