// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 부서 라우팅 엔진 (Department Router)
// 카테고리 기반 최적 부서 추천
// ═══════════════════════════════════════════════════════════

import type { ComplaintCategory, UrgencyLevel, DepartmentRecommendation, Department } from '../types/index';
import { getDepartmentsByCategory, getDepartmentById } from '../data/departmentData';

// ── 카테고리 → 한국어 라벨 매핑 ──
const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  payment_error: '결제 오류',
  refund_request: '환불 요청',
  exchange_request: '교환 요청',
  delivery_issue: '배송 문제',
  product_defect: '제품 불량',
  account_issue: '계정 문제',
  service_complaint: '서비스 불만',
  inquiry_general: '일반 문의',
  technical_support: '기술 지원',
  visit_reservation: '방문 예약',
  emergency: '긴급/사고',
  repeated_complaint: '반복 민원',
};

// ── 기본 폴백 부서 (일반상담팀) ──
const FALLBACK_DEPARTMENT: Department = {
  id: 'general',
  name: '일반상담팀',
  description: '일반적인 고객 문의를 처리하는 부서입니다.',
  icon: '📞',
  categories: ['inquiry_general'],
  avgWaitTime: 120,
  avgHandleTime: 10,
  operatingHours: '09:00-18:00',
};

/**
 * 카테고리와 긴급도를 기반으로 최적 부서를 추천
 *
 * @param category - 분류된 민원 카테고리
 * @param urgencyLevel - 긴급도 레벨
 * @returns DepartmentRecommendation — 추천 부서, 대안 부서, 신뢰도, 사유
 */
export function routeDepartment(
  category: ComplaintCategory,
  urgencyLevel: UrgencyLevel
): DepartmentRecommendation {
  // 1. 카테고리에 매칭되는 부서 검색
  const matchingDepartments = getDepartmentsByCategory(category);
  const categoryLabel = CATEGORY_LABELS[category] || category;

  // 2. 매칭 부서가 없는 경우 → 폴백
  if (!matchingDepartments || matchingDepartments.length === 0) {
    return {
      primary: FALLBACK_DEPARTMENT,
      alternatives: [],
      confidence: 50,
      reason: `'${categoryLabel}' 카테고리에 매칭되는 전담 부서가 없어 일반상담팀으로 연결합니다.`,
    };
  }

  // 3. 주 부서 = 첫 번째 매칭, 대안 = 나머지
  const primary = matchingDepartments[0];
  const alternatives = matchingDepartments.slice(1);

  // 4. 높은 긴급도이고 긴급/사고 카테고리가 아닌 경우 → 사고/긴급대응팀 추가
  if (urgencyLevel === 'High' && category !== 'emergency') {
    const emergencyDept = getDepartmentById('emergency');
    if (emergencyDept) {
      // 이미 대안에 포함되어 있지 않은 경우에만 추가
      const alreadyIncluded = alternatives.some((dept) => dept.id === emergencyDept.id);
      if (!alreadyIncluded && primary.id !== emergencyDept.id) {
        alternatives.push(emergencyDept);
      }
    }
  }

  // 5. 신뢰도 계산
  //    - 단일 매칭 = 높은 신뢰도
  //    - 다수 매칭 = 상대적으로 낮은 신뢰도
  let confidence: number;
  if (matchingDepartments.length === 1) {
    confidence = 95;
  } else if (matchingDepartments.length === 2) {
    confidence = 85;
  } else {
    confidence = 75;
  }

  // 긴급도에 따라 신뢰도 조정
  if (urgencyLevel === 'High') {
    confidence = Math.min(98, confidence + 5);
  }

  // 6. 추천 사유 생성
  let reason = `'${categoryLabel}' 유형의 문의로, ${primary.name}에서 전문적으로 처리 가능합니다.`;

  if (urgencyLevel === 'High') {
    reason += ` 긴급도가 높아 우선 처리를 권장합니다.`;
  }

  if (alternatives.length > 0) {
    const altNames = alternatives.map((d) => d.name).join(', ');
    reason += ` 대안 부서: ${altNames}.`;
  }

  return {
    primary,
    alternatives,
    confidence,
    reason,
  };
}
