import express from 'express';
import path from 'path';
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

// Lyria Music Generation Endpoint
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt, model = 'lyria-3-clip-preview' } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'El parámetro "prompt" es requerido.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY no encontrada en las variables de entorno del servidor.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Use generateContentStream with Lyria model
    const response = await ai.models.generateContentStream({
      model: model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview',
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({ 
        error: 'El modelo no retornó datos de audio. Intenta con un prompt descriptivo diferente.' 
      });
    }

    res.json({
      audioBase64,
      mimeType,
      lyrics,
      prompt,
      model,
      generatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error generating music via Lyria:', err);
    res.status(500).json({ 
      error: err.message || 'Error interno al generar música con Lyria.' 
    });
  }
});

// Veo 3 Video Generation Start Endpoint
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'El parámetro "prompt" es requerido.' });
    }

    const validAspectRatios = ['16:9', '9:16'];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '16:9';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY no encontrada en las variables de entorno del servidor.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Generate video using veo-3.1-fast-generate-preview
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: chosenAspectRatio as '16:9' | '9:16',
      },
    });

    res.json({ operationName: operation.name });
  } catch (err: any) {
    console.error('Error starting video generation with Veo 3:', err);
    res.status(500).json({ 
      error: err.message || 'Error al iniciar la generación de video con Veo 3.' 
    });
  }
});

// Veo 3 Video Status Polling Endpoint
app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'El parámetro "operationName" es requerido.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: Boolean(updated.done),
      error: updated.error || null,
    });
  } catch (err: any) {
    console.error('Error checking video status:', err);
    res.status(500).json({ 
      error: err.message || 'Error al consultar estado del video.' 
    });
  }
});

// Veo 3 Video Download Stream Endpoint
app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'El parámetro "operationName" es requerido.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: 'No se encontró la URI del video generado.' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Error al descargar el video desde Google.' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    const buffer = Buffer.from(await videoRes.arrayBuffer());
    res.send(buffer);
  } catch (err: any) {
    console.error('Error downloading video:', err);
    res.status(500).json({ 
      error: err.message || 'Error al descargar el video.' 
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KUNTUR server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
