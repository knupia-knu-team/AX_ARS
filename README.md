# VoiceRoute AX (AI 기반 음성 이해형 지능형 고객센터 AX 플랫폼)

VoiceRoute AX는 기존 번호 선택식 ARS의 비효율(잘못된 부서 연결, 대기 시간 지연, 상담사 분류 업무 부담)을 개선하기 위해 설계된 **AI 기반 음성 이해형 지능형 고객센터 운영 AX 플랫폼**의 데모 프로토타입 MVP입니다.

고객의 자연어 발화를 분석하여 주요 의도(Intent) 분석, 긴급도 평가, 유관 부서 자동 라우팅, 상담사 지원 브리핑, 그리고 CRM 상담 일지 자동 생성을 한 번에 처리합니다.

---

## ☁️ Google Cloud 서비스 아키텍처

본 프로젝트는 대회 요구사항을 준수하여 Google Cloud 플랫폼에서 완전히 구동되도록 설계되었습니다.

1.  **Google Cloud Run**: 풀스택 통합 컨테이너를 호스팅하며, 서버리스 환경에서 안전하고 신속하게 트래픽을 처리합니다. (단일 컨테이너 내에서 React 정적 빌드 서빙 및 Express API 제공)
2.  **Vertex AI Gemini (Gemini API)**: 서버 측 백엔드에서 보안상 안전하게 호출되며, 시스템 지침 및 강제 JSON 스키마 규격을 적용해 고객 문의 내용을 깊이 있게 구조적 분석합니다.

---

## ⚡ Fallback (대체 작동) 정책

*   **"If Gemini is unavailable, the service uses the Mock Rule Engine."**
*   로컬에 Google Cloud 인증 정보가 없거나, Vertex AI 호출 중 쿼터 초과/네트워크 지연/구조화 JSON 파싱 실패 등의 오류가 발생하면 백엔드 서버가 이를 감지하여 **Mock Rule Engine** 분석 결과로 즉각적이고 안전하게 우회(Fallback)시킵니다.
*   이 과정에서 사용자 화면에는 에러가 발생하지 않으며, 서버 측에만 상세 사유 경고(`console.warn`)를 기록하여 시연 안정성을 100% 보장합니다.

---

## ⚙️ Gemini 환경 변수 설정 (Environment Variables)

백엔드 서버 작동을 제어하기 위해 다음 환경 변수를 설정할 수 있습니다.

*   `USE_GEMINI`: `true`로 설정하면 Vertex AI Gemini API를 연동하고, `false`면 즉시 Mock 엔진을 작동합니다. (로컬 기본값: `false`)
*   `GOOGLE_CLOUD_PROJECT`: 연동할 Google Cloud 프로젝트 ID입니다.
*   `GOOGLE_CLOUD_LOCATION`: Vertex AI 서비스 리전입니다. (기본값: `us-central1` / 한국 리전 권장값: `asia-northeast3`)
*   `GEMINI_MODEL`: 사용할 Gemini 모델 식별자입니다. (기본값: `gemini-2.0-flash`)

---

## 🏃 로컬 실행 방법 (Local Run Instructions)

### 1. 패키지 설치 및 빌드
```bash
# 전체 의존성 패키지 설치 (npm workspaces 연동)
npm install

# 전체 프로젝트 빌드 검증 (프론트엔드 및 백엔드)
npm run build
```

### 2. 로컬 실행
```bash
# 프론트엔드 Vite(5173포트)와 백엔드 Express(3001포트) 동시 기동
npm run dev
```
기동 후 웹 브라우저에서 `http://localhost:5173`으로 접속합니다.

### 3. 로컬에서 Gemini API 활성화 테스트
1.  컴퓨터에 `gcloud SDK`가 설치되어 있는지 확인합니다.
2.  터미널에서 아래 명령을 실행해 Application Default Credentials (ADC) 로그인을 수행합니다:
    ```bash
    gcloud auth application-default login
    ```
3.  프로젝트 루트에 `.env` 파일을 생성하고 아래 양식으로 입력한 뒤 서버를 재기동합니다:
    ```env
    USE_GEMINI=true
    GOOGLE_CLOUD_PROJECT=your-gcp-project-id
    GOOGLE_CLOUD_LOCATION=us-central1
    GEMINI_MODEL=gemini-2.0-flash
    ```

---

## ☁️ Google Cloud Run 배포 가이드 (Cloud Run Deployment)

프로젝트 루트에 작성되어 있는 **Dockerfile**을 사용하여 간편하게 Cloud Run에 배포할 수 있습니다. 모든 자격 증명은 보안 규칙에 따라 소스 코드에 남기지 않으며, Cloud Run 서비스 환경 변수 및 서비스 계정 권한(IAM)을 통해 바인딩됩니다.

### 1. GCP CLI 인증 및 프로젝트 설정
```bash
# Google Cloud CLI 로그인
gcloud auth login

# 배포할 대상 GCP 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID
```

### 2. 필요한 GCP API 서비스 활성화
```bash
# Cloud Run 및 Vertex AI(aiplatform) 서비스 API 활성화
gcloud services enable run.googleapis.com aiplatform.googleapis.com
```

### 3. Cloud Run 배포 명령어 실행
다음 한 줄의 명령어로 루트의 Dockerfile을 기반으로 소스를 자동 빌드 및 업로드하여 Cloud Run에 배포할 수 있습니다:
```bash
gcloud run deploy voiceroute-ax \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### 4. Cloud Run 환경 변수 주입 방법
배포가 완료된 후 Google Cloud 콘솔 또는 아래 CLI 명령을 통해 Cloud Run 서비스의 환경 변수를 설정할 수 있습니다.
```bash
gcloud run services update voiceroute-ax \
  --set-env-vars="USE_GEMINI=true,GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1,GEMINI_MODEL=gemini-2.0-flash" \
  --region us-central1
```

*참고: Cloud Run 서비스 계정(IAM)에 `Vertex AI 사용자 (roles/aiplatform.user)` 권한이 부여되어 있어야 정상적으로 API가 실행됩니다.*
