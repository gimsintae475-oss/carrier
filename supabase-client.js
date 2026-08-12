// 브라우저가 임의 버전으로 바뀌지 않도록 Supabase JS 버전을 고정합니다.
const SUPABASE_JS_URL = "https://esm.sh/@supabase/supabase-js@2.56.1?bundle";
const config = window.GREENON_CONFIG;

/**
 * Supabase 클라이언트 준비 결과를 app.js에 알립니다.
 * 모듈 다운로드나 설정에 문제가 있어도 기존 체험 기능은 그대로 사용할 수 있습니다.
 */
async function connectSupabase() {
  try {
    if (!config?.supabaseUrl || !config?.supabasePublishableKey) {
      throw new Error("Supabase 공개 설정이 비어 있습니다.");
    }

    const { createClient } = await import(SUPABASE_JS_URL);
    const client = createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    window.greenOnSupabase = client;
    window.dispatchEvent(new CustomEvent("greenon:supabase-ready", { detail: { client } }));
  } catch (error) {
    console.error("Supabase 클라이언트를 준비하지 못했습니다.", error);
    window.greenOnSupabaseError = error;
    window.dispatchEvent(new CustomEvent("greenon:supabase-error", { detail: { error } }));
  }
}

connectSupabase();
