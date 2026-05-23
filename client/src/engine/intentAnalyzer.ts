// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 의도 분석 엔진 (Intent Analyzer)
// 규칙 기반 한국어 의도 분석기
// ═══════════════════════════════════════════════════════════

import type { IntentRule, IntentResult, ComplaintCategory } from '../types/index';

// ── 의도 분석 규칙 정의 (12개 민원 카테고리) ──
const INTENT_RULES: IntentRule[] = [
  {
    category: 'payment_error',
    mainIntent: '결제 오류',
    keywords: ['결제', '카드', '승인', '결제오류', '이중결제', '중복결제', '결제취소', '자동결제', '과금', '청구'],
    subIntents: [
      { keywords: ['이중', '중복', '두번', '두 번'], label: '이중 결제' },
      { keywords: ['취소', '승인취소'], label: '결제 취소' },
      { keywords: ['자동', '정기'], label: '자동결제 오류' },
      { keywords: ['과금', '청구', '요금'], label: '부당 과금' },
    ],
    weight: 1.2,
  },
  {
    category: 'refund_request',
    mainIntent: '환불 요청',
    keywords: ['환불', '반환', '돌려', '돈', '입금', '환급', '반품', '취소환불', '환불요청'],
    subIntents: [
      { keywords: ['지연', '안들어', '안 들어', '언제'], label: '환불 지연' },
      { keywords: ['부분', '일부'], label: '부분 환불' },
      { keywords: ['전액', '전부', '다'], label: '전액 환불' },
      { keywords: ['거부', '거절', '안해'], label: '환불 거부' },
    ],
    weight: 1.1,
  },
  {
    category: 'exchange_request',
    mainIntent: '교환 요청',
    keywords: ['교환', '바꿔', '변경', '사이즈', '색상', '교체', '다른걸로', '다른 걸로', '교환요청'],
    subIntents: [
      { keywords: ['사이즈', '크기', '호수'], label: '사이즈 교환' },
      { keywords: ['색상', '컬러', '색깔'], label: '색상 교환' },
      { keywords: ['불량', '하자', '결함'], label: '불량 교환' },
      { keywords: ['다른', '변경'], label: '제품 변경' },
    ],
    weight: 1.0,
  },
  {
    category: 'delivery_issue',
    mainIntent: '배송 문제',
    keywords: ['배송', '택배', '운송', '도착', '파손', '누락', '분실', '배달', '수령', '미배송', '오배송', '배송지연'],
    subIntents: [
      { keywords: ['지연', '늦', '안와', '안 와', '언제'], label: '배송 지연' },
      { keywords: ['파손', '깨짐', '망가', '찌그러'], label: '배송 중 파손' },
      { keywords: ['누락', '빠진', '없', '안들어'], label: '상품 누락' },
      { keywords: ['분실', '잃어', '없어'], label: '택배 분실' },
      { keywords: ['오배송', '잘못', '다른'], label: '오배송' },
    ],
    weight: 1.1,
  },
  {
    category: 'product_defect',
    mainIntent: '제품 불량',
    keywords: ['불량', '고장', '하자', '결함', '작동', '안됨', '안 됨', '망가', '깨진', '고장남', '품질'],
    subIntents: [
      { keywords: ['작동', '안됨', '안 됨', '안켜', '안 켜'], label: '작동 불량' },
      { keywords: ['외관', '스크래치', '긁힘', '찍힘'], label: '외관 불량' },
      { keywords: ['부품', '부속', '빠진'], label: '부품 결함' },
      { keywords: ['소리', '이상한', '냄새'], label: '이상 증상' },
    ],
    weight: 1.0,
  },
  {
    category: 'account_issue',
    mainIntent: '계정 문제',
    keywords: ['계정', '로그인', '비밀번호', '아이디', '인증', '본인확인', '비번', '잠김', '접속', '회원'],
    subIntents: [
      { keywords: ['로그인', '접속', '안돼', '안 돼'], label: '로그인 실패' },
      { keywords: ['비밀번호', '비번', '변경', '초기화'], label: '비밀번호 문제' },
      { keywords: ['인증', '본인확인', '인증번호'], label: '인증 오류' },
      { keywords: ['탈퇴', '삭제', '해지'], label: '계정 탈퇴' },
    ],
    weight: 1.0,
  },
  {
    category: 'service_complaint',
    mainIntent: '서비스 불만',
    keywords: ['불만', '불편', '서비스', '태도', '응대', '친절', '무례', '기분나쁜', '실망', '최악'],
    subIntents: [
      { keywords: ['태도', '무례', '불친절', '반말'], label: '상담원 태도' },
      { keywords: ['대기', '오래', '기다', '연결'], label: '대기 시간 불만' },
      { keywords: ['약속', '안지', '이행'], label: '약속 불이행' },
      { keywords: ['품질', '서비스', '저하'], label: '서비스 품질' },
    ],
    weight: 0.9,
  },
  {
    category: 'inquiry_general',
    mainIntent: '일반 문의',
    keywords: ['문의', '궁금', '알고싶', '어떻게', '요금', '가격', '절차', '방법', '안내', '확인', '질문'],
    subIntents: [
      { keywords: ['요금', '가격', '비용', '얼마'], label: '요금 문의' },
      { keywords: ['절차', '방법', '어떻게', '과정'], label: '절차 문의' },
      { keywords: ['영업', '시간', '위치', '주소'], label: '매장 문의' },
      { keywords: ['이벤트', '할인', '프로모션', '혜택'], label: '프로모션 문의' },
    ],
    weight: 0.7,
  },
  {
    category: 'technical_support',
    mainIntent: '기술 지원',
    keywords: ['오류', '에러', '버그', '튕김', '멈춤', '접속', '인터넷', '앱', '속도', '설정', '업데이트', '화면'],
    subIntents: [
      { keywords: ['앱', '어플', '애플리케이션'], label: '앱 오류' },
      { keywords: ['접속', '인터넷', '연결', '와이파이'], label: '접속 장애' },
      { keywords: ['속도', '느림', '느려', '렉'], label: '속도 저하' },
      { keywords: ['설정', '세팅', '설치'], label: '설정 지원' },
      { keywords: ['업데이트', '최신', '버전'], label: '업데이트 문제' },
    ],
    weight: 1.0,
  },
  {
    category: 'visit_reservation',
    mainIntent: '방문 예약',
    keywords: ['방문', '기사', '출장', '예약', '설치', '점검', '수리', '방문예약', '일정'],
    subIntents: [
      { keywords: ['설치', '신규'], label: '설치 예약' },
      { keywords: ['수리', '고장', 'AS'], label: '수리 예약' },
      { keywords: ['점검', '정기'], label: '점검 예약' },
      { keywords: ['변경', '취소', '일정'], label: '예약 변경/취소' },
    ],
    weight: 1.0,
  },
  {
    category: 'emergency',
    mainIntent: '긴급/사고',
    keywords: ['긴급', '사고', '위험', '도용', '해킹', '피해', '신고', '도로', '맨홀', '안전', '화재', '누출', '폭발'],
    subIntents: [
      { keywords: ['도용', '해킹', '유출'], label: '보안 사고' },
      { keywords: ['도로', '맨홀', '시설'], label: '시설 사고' },
      { keywords: ['화재', '누출', '폭발', '가스'], label: '안전 사고' },
      { keywords: ['피해', '사기', '범죄'], label: '피해 신고' },
    ],
    weight: 1.5,
  },
  {
    category: 'repeated_complaint',
    mainIntent: '반복 민원',
    keywords: ['여러번', '여러 번', '반복', '계속', '해결안', '또', '다시', '몇번째', '몇 번째', '이전에도'],
    subIntents: [
      { keywords: ['해결안', '해결이 안', '안됐', '안 됐'], label: '미해결 반복' },
      { keywords: ['또', '다시', '계속'], label: '동일 문제 재발' },
      { keywords: ['여러번', '여러 번', '몇번째', '몇 번째'], label: '다수 접수' },
    ],
    weight: 1.3,
  },
];

