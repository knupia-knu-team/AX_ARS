export type FAQPriority = "Low" | "Medium" | "High";

export interface EcommerceFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  agentScript: string;
  policySummary: string;
  requiredInfo: string[];
  nextActions: string[];
  escalationRules: string[];
  department: string;
  keywords: string[];
  priority: FAQPriority;
}

export const ECOMMERCE_FAQ_DATABASE: EcommerceFAQ[] = [
  {
    id: "FAQ-DLV-001",
    category: "배송 지연",
    question: "오늘 도착 예정 상품이 아직 도착하지 않았을 때 어떻게 안내하나요?",
    answer:
      "배송 예정일 당일에는 택배사 스캔 지연 또는 지역 물량 증가로 실제 도착 시간이 늦어질 수 있습니다. 먼저 주문 상태와 배송 추적 정보를 확인한 뒤, 이동 이력이 멈춘 경우 배송지원팀 확인 요청으로 처리합니다.",
    agentScript:
      "불편을 드려 죄송합니다. 먼저 주문번호 기준으로 현재 배송 단계와 택배사 이동 이력을 확인해보겠습니다.",
    policySummary:
      "배송 예정일 당일 지연은 배송 이력 확인 후 안내하며, 일정 시간 이상 이동 이력이 없으면 배송지원팀 확인 대상으로 분류합니다.",
    requiredInfo: ["주문번호", "수령인명", "배송 예정일", "배송 조회 상태", "고객 요청 수령 희망일"],
    nextActions: ["배송조회 확인", "택배사 스캔 이력 확인", "배송지원팀 확인 요청", "고객에게 예상 처리 시간 안내"],
    escalationRules: ["동일 배송 건으로 2회 이상 문의", "고가 상품 지연", "식품/신선 상품 지연", "고객이 민원 접수 의사 표현"],
    department: "배송지원팀",
    keywords: ["배송", "도착 예정", "아직 안 왔", "배송 지연", "조회"],
    priority: "Medium",
  },
  {
    id: "FAQ-DLV-002",
    category: "빠른배송 지연",
    question: "빠른배송 상품이 약속 시간 내 도착하지 않았을 때 보상 안내는 어떻게 하나요?",
    answer:
      "빠른배송 지연 여부는 주문의 배송 약속 시간과 실제 배송 완료 시간을 기준으로 확인합니다. 지연이 확인되면 내부 보상 가능 여부를 조회하고, 보상 대상이 아닌 경우에는 지연 사유와 후속 조치를 안내합니다.",
    agentScript:
      "빠른배송으로 주문하셨는데 약속된 시간에 받지 못해 불편하셨겠습니다. 약속 시간과 현재 배송 상태를 먼저 확인하겠습니다.",
    policySummary:
      "빠른배송 지연은 약속 시간, 배송 완료 시간, 상품 유형을 기준으로 보상 가능 여부를 확인합니다.",
    requiredInfo: ["주문번호", "빠른배송 약속 시간", "실제 배송 완료 여부", "상품 유형", "배송지"],
    nextActions: ["약속 시간 확인", "배송 완료 시간 확인", "보상 가능 여부 조회", "보상 또는 재안내 처리"],
    escalationRules: ["빠른배송 반복 지연", "신선식품 지연", "고객이 보상 요구", "동일 고객 반복 불만"],
    department: "배송지원팀",
    keywords: ["빠른배송", "오늘 도착", "약속 시간", "지연", "보상"],
    priority: "High",
  },
  {
    id: "FAQ-DLV-003",
    category: "배송지 변경",
    question: "주문 후 배송지를 잘못 입력한 경우 변경이 가능한가요?",
    answer:
      "배송지 변경 가능 여부는 주문 상태에 따라 달라집니다. 상품이 아직 출고 전이면 배송지 변경이 가능할 수 있으나, 출고 완료 또는 배송 중 단계에서는 변경이 제한될 수 있습니다.",
    agentScript:
      "배송지 변경 가능 여부는 현재 출고 상태에 따라 달라집니다. 주문 상태를 확인한 뒤 가능한 처리 방법을 안내드리겠습니다.",
    policySummary:
      "출고 전에는 배송지 변경 가능성이 있으나, 출고 이후에는 변경 제한 또는 택배사 처리 기준에 따릅니다.",
    requiredInfo: ["주문번호", "현재 배송지", "변경 희망 배송지", "출고 상태"],
    nextActions: ["주문 상태 확인", "출고 전이면 배송지 변경 처리", "출고 후면 변경 제한 안내", "필요 시 반품/재주문 안내"],
    escalationRules: ["고가 상품", "주소 오류로 오배송 가능성 높음", "고객이 긴급 수령 요청"],
    department: "배송지원팀",
    keywords: ["배송지", "주소", "잘못 입력", "변경", "수정"],
    priority: "Low",
  },
  {
    id: "FAQ-DMG-001",
    category: "상품 파손",
    question: "파손 상품 교환 시 귀책 증빙용 사진은 어떻게 제출하나요?",
    answer:
      "파손 상품은 상품 상태, 외부 포장 상태, 운송장 사진을 함께 확인해야 합니다. 고객에게 파손 부위가 보이는 사진과 포장 박스 사진을 요청하고, 접수 후 상품품질팀 또는 반품/교환팀 기준에 따라 교환 가능 여부를 확인합니다.",
    agentScript:
      "상품이 파손된 상태로 도착해 불편하셨겠습니다. 정확한 처리를 위해 파손 부위와 포장 상태 사진 확인이 필요합니다.",
    policySummary:
      "파손 접수는 상품 사진, 포장 사진, 운송장 정보를 기준으로 귀책 여부와 교환 가능 여부를 판단합니다.",
    requiredInfo: ["주문번호", "파손 부위 사진", "외부 포장 사진", "운송장 사진", "수령일"],
    nextActions: ["사진 제출 안내", "상품품질팀 검토 요청", "교환 가능 여부 확인", "교환 접수 또는 환불 절차 안내"],
    escalationRules: ["고가 상품 파손", "식품/전자제품 파손", "사진 제출 불가", "고객 강한 불만"],
    department: "상품품질팀",
    keywords: ["파손", "깨짐", "찌그러짐", "사진", "증빙", "교환"],
    priority: "Medium",
  },
  {
    id: "FAQ-DMG-002",
    category: "상품 파손",
    question: "상품 박스만 훼손되고 내용물은 정상인 경우도 교환이 가능한가요?",
    answer:
      "내용물에 이상이 없고 외부 포장만 훼손된 경우에는 교환 대상이 아닐 수 있습니다. 다만 선물용 상품, 밀봉 훼손, 상품 가치 하락 가능성이 있는 경우에는 상세 확인이 필요합니다.",
    agentScript:
      "박스 훼손으로 불편하셨겠습니다. 내용물 상태와 상품 사용 가능 여부를 확인한 뒤 처리 기준을 안내드리겠습니다.",
    policySummary:
      "외부 포장 훼손만으로는 교환이 제한될 수 있으나, 상품 가치에 영향이 있으면 추가 검토합니다.",
    requiredInfo: ["주문번호", "박스 훼손 사진", "내용물 이상 여부", "선물용 여부", "개봉 여부"],
    nextActions: ["내용물 상태 확인", "포장 훼손 정도 확인", "교환 가능성 검토", "필요 시 상품품질팀 이관"],
    escalationRules: ["선물용 상품", "고가 상품", "고객이 상품 가치 하락 주장"],
    department: "상품품질팀",
    keywords: ["박스", "포장", "훼손", "내용물", "정상"],
    priority: "Low",
  },
  {
    id: "FAQ-MIS-001",
    category: "상품 누락",
    question: "일부 상품 누락 시 추가 발송 처리는 어떻게 되나요?",
    answer:
      "일부 상품 누락은 주문 구성, 출고 수량, 배송 완료 수량을 비교해 확인합니다. 누락이 확인되면 추가 발송, 환불, 또는 판매자 확인 요청 중 가능한 처리 방법을 안내합니다.",
    agentScript:
      "주문하신 상품 중 일부가 누락되어 불편하셨겠습니다. 주문 구성과 실제 수령 상품을 비교해 확인하겠습니다.",
    policySummary:
      "상품 누락은 주문 구성과 출고/배송 이력을 확인한 뒤 추가 발송 또는 환불로 처리합니다.",
    requiredInfo: ["주문번호", "누락된 상품명", "받은 상품 목록", "배송 박스 수량", "운송장 번호"],
    nextActions: ["주문 구성 확인", "출고 수량 확인", "누락 상품 확인", "추가 발송 또는 환불 접수"],
    escalationRules: ["고가 상품 누락", "반복 누락", "판매자 확인 지연", "고객 민원 예고"],
    department: "배송지원팀",
    keywords: ["누락", "일부", "빠짐", "상품이 안 왔", "추가 발송"],
    priority: "Medium",
  },
  {
    id: "FAQ-MIS-002",
    category: "상품 누락",
    question: "묶음배송 상품 중 하나만 도착하지 않은 경우 어떻게 처리하나요?",
    answer:
      "묶음배송이라도 상품별로 출고지와 운송장이 다를 수 있습니다. 먼저 각 상품의 운송장과 출고 상태를 확인하고, 실제 누락인지 분리 배송인지 구분해야 합니다.",
    agentScript:
      "묶음 주문 상품이라도 상품별로 배송 일정이 다를 수 있습니다. 각 상품의 배송 상태를 나눠서 확인해보겠습니다.",
    policySummary:
      "묶음배송 문의는 상품별 운송장과 출고 상태를 확인하여 분리 배송인지 누락인지 판단합니다.",
    requiredInfo: ["주문번호", "도착한 상품명", "미도착 상품명", "상품별 운송장", "배송 박스 수"],
    nextActions: ["상품별 배송 상태 확인", "분리 배송 여부 안내", "누락 확인 시 추가 처리 접수"],
    escalationRules: ["전체 주문 중 고가 상품 미도착", "배송 완료로 표시되나 미수령", "고객 반복 문의"],
    department: "배송지원팀",
    keywords: ["묶음배송", "하나만", "일부만", "분리 배송", "안 왔"],
    priority: "Medium",
  },
  {
    id: "FAQ-WRG-001",
    category: "오배송",
    question: "주문하지 않은 다른 물건이 왔을 때 조치 방법은 무엇인가요?",
    answer:
      "오배송이 의심되는 경우 고객이 실제 주문한 상품과 수령한 상품을 비교해야 합니다. 수령 상품명, 사진, 운송장 정보를 확인한 후 오배송으로 판단되면 회수 및 재배송 또는 환불 절차를 안내합니다.",
    agentScript:
      "주문하신 상품이 아닌 다른 상품을 받으셨다면 불편하셨겠습니다. 주문 상품과 실제 수령 상품 정보를 확인한 뒤 회수 및 재배송 절차를 안내드리겠습니다.",
    policySummary:
      "오배송은 주문 상품, 수령 상품, 운송장 정보를 비교해 확인하며, 확인 후 회수와 재배송 또는 환불로 처리합니다.",
    requiredInfo: ["주문번호", "받은 상품 사진", "운송장 사진", "실제 주문 상품명", "수령일"],
    nextActions: ["오배송 여부 확인", "회수 접수", "재배송 가능 여부 확인", "환불 또는 교환 처리 안내"],
    escalationRules: ["개인정보가 포함된 타인 상품 수령", "고가 상품 오배송", "식품/신선 상품 오배송"],
    department: "배송지원팀",
    keywords: ["오배송", "다른 물건", "다른 상품", "주문하지 않은", "잘못 왔"],
    priority: "Medium",
  },
  {
    id: "FAQ-RTN-001",
    category: "반품 접수",
    question: "반품 접수 후 회수 기사가 오지 않았을 때 어떻게 처리하나요?",
    answer:
      "반품 회수 일정은 택배사 사정에 따라 지연될 수 있습니다. 회수 접수 상태와 예정일을 확인하고, 예정일이 지났다면 회수 재요청 또는 배송지원팀 확인 요청으로 처리합니다.",
    agentScript:
      "반품 접수 후 회수가 지연되어 불편하셨겠습니다. 회수 접수 상태와 예정일을 확인해보겠습니다.",
    policySummary:
      "회수 지연은 회수 접수 상태, 예정일, 택배사 배정 여부를 확인한 뒤 재요청합니다.",
    requiredInfo: ["주문번호", "반품 접수일", "회수 예정일", "회수 주소", "상품 포장 상태"],
    nextActions: ["회수 접수 상태 확인", "회수 예정일 확인", "택배사 회수 재요청", "고객에게 재방문 일정 안내"],
    escalationRules: ["회수 지연 3일 이상", "고객 반복 문의", "환불 지연과 연결된 경우"],
    department: "반품/교환팀",
    keywords: ["반품", "회수", "기사", "안 왔", "재요청"],
    priority: "Medium",
  },
  {
    id: "FAQ-RTN-002",
    category: "반품 접수",
    question: "반품비는 언제 발생하나요?",
    answer:
      "반품비는 반품 사유에 따라 달라집니다. 상품 불량, 파손, 오배송 등 판매자 또는 배송 귀책 사유라면 고객 부담이 아닐 수 있고, 단순 변심의 경우 반품비가 발생할 수 있습니다.",
    agentScript:
      "반품비 발생 여부는 반품 사유에 따라 달라집니다. 접수하신 사유를 확인한 뒤 부담 여부를 안내드리겠습니다.",
    policySummary:
      "단순 변심은 반품비 발생 가능성이 있고, 상품 문제나 오배송은 귀책 확인 후 면제될 수 있습니다.",
    requiredInfo: ["주문번호", "반품 사유", "상품 상태", "수령일", "사진 증빙 여부"],
    nextActions: ["반품 사유 확인", "귀책 여부 판단", "반품비 안내", "필요 시 증빙 요청"],
    escalationRules: ["고객이 반품비 부당 청구 주장", "파손/오배송과 반품비가 연결된 경우"],
    department: "반품/교환팀",
    keywords: ["반품비", "배송비", "부담", "단순 변심", "귀책"],
    priority: "Low",
  },
  {
    id: "FAQ-EXC-001",
    category: "교환 접수",
    question: "상품 교환은 어떤 절차로 진행되나요?",
    answer:
      "교환은 상품 상태와 교환 가능 재고를 확인한 뒤 접수합니다. 교환 가능 재고가 없으면 환불 또는 대체 처리 안내가 필요합니다.",
    agentScript:
      "교환을 원하시는 상품의 상태와 재고를 확인한 뒤 접수 가능 여부를 안내드리겠습니다.",
    policySummary:
      "교환은 상품 상태, 교환 사유, 재고 여부를 기준으로 접수합니다.",
    requiredInfo: ["주문번호", "교환 사유", "교환 희망 옵션", "상품 상태", "재고 여부"],
    nextActions: ["교환 가능 여부 확인", "재고 확인", "회수 접수", "교환 상품 발송 일정 안내"],
    escalationRules: ["교환 재고 없음", "고가 상품", "반복 교환 요청", "상품 파손 동반"],
    department: "반품/교환팀",
    keywords: ["교환", "옵션 변경", "사이즈", "색상", "재고"],
    priority: "Low",
  },
  {
    id: "FAQ-RFD-001",
    category: "환불 지연",
    question: "환불 완료라고 표시되는데 카드 취소가 아직 안 된 경우 어떻게 안내하나요?",
    answer:
      "서비스 화면에서 환불 완료로 표시되어도 카드사 반영까지 시간이 걸릴 수 있습니다. 결제수단, 환불 처리일, 카드사 반영 예정 기간을 확인해 안내합니다.",
    agentScript:
      "환불 완료로 보이는데 카드 취소가 확인되지 않아 걱정되셨겠습니다. 환불 처리일과 카드사 반영 예상 기간을 확인해드리겠습니다.",
    policySummary:
      "환불 처리 완료 후 카드사 승인 취소 반영까지 결제수단별 시간이 소요될 수 있습니다.",
    requiredInfo: ["주문번호", "결제수단", "환불 처리일", "카드사", "환불 금액"],
    nextActions: ["환불 상태 확인", "결제수단별 반영 기간 안내", "카드사 반영 지연 가능성 안내", "필요 시 환불정산팀 확인 요청"],
    escalationRules: ["반영 예정 기간 초과", "고객이 동일 건 반복 문의", "환불 금액 불일치"],
    department: "환불정산팀",
    keywords: ["환불 완료", "카드 취소", "아직 안 됨", "환불 지연", "승인 취소"],
    priority: "Medium",
  },
  {
    id: "FAQ-RFD-002",
    category: "환불 지연",
    question: "반품 상품 회수 후 환불이 지연되는 경우 어떻게 처리하나요?",
    answer:
      "반품 회수 후에는 상품 입고 확인과 검수 절차가 필요합니다. 입고 또는 검수가 완료되지 않은 경우 환불이 지연될 수 있으며, 지연 사유를 확인해 안내합니다.",
    agentScript:
      "반품 후 환불이 늦어져 불편하셨겠습니다. 상품 입고와 검수 상태를 먼저 확인해보겠습니다.",
    policySummary:
      "반품 환불은 회수 완료, 물류센터 입고, 검수 완료 여부를 기준으로 진행됩니다.",
    requiredInfo: ["주문번호", "반품 회수일", "운송장 번호", "입고 상태", "검수 상태"],
    nextActions: ["회수 완료 여부 확인", "입고 상태 확인", "검수 진행 여부 확인", "환불정산팀 처리 요청"],
    escalationRules: ["회수 후 장기간 미환불", "고객 반복 문의", "고액 환불 건", "검수 지연"],
    department: "환불정산팀",
    keywords: ["반품", "환불", "회수 완료", "입고", "검수", "지연"],
    priority: "High",
  },
  {
    id: "FAQ-PAY-001",
    category: "중복 결제",
    question: "카드가 두 번 결제된 것처럼 보일 때 어떻게 확인하나요?",
    answer:
      "중복 결제는 실제 승인 건인지, 승인 대기 또는 가승인인지 확인해야 합니다. 주문번호와 결제 승인번호를 확인하고 실제 중복 승인으로 확인되면 환불정산팀 확인 요청으로 처리합니다.",
    agentScript:
      "중복 결제로 보이는 상황이라 걱정되셨겠습니다. 실제 승인 내역인지 먼저 확인한 뒤 필요한 조치를 안내드리겠습니다.",
    policySummary:
      "중복 결제는 주문 결제 내역과 카드 승인 내역을 대조하여 실제 중복 여부를 확인합니다.",
    requiredInfo: ["주문번호", "결제일시", "결제금액", "카드사", "승인번호"],
    nextActions: ["주문 결제 내역 확인", "승인번호 확인", "중복 승인 여부 판단", "환불정산팀 확인 요청"],
    escalationRules: ["실제 중복 승인 확인", "고액 결제", "고객 반복 문의", "환불 지연 동반"],
    department: "주문/결제팀",
    keywords: ["중복 결제", "두 번", "카드", "승인", "결제"],
    priority: "Medium",
  },
  {
    id: "FAQ-PAY-002",
    category: "결제 오류",
    question: "결제는 됐는데 주문이 생성되지 않은 경우 어떻게 처리하나요?",
    answer:
      "결제 승인과 주문 생성이 일시적으로 불일치할 수 있습니다. 결제 승인번호와 주문 생성 여부를 확인한 뒤, 주문이 생성되지 않았다면 결제 취소 또는 주문 복구 가능 여부를 확인합니다.",
    agentScript:
      "결제는 되었는데 주문이 보이지 않는 상황이면 당황스러우셨겠습니다. 결제 승인 내역과 주문 생성 여부를 함께 확인하겠습니다.",
    policySummary:
      "결제 승인 후 주문 미생성 건은 승인번호 기준으로 결제/주문 시스템 매칭 여부를 확인합니다.",
    requiredInfo: ["결제일시", "결제금액", "카드사", "승인번호", "고객 계정 정보"],
    nextActions: ["결제 승인 확인", "주문 생성 여부 확인", "주문 복구 가능성 확인", "필요 시 결제 취소 안내"],
    escalationRules: ["고액 결제", "주문 미생성 반복", "고객 강한 불만"],
    department: "주문/결제팀",
    keywords: ["결제 됐는데", "주문 없음", "주문이 안 보여", "승인", "오류"],
    priority: "Medium",
  },
  {
    id: "FAQ-CPN-001",
    category: "쿠폰/할인 적용 오류",
    question: "쿠폰이 적용되지 않아 결제 금액이 다르게 나온 경우 어떻게 안내하나요?",
    answer:
      "쿠폰 적용 여부는 쿠폰 사용 조건, 최소 주문금액, 적용 대상 상품, 중복 할인 가능 여부를 확인해야 합니다. 조건을 만족했는데도 적용되지 않았다면 쿠폰/멤버십팀 확인 요청으로 처리합니다.",
    agentScript:
      "쿠폰이 적용되지 않아 결제 금액이 달라져 불편하셨겠습니다. 쿠폰 사용 조건과 주문 상품을 확인해보겠습니다.",
    policySummary:
      "쿠폰은 사용 조건, 대상 상품, 유효기간, 중복 적용 제한에 따라 적용 여부가 결정됩니다.",
    requiredInfo: ["주문번호", "쿠폰명", "쿠폰 유효기간", "주문 금액", "적용 대상 상품"],
    nextActions: ["쿠폰 조건 확인", "주문 상품 적용 가능 여부 확인", "중복 할인 제한 확인", "필요 시 쿠폰/멤버십팀 확인"],
    escalationRules: ["프로모션 오류 의심", "다수 고객 동일 문의", "고객이 보상 요구"],
    department: "쿠폰/멤버십팀",
    keywords: ["쿠폰", "할인", "적용", "금액", "프로모션"],
    priority: "Low",
  },
  {
    id: "FAQ-SUB-001",
    category: "정기배송/구독 결제",
    question: "정기배송을 해지했는데 또 결제된 경우 어떻게 처리하나요?",
    answer:
      "정기배송 해지 시점과 다음 결제 예정일을 확인해야 합니다. 이미 결제 생성 이후 해지된 경우 결제가 진행되었을 수 있으며, 배송 전이면 취소 가능 여부를 확인합니다.",
    agentScript:
      "정기배송 해지 후 다시 결제가 되어 불편하셨겠습니다. 해지 시점과 결제 생성 시간을 확인해보겠습니다.",
    policySummary:
      "정기배송 결제는 결제 생성 시점과 해지 시점에 따라 취소 가능 여부가 달라집니다.",
    requiredInfo: ["정기배송 상품명", "해지 신청 시점", "결제일시", "배송 상태", "주문번호"],
    nextActions: ["해지 이력 확인", "결제 생성 시점 확인", "배송 전 취소 가능 여부 확인", "환불 또는 다음 회차 해지 안내"],
    escalationRules: ["반복 결제", "고객이 해지 완료 화면 보유", "고액 정기결제"],
    department: "주문/결제팀",
    keywords: ["정기배송", "구독", "해지", "또 결제", "자동 결제"],
    priority: "Medium",
  },
  {
    id: "FAQ-MEM-001",
    category: "멤버십 혜택 문의",
    question: "멤버십 혜택이 적용되지 않았을 때 어떻게 확인하나요?",
    answer:
      "멤버십 혜택 적용 여부는 고객의 멤버십 상태, 상품의 혜택 대상 여부, 결제 시점의 조건을 확인해야 합니다. 혜택 대상인데 적용되지 않았다면 쿠폰/멤버십팀 확인이 필요합니다.",
    agentScript:
      "멤버십 혜택이 적용되지 않아 불편하셨겠습니다. 고객님의 멤버십 상태와 해당 상품의 적용 조건을 확인하겠습니다.",
    policySummary:
      "멤버십 혜택은 고객 멤버십 상태와 상품별 혜택 대상 여부에 따라 적용됩니다.",
    requiredInfo: ["고객 ID", "멤버십 상태", "주문번호", "상품명", "혜택 종류"],
    nextActions: ["멤버십 활성 상태 확인", "상품 혜택 대상 여부 확인", "혜택 적용 이력 확인", "필요 시 쿠폰/멤버십팀 확인"],
    escalationRules: ["혜택 미적용 반복", "프로모션 오류 의심", "고객 보상 요구"],
    department: "쿠폰/멤버십팀",
    keywords: ["멤버십", "혜택", "무료배송", "할인", "적용 안 됨"],
    priority: "Low",
  },
  {
    id: "FAQ-SEL-001",
    category: "판매자 문의",
    question: "판매자가 계속 답변하지 않을 때 어떻게 처리하나요?",
    answer:
      "판매자 문의 지연은 문의 접수 시간과 판매자 응답 기한을 확인해야 합니다. 응답 기한을 초과했거나 고객 불만이 큰 경우 판매자지원팀 또는 민원전담팀으로 이관합니다.",
    agentScript:
      "판매자 답변이 지연되어 불편하셨겠습니다. 문의 접수 시점과 판매자 응답 상태를 확인한 뒤 후속 처리하겠습니다.",
    policySummary:
      "판매자 응답 지연은 접수 시점, 응답 기한, 상품 유형을 기준으로 확인 후 판매자지원팀에 요청합니다.",
    requiredInfo: ["주문번호", "판매자명", "문의 접수일", "문의 내용", "응답 지연 기간"],
    nextActions: ["판매자 문의 이력 확인", "응답 기한 확인", "판매자지원팀 확인 요청", "고객에게 예상 처리 시간 안내"],
    escalationRules: ["응답 기한 초과", "고객 반복 문의", "고객이 민원 접수 의사 표현", "환불/교환 지연과 연결"],
    department: "판매자지원팀",
    keywords: ["판매자", "답변", "응답 안 함", "문의", "해결 안 됨"],
    priority: "Medium",
  },
  {
    id: "FAQ-CMP-001",
    category: "강성 민원 / 반복 문의",
    question: "같은 문제로 반복 전화한 고객은 어떻게 응대해야 하나요?",
    answer:
      "반복 문의 고객은 이전 상담 이력과 미해결 사유를 먼저 확인해야 합니다. 고객에게 같은 설명을 반복하게 하지 않고, 현재까지 확인된 내용과 남은 처리 단계를 요약해서 안내합니다.",
    agentScript:
      "같은 문제로 여러 번 연락 주시게 되어 불편을 드렸습니다. 이전 상담 이력을 확인한 뒤 반복 설명 없이 바로 처리 상황을 안내드리겠습니다.",
    policySummary:
      "반복 문의는 상담 이력 확인, 미해결 사유 파악, 담당 부서 이관 여부를 우선 검토합니다.",
    requiredInfo: ["최근 상담 이력", "미해결 사유", "이전 안내 내용", "담당 부서 처리 상태"],
    nextActions: ["이전 상담 이력 확인", "미해결 원인 확인", "처리 부서 상태 확인", "필요 시 민원전담팀 이관"],
    escalationRules: ["세 번째 이상 문의", "고객이 민원/신고 언급", "책임자 연결 요청", "이전 처리 약속 미이행"],
    department: "민원전담팀",
    keywords: ["세 번째", "계속", "해결 안 됨", "민원", "책임자", "신고"],
    priority: "High",
  },
  {
    id: "FAQ-CMP-002",
    category: "강성 민원 / 반복 문의",
    question: "고객이 책임자 연결을 요청할 때 어떻게 대응하나요?",
    answer:
      "책임자 연결 요청은 고객 불만 수준이 높은 신호입니다. 상담사는 먼저 불편 사항을 인정하고, 처리 가능한 범위와 이관 기준을 설명한 뒤 필요 시 민원전담팀 또는 관리자 확인으로 연결합니다.",
    agentScript:
      "불편이 크셨던 점 이해합니다. 현재 제가 확인 가능한 내용부터 빠르게 확인하고, 필요한 경우 담당 부서 또는 관리자 확인 절차로 연결하겠습니다.",
    policySummary:
      "책임자 연결 요청은 민원 강도 높음으로 분류하며, 상담 이력과 미해결 사유 확인 후 에스컬레이션합니다.",
    requiredInfo: ["상담 이력", "고객 요구사항", "이전 처리 결과", "현재 미해결 항목"],
    nextActions: ["불만 사유 요약", "처리 가능 범위 안내", "민원전담팀 이관 판단", "관리자 확인 요청"],
    escalationRules: ["책임자 요청", "민원 접수 언급", "법적 조치 언급", "반복 미해결"],
    department: "민원전담팀",
    keywords: ["책임자", "관리자", "민원", "신고", "해결 안 되면"],
    priority: "High",
  },
  {
    id: "FAQ-GEN-001",
    category: "일반 문의",
    question: "주문번호를 모르는 고객의 문의는 어떻게 시작하나요?",
    answer:
      "주문번호를 모르는 경우 고객 ID, 휴대폰 번호 일부, 주문일, 상품명 등으로 주문을 찾을 수 있습니다. 개인정보 보호를 위해 본인 확인 절차를 먼저 진행해야 합니다.",
    agentScript:
      "주문번호를 모르셔도 괜찮습니다. 본인 확인 후 주문일이나 상품명 기준으로 확인해드리겠습니다.",
    policySummary:
      "주문번호가 없는 문의는 본인 확인 후 고객 계정과 주문 조건으로 조회합니다.",
    requiredInfo: ["고객 ID", "본인 확인 정보", "주문일", "상품명", "수령인 정보"],
    nextActions: ["본인 확인", "고객 계정 조회", "주문 조건 검색", "관련 주문 선택 후 처리"],
    escalationRules: ["본인 확인 실패", "타인 주문 조회 요청", "개인정보 관련 민감 문의"],
    department: "일반상담팀",
    keywords: ["주문번호", "모름", "조회", "찾아", "확인"],
    priority: "Low",
  },
  {
    id: "FAQ-GEN-002",
    category: "일반 문의",
    question: "현금영수증이나 거래명세서 발급 문의는 어떻게 안내하나요?",
    answer:
      "증빙서류 발급은 결제수단과 주문 상태에 따라 가능 여부가 달라집니다. 주문 상세에서 발급 가능한 항목을 확인하고, 발급이 제한되는 경우 사유를 안내합니다.",
    agentScript:
      "증빙서류 발급이 필요하시군요. 주문 상태와 결제수단을 확인한 뒤 발급 가능 여부를 안내드리겠습니다.",
    policySummary:
      "현금영수증, 거래명세서 등 증빙서류는 주문 상태와 결제수단 기준으로 발급 가능 여부를 확인합니다.",
    requiredInfo: ["주문번호", "결제수단", "발급 희망 서류", "사업자 여부", "주문 상태"],
    nextActions: ["주문 상세 확인", "발급 가능 항목 확인", "발급 방법 안내", "제한 시 사유 안내"],
    escalationRules: ["사업자 증빙 분쟁", "결제정보 불일치", "고객이 세금 신고 기한 언급"],
    department: "일반상담팀",
    keywords: ["현금영수증", "거래명세서", "영수증", "증빙", "발급"],
    priority: "Low",
  }
];

