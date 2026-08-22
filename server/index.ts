import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import { seedDatabase } from './db/seed';
import authRoutes from './routes/auth';
import ocrRoutes from './routes/ocr';
import sandboxRoutes from './routes/sandbox';
import coursesRoutes from './routes/courses';
import classroomsRoutes from './routes/classrooms';
import submissionsRoutes from './routes/submissions';
import blogsRoutes from './routes/blogs';
import adminRoutes from './routes/admin';

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PaperCode Bangladesh Backend Engine',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(config.gemini.apiKey && config.gemini.apiKey !== 'your_gemini_api_key_here'),
    judge0Configured: Boolean(config.judge0.apiUrl)
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/classrooms', classroomsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all 404 for unmatched API routes
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' was not found.`
  });
});

// Serve frontend in production / Render unified deployment
// Try multiple possible dist locations for maximum compatibility
const possibleDistPaths = [
  path.resolve(process.cwd(), 'dist'),
  path.resolve(new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), '..', 'dist'),
  path.resolve('/opt/render/project/src', 'dist'),
];

let distPath: string | null = null;
for (const candidate of possibleDistPaths) {
  const normalizedCandidate = path.normalize(candidate);
  if (fs.existsSync(path.join(normalizedCandidate, 'index.html'))) {
    distPath = normalizedCandidate;
    console.log(`[SPA] Serving frontend from: ${distPath}`);
    break;
  }
}

if (distPath) {
  // Serve all static assets (JS, CSS, images, _redirects, etc.)
  app.use(express.static(distPath, { maxAge: '1d', etag: true }));

  // Read index.html once at startup — avoids Express 5 sendFile path resolution issues
  const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

  // SPA catch-all: any non-API, non-static request gets index.html with 200 OK
  // This MUST come after express.static so real files are served directly
  app.use((req: Request, res: Response) => {
    res.status(200).type('html').send(indexHtml);
  });
} else {
  console.warn('[SPA] No dist/index.html found. Tried:', possibleDistPaths.map(p => path.normalize(p)));
  app.get('/', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      message: 'PaperCode Backend API is active. Frontend build not found — run npm run build first.',
      documentation: '/api/health'
    });
  });

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Resource '${req.originalUrl}' was not found. Frontend may not be built.`
    });
  });
}

// Initialize Database & Start Server
seedDatabase().then(() => {
  app.listen(config.port, '0.0.0.0', () => {
    console.log('=================================================================');
    console.log('🚀 PaperCode Backend Server is running on http://localhost:' + config.port);
    console.log('⚡ Gemini 2.0 Flash OCR: ' + (config.gemini.apiKey ? 'Configured' : 'Using Local AST Fallback (Add GEMINI_API_KEY in .env)'));
    console.log('⚡ Server Sandbox Runner: ' + config.judge0.apiUrl);
    console.log('=================================================================');
  });
}).catch(err => {
  console.error('Server startup error:', err);
});
