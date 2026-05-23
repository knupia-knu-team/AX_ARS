// ═══════════════════════════════════════════════════════════
// Call Mate AX — Vertex AI Gemini Integration Service
// ═══════════════════════════════════════════════════════════

import { GoogleGenAI } from '@google/genai';
import type { APIAnalysisResult } from '../types/shared.js';

// 환경 변수 설정 로드
const useGemini = process.env.USE_GEMINI === 'true';
const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

let aiClient: GoogleGenAI | null = null;

if (useGemini) {
  try {
    if (!project) {
      console.warn('⚠️ GOOGLE_CLOUD_PROJECT 환경 변수가 누락되었습니다. Vertex AI 연동이 실패할 수 있습니다.');
    }
    // unified Google Gen AI SDK를 Vertex AI 모드로 설정
    aiClient = new GoogleGenAI({
      vertexai: true,
      project: project,
      location: location
    });
    console.log(`❇️ Google Gen AI Client initialized for Vertex AI: Project=${project}, Location=${location}, Model=${model}`);
  } catch (err) {
    console.error('⚠️ Google Gen AI 클라이언트 초기화 중 오류 발생:', err);
  }
}

const SYSTEM_INSTRUCTION = `당신은 대한민국 대표 이커머스 쇼핑몰(쿠팡형 대형 이커머스 서비스) 고객센터 상담원을 지원하는 AI 상담 어시스턴트입니다.
상담원이 고객의 수신 전화를 받았을 때 작성된 통화 음성 텍스트(STT 결과)를 전달받아, 실시간으로 문의 유형 분류, 긴급도 판정, 추천 처리 부서, 요약 브리핑 및 대응 시나리오, 그리고 CRM 상담 일지 초안 작성을 위한 JSON 형식의 구조화된 데이터만을 응답하십시오.

분류 항목 및 작성 가이드라인:
1. mainIntent: 문의의 주요 의도. 반드시 아래 '이커머스 의도 카테고리' 중 하나로 분류하십시오:
   - 주문 확인, 결제 오류, 중복 결제, 쿠폰/할인 적용 오류, 배송 지연, 빠른배송 지연, 배송지 변경, 상품 파손, 상품 누락, 오배송, 반품 요청, 교환 요청, 환불 지연, 정기배송/구독 문의, 멤버십 혜택 문의, 판매자 문의, 반복 민원, 일반 문의
2. subIntent: 의도와 관련된 구체적 소분류 제목.
3. detectedKeywords: 문의 내용에서 핵심이 되는 명사 위주의 키워드 목록 배열.
4. urgencyLevel: "Low" | "Medium" | "High" 중 하나로 평가.
   - High (긴급): 동일 불만에 따른 3회 이상 재연락(반복 민원), 심한 언쟁/민원 제기 언급("민원 넣겠다", "소비자원", "세 번째 전화", "계속 해결 안 됨", "책임자" 언급), 빠른배송 보장 상품 당일 미도착 지연, 고가의 상품 배송 누락 등 즉각적인 조치가 필요한 사안.
   - Medium (주의): 결제 청구 금액 이상, 단순 오배송/상품 파손/누락, 일반 배송 지연, 환불 입금 지연 등.
   - Low (일반): 단순 배송지 주소 변경, 쿠폰 유효기간 조회, 멤버십 혜택 문의, 일반 정보 질문.
5. urgencyScore: 0~100 사이의 정수 점수.
6. confidenceScore: 0~100 사이의 분석 신뢰도.
7. recommendedDepartment: 다음 9개 이커머스 전문 부서 중 가장 알맞은 부서로 추천:
   - 주문/결제팀 (주문 변경, 결제 수단, 청구 오류 등)
   - 배송지원팀 (배송 위치 조회, 배송 지연, 주소지 변경 등)
   - 반품/교환팀 (반품 신청, 교환 신청, 회수 기사 지연 등)
   - 환불정산팀 (결제 취소 지연, 환불 입금 확인 등)
   - 상품품질팀 (상품 하자, 파손, 유통기한 불량 등)
   - 쿠폰/멤버십팀 (할인 쿠폰 오류, 멤버십 혜택, 정기결제 해지 등)
   - 판매자지원팀 (입점 파트너 판매자 답변 지연, 오픈마켓 소통 불량 등)
   - 민원전담팀 (반복 컴플레인, 상급자 연결 요망 등)
   - 일반상담팀 (그 외 포괄 범위에 해당하지 않는 단순 문의)
8. alternativeDepartments: 1순위 추천 외의 2순위 대안 부서 목록 배열.
9. summaryForAgent: 상담사가 수신 전화를 끊지 않고도 파악할 수 있도록 1~2문장으로 요약한 통화 내용 브리핑.
10. recommendedFAQ: 관련도가 높은 이커머스 자주 묻는 질문(FAQ)의 예상 질문 목록 배열 (최대 3개). 다음 질문 목록 중에서만 선택해 주십시오:
    - '오늘 도착 예정 상품이 아직 도착하지 않았을 때 어떻게 안내하나요?'
    - '빠른배송 상품이 약속 시간 내 도착하지 않았을 때 보상 안내는 어떻게 하나요?'
    - '주문 후 배송지를 잘못 입력한 경우 변경이 가능한가요?'
    - '파손 상품 교환 시 귀책 증빙용 사진은 어떻게 제출하나요?'
    - '상품 박스만 훼손되고 내용물은 정상인 경우도 교환이 가능한가요?'
    - '일부 상품 누락 시 추가 발송 처리는 어떻게 되나요?'
    - '묶음배송 상품 중 하나만 도착하지 않은 경우 어떻게 처리하나요?'
    - '주문하지 않은 다른 물건이 왔을 때 조치 방법은 무엇인가요?'
    - '반품 접수 후 회수 기사가 오지 않았을 때 어떻게 처리하나요?'
    - '반품비는 언제 발생하나요?'
    - '상품 교환은 어떤 절차로 진행되나요?'
    - '환불 완료라고 표시되는데 카드 취소가 아직 안 된 경우 어떻게 안내하나요?'
    - '반품 상품 회수 후 환불이 지연되는 경우 어떻게 처리하나요?'
    - '카드가 두 번 결제된 것처럼 보일 때 어떻게 확인하나요?'
    - '결제는 됐는데 주문이 생성되지 않은 경우 어떻게 처리하나요?'
    - '쿠폰이 적용되지 않아 결제 금액이 다르게 나온 경우 어떻게 안내하나요?'
    - '정기배송을 해지했는데 또 결제된 경우 어떻게 처리하나요?'
    - '멤버십 혜택이 적용되지 않았을 때 어떻게 확인하나요?'
    - '판매자가 계속 답변하지 않을 때 어떻게 처리하나요?'
    - '같은 문제로 반복 전화한 고객은 어떻게 응대해야 하나요?'
    - '고객이 책임자 연결을 요청할 때 어떻게 대응하나요?'
    - '주문번호를 모르는 고객의 문의는 어떻게 시작하나요?'
    - '현금영수증이나 거래명세서 발급 문의는 어떻게 안내하나요?'
11. responseGuide: 상담사를 위한 실시간 추천 멘트 및 초기 대응 스크립트 가이드라인 (한 문장).
12. crmCategoryCode: 세 자리 영문 및 숫자 조합의 CRM 민원 분류 코드 (예: PAY-ERR-601).
13. nextActions: 상담사가 통화 도중 및 완료 후 처리해야 할 액션 항목 목록 배열 (3~4개).
14. explanation: 해당 이관 부서 및 긴급도를 판정한 AI의 근거 설명 (한국어).

중요 안전 및 범위 규칙:
- 이커머스 쇼핑몰의 상담 범위 외인 금융 사고(대출 권유 등), 의료 긴급, 도로/시설 위험(가스 누출, 맨홀 열림, 소방/재난/수도 파열 등)에 대한 실질적 대응이나 사법/의료 최종 의사결정을 내리지 마십시오.
- 만약 이커머스 쇼핑몰 서비스 범위 외의 문의인 경우, mainIntent를 "일반 문의"로 분류하고, recommendedDepartment를 "일반상담팀"으로 분류하며, explanation에 "이커머스 지원 범위를 벗어난 일반 외부 문의이므로 일반상담팀 안내 후 종결"이라고 기록하십시오.

출력 형식:
- 제공된 JSON Schema를 엄격히 준수하여 유효한 JSON 형식으로만 응답해야 하며, 마크다운(\`\`\`)이나 다른 일반 텍스트 설명을 절대로 덧붙이지 마십시오.`;

