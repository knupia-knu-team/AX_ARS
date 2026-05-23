// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 응대 가이드 생성 엔진 (Response Generator)
// 카테고리·긴급도 기반 응대 가이드 및 다음 조치 생성
// ═══════════════════════════════════════════════════════════

import type { ComplaintCategory, UrgencyLevel, ResponseGuide } from '../types/index';
import { getResponseGuide } from '../data/responseGuides';

/**
 * 카테고리별 다음 조치 항목 생성
 */
function generateNextActions(
  category: ComplaintCategory,
  urgencyLevel: UrgencyLevel,
  _keywords: string[]
): string[] {
  const actions: string[] = [];

  // 공통: 고객 본인 확인은 항상 포함
  actions.push('고객 본인 확인');

  // 카테고리별 조치 항목
  switch (category) {
    case 'payment_error':
      actions.push('결제 내역 확인');
      actions.push('카드사/PG사 승인 내역 조회');
      actions.push('결제 오류 접수 및 정정 처리');
      break;

    case 'refund_request':
      actions.push('결제 내역 확인');
      actions.push('환불 처리 접수');
      actions.push('환불 예상 소요 기간 안내');
      break;

    case 'exchange_request':
      actions.push('주문 내역 확인');
      actions.push('교환 가능 여부 확인');
      actions.push('교환 접수 처리');
      break;

    case 'delivery_issue':
      actions.push('배송 추적 조회');
      actions.push('물류센터 연락');
      actions.push('배송 상태 업데이트 안내');
      break;

    case 'product_defect':
      actions.push('제품 상태 확인 (사진/영상)');
      actions.push('불량 접수 및 교환/환불 안내');
      actions.push('품질관리팀 보고');
      break;

    case 'account_issue':
      actions.push('계정 상태 확인');
      actions.push('본인 인증 절차 진행');
      actions.push('계정 복구/변경 처리');
      break;

    case 'service_complaint':
      actions.push('불만 내용 상세 기록');
      actions.push('해당 부서/담당자 확인');
      actions.push('고객 보상 방안 검토');
      break;

    case 'inquiry_general':
      actions.push('문의 내용 확인');
      actions.push('관련 정보 안내');
      actions.push('추가 문의 사항 확인');
      break;

    case 'technical_support':
      actions.push('원격 진단 시작');
      actions.push('장애 접수');
      actions.push('기술 지원 이력 확인');
      break;

    case 'visit_reservation':
      actions.push('가용 일정 확인');
      actions.push('방문 예약 접수');
      actions.push('예약 확인 안내 발송');
      break;

    case 'emergency':
      actions.push('긴급 대응 프로세스 시작');
      actions.push('관리자 에스컬레이션');
      actions.push('유관 부서 동시 알림');
      break;

    case 'repeated_complaint':
      actions.push('이전 상담 이력 확인');
      actions.push('상위 담당자 배정');
      actions.push('미해결 건 원인 분석');
      break;
  }

  // 높은 긴급도인 경우 추가 조치
  if (urgencyLevel === 'High') {
    actions.push('우선 처리 요청');
  }

  return actions;
}

/**
 * 응대 가이드 및 다음 조치 항목 생성
 *
 * @param category - 분류된 민원 카테고리
 * @param urgencyLevel - 긴급도 레벨
 * @param keywords - 감지된 키워드 목록
 * @returns 응대 가이드와 다음 조치 항목
 */
export function generateResponse(
  category: ComplaintCategory,
  urgencyLevel: UrgencyLevel,
  keywords: string[]
): { guide: ResponseGuide | null; nextActions: string[] } {
  // 1. 카테고리에 맞는 응대 가이드 조회
  const guide = getResponseGuide(category);

  // 2. 다음 조치 항목 생성
  const nextActions = generateNextActions(category, urgencyLevel, keywords);

  return { guide, nextActions };
}
