# Carrier GreenON

Carrier GreenON은 캐리어 에어컨 사용자를 위한 ESG 친환경 냉방 미션·리워드 웹앱입니다. 실제 에어컨 API 대신 가상 IoT 데이터를 사용하며, 사용자 데이터는 Supabase Auth·Postgres·RLS로 분리합니다.

## 주요 사용자 흐름

회원가입/로그인 → 서울 날씨와 가상 에어컨 상태 확인 → GREEN MISSION 참여 → 시간·상태 시뮬레이션 → 미션 성공 및 GREEN POINT 적립 → GREEN WALLET 확인 → REWARD SHOP 구매 → 구매내역 확인

## 기술 구성

- HTML, CSS, Vanilla JavaScript 기반 모바일 우선 정적 웹앱
- Supabase Auth와 RLS가 적용된 사용자별 미션·포인트·구매 데이터
- Open-Meteo 실시간 날씨와 실패 시 샘플 날씨 폴백
- Motion for JavaScript 기반 화면 진입·캐릭터·꽃·구름 애니메이션
- Render Static Site용 환경변수 빌드와 Blueprint

## 봄 정원 디자인과 보미

- GreenON 오리지널 바람 요정 `보미(BOMI)`가 홈에서 미션과 냉방 팁을 안내합니다.
- 보미 이미지 생성용 Gemini 프롬프트는 `docs/GEMINI_CHARACTER_PROMPT.md`에 정리했습니다.
- 애니메이션은 MIT 라이선스인 [Motion for JavaScript](https://motion.dev/)의 `animate()`와 `stagger()` 패턴을 사용했습니다.
- 적용 근거와 위치는 `docs/UI_ANIMATION_REFERENCE.md`에서 확인할 수 있습니다.
- 운영체제의 동작 줄이기 설정을 존중하며, 외부 모듈을 불러오지 못해도 핵심 기능은 계속 작동합니다.

## 환경변수

`.env.example`을 참고해 다음 두 공개 값만 설정합니다.

```dotenv
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_public_key
```

Supabase `publishable` 키는 RLS와 함께 브라우저에서 사용하도록 설계된 공개 키입니다. `sb_secret_*`, `service_role`, `SUPABASE_SECRET_KEY`는 브라우저나 Render 정적 사이트 환경변수에 절대로 넣지 않습니다.

## Production build

macOS/Linux 또는 Git Bash에서 실행합니다.

```bash
cp .env.example .env
# .env를 실제 공개 설정으로 수정
bash scripts/build.sh
```

빌드 스크립트는 URL과 키 형식을 검증하고 `dist/`에 배포 파일을 생성합니다. Windows PowerShell에서 미리보기 서버를 실행할 수 있습니다.

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

브라우저에서 `http://127.0.0.1:4173/`에 접속합니다.

## Render 배포 준비

저장소 루트의 `render.yaml`을 Blueprint로 연결하면 다음 설정이 적용됩니다.

- 서비스 유형: Static Site
- Build Command: `bash scripts/build.sh`
- Publish Directory: `dist`
- 필수 환경변수: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
- 모든 화면 경로를 `/index.html`로 rewrite
- 기본 보안 응답 헤더 적용

Blueprint 최초 생성 화면에서 두 환경변수의 실제 값을 입력합니다. 환경변수 변경 후에는 반드시 다시 빌드·배포해야 정적 `config.js`에 반영됩니다.

## 보안 원칙

- 사용자 데이터 테이블은 RLS로 본인 행만 접근합니다.
- 포인트 적립과 상품 구매는 인증 사용자 전용 원자적 RPC를 사용합니다.
- 브라우저에는 Supabase publishable 키만 포함합니다.
- 실제 캐리어 에어컨 API나 관리자용 비밀 키를 사용하지 않습니다.
- `.env`, 로컬 `config.js`, `dist/`는 Git에서 제외됩니다.

## 주요 파일

- `index.html`: 화면 구조와 접근성 마크업
- `styles.css`: White + Blue 디자인과 Red 오류 상태
- `app.js`: 미션·IoT·포인트·리워드 화면 로직
- `supabase-client.js`: 고정 버전 Supabase 브라우저 클라이언트
- `weather-service.js`: Open-Meteo 연결과 샘플 폴백
- `motion-enhancements.js`: 보미·꽃·구름·화면 전환 Motion 효과
- `assets/bomi-hero.png`: GreenON 오리지널 캐릭터 히어로 이미지
- `docs/GEMINI_CHARACTER_PROMPT.md`: Gemini용 캐릭터 생성 프롬프트
- `scripts/build.sh`: Render production build
- `render.yaml`: Render Static Site Blueprint
- `CHECKLIST.md`: 단계별 개발·검증 현황
