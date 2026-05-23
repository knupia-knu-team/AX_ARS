import { analyzeCustomerInquiry } from '../server/src/services/analyzer.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { text, domain, context } = req.body ?? {};

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: '올바른 "text" 파라미터가 필요합니다.' });
    return;
  }

  console.log(`[API Analyze Request] Domain: ${domain || 'default'}, Channel: ${context?.channel || 'none'}, Order ID: ${context?.orderId || 'none'}`);

  try {
    const startTime = Date.now();
    const result = await analyzeCustomerInquiry(text);
    const processingTimeMs = Date.now() - startTime;

    res.status(200).json({
      ...result,
      processingTimeMs
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: '분석 처리 중 서버 에러가 발생했습니다.'
    });
  }
}