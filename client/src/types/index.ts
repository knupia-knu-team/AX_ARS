// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — 핵심 타입 정의
// AI 기반 음성 이해형 지능형 고객센터 AX 플랫폼
// ═══════════════════════════════════════════════════════════

// ── 민원 유형 카테고리 ──
export type ComplaintCategory =
  | 'payment_error'       // 결제 오류
  | 'refund_request'      // 환불 요청
  | 'exchange_request'    // 교환 요청
  | 'delivery_issue'      // 배송 문제
  | 'product_defect'      // 제품 불량
  | 'account_issue'       // 계정 문제
  | 'service_complaint'   // 서비스 불만
  | 'inquiry_general'     // 일반 문의
  | 'technical_support'   // 기술 지원
  | 'visit_reservation'   // 방문 예약
  | 'emergency'           // 긴급/사고
  | 'repeated_complaint'; // 반복 민원

// ── 긴급도 ──
export type UrgencyLevel = 'Low' | 'Medium' | 'High';

// ── 부서 ──
export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: ComplaintCategory[];
  avgWaitTime: number;       // 평균 대기 시간 (초)
  avgHandleTime: number;     // 평균 처리 시간 (분)
  operatingHours: string;
}

// ── 고객 문의 ──
export interface CustomerInquiry {
  id: string;
  rawText: string;
  timestamp: Date;
  source: 'voice' | 'text';
}

// ── 의도 분석 결과 ──
export interface IntentResult {
  mainIntent: string;         // "결제 오류", "배송 지연" 등
  subIntent: string;          // "이중 결제", "미배송" 등
  category: ComplaintCategory;
  detectedKeywords: string[];
  confidence: number;         // 0 ~ 100
}

// ── 긴급도 분석 결과 ──
export interface UrgencyResult {
  level: UrgencyLevel;
  score: number;              // 0 ~ 100
  reasons: string[];          // 긴급도 판정 사유
}

// ── 부서 추천 결과 ──
export interface DepartmentRecommendation {
  primary: Department;
  alternatives: Department[];
  confidence: number;         // 0 ~ 100
  reason: string;
}

// ── FAQ ──
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: ComplaintCategory;
  keywords: string[];
}

// ── 응대 가이드 ──
export interface ResponseGuideStep {
  step: number;
  title: string;
  script: string;
  notes?: string;
}

export interface ResponseGuide {
  id: string;
  category: ComplaintCategory;
  title: string;
  steps: ResponseGuideStep[];
  warnings?: string[];
  tips?: string[];
}

// ── 예시 문의 ──
export interface SampleInquiry {
  id: string;
  text: string;
  category: ComplaintCategory;
  expectedUrgency: UrgencyLevel;
  description: string;
  icon: string;
}

// ── 통합 AI 분석 결과 ──
export interface AnalysisResult {
  originalText: string;
  normalizedText: string;
  mainIntent: string;
  subIntent: string;
  detectedKeywords: string[];
  urgencyLevel: UrgencyLevel;
  urgencyScore: number;
  urgencyReasons: string[];
  confidenceScore: number;
  recommendedDepartment: Department;
  alternativeDepartments: Department[];
  departmentConfidence: number;
  departmentReason: string;
  summaryForAgent: string;
  recommendedFAQ: FAQ[];
  responseGuide: ResponseGuide | null;
  crmCategoryCode: string;
  nextActions: string[];
  explanation: string;
  processingTimeMs: number;
}

// ── CRM 기록 ──
export interface CRMRecord {
  consultId: string;
  date: string;
  duration: number;             // 초
  category: ComplaintCategory;
  complaintCode: string;
  summary: string;
  resolution: string;
  agentNotes: string;
  status: 'resolved' | 'escalated' | 'pending';
  analysisResult: AnalysisResult;
}

// ── 앱 전역 상태 ──
export interface AppState {
  currentInquiry: CustomerInquiry | null;
  analysisResult: AnalysisResult | null;
  crmRecord: CRMRecord | null;
  consultStartTime: number | null;
  isAnalyzing: boolean;
  analysisStep: number;
}

// ── 의도 분석 규칙 (엔진 내부용) ──
export interface IntentRule {
  category: ComplaintCategory;
  mainIntent: string;
  subIntents: { keywords: string[]; label: string }[];
  keywords: string[];
  weight: number;
}

// ── 긴급도 규칙 (엔진 내부용) ──
export interface UrgencyRule {
  keywords: string[];
  scoreBoost: number;
  reason: string;
}
