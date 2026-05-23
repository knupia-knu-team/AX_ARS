// ═══════════════════════════════════════════════════════════
// VoiceRoute AX — Shared API Types (Client Copy)
// ═══════════════════════════════════════════════════════════

export type UrgencyLevel = 'Low' | 'Medium' | 'High';

export interface APIAnalysisResult {
  originalText: string;
  normalizedText: string;
  mainIntent: string;
  subIntent: string;
  detectedKeywords: string[];
  urgencyLevel: UrgencyLevel;
  urgencyScore: number;
  confidenceScore: number;
  recommendedDepartment: string;
  alternativeDepartments: string[];
  summaryForAgent: string;
  recommendedFAQ: string[];
  responseGuide: string;
  crmCategoryCode: string;
  nextActions: string[];
  explanation: string;
  analysisSource: 'Mock Rule Engine' | 'Gemini';
  processingTimeMs?: number;
}
