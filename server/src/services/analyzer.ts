// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — Dual Engine Analyzer Orchestrator
// ═══════════════════════════════════════════════════════════

import type { APIAnalysisResult } from '../types/shared.js';
import { analyzeWithGemini } from './vertexAI.js';
import { runMockAnalysis } from './mockEngine.js';

const useGemini = process.env.USE_VERTEX_AI === 'true' || process.env.USE_GEMINI === 'true';

/**
 * 고객 문의 분석 메인 진입점 (Dual Engine Orchestrator)
 * 1. USE_VERTEX_AI=true(또는 기존 USE_GEMINI=true)이고 자격증명/클라이언트가 준비되면 Gemini API 호출을 수행합니다.
 * 2. 만약 API 호출이 실패하거나 설정이 누락되거나, 스키마 유효성 검증이 안 될 경우
 *    자동으로 로컬 Mock Rule Engine으로 Fallback 처리를 수행합니다.
 */
export async function analyzeCustomerInquiry(text: string): Promise<APIAnalysisResult> {
  if (useGemini) {
    try {
      const result = await analyzeWithGemini(text);
      return result;
    } catch (err: any) {
      // 사용자에게 노출하지 않고 서버 측에만 상세 경고/실패 원인을 기록합니다.
      console.warn(`[API Fallback Triggered] Gemini analysis failed. Falling back to Mock Rule Engine. Reason: ${err.message || err}`);
      
      // Fallback 실행
      const fallbackResult = runMockAnalysis(text);
      return {
        ...fallbackResult,
        analysisSource: 'Mock Rule Engine'
      };
    }
  }

  // Gemini 미활성화 상태인 경우 즉시 Mock 실행
  return runMockAnalysis(text);
}
