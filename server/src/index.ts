// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — Express Server Entrypoint
// ═══════════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeCustomerInquiry } from './services/analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정 - 로컬 개발 포트(5173) 허용
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Body Parser
app.use(express.json());

// ── GET /api/health ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'VoiceRoute AX API'
  });
});

// ── POST /api/analyze ──
app.post('/api/analyze', async (req, res) => {
  const { text, domain, context } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({
      error: '올바른 "text" 파라미터가 필요합니다.'
    });
    return;
  }

  // 요청 메타데이터 로그 기록 (디버깅용)
  console.log(`[API Analyze Request] Domain: ${domain || 'default'}, Channel: ${context?.channel || 'none'}, Order ID: ${context?.orderId || 'none'}`);

  try {
    const startTime = Date.now();
    const result = await analyzeCustomerInquiry(text);
    const processingTimeMs = Date.now() - startTime;
    
    res.json({
      ...result,
      processingTimeMs
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: '분석 처리 중 서버 에러가 발생했습니다.'
    });
  }
});


// ── Production static files serving ──
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// API가 아닌 경로에 대해서는 React SPA index.html 리턴
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      // index.html이 없을 경우 (예: 빌드가 안 되었을 때) 프렌들리 메시지 리턴
      res.status(404).send('VoiceRoute AX API Server is running. Client assets not found.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 VoiceRoute AX backend running on port ${PORT}`);
});