const JSON_SCHEMA = {
  type: 'object',
  properties: {
    originalText: { type: 'string', description: '고객이 입력한 원래 발화문' },
    normalizedText: { type: 'string', description: '공백 등이 정리된 정규화 발화문' },
    mainIntent: { type: 'string', description: '대분류 문의 의도' },
    subIntent: { type: 'string', description: '소분류 세부 의도' },
    detectedKeywords: { type: 'array', items: { type: 'string' }, description: '추출된 키워드 목록' },
    urgencyLevel: { type: 'string', enum: ['Low', 'Medium', 'High'], description: '긴급도 수준' },
    urgencyScore: { type: 'integer', description: '긴급도 점수 (0-100)' },
    confidenceScore: { type: 'integer', description: '분류 신뢰도 점수 (0-100)' },
    recommendedDepartment: { type: 'string', description: '추천 부서명 (9개 부서 중 필수 매칭)' },
    alternativeDepartments: { type: 'array', items: { type: 'string' }, description: '대안 부서 목록' },
    summaryForAgent: { type: 'string', description: '상담사용 요약 브리핑 문구' },
    recommendedFAQ: { type: 'array', items: { type: 'string' }, description: '추천 FAQ 예상 질문 배열 (최대 3개)' },
    responseGuide: { type: 'string', description: '상담 가이드라인 요약 (한 문장)' },
    crmCategoryCode: { type: 'string', description: 'CRM 민원 분류 코드' },
    nextActions: { type: 'array', items: { type: 'string' }, description: '상담 추천 다음 액션 목록 (3-4개)' },
    explanation: { type: 'string', description: 'AI 분류 결과에 대한 근거 설명' }
  },
  required: [
    'originalText',
    'normalizedText',
    'mainIntent',
    'subIntent',
    'detectedKeywords',
    'urgencyLevel',
    'urgencyScore',
    'confidenceScore',
    'recommendedDepartment',
    'alternativeDepartments',
    'summaryForAgent',
    'recommendedFAQ',
    'responseGuide',
    'crmCategoryCode',
    'nextActions',
    'explanation'
  ]
};

