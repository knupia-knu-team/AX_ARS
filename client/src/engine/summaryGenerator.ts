// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 요약 생성 엔진 (Summary Generator)
// 상담원 요약, CRM 코드, 분석 설명 생성
// ═══════════════════════════════════════════════════════════

import type { ComplaintCategory, IntentResult, UrgencyResult } from '../types/index';

// ── 카테고리 → CRM 3글자 접두어 매핑 ──
const CATEGORY_PREFIX_MAP: Record<ComplaintCategory, string> = {
  payment_error: 'PAY',
  refund_request: 'REF',
  exchange_request: 'EXC',
  delivery_issue: 'DEL',
  product_defect: 'DEF',
  account_issue: 'ACC',
  service_complaint: 'SVC',
  inquiry_general: 'INQ',
  technical_support: 'TEC',
  visit_reservation: 'VIS',
  emergency: 'EMG',
  repeated_complaint: 'RPT',
};

// ── 서브인텐트 → CRM 3글자 접미어 매핑 ──
const SUB_INTENT_SUFFIX_MAP: Record<string, string> = {
  '이중 결제': 'DBL',
  '결제 취소': 'CAN',
  '자동결제 오류': 'AUT',
  '부당 과금': 'CHG',
  '환불 지연': 'DLY',
  '부분 환불': 'PRT',
  '전액 환불': 'FUL',
  '환불 거부': 'REJ',
  '사이즈 교환': 'SIZ',
  '색상 교환': 'CLR',
  '불량 교환': 'DEF',
  '제품 변경': 'CHG',
  '배송 지연': 'DLY',
  '배송 중 파손': 'DMG',
  '상품 누락': 'MIS',
  '택배 분실': 'LST',
  '오배송': 'WRG',
  '작동 불량': 'MAL',
  '외관 불량': 'EXT',
  '부품 결함': 'PRT',
  '이상 증상': 'ABN',
  '로그인 실패': 'LOG',
  '비밀번호 문제': 'PWD',
  '인증 오류': 'VRF',
  '계정 탈퇴': 'DEL',
  '상담원 태도': 'ATT',
  '대기 시간 불만': 'WAI',
  '약속 불이행': 'BRK',
  '서비스 품질': 'QUA',
  '요금 문의': 'FEE',
  '절차 문의': 'PRC',
  '매장 문의': 'STR',
  '프로모션 문의': 'PRM',
  '앱 오류': 'APP',
  '접속 장애': 'CON',
  '속도 저하': 'SPD',
  '설정 지원': 'SET',
  '업데이트 문제': 'UPD',
  '설치 예약': 'INS',
  '수리 예약': 'REP',
  '점검 예약': 'CHK',
  '예약 변경/취소': 'MOD',
  '보안 사고': 'SEC',
  '시설 사고': 'FAC',
  '안전 사고': 'SAF',
  '피해 신고': 'RPT',
  '미해결 반복': 'UNR',
  '동일 문제 재발': 'REC',
  '다수 접수': 'MUL',
  '기타': 'ETC',
};

/**
 * 3자리 랜덤 숫자 생성 (001~999)
 */
function generateRandomSuffix(): string {
  const num = Math.floor(Math.random() * 999) + 1;
  return String(num).padStart(3, '0');
}

/**
 * 상담원용 한국어 요약 생성
 *
 * @param text - 원본 고객 문의 텍스트
 * @param mainIntent - 주요 의도
 * @param subIntent - 세부 의도
 * @param keywords - 감지된 키워드 목록
 * @returns 1~2문장의 한국어 요약
 */
export function generateSummary(
  _text: string,
  mainIntent: string,
  subIntent: string,
  keywords: string[]
): string {
  // 키워드 컨텍스트 생성
  const keywordContext =
    keywords.length > 0
      ? keywords.slice(0, 5).join(', ') + ' 관련 사항'
      : '상세 내용';

  // 서브인텐트가 기타인 경우
  if (subIntent === '기타') {
    return `고객이 ${mainIntent} 관련 문의. ${keywordContext} 확인 필요.`;
  }

  return `고객이 ${mainIntent} 관련 문의. ${subIntent} 건으로, ${keywordContext} 확인 필요.`;
}

/**
 * CRM 카테고리 코드 생성
 *
 * @param category - 민원 카테고리
 * @param subIntent - 세부 의도
 * @returns 'PAY-ERR-001' 형식의 CRM 코드
 */
export function generateCRMCode(category: ComplaintCategory, subIntent: string): string {
  const prefix = CATEGORY_PREFIX_MAP[category] || 'GEN';
  const suffix = SUB_INTENT_SUFFIX_MAP[subIntent] || 'ETC';
  const number = generateRandomSuffix();

  return `${prefix}-${suffix}-${number}`;
}

/**
 * 분석 프로세스 전체 설명 생성 (한국어)
 *
 * @param intentResult - 의도 분석 결과
 * @param urgencyResult - 긴급도 분석 결과
 * @param deptName - 추천 부서명
 * @returns 분석 과정을 설명하는 한국어 문장
 */
export function generateExplanation(
  intentResult: IntentResult,
  urgencyResult: UrgencyResult,
  deptName: string
): string {
  const keywordsStr =
    intentResult.detectedKeywords.length > 0
      ? intentResult.detectedKeywords.slice(0, 5).join(', ')
      : '일반';

  const reasonsStr =
    urgencyResult.reasons.length > 0
      ? urgencyResult.reasons.slice(0, 3).join(', ')
      : '특이 사항 없음';

  const levelLabel =
    urgencyResult.level === 'High'
      ? '높음'
      : urgencyResult.level === 'Medium'
        ? '보통'
        : '낮음';

  return (
    `고객 문의에서 [${keywordsStr}] 키워드가 감지되어 ` +
    `'${intentResult.mainIntent}'(으)로 분류되었습니다. ` +
    `긴급도는 ${reasonsStr}(으)로 인해 '${levelLabel}'(으)로 판정되었으며, ` +
    `${deptName}(으)로 연결을 추천합니다.`
  );
}
