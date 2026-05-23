import { useState, useEffect, useRef } from 'react';
import type { APIAnalysisResult } from './types/shared';
import { ECOMMERCE_FAQ_DATABASE } from './data/faqData';

// 10가지 실시간 ARS 대기 콜 정의
interface MockScenario {
  id: string;
  customer: string;
  order: string;
  title: string;
  text: string;
  urgency: 'Low' | 'Medium' | 'High';
  waitTime: string;
}

const ARS_QUEUE: MockScenario[] = [
  {
    id: 'CALL-2026-0523-001',
    customer: 'CUST-1024',
    order: 'ORD-2026-0523-9011',
    title: '배송 지연',
    text: '아니 어제 오전 중에 주문한 생수 세 묶음이 오늘 아침 일찍 도착 예정이라고 톡이 왔었거든요? 그런데 지금 벌써 오후 3시가 넘었는데 감감무소식이라서요. 오늘 저녁에 손님들이 오시기로 해서 물이 급하게 필요한데 택배 어디쯤 와 있는지 확인 좀 빨리 해주세요.',
    urgency: 'Medium',
    waitTime: '01:24'
  },
  {
    id: 'CALL-2026-0523-002',
    customer: 'CUST-3958',
    order: 'ORD-2026-0523-4412',
    title: '상품 파손 교환',
    text: '배송 받아서 방금 박스를 개봉해봤는데, 안쪽 도자기 접시 세트 포장에 에어캡이 제대로 안 싸여 있더라고. 모서리 부분이 아예 깨지고 금이 가 있어서 이대로는 도저히 쓸 수가 없겠네요. 바로 반품 수거해가시고 재고 있으면 새 제품으로 빠르게 다시 보내주시면 좋겠습니다.',
    urgency: 'Medium',
    waitTime: '02:05'
  },
  {
    id: 'CALL-2026-0523-003',
    customer: 'CUST-8831',
    order: 'ORD-2026-0523-5593',
    title: '반품 회수 지연',
    text: '지난주 목요일에 반품 접수를 다 끝마쳤는데 회수 기사가 아직까지 안 오고 뭐 하는 건지 모르겠네요. 현관 문 앞에다 박스 내놓은 지 벌써 나흘째인데 분실이라도 되면 그쪽에서 책임질 겁니까? 오늘 중으로는 무조건 수거 기사 방문하게 예약 다시 잡아주세요.',
    urgency: 'Medium',
    waitTime: '00:45'
  },
  {
    id: 'CALL-2026-0523-004',
    customer: 'CUST-2048',
    order: 'ORD-2026-0523-1842',
    title: '카드 환불 지연',
    text: '마이페이지 들어가 보니까 분명 삼일 전에 승인 취소 완료라고 떠 있거든요? 근데 아직 제 카드 연결 계좌에는 환불 금액이 안 들어와서요. 혹시 취소 신청이 누락되었거나 승인 전표 매입에 문제가 생긴 건지 불안해서 전화했으니까 정확하게 체크해주세요.',
    urgency: 'Low',
    waitTime: '03:10'
  },
  {
    id: 'CALL-2026-0523-005',
    customer: 'CUST-7749',
    order: 'ORD-2026-0523-6623',
    title: '쿠폰 미적용 청구',
    text: '결제하기 전에 분명히 첫 구매 10% 웰컴 할인 쿠폰을 적용해서 할인된 금액을 보고 카드 결제 버튼을 눌렀거든요. 그런데 결제 완료 후에 날아온 문자에는 할인받기 전 원래 판매가 그대로 청구가 되었더라고요. 적용에 오류가 생긴 건지 한번 들여다봐주시고 차액 환불 가능할까요?',
    urgency: 'Low',
    waitTime: '01:15'
  },
  {
    id: 'CALL-2026-0523-006',
    customer: 'CUST-9904',
    order: 'ORD-2026-0523-0081',
    title: '구독 해지 오결제',
    text: '지난달 말일에 분명히 멤버십 정기배송이랑 정기 구독을 모바일 앱에서 직접 해지 완료 처리를 했거든요? 근데 오늘 아침에 또 4,900원이 멋대로 정기 자동 결제 승인 문자가 와서요. 이거 전형적인 시스템 버그 아닌가요? 지금 즉시 승인 취소하시고 확실히 탈퇴 처리 바랍니다.',
    urgency: 'High',
    waitTime: '04:20'
  },
  {
    id: 'CALL-2026-0523-007',
    customer: 'CUST-4112',
    order: 'ORD-2026-0523-8742',
    title: '배송 상품 누락',
    text: '택배 박스가 와서 뜯어봤더니 내가 시킨 냄비 세트 세 개 중에 큰 거 하나만 들어있고 작은 냄비 두 개가 아예 빠져 있어요. 박스 안에 빈 공간이 휑한데 같이 넣는 걸 잊으신 모양이네요. 이거 어떻게 다시 보내주시는 건지, 아니면 돈으로 돌려주시는 건지 얼른 알려줘요.',
    urgency: 'Medium',
    waitTime: '00:58'
  },
  {
    id: 'CALL-2026-0523-008',
    customer: 'CUST-3049',
    order: 'ORD-2026-0523-1250',
    title: '배송지 변경 요청',
    text: '안녕하세요, 다름이 아니라 주문서를 급하게 넣느라 직전 이사 가기 전 옛날 주소지로 배송지를 잘못 선택한 것 같아요. 송장 출력 전이면 현재 변경된 새 아파트 주소로 실시간 주소지 변경 처리가 가능한가요? 번거롭게 해드려 죄송하지만 확인 부탁드립니다.',
    urgency: 'Low',
    waitTime: '00:30'
  },
  {
    id: 'CALL-2026-0523-009',
    customer: 'CUST-5221',
    order: 'ORD-2026-0523-1090',
    title: '판매자 불통 민원',
    text: '입점 판매자 쪽에 상품 불량 때문에 교환 게시판에 글을 올린 지 삼일이 지났는데도 아무 답변이 없어요. 대표 번호로 전화를 걸어도 계속 통화 중이거나 없는 번호라고만 나오는데, Call Mate 본사 차원에서 판매자한테 연락 좀 취해주시든가 취소 조치를 해주시든가 빨리 중재해주세요.',
    urgency: 'Low',
    waitTime: '02:40'
  },
  {
    id: 'CALL-2026-0523-010',
    customer: 'CUST-9931',
    order: 'ORD-2026-0523-7182',
    title: '3차 반복 민원',
    text: '같은 배송 지연 건으로 어제오늘만 벌써 세 번째 전화하고 있는데 왜 상담사마다 매번 확인해보겠다는 말만 반복하고 해결을 안 해줍니까? 이번에도 오늘 저녁까지 연락 없고 해결 안 되면 소비자고발센터에 정식으로 민원 넣고 고발 조치 할 테니 알아서 하세요. 책임자 바꾸세요!',
    urgency: 'High',
    waitTime: '05:15'
  }
];