/**
 * Gemini API를 사용하여 고객 문의 텍스트를 구조적으로 분석합니다.
 * @param text 고객 발화 텍스트
 * @returns APIAnalysisResult 형식의 분석 결과
 */
export async function analyzeWithGemini(text: string): Promise<APIAnalysisResult> {
  if (!useGemini || !aiClient) {
    throw new Error('Gemini API 연동이 활성화되지 않았거나 클라이언트가 올바르게 초기화되지 않았습니다.');
  }

  try {
    const response = await aiClient.models.generateContent({
      model: model,
      contents: text,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseJsonSchema: JSON_SCHEMA,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini로부터 비어있는 응답을 받았습니다.');
    }

    const parsedData = JSON.parse(responseText);

    // 스키마 적합성 유효성 검증
    const requiredFields = [
      'originalText',
      'normalizedText',
      'mainIntent',
      'subIntent',
      'detectedKeywords',
      'urgencyLevel',
      'urgencyScore',
      'confidenceScore',
      'recommendedDepartment',
      'alternativeDepartments',
      'summaryForAgent',
      'recommendedFAQ',
      'responseGuide',
      'crmCategoryCode',
      'nextActions',
      'explanation'
    ];

    for (const field of requiredFields) {
      if (!(field in parsedData)) {
        throw new Error(`Gemini 응답 JSON에 필수 필드가 누락되었습니다: ${field}`);
      }
    }

    // 긴급도 보정
    if (!['Low', 'Medium', 'High'].includes(parsedData.urgencyLevel)) {
      parsedData.urgencyLevel = 'Low';
    }

    return {
      originalText: parsedData.originalText || text,
      normalizedText: parsedData.normalizedText || text,
      mainIntent: parsedData.mainIntent,
      subIntent: parsedData.subIntent,
      detectedKeywords: Array.isArray(parsedData.detectedKeywords) ? parsedData.detectedKeywords : [],
      urgencyLevel: parsedData.urgencyLevel,
      urgencyScore: typeof parsedData.urgencyScore === 'number' ? parsedData.urgencyScore : 50,
      confidenceScore: typeof parsedData.confidenceScore === 'number' ? parsedData.confidenceScore : 90,
      recommendedDepartment: parsedData.recommendedDepartment,
      alternativeDepartments: Array.isArray(parsedData.alternativeDepartments) ? parsedData.alternativeDepartments : [],
      summaryForAgent: parsedData.summaryForAgent,
      recommendedFAQ: Array.isArray(parsedData.recommendedFAQ) ? parsedData.recommendedFAQ : [],
      responseGuide: parsedData.responseGuide,
      crmCategoryCode: parsedData.crmCategoryCode,
      nextActions: Array.isArray(parsedData.nextActions) ? parsedData.nextActions : [],
      explanation: parsedData.explanation,
      analysisSource: 'Gemini'
    };

  } catch (err: any) {
    throw new Error(`Gemini API 처리 실패: ${err.message || err}`);
  }
}
