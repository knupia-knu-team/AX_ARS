// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 부서 데이터
// AI 기반 음성 이해형 지능형 고객센터 AX 플랫폼
// ═══════════════════════════════════════════════════════════

import type { Department, ComplaintCategory } from '../types/index';

export const departments: Department[] = [
  {
    id: 'dept-payment',
    name: '결제지원팀',
    description:
      '결제 오류, 이중 결제, 결제 수단 변경 등 모든 결제 관련 문제를 전문적으로 처리합니다. 카드사 연동 확인 및 PG사 결제 내역 조회가 가능합니다.',
    icon: '💳',
    categories: ['payment_error'],
    avgWaitTime: 120,
    avgHandleTime: 8,
    operatingHours: '09:00-18:00',
  },
  {
    id: 'dept-refund',
    name: '환불/교환팀',
    description:
      '환불 접수, 환불 진행 상황 확인, 교환 접수 및 처리를 담당합니다. 부분 환불, 전체 환불, 교환 배송 등 다양한 사후 처리를 지원합니다.',
    icon: '🔄',
    categories: ['refund_request', 'exchange_request'],
    avgWaitTime: 180,
    avgHandleTime: 12,
    operatingHours: '09:00-18:00',
  },
  {
    id: 'dept-delivery',
    name: '배송지원팀',
    description:
      '배송 지연, 오배송, 택배 파손, 배송 조회 등 배송 전반의 문제를 처리합니다. 택배사 실시간 연동을 통해 배송 현황을 즉시 확인할 수 있습니다.',
    icon: '📦',
    categories: ['delivery_issue', 'product_defect'],
    avgWaitTime: 90,
    avgHandleTime: 7,
    operatingHours: '09:00-21:00',
  },
  {
    id: 'dept-tech',
    name: '기술지원팀',
    description:
      '앱 오류, 인터넷 장애, 시스템 접속 문제, 계정 복구 등 기술적인 문제를 전문적으로 해결합니다. 원격 지원 및 로그 분석이 가능합니다.',
    icon: '🔧',
    categories: ['technical_support', 'account_issue'],
    avgWaitTime: 150,
    avgHandleTime: 15,
    operatingHours: '09:00-22:00',
  },
  {
    id: 'dept-visit',
    name: '방문예약팀',
    description:
      '기사 방문 예약, 현장 점검 일정 조율, 방문 서비스 접수를 담당합니다. 고객 희망 일시에 맞춘 예약 배정이 가능합니다.',
    icon: '📅',
    categories: ['visit_reservation', 'technical_support'],
    avgWaitTime: 60,
    avgHandleTime: 5,
    operatingHours: '09:00-18:00',
  },
  {
    id: 'dept-emergency',
    name: '사고/긴급대응팀',
    description:
      '카드 도용, 개인정보 유출, 안전 사고, 긴급 시설 문제 등 즉각 대응이 필요한 긴급 상황을 처리합니다. 24시간 운영되며 관계 기관 연계가 가능합니다.',
    icon: '🚨',
    categories: ['emergency'],
    avgWaitTime: 30,
    avgHandleTime: 20,
    operatingHours: '24시간',
  },
  {
    id: 'dept-general',
    name: '일반상담팀',
    description:
      '요금 안내, 서비스 이용 방법, 이벤트 문의 등 일반적인 상담과 서비스 불만 접수를 처리합니다. 가장 폭넓은 범위의 고객 문의에 대응합니다.',
    icon: '📞',
    categories: ['inquiry_general', 'service_complaint'],
    avgWaitTime: 60,
    avgHandleTime: 5,
    operatingHours: '09:00-18:00',
  },
  {
    id: 'dept-complaint',
    name: '민원전담팀',
    description:
      '반복 민원, 미해결 불만, 고질적 서비스 문제 등을 전담 처리합니다. 이전 상담 이력을 종합 분석하여 근본적인 해결 방안을 제시합니다.',
    icon: '📋',
    categories: ['repeated_complaint', 'service_complaint'],
    avgWaitTime: 90,
    avgHandleTime: 25,
    operatingHours: '09:00-18:00',
  },
];

/**
 * 부서 ID로 부서 정보를 조회합니다.
 */
export function getDepartmentById(id: string): Department | undefined {
  return departments.find((dept) => dept.id === id);
}

/**
 * 민원 카테고리에 해당하는 모든 부서를 조회합니다.
 */
export function getDepartmentsByCategory(
  category: ComplaintCategory,
): Department[] {
  return departments.filter((dept) => dept.categories.includes(category));
}