/**
 * 텍스트 정규화: 공백 정리 및 트리밍
 */
function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * 텍스트에서 키워드 매칭 수를 계산
 */
function countKeywordMatches(text: string, keywords: string[]): { count: number; matched: string[] } {
  let count = 0;
  const matched: string[] = [];

  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      count++;
      matched.push(keyword);
    }
  }

  return { count, matched };
}

/**
 * 서브인텐트 결정
 */
function determineSubIntent(
  text: string,
  subIntents: { keywords: string[]; label: string }[]
): string {
  let bestLabel = '기타';
  let bestCount = 0;

  for (const sub of subIntents) {
    const { count } = countKeywordMatches(text, sub.keywords);
    if (count > bestCount) {
      bestCount = count;
      bestLabel = sub.label;
    }
  }

  return bestLabel;
}

/**
 * 규칙 기반 한국어 의도 분석
 *
 * @param text - 고객 문의 텍스트 (한국어)
 * @returns IntentResult — 분석된 의도, 카테고리, 키워드, 신뢰도
 */
export function analyzeIntent(text: string): IntentResult {
  const normalized = normalizeText(text);

  // 빈 텍스트 처리
  if (!normalized) {
    return {
      mainIntent: '일반 문의',
      subIntent: '기타',
      category: 'inquiry_general',
      detectedKeywords: [],
      confidence: 40,
    };
  }

  let bestCategory: ComplaintCategory = 'inquiry_general';
  let bestMainIntent = '일반 문의';
  let bestScore = 0;
  let bestMatchedKeywords: string[] = [];
  let bestRule: IntentRule | null = null;

  // 각 규칙에 대해 키워드 매칭 및 점수 계산
  for (const rule of INTENT_RULES) {
    const { count, matched } = countKeywordMatches(normalized, rule.keywords);

    if (count === 0) continue;

    // 점수 = (매칭 수 * 가중치) / 전체 키워드 수
    const score = (count * rule.weight) / rule.keywords.length;

    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
      bestMainIntent = rule.mainIntent;
      bestMatchedKeywords = matched;
      bestRule = rule;
    }
  }

  // 서브인텐트 결정
  const subIntent = bestRule
    ? determineSubIntent(normalized, bestRule.subIntents)
    : '기타';

  // 전체 감지된 키워드 수집 (모든 규칙에서)
  const allDetectedKeywords: string[] = [];
  for (const rule of INTENT_RULES) {
    const { matched } = countKeywordMatches(normalized, rule.keywords);
    allDetectedKeywords.push(...matched);
  }
  // 중복 제거
  const uniqueKeywords = [...new Set(allDetectedKeywords)];

  // 신뢰도 계산 (40 ~ 98 범위)
  let confidence: number;
  if (bestScore === 0) {
    confidence = 40;
  } else {
    // 매칭 키워드 수와 점수 기반으로 신뢰도 산출
    const rawConfidence = Math.min(bestScore * 100, 60) + bestMatchedKeywords.length * 8;
    confidence = Math.max(40, Math.min(98, Math.round(rawConfidence)));
  }

  return {
    mainIntent: bestMainIntent,
    subIntent,
    category: bestCategory,
    detectedKeywords: uniqueKeywords.length > 0 ? uniqueKeywords : bestMatchedKeywords,
    confidence,
  };
}
