#!/usr/bin/env bash
set -euo pipefail

# 어느 위치에서 실행해도 프로젝트 루트를 기준으로 빌드하도록 경로를 계산합니다.
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PROJECT_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$PROJECT_ROOT/dist"

# 로컬에서는 선택적으로 .env를 읽고, Render에서는 대시보드 환경변수를 그대로 사용합니다.
if [[ -f "$PROJECT_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$PROJECT_ROOT/.env"
  set +a
fi

: "${SUPABASE_URL:?SUPABASE_URL 환경변수가 필요합니다.}"
: "${SUPABASE_PUBLISHABLE_KEY:?SUPABASE_PUBLISHABLE_KEY 환경변수가 필요합니다.}"

# 브라우저에는 Supabase 프로젝트 URL과 publishable 키만 허용합니다.
# 따옴표나 스크립트가 섞인 값도 함께 차단해 생성 파일의 안전성을 지킵니다.
if [[ ! "$SUPABASE_URL" =~ ^https://[a-z0-9-]+\.supabase\.co$ ]]; then
  echo "오류: SUPABASE_URL은 https://<project-ref>.supabase.co 형식이어야 합니다." >&2
  exit 1
fi

if [[ ! "$SUPABASE_PUBLISHABLE_KEY" =~ ^sb_publishable_[A-Za-z0-9_-]+$ ]]; then
  echo "오류: 브라우저 빌드에는 sb_publishable_ 형식의 키만 사용할 수 있습니다." >&2
  exit 1
fi

if [[ "$SUPABASE_URL" == "https://your-project-ref.supabase.co" ||
      "$SUPABASE_PUBLISHABLE_KEY" == "sb_publishable_your_public_key" ]]; then
  echo "오류: .env.example의 예시 값을 실제 Supabase 공개 설정으로 바꿔 주세요." >&2
  exit 1
fi

# 검증이 끝난 뒤에만 이전 산출물을 교체합니다.
rm -rf -- "$DIST_DIR"
mkdir -p -- "$DIST_DIR"
cp -- \
  "$PROJECT_ROOT/index.html" \
  "$PROJECT_ROOT/styles.css" \
  "$PROJECT_ROOT/app.js" \
  "$PROJECT_ROOT/supabase-client.js" \
  "$PROJECT_ROOT/weather-service.js" \
  "$DIST_DIR/"

# 정적 사이트는 런타임 환경변수를 읽을 수 없으므로 공개 설정 파일을 빌드 시 생성합니다.
{
  printf '%s\n' '// Render 빌드에서 생성된 공개 브라우저 설정입니다.'
  printf '%s\n' '// service_role 또는 secret key는 이 파일에 절대로 포함하지 않습니다.'
  printf '%s\n' 'window.GREENON_CONFIG = Object.freeze({'
  printf '  supabaseUrl: "%s",\n' "$SUPABASE_URL"
  printf '  supabasePublishableKey: "%s",\n' "$SUPABASE_PUBLISHABLE_KEY"
  printf '%s\n' '  weather: Object.freeze({'
  printf '%s\n' '    provider: "open-meteo",'
  printf '%s\n' '    locationName: "서울특별시",'
  printf '%s\n' '    latitude: 37.5665,'
  printf '%s\n' '    longitude: 126.978,'
  printf '%s\n' '    timezone: "Asia/Seoul",'
  printf '%s\n' '    timeoutMs: 6000,'
  printf '%s\n' '  }),'
  printf '%s\n' '});'
} > "$DIST_DIR/config.js"

echo "Carrier GreenON production build 완료: $DIST_DIR"