// CRM 일지 초안 템플릿 생성기
const generateCrmMemoText = (res: APIAnalysisResult, callId: string, customerId: string, orderId: string) => {
  return `[Call Mate AX — 이커머스 상담 요약 보고서]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 상담 번호    : ${callId}
■ 고객 ID      : ${customerId}
■ 주문 번호    : ${orderId}
■ 민원 코드    : ${res.crmCategoryCode}
■ 담당 부서    : ${res.recommendedDepartment}
■ 문의 유형    : ${res.mainIntent} > ${res.subIntent}
■ 긴급 수준    : ${res.urgencyLevel === 'High' ? '상 (우선 처리)' : res.urgencyLevel === 'Medium' ? '중 (주의)' : '하 (일반)'}
■ 분석 엔진    : ${res.analysisSource}
■ 상담 상태    : 접수 완료

■ [고객 발화 내용]
"${res.originalText}"

■ [AI 사전 요약 브리핑]
${res.summaryForAgent}

■ [추천 응대 스크립트]
${res.responseGuide}

■ [후속 조치 태스크]
${res.nextActions.map((action, idx) => `  ${idx + 1}. ${action}`).join('\n')}

■ [AI 라우팅 판정 근거]
${res.explanation}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CRM 등록 일시: ${new Date().toLocaleString('ko-KR')}]`;
};

// 모의 이력 조회
const getMockRecentHistory = (scenIndex: number) => {
  const histories = [
    [
      { date: '2026-05-18', category: '배송지 변경', dept: '배송지원팀', status: '완료' },
      { date: '2026-04-12', category: '반품 접수', dept: '반품/교환팀', status: '완료' }
    ],
    [
      { date: '2026-05-20', category: '교환 문의', dept: '반품/교환팀', status: '진행중' },
      { date: '2026-03-10', category: '결제 오류', dept: '주문/결제팀', status: '완료' }
    ],
    [
      { date: '2026-05-10', category: '반품 신청', dept: '반품/교환팀', status: '완료' }
    ],
    [
      { date: '2026-05-21', category: '환불 확인', dept: '환불정산팀', status: '대기' },
      { date: '2026-05-15', category: '오배송 접수', dept: '상품품질팀', status: '완료' }
    ],
    [
      { date: '2026-05-02', category: '멤버십 혜택', dept: '쿠폰/멤버십팀', status: '완료' }
    ],
    [
      { date: '2026-05-22', category: '정기배송 해지', dept: '쿠폰/멤버십팀', status: '완료' },
      { date: '2026-04-18', category: '중복 결제', dept: '주문/결제팀', status: '완료' },
      { date: '2026-03-05', category: '배송 지연', dept: '배송지원팀', status: '완료' }
    ],
    [
      { date: '2026-05-14', category: '상품 누락', dept: '상품품질팀', status: '완료' }
    ],
    [
      { date: '2026-05-22', category: '주문 변경', dept: '주문/결제팀', status: '완료' }
    ],
    [
      { date: '2026-05-19', category: '판매자 문의', dept: '판매자지원팀', status: '대기' }
    ],
    [
      { date: '2026-05-23', category: '환불 문의', dept: '환불정산팀', status: '진행중' },
      { date: '2026-05-22', category: '교환 문의', dept: '반품/교환팀', status: '대기' },
      { date: '2026-05-19', category: '배송 지연', dept: '배송지원팀', status: '완료' }
    ]
  ];
  return histories[scenIndex % histories.length];
};

