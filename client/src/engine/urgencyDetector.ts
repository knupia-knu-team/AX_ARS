// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 긴급도 감지 엔진 (Urgency Detector)
// 키워드 패턴 기반 긴급도 분석
// ═══════════════════════════════════════════════════════════

import type { UrgencyRule, UrgencyResult, UrgencyLevel, ComplaintCategory } from '../types/index';

// ── 긴급도 부스팅 규칙 정의 ──

/** 높은 긴급도 키워드 (scoreBoost: 30~40) */
const HIGH_URGENCY_RULES: UrgencyRule[] = [
  {
    keywords: ['긴급', '위험', '사고'],
    scoreBoost: 40,
    reason: '긴급/위험 상황 키워드 감지',
  },
  {
    keywords: ['도용', '해킹'],
    scoreBoost: 35,
    reason: '보안 위협 키워드 감지',
  },
  {
    keywords: ['지금', '즉시', '당장'],
    scoreBoost: 30,
    reason: '즉각 대응 요구 감지',
  },
  {
    keywords: ['계속되고', '계속해서'],
    scoreBoost: 30,
    reason: '지속적 문제 발생 감지',
  },
  {
    keywords: ['피해', '신고', '경찰'],
    scoreBoost: 35,
    reason: '피해 신고 관련 키워드 감지',
  },
  {
    keywords: ['소보원', '법적', '고발', '소송'],
    scoreBoost: 30,
    reason: '법적 조치 언급 감지',
  },
];

/** 중간 긴급도 키워드 (scoreBoost: 10~20) */
const MEDIUM_URGENCY_RULES: UrgencyRule[] = [
  {
    keywords: ['환불', '돈', '결제'],
    scoreBoost: 15,
    reason: '금전 관련 문의 감지',
  },
  {
    keywords: ['파손', '불량', '오류'],
    scoreBoost: 15,
    reason: '제품/서비스 문제 감지',
  },
  {
    keywords: ['안되', '안 되', '못'],
    scoreBoost: 10,
    reason: '기능 장애 감지',
  },
  {
    keywords: ['지연', '늦', '안와', '안 와'],
    scoreBoost: 15,
    reason: '지연 관련 키워드 감지',
  },
];

/** 감정 고조 키워드 (scoreBoost: 15) */
const EMOTIONAL_RULES: UrgencyRule[] = [
  {
    keywords: ['화나', '짜증', '황당', '어이없', '미치', '답답'],
    scoreBoost: 15,
    reason: '고객 감정 고조 감지',
  },
  {
    keywords: ['최악', '실망', '열받', '빡'],
    scoreBoost: 15,
    reason: '강한 불만 표현 감지',
  },
];

/** 반복 민원 마커 (scoreBoost: 20) */
const REPEATED_COMPLAINT_RULES: UrgencyRule[] = [
  {
    keywords: ['여러번', '여러 번', '반복', '또', '해결안', '해결이 안'],
    scoreBoost: 20,
    reason: '반복 민원 패턴 감지',
  },
  {
    keywords: ['몇번째', '몇 번째', '이전에도', '다시'],
    scoreBoost: 20,
    reason: '이전 문의 이력 언급 감지',
  },
];

/** 금전적 피해 마커 (scoreBoost: 25) */
const FINANCIAL_DAMAGE_RULES: UrgencyRule[] = [
  {
    keywords: ['결제가 계속', '자동으로', '빠져나', '인출'],
    scoreBoost: 25,
    reason: '지속적 금전 피해 감지',
  },
  {
    keywords: ['이중결제', '중복결제', '과금'],
    scoreBoost: 25,
    reason: '부당 결제 피해 감지',
  },
];

// 전체 규칙 병합
const ALL_URGENCY_RULES: UrgencyRule[] = [
  ...HIGH_URGENCY_RULES,
  ...MEDIUM_URGENCY_RULES,
  ...EMOTIONAL_RULES,
  ...REPEATED_COMPLAINT_RULES,
  ...FINANCIAL_DAMAGE_RULES,
];

// ── 카테고리별 기본 긴급도 점수 ──
const CATEGORY_BASE_SCORES: Partial<Record<ComplaintCategory, number>> = {
  emergency: 30,
  payment_error: 10,
  refund_request: 10,
  product_defect: 5,
  repeated_complaint: 15,
  delivery_issue: 5,
  account_issue: 5,
  technical_support: 5,
  service_complaint: 5,
  exchange_request: 0,
  visit_reservation: 0,
  inquiry_general: 0,
};

/**
 * 긴급도 점수를 레벨로 매핑
 */
function scoreToLevel(score: number): UrgencyLevel {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

/**
 * 텍스트에서 규칙 키워드 매칭 여부 확인
 */
function matchesRule(text: string, rule: UrgencyRule): boolean {
  return rule.keywords.some((keyword) => text.includes(keyword));
}

/**
 * 긴급도 감지
 *
 * @param text - 고객 문의 텍스트 (한국어)
 * @param category - 분류된 민원 카테고리
 * @returns UrgencyResult — 긴급도 레벨, 점수, 판정 사유
 */
export function detectUrgency(text: string, category: ComplaintCategory): UrgencyResult {
  const normalized = text.trim().replace(/\s+/g, ' ');

  // 1. 기본 점수 시작
  let score = 20;
  const reasons: string[] = [];

  // 2. 카테고리 기반 기본 점수 추가
  const categoryBase = CATEGORY_BASE_SCORES[category] ?? 0;
  if (categoryBase > 0) {
    score += categoryBase;
    reasons.push(`카테고리 기반 가중치 적용 (${category})`);
  }

  // 3. 모든 긴급도 규칙 검사
  for (const rule of ALL_URGENCY_RULES) {
    if (matchesRule(normalized, rule)) {
      score += rule.scoreBoost;
      reasons.push(rule.reason);
    }
  }

  // 4. 점수 클램핑 (0 ~ 100)
  score = Math.max(0, Math.min(100, score));

  // 5. 레벨 매핑
  const level = scoreToLevel(score);

  // 6. 사유가 없는 경우 기본 사유 추가
  if (reasons.length === 0) {
    reasons.push('특이 사항 없음');
  }

  return { level, score, reasons };
}