export function getRecommendedFAQs(params: {
  mainIntent?: string;
  subIntent?: string;
  detectedKeywords?: string[];
  recommendedDepartment?: string;
  urgencyLevel?: "Low" | "Medium" | "High";
  limit?: number;
}): EcommerceFAQ[] {
  const {
    mainIntent = "",
    subIntent = "",
    detectedKeywords = [],
    recommendedDepartment = "",
    urgencyLevel = "Low",
    limit = 4,
  } = params;

  const queryTerms = [
    mainIntent,
    subIntent,
    recommendedDepartment,
    ...detectedKeywords,
  ]
    .join(" ")
    .toLowerCase();

  const scored = ECOMMERCE_FAQ_DATABASE.map((faq) => {
    let score = 0;

    if (mainIntent && faq.category.includes(mainIntent)) score += 10;
    if (subIntent && faq.question.includes(subIntent)) score += 4;
    if (recommendedDepartment && faq.department === recommendedDepartment) score += 6;

    for (const keyword of faq.keywords) {
      if (queryTerms.includes(keyword.toLowerCase())) score += 3;
    }

    for (const keyword of detectedKeywords) {
      if (faq.question.includes(keyword) || faq.answer.includes(keyword)) score += 2;
    }

    if (urgencyLevel === "High" && faq.priority === "High") score += 5;
    if (urgencyLevel === "Medium" && faq.priority === "Medium") score += 2;

    return { faq, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.faq);
}

// 기존 로컬 분석 엔진과의 호환성을 위한 searchFAQs 래퍼 함수 추가
import type { FAQ, ComplaintCategory } from '../types/index';

export function searchFAQs(keywords: string[]): FAQ[] {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  const scored = ECOMMERCE_FAQ_DATABASE.map((faq) => {
    const matchCount = faq.keywords.filter((fk) =>
      lowerKeywords.some(
        (lk) => fk.toLowerCase().includes(lk) || lk.includes(fk.toLowerCase())
      )
    ).length;
    return { faq, matchCount };
  })
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

  return scored.map(({ faq }) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: (faq.category === '배송 지연' || faq.category === '빠른배송 지연' || faq.category === '배송지 변경')
      ? 'delivery_issue'
      : (faq.category === '결제 오류' || faq.category === '중복 결제')
      ? 'payment_error'
      : (faq.category === '환불 지연')
      ? 'refund_request'
      : (faq.category === '반품 접수')
      ? 'exchange_request'
      : 'inquiry_general' as ComplaintCategory,
    keywords: faq.keywords
  }));
}

