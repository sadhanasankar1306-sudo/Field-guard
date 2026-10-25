import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/apiRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createExpressApp() {
  const app = express();

  // Allow up to 16MB JSON body so 10MB base64-encoded image uploads can be validated cleanly by Stage 1
  app.use(express.json({ limit: '16mb' }));

  // Security & CORS headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  // Mount modular REST API
  app.use('/api', apiRouter);

  // Global JSON payload error handler (e.g. >16MB body)
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err && err.type === 'entity.too.large') {
      res.status(413).json({
        outcomeCode: 'OUTCOME_C_ABSTENTION',
        statusLabel: 'Unable to diagnose reliably',
        rejectionCategory: 'INVALID_UPLOAD_OR_CORRUPTED',
        abstentionMessage:
          'Uploaded file exceeds the maximum allowed payload size (10 MB limit). Please resize or compress the photograph and try again.',
      });
      return;
    }
    next(err);
  });

  return app;
}

export const app = createExpressApp();

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FieldGuard AI server listening on http://0.0.0.0:${PORT}`);
  });
}

// Only start the HTTP listener if executed directly (e.g. in dev or container)
if (process.env.VERCEL !== '1') {
  startServer();
}
