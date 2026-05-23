// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 통합 분석 파이프라인 (Engine Index)
// 모든 엔진 모듈을 조합한 고객 문의 분석 진입점
// ═══════════════════════════════════════════════════════════

import type { AnalysisResult } from '../types/index';
import { analyzeIntent } from './intentAnalyzer';
import { detectUrgency } from './urgencyDetector';
import { routeDepartment } from './departmentRouter';
import { generateResponse } from './responseGenerator';
import { generateSummary, generateCRMCode, generateExplanation } from './summaryGenerator';
import { searchFAQs } from '../data/faqData';

// 타입 편의 재수출
export type { AnalysisResult } from '../types/index';

/**
 * 텍스트 정규화 (공백 정리)
 */
function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * 고객 문의 통합 분석
 *
 * 전체 파이프라인:
 * 1. 의도 분석 (Intent Analysis)
 * 2. 긴급도 감지 (Urgency Detection)
 * 3. 부서 라우팅 (Department Routing)
 * 4. 응대 가이드 생성 (Response Generation)
 * 5. 요약 생성 (Summary Generation)
 * 6. CRM 코드 생성
 * 7. 분석 설명 생성
 * 8. FAQ 검색
 *
 * @param text - 고객 문의 원문 텍스트 (한국어)
 * @returns AnalysisResult — 통합 분석 결과
 */
export function analyzeCustomerInquiry(text: string): AnalysisResult {
  const startTime = performance.now();

  // 빈 텍스트 처리
  const safeText = text || '';
  const normalizedText = normalizeText(safeText);

  // ── Step 1: 의도 분석 ──
  const intentResult = analyzeIntent(safeText);

  // ── Step 2: 긴급도 감지 ──
  const urgencyResult = detectUrgency(safeText, intentResult.category);

  // ── Step 3: 부서 라우팅 ──
  const deptResult = routeDepartment(intentResult.category, urgencyResult.level);

  // ── Step 4: 응대 가이드 생성 ──
  const responseResult = generateResponse(
    intentResult.category,
    urgencyResult.level,
    intentResult.detectedKeywords
  );

  // ── Step 5: 상담원 요약 생성 ──
  const summaryForAgent = generateSummary(
    safeText,
    intentResult.mainIntent,
    intentResult.subIntent,
    intentResult.detectedKeywords
  );

  // ── Step 6: CRM 코드 생성 ──
  const crmCategoryCode = generateCRMCode(intentResult.category, intentResult.subIntent);

  // ── Step 7: 분석 설명 생성 ──
  const explanation = generateExplanation(
    intentResult,
    urgencyResult,
    deptResult.primary.name
  );

  // ── Step 8: FAQ 검색 (최대 3건) ──
  const recommendedFAQ = searchFAQs(intentResult.detectedKeywords).slice(0, 3);

  // ── 처리 시간 계산 + 리얼리즘 지연 ──
  // 인위적 지연: 최소 100ms 이상의 처리 시간 보장
  const elapsed = performance.now() - startTime;
  const artificialDelay = Math.max(0, 100 - elapsed);
  // 동기적 busy-wait로 지연 시뮬레이션
  if (artificialDelay > 0) {
    const waitUntil = performance.now() + artificialDelay;
    while (performance.now() < waitUntil) {
      // busy-wait
    }
  }
  const processingTimeMs = Math.round(performance.now() - startTime);

  // ── 통합 결과 조립 ──
  const result: AnalysisResult = {
    originalText: safeText,
    normalizedText,

    mainIntent: intentResult.mainIntent,
    subIntent: intentResult.subIntent,
    detectedKeywords: intentResult.detectedKeywords,

    urgencyLevel: urgencyResult.level,
    urgencyScore: urgencyResult.score,
    urgencyReasons: urgencyResult.reasons,

    confidenceScore: intentResult.confidence,

    recommendedDepartment: deptResult.primary,
    alternativeDepartments: deptResult.alternatives,
    departmentConfidence: deptResult.confidence,
    departmentReason: deptResult.reason,

    summaryForAgent,
    recommendedFAQ,
    responseGuide: responseResult.guide,

    crmCategoryCode,
    nextActions: responseResult.nextActions,
    explanation,
    processingTimeMs,
  };

  return result;
}
