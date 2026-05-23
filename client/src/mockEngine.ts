// ═══════════════════════════════════════════════════════════
// Call Mate AX — Client-side Mock Engine (GitHub Pages 정적 배포용)
// ═══════════════════════════════════════════════════════════

import type { APIAnalysisResult } from './types/shared';

export function runMockAnalysis(text: string): APIAnalysisResult {
  const normalizedText = text.trim().replace(/\s+/g, ' ');

  let mainIntent = '일반 문의';
  let subIntent = '일반 상담';
  let detectedKeywords: string[] = [];
  let urgencyLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let urgencyScore = 20;
  const confidenceScore = 95;
  let recommendedDepartment = '일반상담팀';
  let alternativeDepartments: string[] = [];
  let summaryForAgent = '';
  let recommendedFAQ: string[] = [];
  let responseGuide = '';
  let crmCategoryCode = 'ECO-GEN-001';
  let nextActions: string[] = [];
  let explanation = '';

  const isNonEcommerce =
    normalizedText.includes('가스 냄새') ||
    normalizedText.includes('맨홀') ||
    normalizedText.includes('도로 파손') ||
    normalizedText.includes('심장마비') ||
    normalizedText.includes('병원') ||
    normalizedText.includes('대출') ||
    normalizedText.includes('안전 사고') ||
    normalizedText.includes('소방') ||
    normalizedText.includes('수도 파열');

  if (isNonEcommerce) {
    return {
      originalText: text, normalizedText,
      mainIntent: '일반 문의', subIntent: '이커머스 범주 외 문의',
      detectedKeywords: [], urgencyLevel: 'Low', urgencyScore: 15, confidenceScore: 98,
      recommendedDepartment: '일반상담팀', alternativeDepartments: [],
      summaryForAgent: '이커머스 고객센터의 상담 범위를 벗어난 일반 외부 문의입니다.',
      recommendedFAQ: ['주문번호를 모르는 고객의 문의는 어떻게 시작하나요?'],
      responseGuide: '본 이커머스 지원 범위를 벗어난 내용임을 정중히 안내합니다.',
      crmCategoryCode: 'ECO-OUT-000',
      nextActions: ['이커머스 범주 외 문의 사항임을 고객에게 설명', '일반상담팀 안내 후 통화 종결'],
      explanation: '이커머스 상담 범위를 초과하여 일반상담팀으로 분류합니다.',
      analysisSource: 'Mock Rule Engine',
    };
  }

  // 1. 배송 지연 (Medium)
  if (normalizedText.includes('생수') || normalizedText.includes('도도착 예정이었는데')) {
    mainIntent = '배송 지연'; subIntent = '배송 예정일 초과 지연';
    detectedKeywords = ['생수', '배송', '지연', '도착'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Medium'; urgencyScore = 55;
    recommendedDepartment = '배송지원팀'; alternativeDepartments = ['일반상담팀'];
    summaryForAgent = '배송 약속 기한이 경과하였으나 상품을 수령하지 못한 배송 지연 상태에 대한 불만 문의입니다.';
    recommendedFAQ = ['오늘 도착 예정 상품이 아직 도착하지 않았을 때 어떻게 안내하나요?', '빠른배송 상품이 약속 시간 내 도착하지 않았을 때 보상 안내는 어떻게 하나요?'];
    responseGuide = '운송장 번호 조회를 통해 최종 간선 상차/하차 터미널 위치를 조회하고 대리점 담당 배송기사 연락처를 매핑해 안내합니다.';
    crmCategoryCode = 'ECO-DEL-501';
    nextActions = ['운송장 번호로 실시간 허브 위치 파악', '최종 담당 택배 대리점 확인', '오늘 도착 보상 대상 여부 판정'];
    explanation = '상품 배송 및 운송장 지연 문제로 분석되어 배송지원팀으로 이관합니다.';
  }
  // 2. 상품 파손 교환 (Medium)
  else if (normalizedText.includes('도자기') || normalizedText.includes('에어캡')) {
    mainIntent = '상품 파손'; subIntent = '배송 상품 불량/파손';
    detectedKeywords = ['파손', '도자기', '배송', '교환'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Medium'; urgencyScore = 60;
    recommendedDepartment = '상품품질팀'; alternativeDepartments = ['반품/교환팀', '배송지원팀'];
    summaryForAgent = '도자기 접시 세트의 내부 완충 포장 부실로 인해 모서리가 깨지고 파손되어 새 상품으로 빠른 교환을 요청하는 접수 건입니다.';
    recommendedFAQ = ['파손 상품 교환 시 귀책 증빙용 사진은 어떻게 제출하나요?', '상품 박스만 훼손되고 내용물은 정상인 경우도 교환이 가능한가요?'];
    responseGuide = '포장 패키지 외부 파손 여부와 상품 파손 부위 확인을 위해 사진 증빙 접수를 안내하고 교환 절차를 접수합니다.';
    crmCategoryCode = 'ECO-DMG-401';
    nextActions = ['고객 증빙 사진 등록 안내 및 접수', '물류창고 패킹 출고 중량 기록 검토', '재발송 또는 부분 환불 처리 확정'];
    explanation = '제품 파손 귀책 판단 및 교환/보상을 신속하게 처리하기 위해 상품품질팀으로 라우팅합니다.';
  }
  // 3. 반품 회수 지연 (Medium)
  else if (normalizedText.includes('회수 기사') || normalizedText.includes('나흘째')) {
    mainIntent = '반품 요청'; subIntent = '회수 기사 방문 지연';
    detectedKeywords = ['반품', '회수', '기사', '지연'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Medium'; urgencyScore = 50;
    recommendedDepartment = '반품/교환팀'; alternativeDepartments = ['배송지원팀'];
    summaryForAgent = '반품 접수 후 수거 기사의 방문이 나흘째 지연되어 현관 문 앞 방치 상품의 분실을 불안해하며 조속한 수거를 요구하는 지연 문의입니다.';
    recommendedFAQ = ['반품 접수 후 회수 기사가 오지 않았을 때 어떻게 처리하나요?', '반품비는 언제 발생하나요?'];
    responseGuide = '반품 접수 번호를 확인하고, 택배 회수 예약 스케줄을 조회하여 지정된 담당 기사의 수거 일정을 파악해 안내합니다.';
    crmCategoryCode = 'ECO-RTN-301';
    nextActions = ['반품/교환 접수 유효성 검증', '회수 지시 택배사 송장 스케줄 체크', '회수 기사 미배정 시 긴급 수거 요청 재등록'];
    explanation = '반품 및 교환, 회수 일정 관련 문의로 분류되어 반품/교환팀 전담 부서에 연동합니다.';
  }
  // 4. 카드 환불 지연 (Low)
  else if (normalizedText.includes('승인 취소 완료라고') || normalizedText.includes('카드 연결 계좌')) {
    mainIntent = '환불 지연'; subIntent = '카드 승인 취소 지연';
    detectedKeywords = ['환불', '카드', '취소', '승인'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Low'; urgencyScore = 35;
    recommendedDepartment = '환불정산팀'; alternativeDepartments = ['주문/결제팀'];
    summaryForAgent = '마이페이지 상에는 승인 취소 완료로 표시되었으나 실제 카드 연결 계좌에 금액이 인입되지 않아 계좌 입금 소요 기간을 질문하는 조회성 건입니다.';
    recommendedFAQ = ['환불 완료라고 표시되는데 카드 취소가 아직 안 된 경우 어떻게 안내하나요?', '반품 상품 회수 후 환불이 지연되는 경우 어떻게 처리하나요?'];
    responseGuide = '결제 수단별 취소 전표 매입 완료 및 환불 대금 카드사 정산 반영 예정 소요 기간을 이성적으로 설명합니다.';
    crmCategoryCode = 'ECO-REF-202';
    nextActions = ['취소 처리 및 PG 송신 일자 확인', '결제 대행사(PG) 승인 상태 조회', '고객 카드사 대금 입금 지연 시 대처 방법 안내'];
    explanation = '환불 처리 일정 지연 건에 대한 표준 반영 기간 안내로 파악되어 전담 환불정산팀으로 라우팅을 진행합니다.';
  }
  // 5. 쿠폰 미적용 (Low)
  else if (normalizedText.includes('웰컴') || normalizedText.includes('웰컴 할인')) {
    mainIntent = '쿠폰/할인 적용 오류'; subIntent = '첫 구매 쿠폰 미반영 청구';
    detectedKeywords = ['쿠폰', '할인', '청구', '오류'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Low'; urgencyScore = 30;
    recommendedDepartment = '쿠폰/멤버십팀'; alternativeDepartments = ['주문/결제팀'];
    summaryForAgent = '첫 구매 10% 웰컴 할인 쿠폰을 적용했으나 실제 원금액대로 결제가 체결되어 차액 환불 가능 여부를 확인 요청하는 일반 질의 건입니다.';
    recommendedFAQ = ['쿠폰이 적용되지 않아 결제 금액이 다르게 나온 경우 어떻게 안내하나요?', '멤버십 혜택이 적용되지 않았을 때 어떻게 확인하나요?'];
    responseGuide = '주문 시점의 쿠폰 적용 기록과 최소 결제 금액 충족 등 상세 적용 한도 조건을 검토하여 차액 환불 접수를 진행합니다.';
    crmCategoryCode = 'ECO-PAY-601';
    nextActions = ['주문 실결제 승인 횟수 조회', '적용 가능한 할인/쿠폰 조건 검토', 'PG사 한도 및 이중 승인 취소 접수'];
    explanation = '쿠폰 및 할인 내역 검토 및 청구 차액의 조정을 위해 전문 쿠폰/멤버십팀으로 연결해 처리합니다.';
  }
  // 6. 구독 해지 오결제 (High)
  else if (normalizedText.includes('멋대로') || normalizedText.includes('4,900원')) {
    mainIntent = '정기배송/구독 문의'; subIntent = '구독 해지 후 자동 오결제';
    detectedKeywords = ['구독', '해지', '오결제', '자동결제'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'High'; urgencyScore = 85;
    recommendedDepartment = '쿠폰/멤버십팀'; alternativeDepartments = ['주문/결제팀', '환불정산팀'];
    summaryForAgent = '멤버십 및 정기배송 해지 처리가 정상 완료되었으나 자동 결제가 중복 진행되어 즉시 취소 및 환불을 강하게 요구하는 강성 민원 건입니다.';
    recommendedFAQ = ['정기배송을 해지했는데 또 결제된 경우 어떻게 처리하나요?', '멤버십 혜택이 적용되지 않았을 때 어떻게 확인하나요?'];
    responseGuide = '정기배송 해지 완료 시간 및 자동 이체 승인 기록 대조 후 시스템 연동 오류 즉각 승인 취소 프로세스를 밟습니다.';
    crmCategoryCode = 'ECO-MBR-701';
    nextActions = ['멤버십 가입 및 정기배송 스케줄 이력 조회', '구독 자동결제 취소 처리 접수', '미제공된 멤버십 회원 전용 혜택 확인'];
    explanation = '정기배송 구독 정보 해지 오류로 자동 오청구된 것이므로 신속 확인을 위해 쿠폰/멤버십팀으로 라우팅합니다.';
  }
  // 7. 배송 상품 누락 (Medium)
  else if (normalizedText.includes('냄비') || normalizedText.includes('두 개가 아예')) {
    mainIntent = '상품 누락'; subIntent = '대량 배송 상품 누락';
    detectedKeywords = ['누락', '냄비', '배송', '미수령'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Medium'; urgencyScore = 65;
    recommendedDepartment = '배송지원팀'; alternativeDepartments = ['상품품질팀', '반품/교환팀'];
    summaryForAgent = '주문한 냄비 세트 3개 상품 중 1개만 수령하고 2개가 배송 누락되어, 포장 검수 영상 확인 및 즉시 재발송 처리를 촉구하는 긴급 건입니다.';
    recommendedFAQ = ['일부 상품 누락 시 추가 발송 처리는 어떻게 되나요?', '묶음배송 상품 중 하나만 도착하지 않은 경우 어떻게 처리하나요?'];
    responseGuide = '출고 및 포장 검수 녹화 영상 판독 및 물류 검수를 지시하고 즉시 누락 물품 재발송 처리를 위해 선결 조치합니다.';
    crmCategoryCode = 'ECO-MIS-001';
    nextActions = ['주문 구성 확인', '출고 수량 확인', '누락 상품 확인', '추가 발송 또는 환불 접수'];
    explanation = '배송 누락 중 다량 누락 건으로 분류되어 이를 신속히 추적할 수 있도록 배송지원팀으로 라우팅합니다.';
  }
  // 8. 배송지 변경 (Low)
  else if (normalizedText.includes('새 아파트') || normalizedText.includes('옛날 주소지')) {
    mainIntent = '배송지 변경'; subIntent = '출고 전 배송 주소 정정';
    detectedKeywords = ['배송지', '주소', '변경', '정정'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Low'; urgencyScore = 25;
    recommendedDepartment = '배송지원팀'; alternativeDepartments = ['일반상담팀'];
    summaryForAgent = '주소 오입력으로 인해 출고 전 새 이사지 주소로 실시간 변경을 공손하게 요청하는 단순 문의 건입니다.';
    recommendedFAQ = ['주문 후 배송지를 잘못 입력한 경우 변경이 가능한가요?'];
    responseGuide = '출고 및 패킹 단계를 점검하여 상품 준비 중 단계인 경우 즉시 주소지 정정을 업데이트합니다.';
    crmCategoryCode = 'ECO-ADR-801';
    nextActions = ['주문 상품의 출고/패킹 상태 점검', '출고 전 상태일 경우 배송지 주소 업데이트', '이미 출고된 경우 기사 연락망 정보 인계'];
    explanation = '출고 전 배송지 변경에 관한 단순 정정 문의로 배송지원팀에서 전담하여 신속히 대응할 수 있습니다.';
  }
  // 9. 판매자 불통 (Low)
  else if (normalizedText.includes('본사 차원') || normalizedText.includes('소명')) {
    mainIntent = '판매자 문의'; subIntent = '입점 판매자 불통 중재';
    detectedKeywords = ['판매자', '불통', '중재', '답변'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Low'; urgencyScore = 38;
    recommendedDepartment = '판매자지원팀'; alternativeDepartments = ['일반상담팀'];
    summaryForAgent = '입점 제휴 판매자의 게시판 답변 지연으로 인해 플랫폼 본사 차원의 직권 환불 및 중재 규정을 이성적으로 질문하는 조회성 건입니다.';
    recommendedFAQ = ['판매자가 계속 답변하지 않을 때 어떻게 처리하나요?'];
    responseGuide = '판매자 입점 소명 지연 프로세스에 의거해 본사 취소 지침을 검토하고 고객에게 직권 환불 가능성 규정을 안내합니다.';
    crmCategoryCode = 'ECO-PTN-901';
    nextActions = ['입점 파트너 판매자 컨택처 확보 시도', '판매자 측 답변 촉구 긴급 소명 공문 발송', '미답변 시 본사 직권 중재 처리 규정 검토'];
    explanation = '제휴 파트너 판매자 소통 지연 중재건으로 분류되어 판매자지원팀으로 이관합니다.';
  }
  // 10. 3차 반복 민원 (High)
  else if (normalizedText.includes('소비자고발') || normalizedText.includes('고발 조치')) {
    mainIntent = '반복 민원'; subIntent = '미해결 반복 불만 에스컬레이션';
    detectedKeywords = ['민원', '고발', '책임자', '해결'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'High'; urgencyScore = 90;
    recommendedDepartment = '민원전담팀'; alternativeDepartments = ['일반상담팀'];
    summaryForAgent = '[민원 강도: 극도] 배송 지연 건에 대해 벌써 3번째 연락하며 고발 조치와 소비자원 신고를 강력하게 통보 중인 긴급 상급자 이관 민원입니다.';
    recommendedFAQ = ['같은 문제로 반복 전화한 고객은 어떻게 응대해야 하나요?', '고객이 책임자 연결을 요청할 때 어떻게 대응하나요?'];
    responseGuide = '이전 동일 문의 이력을 종합 검토하고 경청한 뒤 민원전담 부서 책임자급 에스컬레이션 프로세스를 밟습니다.';
    crmCategoryCode = 'ECO-REP-911';
    nextActions = ['고객 감정 경청 및 기본 사과', '이전 동일 문의 티켓 이력 조회', '민원전담 책임자급 긴급 에스컬레이션 접수'];
    explanation = '3차 반복 문의 및 소비자원 고발 언급이 감지되어 고강도 반복 민원으로 판단하고 즉시 민원전담팀으로 격상 분류했습니다.';
  }
  // 폴백
  else {
    mainIntent = normalizedText.includes('주문') ? '주문 확인' : '일반 문의';
    subIntent = '주문 및 배송 단순 조회';
    detectedKeywords = ['주문', '확인'].filter(k => normalizedText.includes(k));
    urgencyLevel = 'Low'; urgencyScore = 20;
    recommendedDepartment = '일반상담팀'; alternativeDepartments = ['민원전담팀'];
    summaryForAgent = '기타 상품 상세 정보 문의, 주문 상태 단순 확인 등 일반적인 이커머스 질의 사항입니다.';
    recommendedFAQ = ['주문번호를 모르는 고객의 문의는 어떻게 시작하나요?', '현금영수증이나 거래명세서 발급 문의는 어떻게 안내하나요?'];
    responseGuide = '고객의 일반 문의사항에 성실히 답변하고, 특이사항이 없는 경우 친절하게 상담을 마칩니다.';
    crmCategoryCode = 'ECO-GEN-101';
    nextActions = ['문의 사항에 적합한 표준 매뉴얼 안내', '상세 조건 유효 확인 및 종결', '필요 시 해당 카테고리 팀으로 메모 전달'];
    explanation = '특수 이관이 요구되는 키워드가 미탐지되어 기본 일반상담팀으로 라우팅을 조치합니다.';
  }

  return {
    originalText: text, normalizedText,
    mainIntent, subIntent, detectedKeywords,
    urgencyLevel, urgencyScore, confidenceScore,
    recommendedDepartment, alternativeDepartments,
    summaryForAgent, recommendedFAQ, responseGuide,
    crmCategoryCode, nextActions, explanation,
    analysisSource: 'Mock Rule Engine',
  };
}