const DEPARTMENTS = [
  '주문/결제팀',
  '배송지원팀',
  '반품/교환팀',
  '환불정산팀',
  '상품품질팀',
  '쿠폰/멤버십팀',
  '판매자지원팀',
  '민원전담팀',
  '일반상담팀'
];

function App() {
  // CTI 상태 및 대기열
  const [activeScenIdx, setActiveScenIdx] = useState<number>(0);
  const [phoneStatus, setPhoneStatus] = useState<'상담 대기' | '연결 준비' | '상담 중'>('상담 대기');
  const [callDuration, setCallDuration] = useState(0);
  const [queueStatuses, setQueueStatuses] = useState<string[]>(
    ARS_QUEUE.map((_, idx) => idx === 0 ? '연결됨' : '대기')
  );

  // 분석 결과 데이터 상태
  const [result, setResult] = useState<APIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRM 기록 데이터 상태
  const [crmMemo, setCrmMemo] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSavedAndEnded, setIsSavedAndEnded] = useState(false);
  const [isMemoSaved, setIsMemoSaved] = useState(false);
  
  // 각 고객(인덱스)별 저장된 메모 상태 관리
  const savedMemosRef = useRef<Record<number, string>>({});

  // 각 고객별 상세 상태 캐시 (이탈 후 복원용)
  const savedResultsRef = useRef<Record<number, APIAnalysisResult | null>>({});
  const savedEndedRef = useRef<Record<number, boolean>>({});
  const savedCompletedStepsRef = useRef<Record<number, Record<number, boolean>>>({});
  const savedTransferredRef = useRef<Record<number, boolean>>({});
  const savedTransferDeptRef = useRef<Record<number, string>>({});
  const savedDurationsRef = useRef<Record<number, number>>({});
  const savedPhoneStatusesRef = useRef<Record<number, '상담 대기' | '연결 준비' | '상담 중'>>({});
  
  // FAQ 아코디언 토글 상태 관리
  const [openFaqIdxs, setOpenFaqIdxs] = useState<Record<number, boolean>>({});

  // 상담 이전 부서 및 이전 실행 완료 여부 상태
  const [transferDept, setTransferDept] = useState<string>('일반상담팀');
  const [isTransferred, setIsTransferred] = useState<boolean>(false);
  
  // 체크리스트
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // 실시간 시각 표시 상태
  const [currentTime, setCurrentTime] = useState(new Date());

  // 타이머
  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // 통화 타이머
  useEffect(() => {
    let timer: number;
    if (phoneStatus === '상담 중') {
      timer = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phoneStatus]);

  // 대기열 콜 로딩 시뮬레이션
  const connectCall = async (index: number) => {
    // 1. 현재 고객의 상태를 캐시에 저장 (이미 불러온 결과가 있는 경우에만)
    if (activeScenIdx !== undefined && activeScenIdx !== null && result !== null) {
      savedResultsRef.current[activeScenIdx] = result;
      savedEndedRef.current[activeScenIdx] = isSavedAndEnded;
      savedCompletedStepsRef.current[activeScenIdx] = completedSteps;
      savedTransferredRef.current[activeScenIdx] = isTransferred;
      savedTransferDeptRef.current[activeScenIdx] = transferDept;
      savedDurationsRef.current[activeScenIdx] = callDuration;
      savedPhoneStatusesRef.current[activeScenIdx] = phoneStatus;
      savedMemosRef.current[activeScenIdx] = crmMemo;
    }

    setActiveScenIdx(index);
    setCopied(false);
    setOpenFaqIdxs({});

    // 2. 대상 고객의 캐시된 상태가 있는지 확인
    const cachedResult = savedResultsRef.current[index];
    if (cachedResult !== undefined && cachedResult !== null) {
      setResult(cachedResult);
      setIsSavedAndEnded(savedEndedRef.current[index] || false);
      setCompletedSteps(savedCompletedStepsRef.current[index] || {});
      setIsTransferred(savedTransferredRef.current[index] || false);
      setTransferDept(savedTransferDeptRef.current[index] || '일반상담팀');
      setCallDuration(savedDurationsRef.current[index] || 0);
      setPhoneStatus(savedPhoneStatusesRef.current[index] || '상담 대기');
      setCrmMemo(savedMemosRef.current[index] || '');
      setIsAnalyzing(false);
      setError(null);
      return;
    }

    // 캐시가 없는 최초 진입인 경우에만 새로 고침/로딩 진행
    setPhoneStatus('연결 준비');
    setCallDuration(0);
    setResult(null);
    setCompletedSteps({});
    setIsSavedAndEnded(false);
    setError(null);
    setIsAnalyzing(true);
    setIsTransferred(false);
    setTransferDept('일반상담팀');

    const savedMemo = savedMemosRef.current[index];
    if (savedMemo !== undefined) {
      setCrmMemo(savedMemo);
    } else {
      setCrmMemo('');
    }

    const selected = ARS_QUEUE[index];

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selected.text,
          domain: 'ecommerce',
          context: {
            channel: 'phone_call_simulation',
            orderId: selected.order,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류 (Status: ${response.status})`);
      }

      const data: APIAnalysisResult = await response.json();
      setResult(data);
      
      // 추천 부서 자동 매핑
      if (data.recommendedDepartment) {
        const dept = data.recommendedDepartment;
        if (DEPARTMENTS.includes(dept)) {
          setTransferDept(dept);
        } else if (DEPARTMENTS.includes(dept + '팀')) {
          setTransferDept(dept + '팀');
        }
      }
      
      if (savedMemosRef.current[index] === undefined) {
        setCrmMemo(generateCrmMemoText(data, selected.id, selected.customer, selected.order));
      }
      
      setPhoneStatus('상담 중');
    } catch (err: any) {
      console.error('분석 요청 에러:', err);
      setError(err.message || '서버 API 요청 중 오류가 발생했습니다.');
      setPhoneStatus('상담 대기');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 마운트 시 첫 번째 대기 전화 자동 연결 시도
  useEffect(() => {
    connectCall(0);
  }, []);

  const handleStepToggle = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyMemo = () => {
    if (!crmMemo) return;
    navigator.clipboard.writeText(crmMemo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCompleteConsultation = () => {
    setIsSavedAndEnded(true);
    setPhoneStatus('상담 대기');
    setQueueStatuses(prev => {
      const copy = [...prev];
      copy[activeScenIdx] = isTransferred ? '이전' : '완료';
      return copy;
    });
  };

  const handleSaveMemo = () => {
    savedMemosRef.current[activeScenIdx] = crmMemo;
    setIsMemoSaved(true);
    setTimeout(() => setIsMemoSaved(false), 2000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdxs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleNextCall = () => {
    // "대기" 상태인 고객 중 가장 상단(인덱스가 가장 낮은)에 있는 고객 찾기
    let foundIdx = -1;
    for (let i = 0; i < ARS_QUEUE.length; i++) {
      if (queueStatuses[i] === '대기') {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== -1) {
      connectCall(foundIdx);
      setQueueStatuses(prev => {
        const copy = [...prev];
        copy[foundIdx] = '연결됨';
        return copy;
      });
    } else {
      alert('대기 중인 수신 상담이 없습니다.');
    }
  };

  // 시간 포맷 (mm:ss)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 테두리 강조 결정
  const getUrgencyBorderColor = (level?: string) => {
    if (level === 'High') return '#ef4444';
    if (level === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  const activeCall = ARS_QUEUE[activeScenIdx];
  const recentHistory = getMockRecentHistory(activeScenIdx);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      color: '#0f172a',
      fontFamily: 'Pretendard, -apple-system, system-ui, sans-serif',
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 1. 상단 헤더 (CTI 헤더) */}
      <header style={{
        padding: '8px 16px',
        background: '#ffffff',
        borderBottom: '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚙️</span>
          <span style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b', letterSpacing: '-0.02em' }}>
            Call Mate AX
          </span>
          <div style={{ width: '1px', height: '14px', background: '#cbd5e1', margin: '0 8px' }} />
          <span style={{ color: '#64748b', fontWeight: 600 }}>
            이커머스 고객센터 상담 지원 워크벤치
          </span>
        </div>

        {/* CTI 정보 및 통합 제어 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: phoneStatus === '상담 중' ? '#10b981' : phoneStatus === '연결 준비' ? '#f59e0b' : '#94a3b8',
                animation: phoneStatus === '연결 준비' ? 'pulse 1s infinite' : 'none'
              }} />
              <span style={{ fontWeight: 700, color: '#334155' }}>
                {phoneStatus} {phoneStatus === '상담 중' && `[${formatDuration(callDuration)}]`}
              </span>
            </div>
            <div style={{ width: '1px', height: '12px', background: '#cbd5e1' }} />
            <div style={{ color: '#475569', fontWeight: 500 }}>
              👤 <strong>홍길동</strong> (배송지원 2팀)
            </div>
            <div style={{ width: '1px', height: '12px', background: '#cbd5e1' }} />
            <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
              🕒 {currentTime.toLocaleString('ko-KR', { hour12: false })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleCompleteConsultation}
              disabled={phoneStatus !== '상담 중'}
              style={{
                background: isSavedAndEnded ? '#10b981' : phoneStatus !== '상담 중' ? '#cbd5e1' : '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: phoneStatus !== '상담 중' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSavedAndEnded ? '✓ 상담 저장 완료' : '💾 상담 저장 및 종료'}
            </button>
            <button
              onClick={handleNextCall}
              disabled={queueStatuses.includes('연결됨')}
              style={{
                background: queueStatuses.includes('연결됨') ? '#cbd5e1' : '#2563eb',
                color: queueStatuses.includes('연결됨') ? '#94a3b8' : '#ffffff',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: queueStatuses.includes('연결됨') ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ➕ 다음 상담 연결
            </button>
          </div>
        </div>
      </header>

      {/* 메인 뷰포트 */}
      <main style={{
        flex: 1,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto'
      }}>


        {/* 3단 레이아웃 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr 1fr',
          gap: '12px',
          alignItems: 'stretch'
        }}>
          
          {/* [좌측 영역] 상담 기본 정보 */}
          <section style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            
            {/* 1. 수신 상담 대기열 (CTI Queue) */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b', borderBottom: '2px solid #64748b', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>📞 수신 상담 대기열</span>
                <span style={{ color: '#3b82f6', fontSize: '11px' }}>총 {ARS_QUEUE.length}건</span>
              </h3>
              <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                      <th style={{ padding: '4px 6px', fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '4px 6px', fontWeight: 600 }}>유형</th>
                      <th style={{ padding: '4px 6px', fontWeight: 600, textAlign: 'center' }}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ARS_QUEUE.map((item, idx) => (
                      <tr 
                        key={item.id} 
                        onClick={() => !isAnalyzing && connectCall(idx)}
                        style={{ 
                          borderBottom: '1px solid #f1f5f9', 
                          background: activeScenIdx === idx ? '#eff6ff' : '#ffffff',
                          cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                          fontWeight: activeScenIdx === idx ? 700 : 400
                        }}
                      >
                        <td style={{ padding: '5px 6px', color: '#475569' }}>{item.customer}</td>
                        <td style={{ padding: '5px 6px', color: '#1e293b' }}>{item.title}</td>
                        <td style={{ padding: '5px 6px', textAlign: 'center' }}>
                          <span style={{ 
                            color: queueStatuses[idx] === '연결됨' ? '#3b82f6' : queueStatuses[idx] === '완료' ? '#10b981' : queueStatuses[idx] === '이전' ? '#8b5cf6' : '#94a3b8',
                            fontWeight: 700 
                          }}>
                            {queueStatuses[idx]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. 수신 상담 정보 */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b', borderBottom: '2px solid #64748b', paddingBottom: '4px' }}>
                📂 수신 상담 상세 정보
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#f8fafc', padding: '4px 6px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>상담 ID</div>
                <div style={{ padding: '4px 6px', borderBottom: '1px solid #e2e8f0', fontFamily: 'monospace' }}>{activeCall.id}</div>
                
                <div style={{ background: '#f8fafc', padding: '4px 6px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>고객 식별자</div>
                <div style={{ padding: '4px 6px', borderBottom: '1px solid #e2e8f0', fontFamily: 'monospace' }}>{activeCall.customer}</div>
                
                <div style={{ background: '#f8fafc', padding: '4px 6px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>주문 번호</div>
                <div style={{ padding: '4px 6px', borderBottom: '1px solid #e2e8f0', fontFamily: 'monospace' }}>{activeCall.order}</div>
                
                <div style={{ background: '#f8fafc', padding: '4px 6px', borderRight: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>유입 채널</div>
                <div style={{ padding: '4px 6px' }}>
                  {activeScenIdx === 4 ? '주문/결제팀' : activeScenIdx === 8 ? '판매자지원팀' : 'ARS 사전 접수'}
                </div>
              </div>
            </div>

            {/* 3. ARS 사전 문의 내용 (STT 변환 결과) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b', borderBottom: '2px solid #64748b', paddingBottom: '4px' }}>
                🎙️ ARS 사전 문의 내용
              </h3>
              <div style={{ 
                flex: 1,
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '4px', 
                padding: '8px 10px',
                fontSize: '12px',
                lineHeight: '1.5',
                color: '#0f172a',
                fontWeight: 600,
                borderLeft: '4px solid #3b82f6',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center'
              }}>
                "{activeCall.text}"
              </div>
            </div>

            {/* 4. 최근 문의 이력 */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b', borderBottom: '2px solid #64748b', paddingBottom: '4px' }}>
                🕒 최근 문의 이력 (과거 접수건)
              </h3>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '3px 6px', fontWeight: 600 }}>접수일자</th>
                      <th style={{ padding: '3px 6px', fontWeight: 600 }}>문의 유형</th>
                      <th style={{ padding: '3px 6px', fontWeight: 600 }}>담당 부서</th>
                      <th style={{ padding: '3px 6px', fontWeight: 600, textAlign: 'center' }}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentHistory.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '4px 6px', color: '#64748b' }}>{item.date}</td>
                        <td style={{ padding: '4px 6px', color: '#1e293b', fontWeight: 500 }}>{item.category}</td>
                        <td style={{ padding: '4px 6px', color: '#475569' }}>{item.dept}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                          <span style={{ 
                            color: item.status === '완료' ? '#10b981' : item.status === '진행중' ? '#3b82f6' : '#f59e0b',
                            fontWeight: 700
                          }}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>

          {/* [중앙 영역] AI 분석 결과 */}
          <section style={{
            background: '#ffffff',
            border: `1px solid ${result ? getUrgencyBorderColor(result.urgencyLevel) : '#cbd5e1'}`,
            borderRadius: '4px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: result?.urgencyLevel === 'High' ? '0 0 8px rgba(239,68,68,0.1)' : 'none'
          }}>
            
            <h3 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b', borderBottom: '2px solid #64748b', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🧠 AI 분석 결과</span>
              {result && result.analysisSource === 'Gemini' && (
                <span style={{ 
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  borderRadius: '2px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontWeight: 700
                }}>
                  Gemini Engine
                </span>
              )}
            </h3>

            {isAnalyzing ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '40px 0' }}>
                <span className="animate-spin" style={{ fontSize: '2rem' }}>⚙️</span>
                <span style={{ fontWeight: 700, color: '#475569' }}>ARS 분석 결과 로딩 중...</span>
                <span style={{ color: '#94a3b8', fontSize: '11px' }}>Gemini가 고객의 음성을 해독하여 요약 정보를 매핑하는 중입니다.</span>
              </div>
            ) : error ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px', color: '#ef4444', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>⚠️</span>
                <span style={{ fontWeight: 700 }}>분석 연동 에러</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{error}</span>
                <button onClick={() => connectCall(activeScenIdx)} style={{ marginTop: '10px', background: '#3b82f6', color: '#ffffff', padding: '4px 10px', borderRadius: '3px', fontWeight: 600 }}>다시 시도</button>
              </div>
            ) : !result ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', padding: '40px 0' }}>
                분석 데이터가 존재하지 않습니다.
              </div>
            ) : (
              <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                
                {/* 분류 테이블 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  
                  {/* 문의 유형 */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '4px 6px', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>문의 유형</div>
                    <div style={{ padding: '6px', fontWeight: 700, color: '#1e293b', fontSize: '12.5px' }}>{result.mainIntent}</div>
                  </div>

                  {/* 세부 유형 */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '4px 6px', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>세부 유형</div>
                    <div style={{ padding: '6px', fontWeight: 700, color: '#334155', fontSize: '11.5px' }}>{result.subIntent}</div>
                  </div>

                  {/* 고객 상태 분석 */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '4px 6px', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>고객 상태 분석</div>
                    <div style={{ padding: '6px', fontWeight: 700, color: result.urgencyLevel === 'High' ? '#ef4444' : result.urgencyLevel === 'Medium' ? '#f59e0b' : '#10b981' }}>
                      {result.urgencyLevel === 'High' ? '🔴 강한 불만' : result.urgencyLevel === 'Medium' ? '🟡 불만 징후' : '🟢 일반'}
                    </div>
                  </div>

                  {/* 민원 강도 */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '4px 6px', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>민원 강도</div>
                    <div style={{ padding: '6px', fontWeight: 700, color: result.urgencyLevel === 'High' ? '#ef4444' : result.urgencyLevel === 'Medium' ? '#f59e0b' : '#10b981' }}>
                      {result.urgencyLevel === 'High' ? '높음' : result.urgencyLevel === 'Medium' ? '보통' : '낮음'} ({result.urgencyScore}점)
                    </div>
                  </div>

                  {/* 응대 난이도 */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '4px 6px', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>응대 난이도</div>
                    <div style={{ padding: '6px', fontWeight: 700, color: result.urgencyLevel === 'High' ? '#ef4444' : result.urgencyLevel === 'Medium' ? '#f59e0b' : '#10b981' }}>
                      {result.urgencyLevel === 'High' ? '높음' : result.urgencyLevel === 'Medium' ? '보통' : '낮음'}
                    </div>
                  </div>

                  {/* 에스컬레이션 가능성 */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '4px 6px', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>에스컬레이션 가능성</div>
                    <div style={{ padding: '6px', fontWeight: 700, color: result.urgencyLevel === 'High' ? '#ef4444' : result.urgencyLevel === 'Medium' ? '#f59e0b' : '#10b981' }}>
                      {result.urgencyLevel === 'High' ? '높음' : result.urgencyLevel === 'Medium' ? '보통' : '낮음'}
                    </div>
                  </div>

                </div>

                {/* 핵심 키워드 */}
                <div>
                  <span style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>감출 핵심 키워드:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {result.detectedKeywords.map((kw, idx) => (
                      <span key={idx} style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '2px',
                        padding: '1px 6px',
                        fontSize: '11px',
                        color: '#334155',
                        fontWeight: 500
                      }}>
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI 요약 */}
                <div style={{ borderLeft: '3px solid #6366f1', background: '#f5f3ff', padding: '8px 10px', borderRadius: '0 4px 4px 0' }}>
                  <span style={{ display: 'block', fontWeight: 700, color: '#4f46e5', fontSize: '11px', marginBottom: '2px' }}>AI 사전 브리핑 요약:</span>
                  <p style={{ margin: 0, fontSize: '11.5px', lineHeight: 1.45, fontWeight: 500, color: '#1e293b' }}>
                    {result.summaryForAgent}
                  </p>
                </div>

                {/* 우선 확인 필요 항목 */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px', background: '#fcfcfc', flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 700, color: '#475569', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
                    ⚠️ 우선 확인 필요 항목 (고객 이력 매핑)
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                      <span style={{ color: '#3b82f6' }}>•</span>
                      <span>주문 상태 검증: <strong>출고 상태 및 송장 유효성 재확인 필요</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                      <span style={{ color: '#3b82f6' }}>•</span>
                      <span>고객 세그먼트: <strong>우수 멤버십 회원 여부 필히 식별 요망</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                      <span style={{ color: '#3b82f6' }}>•</span>
                      <span>시스템 사유: <strong>{result.explanation.split('.')[0]}.</strong></span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </section>

          {/* [우측 영역] 상담사 지원 */}
          <section style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            
            <h3 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b', borderBottom: '2px solid #64748b', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📢 추천 응대 가이드</span>
              {result && result.urgencyLevel === 'High' && (
                <span style={{
                  color: '#ef4444',
                  fontWeight: 700,
                  fontSize: '11px'
                }}>
                  🚨 상급자 대리검토 대기
                </span>
              )}
            </h3>

            {!result ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', padding: '40px 0' }}>
                분석 데이터 로드 전입니다.
              </div>
            ) : (
              <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                
                {/* 추천 응대 멘트 */}
                <div>
                  <span style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>추천 오프닝/응대 멘트</span>
                  <div style={{
                    padding: '8px 10px',
                    background: '#f0fdfa',
                    borderLeft: '4px solid #0d9488',
                    borderRadius: '0 4px 4px 0',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0f172a',
                    lineHeight: 1.45
                  }}>
                    "{result.responseGuide}"
                  </div>
                </div>

                {/* 추천 응대 가이드 (체크리스트) */}
                <div>
                  <span style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '6px', fontSize: '11.5px' }}>
                    통화 진행 및 후속 처리 가이드라인 (체크리스트):
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {result.nextActions.map((action, idx) => (
                      <label 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 8px',
                          background: completedSteps[idx] ? '#f0fdf4' : '#f8fafc',
                          border: `1px solid ${completedSteps[idx] ? '#bbf7d0' : '#e2e8f0'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11.5px',
                          fontWeight: 500,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <input 
                          type="checkbox"
                          checked={!!completedSteps[idx]}
                          onChange={() => handleStepToggle(idx)}
                          style={{ margin: 0, accentColor: '#10b981' }}
                        />
                        <span style={{
                          textDecoration: completedSteps[idx] ? 'line-through' : 'none',
                          color: completedSteps[idx] ? '#94a3b8' : '#334155'
                        }}>
                          {action}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 관련 FAQ / 정책 정보 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>지식베이스 FAQ 및 정책 정보:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
                    {result.recommendedFAQ.map((faq, idx) => {
                      const matchedFaq = ECOMMERCE_FAQ_DATABASE.find(item => {
                        if (item.question === faq || item.question.includes(faq) || faq.includes(item.question)) {
                          return true;
                        }
                        const faqWords = faq.replace(/[?.,!]/g, '').split(/\s+/).filter(w => w.length > 1);
                        if (faqWords.length === 0) return false;
                        const matchCount = faqWords.filter(w => item.question.includes(w)).length;
                        return (matchCount / faqWords.length) >= 0.4 || matchCount >= 2;
                      });
                      const isOpen = !!openFaqIdxs[idx];
                      
                      return (
                        <div key={idx} style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          fontSize: '11px',
                          lineHeight: 1.4,
                          background: '#ffffff'
                        }}>
                          {/* 질문 헤더 */}
                          <div 
                            onClick={() => toggleFaq(idx)}
                            style={{
                              padding: '6px 8px',
                              background: isOpen ? '#f8fafc' : '#ffffff',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              fontWeight: 600,
                              color: '#334155',
                              borderBottom: isOpen ? '1px solid #e2e8f0' : 'none',
                              transition: 'background 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', flex: 1 }}>
                              <span style={{ color: '#2563eb', fontWeight: 700, marginRight: '4px' }}>Q.</span>
                              <span style={{ color: isOpen ? '#1e293b' : '#475569' }}>{faq}</span>
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '9px', marginLeft: '6px' }}>
                              {isOpen ? '▼' : '▶'}
                            </span>
                          </div>
                          
                          {/* 답변 바디 */}
                          {isOpen && (
                            <div style={{
                              padding: '8px 10px',
                              background: '#fafafa',
                              fontSize: '11px',
                              color: '#334155',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              borderTop: '1px solid #f1f5f9'
                            }}>
                              {matchedFaq ? (
                                <>
                                  <div>
                                    <strong style={{ color: '#0d9488' }}>A. </strong>
                                    <span>{matchedFaq.answer}</span>
                                  </div>
                                  {matchedFaq.policySummary && (
                                    <div style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '4px 6px', borderRadius: '3px' }}>
                                      <strong>정책 요약:</strong> {matchedFaq.policySummary}
                                    </div>
                                  )}
                                  {matchedFaq.agentScript && (
                                    <div style={{ fontSize: '10px', color: '#0369a1', background: '#e0f2fe', padding: '4px 6px', borderRadius: '3px' }}>
                                      <strong>추천 멘트:</strong> "{matchedFaq.agentScript}"
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                  답변 정보가 매칭되지 않았습니다. (데이터 준비 중)
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 상담 이전 */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <span style={{ display: 'block', fontWeight: 700, color: '#475569', fontSize: '11px' }}>
                    상담 이전
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={transferDept}
                      onChange={(e) => setTransferDept(e.target.value)}
                      disabled={isSavedAndEnded}
                      style={{
                        flex: 1,
                        padding: '4px 6px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '3px',
                        fontSize: '11px',
                        background: '#ffffff',
                        outline: 'none',
                        color: '#0f172a'
                      }}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsTransferred(prev => !prev)}
                      disabled={isSavedAndEnded}
                      style={{
                        background: isTransferred ? '#10b981' : '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: isSavedAndEnded ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isTransferred ? '✓ 이전 완료' : '해당 부서로 이전'}
                    </button>
                  </div>
                </div>

              </div>
            )}

          </section>

        </div>

        {/* [하단 영역] CRM 자동 기록 */}
        <section style={{
          background: '#ffffff',
          border: isSavedAndEnded ? '2px solid #10b981' : '1px solid #cbd5e1',
          borderRadius: '4px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          
          <h3 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 4px 0', color: '#1e293b', borderBottom: '2px solid #64748b', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📑 상담 이력 메모장</span>
            {isSavedAndEnded && (
              <span style={{ color: '#10b981', fontWeight: 700 }}>✓ 상담 이력 업로드 및 CRM 시스템 등록 완료</span>
            )}
          </h3>

          {!result ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
              상담 진행 시 CRM 요약 보고서 정보가 표출됩니다.
            </div>
          ) : (
            <div className="animate-fadeIn" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '16px' }}>
              
              {/* CRM 메타데이터 그리드 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontWeight: 700, color: '#475569', fontSize: '11px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>
                  시스템 전송 정보 매핑 (CRM Metadata)
                </span>
                
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '4px', fontSize: '11.5px' }}>
                  <div style={{ background: '#f8fafc', padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>민원 분류 코드</div>
                  <div style={{ padding: '3px 6px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}>{result.crmCategoryCode}</div>

                  <div style={{ background: '#f8fafc', padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>대/세분류 유형</div>
                  <div style={{ padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{result.mainIntent} &gt; {result.subIntent}</div>

                  <div style={{ background: '#f8fafc', padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>주문 번호 매핑</div>
                  <div style={{ padding: '3px 6px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}>{activeCall.order}</div>

                  <div style={{ background: '#f8fafc', padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>최종 추천 부서</div>
                  <div style={{ padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 700, color: '#2563eb' }}>{result.recommendedDepartment}</div>

                  <div style={{ background: '#f8fafc', padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>처리 결과 초안</div>
                  <div style={{ padding: '3px 6px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.responseGuide}</div>

                  <div style={{ background: '#f8fafc', padding: '3px 6px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>후속 조치 사항</div>
                  <div style={{ padding: '3px 6px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.nextActions.join(', ')}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px', marginTop: 'auto', fontSize: '11px', lineHeight: 1.45, color: '#64748b' }}>
                  💡 <strong>작성 가이드:</strong> AI가 작성한 초안 텍스트 필드는 시스템에 직접 업로드 가능한 형태입니다. 내용을 검토한 후 필요에 따라 메모장에 직접 상세 내역을 수동으로 보강할 수 있습니다.
                </div>
              </div>

              {/* CRM 메모장 에디터 영역 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: '#475569', fontSize: '11px' }}>
                  상담 이력 메모장
                </span>
                
                <textarea
                  value={crmMemo}
                  onChange={(e) => setCrmMemo(e.target.value)}
                  style={{
                    width: '100%',
                    height: '140px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    lineHeight: '1.5',
                    outline: 'none',
                    resize: 'none',
                    color: '#0f172a',
                    background: isSavedAndEnded ? '#f8fafc' : '#ffffff'
                  }}
                  disabled={isSavedAndEnded}
                />

                {/* 제어 버튼 그룹 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  {/* 좌측 액션 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={handleCopyMemo}
                      disabled={isSavedAndEnded}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '3px',
                        padding: '4px 10px',
                        cursor: isSavedAndEnded ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        color: copied ? '#10b981' : '#334155'
                      }}
                    >
                      {copied ? '✅ 클립보드 복사 완료' : '📋 전체 클립보드 복사'}
                    </button>
                  </div>

                  {/* 우측 액션 */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {isMemoSaved && (
                      <span style={{ color: '#10b981', fontWeight: 600, fontSize: '11px', marginRight: '6px' }}>
                        ✓ 변경 사항 저장됨
                      </span>
                    )}
                    <button 
                      onClick={handleSaveMemo}
                      disabled={isSavedAndEnded}
                      style={{
                        background: isSavedAndEnded ? '#cbd5e1' : '#10b981',
                        color: isSavedAndEnded ? '#94a3b8' : '#ffffff',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '5px 16px',
                        cursor: isSavedAndEnded ? 'not-allowed' : 'pointer',
                        fontWeight: 700
                      }}
                    >
                      💾 메모 저장
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

        </section>

      </main>

      {/* 푸터 */}
      <footer style={{
        height: '24px',
        background: '#ffffff',
        borderTop: '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        color: '#64748b',
        flexShrink: 0
      }}>
        Call Mate AX Agent Workspace Console | Powered by Google Cloud Run & Vertex AI Gemini API | &copy; 2026 Call Mate AX
      </footer>

    </div>
  );
}

export default App;
