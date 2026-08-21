import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
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

app.listen(config.port, '0.0.0.0', () => {
  console.log('=================================================================');
  console.log('🚀 PaperCode Backend Server is running on http://localhost:' + config.port);
  console.log('⚡ Gemini 2.0 Flash OCR: ' + (config.gemini.apiKey ? 'Configured' : 'Using Local AST Fallback (Add GEMINI_API_KEY in .env)'));
  console.log('⚡ Server Sandbox Runner: ' + config.judge0.apiUrl);
  console.log('=================================================================');
});
