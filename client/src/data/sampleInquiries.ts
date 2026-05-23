// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 예시 문의 데이터
// AI 기반 음성 이해형 지능형 고객센터 AX 플랫폼
// ═══════════════════════════════════════════════════════════

import type { SampleInquiry } from '../types/index';

export const sampleInquiries: SampleInquiry[] = [
  {
    id: 'sample-1',
    text: '환불 신청했는데 아직 돈이 안 들어왔어요',
    category: 'refund_request',
    expectedUrgency: 'Medium',
    description: '환불 지연',
    icon: '💰',
  },
  {
    id: 'sample-2',
    text: '카드 결제가 두 번 됐는데 환불받고 싶어요',
    category: 'payment_error',
    expectedUrgency: 'Medium',
    description: '이중 결제',
    icon: '💳',
  },
  {
    id: 'sample-3',
    text: '인터넷이 계속 끊겨서 기사 방문 받고 싶어요',
    category: 'visit_reservation',
    expectedUrgency: 'Medium',
    description: '기사 방문 요청',
    icon: '🌐',
  },
  {
    id: 'sample-4',
    text: '택배가 파손된 상태로 도착했어요',
    category: 'delivery_issue',
    expectedUrgency: 'Medium',
    description: '배송 파손',
    icon: '📦',
  },
  {
    id: 'sample-5',
    text: '배송이 일주일째 안 오고 있어요',
    category: 'delivery_issue',
    expectedUrgency: 'Medium',
    description: '배송 지연',
    icon: '🚚',
  },
  {
    id: 'sample-6',
    text: '카드가 도용된 것 같고 지금 결제가 계속 되고 있어요',
    category: 'emergency',
    expectedUrgency: 'High',
    description: '카드 도용 긴급',
    icon: '🚨',
  },
  {
    id: 'sample-7',
    text: '도로에 맨홀이 열려 있어서 위험해요',
    category: 'emergency',
    expectedUrgency: 'High',
    description: '안전 신고',
    icon: '⚠️',
  },
  {
    id: 'sample-8',
    text: '상담을 여러 번 했는데 해결이 안 됐어요',
    category: 'repeated_complaint',
    expectedUrgency: 'High',
    description: '반복 민원',
    icon: '😤',
  },
  {
    id: 'sample-9',
    text: '계정 로그인이 안 되고 비밀번호도 재설정이 안 돼요',
    category: 'account_issue',
    expectedUrgency: 'Medium',
    description: '계정 문제',
    icon: '🔐',
  },
  {
    id: 'sample-10',
    text: '상품을 교환하고 싶은데 절차를 모르겠어요',
    category: 'exchange_request',
    expectedUrgency: 'Low',
    description: '교환 절차 문의',
    icon: '🔄',
  },
  {
    id: 'sample-11',
    text: '요금이 갑자기 올라서 이유를 알고 싶어요',
    category: 'inquiry_general',
    expectedUrgency: 'Low',
    description: '요금 문의',
    icon: '📊',
  },
  {
    id: 'sample-12',
    text: '앱이 자꾸 튕기고 결제 화면에서 멈춰요',
    category: 'technical_support',
    expectedUrgency: 'Medium',
    description: '앱 오류',
    icon: '📱',
  },
];
