// Carrier GreenON의 화면 이름과 하단 내비게이션을 연결합니다.
// 로그인 사용자의 시뮬레이션 상태와 리워드 기록은 Supabase에 사용자별로 저장합니다.
const screens = [...document.querySelectorAll("[data-screen]")];
const navigationItems = [...document.querySelectorAll("[data-route]")];
const toast = document.querySelector("[data-toast]");

// 현재 날씨 카드와 날씨 조건별 미션 안내 요소입니다.
const weatherCard = document.querySelector("[data-weather-card]");
const weatherSource = document.querySelector("[data-weather-source]");
const weatherLocation = document.querySelector("[data-weather-location]");
const weatherUpdated = document.querySelector("[data-weather-updated]");
const weatherIcon = document.querySelector("[data-weather-icon]");
const weatherTemperature = document.querySelector("[data-weather-temperature]");
const weatherCondition = document.querySelector("[data-weather-condition]");
const weatherHumidity = document.querySelector("[data-weather-humidity]");
const weatherMissionTitle = document.querySelector("[data-weather-mission-title]");
const weatherMissionDescription = document.querySelector("[data-weather-mission-description]");
const weatherMissionNote = document.querySelector("[data-weather-mission-note]");
const weatherError = document.querySelector("[data-weather-error]");
const weatherRefreshButton = document.querySelector("[data-weather-refresh]");

// MY 화면의 회원가입·로그인·프로필 요소입니다.
const authGuest = document.querySelector("[data-auth-guest]");
const authUser = document.querySelector("[data-auth-user]");
const authConnection = document.querySelector("[data-auth-connection]");
const authForm = document.querySelector("[data-auth-form]");
const displayNameField = document.querySelector("[data-display-name-field]");
const authMessage = document.querySelector("[data-auth-message]");
const authSubmit = document.querySelector("[data-auth-submit]");
const authSubmitLabel = document.querySelector("[data-auth-submit-label]");
const authHelp = document.querySelector("[data-auth-help]");
const logoutButton = document.querySelector("[data-logout-button]");
const profileAvatar = document.querySelector("[data-profile-avatar]");
const profileName = document.querySelector("[data-profile-name]");
const profileEmail = document.querySelector("[data-profile-email]");
const profileLevel = document.querySelector("[data-profile-level]");
const profilePoints = document.querySelector("[data-profile-points]");

// 미션 화면에서 자주 갱신하는 요소를 한 번만 찾아 변수에 보관합니다.
const missionCard = document.querySelector("[data-mission-card]");
const missionBadge = document.querySelector("[data-mission-badge]");
const missionProgress = document.querySelector("[data-mission-progress]");
const missionStartButton = document.querySelector("[data-mission-start]");
const missionStartLabel = document.querySelector("[data-mission-start-label]");
const missionMessage = document.querySelector("[data-mission-message]");
const missionMessageText = document.querySelector("[data-mission-message-text]");
const progressLabel = document.querySelector("[data-progress-label]");
const progressTrack = document.querySelector("[data-progress-track]");
const progressBar = document.querySelector("[data-progress-bar]");
const progressMinutes = document.querySelector("[data-progress-minutes]");
const progressDescription = document.querySelector("[data-progress-description]");
const homeMissionStatus = document.querySelector("[data-home-mission-status]");
const homeMissionDetail = document.querySelector("[data-home-mission-detail]");

// 가상 Carrier 에어컨 카드와 조작 패널에서 사용하는 요소입니다.
const airconCard = document.querySelector("[data-aircon-card]");
const airconStatusBadge = document.querySelector("[data-aircon-status-badge]");
const airconConnection = document.querySelector("[data-aircon-connection]");
const powerButton = document.querySelector("[data-power-button]");
const temperatureLabel = document.querySelector("[data-temperature]");
const controlTemperature = document.querySelector("[data-control-temperature]");
const powerLabel = document.querySelector("[data-power-label]");
const modeLabel = document.querySelector("[data-mode-label]");
const fanLabel = document.querySelector("[data-fan-label]");
const usageLabel = document.querySelector("[data-usage-label]");
const filterLabel = document.querySelector("[data-filter-label]");
const deviceAlert = document.querySelector("[data-device-alert]");
const deviceAlertText = document.querySelector("[data-device-alert-text]");
const homeAirconStatus = document.querySelector("[data-home-aircon-status]");
const homeAirconDetail = document.querySelector("[data-home-aircon-detail]");

// GREEN WALLET의 잔액과 거래내역 화면 요소입니다.
const walletBalance = document.querySelector("[data-wallet-balance]");
const totalEarned = document.querySelector("[data-total-earned]");
const totalUsed = document.querySelector("[data-total-used]");
const transactionList = document.querySelector("[data-transaction-list]");

// 리워드 숍의 상품 목록, 구매내역, 상품 상세 다이얼로그 요소입니다.
const shopBalance = document.querySelector("[data-shop-balance]");
const rewardProductList = document.querySelector("[data-reward-product-list]");
const orderList = document.querySelector("[data-order-list]");
const orderCount = document.querySelector("[data-order-count]");
const rewardDialog = document.querySelector("[data-reward-dialog]");
const dialogVisual = document.querySelector("[data-dialog-visual]");
const dialogCategory = document.querySelector("[data-dialog-category]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogDescription = document.querySelector("[data-dialog-description]");
const dialogPrice = document.querySelector("[data-dialog-price]");
const dialogRemaining = document.querySelector("[data-dialog-remaining]");
const dialogRemainingRow = dialogRemaining.closest("strong");
const purchaseMessage = document.querySelector("[data-purchase-message]");
const purchaseMessageText = document.querySelector("[data-purchase-message-text]");
const purchaseButton = document.querySelector("[data-purchase-button]");
const purchaseButtonLabel = document.querySelector("[data-purchase-button-label]");

const STORAGE_KEY = "carrier-greenon-demo-v1";
const DAILY_MISSION_REWARD = 150;

// 상품 원본은 Supabase rewards 테이블에서 읽어 오며, 브라우저에는 화면 표시용 사본만 둡니다.
let rewardProducts = [];

// 저장된 값이 없거나 일부 필드가 빠졌을 때 사용할 안전한 초기값입니다.
const defaultAppState = {
  aircon: {
    power: true,
    mode: "cool",
    temperature: 26,
    fan: "auto",
    usageMinutes: 0,
    filterPercent: 92,
    sensorStatus: "normal",
  },
  mission: {
    status: "ready",
    elapsedMinutes: 0,
    targetMinutes: 60,
    message: "",
    messageTone: "info",
  },
  wallet: {
    balance: 0,
    transactions: [],
  },
  shop: {
    orders: [],
  },
};

// 이전 단계에서 사용한 GreenON 전용 체험 데이터만 제거합니다. 다른 사이트 데이터는 건드리지 않습니다.
try {
  window.localStorage.removeItem(STORAGE_KEY);
} catch (error) {
  console.warn("이전 GreenON 체험 데이터를 정리하지 못했습니다.", error);
}

// 실제 에어컨 API 대신 사용할 가상 IoT 데이터입니다.
// 값의 의미가 분명하도록 문자열과 숫자를 함께 사용해 초보자도 상태를 쉽게 확인할 수 있습니다.
const airconState = { ...defaultAppState.aircon };

// 미션은 참여 전, 진행 중, 성공, 실패 네 상태를 가집니다.
const missionState = { ...defaultAppState.mission };
const walletState = {
  ...defaultAppState.wallet,
  transactions: [],
};
const shopState = {
  ...defaultAppState.shop,
  orders: [],
};

const modeNames = {
  cool: "냉방",
  fan: "송풍",
  auto: "자동",
};

const fanNames = {
  low: "약풍",
  auto: "자동",
  high: "강풍",
};

let toastTimer;
let walletFilter = "all";
let rewardCategory = "all";
let selectedRewardId = null;
let authMode = "login";
let supabaseClient = window.greenOnSupabase ?? null;
let authInitialized = false;
let authRenderVersion = 0;
let currentUserId = null;
let currentMission = null;
let dataLoadVersion = 0;
let airconSyncTimer;
let weatherRecommendation = null;

/** 에어컨 조작을 짧게 모아 Supabase에 저장하고, 임시 localStorage는 더 이상 사용하지 않습니다. */
function saveAppState() {
  if (!currentUserId || !supabaseClient) {
    return;
  }

  window.clearTimeout(airconSyncTimer);
  airconSyncTimer = window.setTimeout(() => {
    persistAirconState().catch((error) => {
      console.error("가상 에어컨 상태를 저장하지 못했습니다.", error);
      showToast("에어컨 상태 저장에 실패했어요.");
    });
  }, 250);
}

/**
 * 사용자에게 짧은 안내 문구를 보여 줍니다.
 * 같은 안내를 연속해서 눌러도 타이머가 겹치지 않도록 기존 타이머를 먼저 정리합니다.
 */
function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

/** API 시간 문자열을 간단한 월/일 시:분 기준 문구로 바꿉니다. */
function formatWeatherTime(value) {
  const matched = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

  if (matched) {
    return `${Number(matched[2])}월 ${Number(matched[3])}일 ${matched[4]}:${matched[5]} 기준`;
  }

  return "방금 업데이트";
}

/** 공통 날씨 데이터를 카드와 미션 화면에 함께 반영합니다. */
function renderWeather(weather) {
  weatherRecommendation = window.greenOnWeather.getMissionRecommendation(weather);
  const isSample = weather.source === "sample";

  weatherCard.dataset.state = isSample ? "error" : "ready";
  weatherCard.setAttribute("aria-busy", "false");
  weatherSource.dataset.source = weather.source;
  weatherSource.textContent = isSample ? "샘플 데이터" : "실시간";
  weatherLocation.textContent = weather.locationName;
  weatherUpdated.textContent = formatWeatherTime(weather.observedAt);
  weatherIcon.textContent = weather.icon;
  weatherTemperature.textContent = Number(weather.temperature).toFixed(1).replace(".0", "");
  weatherCondition.textContent = weather.condition;
  weatherHumidity.textContent = String(Math.round(Number(weather.humidity)));
  weatherMissionTitle.textContent = weatherRecommendation.title;
  weatherMissionDescription.textContent = weatherRecommendation.description;
  weatherMissionNote.querySelector("span").textContent = weatherRecommendation.icon;
  weatherMissionNote.querySelector("p").textContent = `${weatherRecommendation.title} · ${weatherRecommendation.description}`;
  weatherError.hidden = !weather.errorMessage;
  weatherError.textContent = weather.errorMessage || "";
  renderMission();
}

/** 실시간 날씨를 요청하고 실패 시 샘플 데이터와 Red 오류 안내를 표시합니다. */
async function refreshCurrentWeather() {
  weatherRefreshButton.disabled = true;
  weatherCard.dataset.state = "loading";
  weatherCard.setAttribute("aria-busy", "true");
  weatherSource.dataset.source = "";
  weatherSource.textContent = "불러오는 중";

  try {
    if (!window.greenOnWeather) {
      throw new Error("날씨 연결 모듈이 준비되지 않았습니다.");
    }

    const weather = await window.greenOnWeather.getCurrentWeather();
    renderWeather(weather);
  } catch (error) {
    console.error("날씨 화면을 갱신하지 못했습니다.", error);
    const sample = window.greenOnWeather?.getSampleWeather?.() || {
      locationName: "서울특별시",
      temperature: 31,
      humidity: 68,
      weatherCode: 1,
      observedAt: new Date().toISOString(),
      source: "sample",
      condition: "대체로 맑음",
      icon: "🌤️",
    };
    renderWeather({
      ...sample,
      errorMessage: "날씨 연결 오류로 샘플 데이터를 표시하고 있어요.",
    });
  } finally {
    weatherRefreshButton.disabled = false;
  }
}

/** Supabase 연결 상태를 Blue·Green으로, 실제 오류만 Red로 표시합니다. */
function setAuthConnection(text, tone) {
  authConnection.textContent = text;
  authConnection.dataset.tone = tone;
}

/** 폼 안내 문구를 상태에 맞는 색으로 표시하거나 숨깁니다. */
function setAuthMessage(message = "", tone = "info") {
  authMessage.hidden = !message;
  authMessage.textContent = message;
  authMessage.dataset.tone = tone;
}

/** 네트워크 요청 중에 버튼을 잠가 중복 요청을 막습니다. */
function setAuthBusy(isBusy) {
  authSubmit.disabled = isBusy || !supabaseClient;
  logoutButton.disabled = isBusy;
  authSubmitLabel.textContent = isBusy
    ? "처리 중..."
    : authMode === "signup"
      ? "회원가입"
      : "로그인";
}

/** Supabase의 영문 인증 오류를 사용자가 이해하기 쉬운 문장으로 바꿉니다. */
function getFriendlyAuthError(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않아요.";
  }

  if (message.includes("already registered") || message.includes("already been registered")) {
    return "이미 가입된 이메일이에요. 로그인해 주세요.";
  }

  if (message.includes("password") && message.includes("characters")) {
    return "비밀번호는 6자 이상으로 입력해 주세요.";
  }

  if (message.includes("rate limit")) {
    return "요청이 너무 많아요. 잠시 뒤 다시 시도해 주세요.";
  }

  if (message.includes("email") && message.includes("invalid")) {
    return "이메일 형식을 확인해 주세요.";
  }

  return "요청을 처리하지 못했어요. 잠시 뒤 다시 시도해 주세요.";
}

/** 로그인과 회원가입 탭에 맞춰 필요한 입력칸과 안내를 바꿉니다. */
function setAuthMode(nextMode) {
  authMode = nextMode === "signup" ? "signup" : "login";
  const isSignup = authMode === "signup";
  const passwordInput = authForm.elements.password;

  displayNameField.hidden = !isSignup;
  displayNameField.querySelector("input").required = isSignup;
  passwordInput.autocomplete = isSignup ? "new-password" : "current-password";
  authHelp.textContent = isSignup
    ? "가입 후 받은 인증 메일을 확인하면 로그인을 시작할 수 있어요."
    : "가입한 이메일과 비밀번호를 입력해 주세요.";
  setAuthMessage();
  setAuthBusy(false);

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    const isSelected = button.dataset.authMode === authMode;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
  });
}

/** 서울 기준 오늘 날짜를 DB의 mission_date와 같은 YYYY-MM-DD 형식으로 만듭니다. */
function getSeoulDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

/** 로그아웃할 때 이전 사용자의 화면 데이터를 메모리에서도 즉시 지웁니다. */
function resetUserData() {
  currentUserId = null;
  dataLoadVersion += 1;
  window.clearTimeout(airconSyncTimer);
  Object.assign(airconState, defaultAppState.aircon);
  Object.assign(missionState, defaultAppState.mission, {
    targetMinutes: currentMission?.targetMinutes || defaultAppState.mission.targetMinutes,
  });
  walletState.balance = 0;
  walletState.transactions.splice(0);
  shopState.orders.splice(0);
  renderSimulation();
}

/** 공개 미션과 리워드 상품을 Supabase 카탈로그에서 읽어 옵니다. */
async function loadPublicCatalog() {
  const [missionResult, rewardResult] = await Promise.all([
    supabaseClient
      .from("missions")
      .select("id, code, title, description, target_minutes, min_temperature, reward_points")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabaseClient
      .from("rewards")
      .select("id, code, category, name, description, price_points, icon, stock")
      .order("id", { ascending: true }),
  ]);

  if (missionResult.error || rewardResult.error || !missionResult.data) {
    throw missionResult.error || rewardResult.error || new Error("활성 미션이 없습니다.");
  }

  currentMission = {
    id: missionResult.data.id,
    code: missionResult.data.code,
    title: missionResult.data.title,
    description: missionResult.data.description,
    targetMinutes: Number(missionResult.data.target_minutes),
    minTemperature: Number(missionResult.data.min_temperature),
    rewardPoints: Number(missionResult.data.reward_points),
  };
  missionState.targetMinutes = currentMission.targetMinutes;
  rewardProducts = rewardResult.data.map((reward) => ({
    id: String(reward.id),
    databaseId: reward.id,
    code: reward.code,
    category: reward.category,
    name: reward.name,
    description: reward.description,
    price: Number(reward.price_points),
    icon: reward.icon,
    stock: reward.stock,
  }));
  renderMission();
  renderRewardShop();
}

/** 로그인 사용자의 프로필·기기·미션·지갑·구매내역을 한 번에 불러옵니다. */
async function loadAuthenticatedData(userId) {
  const loadVersion = ++dataLoadVersion;
  const today = getSeoulDate();
  const missionRequest = currentMission
    ? supabaseClient
        .from("user_missions")
        .select("status, progress_minutes, violation_reason, reward_awarded")
        .eq("user_id", userId)
        .eq("mission_id", currentMission.id)
        .eq("mission_date", today)
        .maybeSingle()
    : Promise.resolve({ data: null, error: null });

  const [profileResult, airconResult, missionResult, transactionResult, orderResult] = await Promise.all([
    supabaseClient
      .from("profiles")
      .select("display_name, point_balance, lifetime_points, green_levels(name, icon)")
      .eq("id", userId)
      .single(),
    supabaseClient
      .from("aircon_status")
      .select("power, mode, set_temperature, fan, usage_minutes, filter_percent, sensor_status")
      .eq("user_id", userId)
      .single(),
    missionRequest,
    supabaseClient
      .from("point_transactions")
      .select("id, amount, transaction_type, source_type, description, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100),
    supabaseClient
      .from("reward_orders")
      .select("id, reward_id, points_spent, status, ordered_at, rewards(name, category, icon)")
      .eq("user_id", userId)
      .order("ordered_at", { ascending: false }),
  ]);

  const firstError = [profileResult, airconResult, missionResult, transactionResult, orderResult]
    .find((result) => result.error)?.error;

  if (firstError) {
    throw firstError;
  }

  if (loadVersion !== dataLoadVersion || currentUserId !== userId) {
    return;
  }

  const profile = profileResult.data;
  const level = Array.isArray(profile.green_levels)
    ? profile.green_levels[0]
    : profile.green_levels;
  const aircon = airconResult.data;
  const userMission = missionResult.data;

  Object.assign(airconState, {
    power: aircon.power,
    mode: aircon.mode,
    temperature: Number(aircon.set_temperature),
    fan: aircon.fan,
    usageMinutes: Number(aircon.usage_minutes),
    filterPercent: Number(aircon.filter_percent),
    sensorStatus: aircon.sensor_status,
  });
  Object.assign(missionState, {
    status: userMission?.status || "ready",
    elapsedMinutes: Number(userMission?.progress_minutes || 0),
    targetMinutes: currentMission?.targetMinutes || 60,
    message: userMission?.status === "failed" ? userMission.violation_reason || "미션 조건을 확인해 주세요." : "",
    messageTone: userMission?.status === "failed" ? "warning" : "info",
  });
  walletState.balance = Number(profile.point_balance || 0);
  walletState.transactions.splice(
    0,
    walletState.transactions.length,
    ...transactionResult.data.map((transaction) => ({
      id: String(transaction.id),
      type: transaction.transaction_type,
      amount: Math.abs(Number(transaction.amount)),
      title: transaction.description,
      description: transaction.source_type === "mission" ? "GREEN MISSION 성공 보상" : "GREEN REWARD SHOP 구매",
      createdAt: transaction.created_at,
    })),
  );
  shopState.orders.splice(
    0,
    shopState.orders.length,
    ...orderResult.data.map((order) => {
      const reward = Array.isArray(order.rewards) ? order.rewards[0] : order.rewards;
      return {
        id: String(order.id),
        productId: String(order.reward_id),
        productName: reward?.name || "리워드 상품",
        category: reward?.category || "reward",
        icon: reward?.icon || "🎁",
        price: Number(order.points_spent),
        createdAt: order.ordered_at,
      };
    }),
  );

  profileName.textContent = profile.display_name;
  profileLevel.textContent = level?.name || "새싹";
  profileAvatar.textContent = level?.icon || "🌱";
  profilePoints.textContent = formatPoint(walletState.balance);
  renderSimulation();
}

/** 현재 가상 에어컨 상태를 로그인 사용자의 aircon_status 행에 저장합니다. */
async function persistAirconState() {
  if (!currentUserId || !supabaseClient) {
    return;
  }

  const { error } = await supabaseClient
    .from("aircon_status")
    .update({
      power: airconState.power,
      mode: airconState.mode,
      set_temperature: airconState.temperature,
      fan: airconState.fan,
      usage_minutes: airconState.usageMinutes,
      filter_percent: airconState.filterPercent,
      sensor_status: airconState.sensorStatus,
    })
    .eq("user_id", currentUserId);

  if (error) {
    throw error;
  }
}

/** 예약된 저장을 취소하고 미션 판정 전에 최신 기기 상태를 즉시 DB에 반영합니다. */
async function flushAirconState() {
  window.clearTimeout(airconSyncTimer);
  await persistAirconState();
}

/** 로그아웃 상태의 MY 화면을 기본 회원 폼으로 되돌립니다. */
function renderSignedOut() {
  authGuest.hidden = false;
  authUser.hidden = true;
  authForm.reset();
  setAuthMode("login");
  resetUserData();
}

/** 로그인 사용자의 전체 Supabase 데이터를 읽어 MY와 기능 화면에 표시합니다. */
async function renderSignedIn(session) {
  const renderVersion = ++authRenderVersion;
  const user = session.user;
  currentUserId = user.id;
  authGuest.hidden = true;
  authUser.hidden = false;
  profileName.textContent = user.user_metadata?.display_name || "GreenON 사용자";
  profileEmail.textContent = user.email || "이메일 정보 없음";

  try {
    await loadAuthenticatedData(user.id);

    if (renderVersion === authRenderVersion) {
      setAuthConnection("안전하게 연결됨", "success");
    }
  } catch (error) {
    console.error("사용자 데이터를 불러오지 못했습니다.", error);
    setAuthConnection("데이터 오류", "error");
  }
}

/** 현재 세션 유무에 따라 회원 폼 또는 프로필을 그립니다. */
async function renderAuthSession(session) {
  if (session?.user) {
    await renderSignedIn(session);
  } else {
    authRenderVersion += 1;
    renderSignedOut();
    setAuthConnection("Supabase 연결됨", "success");
  }
}

/** 공개 클라이언트가 준비되면 저장된 세션을 확인하고 인증 변경을 구독합니다. */
async function initializeSupabase(client) {
  if (authInitialized || !client) {
    return;
  }

  authInitialized = true;
  supabaseClient = client;
  setAuthConnection("세션 확인 중", "loading");
  setAuthBusy(true);

  // 공개 카탈로그를 실제로 읽어 프로젝트 URL·publishable key·RLS 연결을 확인합니다.
  try {
    await loadPublicCatalog();
  } catch (connectionError) {
    console.error("Supabase 데이터 연결을 확인하지 못했습니다.", connectionError);
    setAuthConnection("연결 오류", "error");
    setAuthMessage("Supabase 데이터 연결을 확인해 주세요.", "error");
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("로그인 세션을 확인하지 못했습니다.", error);
    setAuthConnection("연결 오류", "error");
    setAuthMessage("Supabase 연결을 확인해 주세요.", "error");
    return;
  }

  await renderAuthSession(data.session);
  setAuthBusy(false);

  // 콜백 안에서 다른 Supabase 요청을 바로 기다리지 않도록 다음 작업 큐에서 화면을 갱신합니다.
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => {
      renderAuthSession(session).catch((authError) => {
        console.error("인증 화면을 갱신하지 못했습니다.", authError);
        setAuthConnection("인증 오류", "error");
      });
    }, 0);
  });
}

/** 오늘 날짜를 사용자가 읽기 쉬운 한국어 형식으로 표시합니다. */
function renderTodayLabel() {
  const todayLabel = document.querySelector("[data-today-label]");
  const dateText = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date());

  todayLabel.textContent = dateText;
}

/** 포인트 숫자에 천 단위 쉼표를 넣어 읽기 쉽게 표시합니다. */
function formatPoint(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

/** 거래 한 건을 안전한 DOM 요소로 만들어 포인트 내역 목록에 표시합니다. */
function createTransactionElement(transaction) {
  const item = document.createElement("article");
  const icon = document.createElement("span");
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  const description = document.createElement("span");
  const amount = document.createElement("p");
  const isEarn = transaction.type === "earn";
  const transactionDate = new Date(transaction.createdAt);
  const dateText = Number.isNaN(transactionDate.getTime())
    ? "날짜 정보 없음"
    : new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(transactionDate);

  item.className = "transaction-item";
  item.dataset.type = transaction.type;
  icon.className = "transaction-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = isEarn ? "+" : "−";
  copy.className = "transaction-copy";
  title.textContent = transaction.title;
  description.textContent = `${transaction.description} · ${dateText}`;
  amount.className = "transaction-amount";
  amount.textContent = `${isEarn ? "+" : "−"}${formatPoint(transaction.amount)} P`;

  copy.append(title, description);
  item.append(icon, copy, amount);
  return item;
}

/** 잔액, 누적 적립·사용액, 선택한 필터의 거래내역을 지갑 화면에 그립니다. */
function renderWallet() {
  const earned = walletState.transactions
    .filter((transaction) => transaction.type === "earn")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const used = walletState.transactions
    .filter((transaction) => transaction.type === "spend")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const visibleTransactions = walletState.transactions.filter(
    (transaction) => walletFilter === "all" || transaction.type === walletFilter,
  );

  walletBalance.textContent = formatPoint(walletState.balance);
  totalEarned.textContent = formatPoint(earned);
  totalUsed.textContent = formatPoint(used);
  transactionList.replaceChildren();

  if (visibleTransactions.length === 0) {
    const emptyState = document.createElement("div");
    const emptyTitle = document.createElement("strong");
    emptyState.className = "transaction-empty";
    emptyTitle.textContent = walletFilter === "spend" ? "아직 사용한 포인트가 없어요" : "아직 포인트 내역이 없어요";
    emptyState.append(
      emptyTitle,
      document.createTextNode(
        walletFilter === "spend"
          ? "리워드 숍이 열리면 포인트 사용내역이 여기에 표시돼요."
          : "GREEN MISSION에 참여하고 첫 포인트를 모아 보세요.",
      ),
    );
    transactionList.append(emptyState);
    return;
  }

  visibleTransactions.forEach((transaction) => {
    transactionList.append(createTransactionElement(transaction));
  });
}

/** 특정 상품을 이미 구매했는지 구매내역에서 확인합니다. */
function hasPurchasedReward(productId) {
  return shopState.orders.some((order) => order.productId === productId);
}

/** 리워드 상품 카드 한 장을 만들어 카테고리별 상품 목록에 넣습니다. */
function createRewardProductElement(product) {
  const card = document.createElement("article");
  const visual = document.createElement("div");
  const category = document.createElement("span");
  const icon = document.createElement("span");
  const title = document.createElement("h3");
  const price = document.createElement("p");
  const button = document.createElement("button");
  const isPurchased = hasPurchasedReward(product.id);

  card.className = "reward-product-card";
  card.dataset.category = product.category;
  card.dataset.productId = product.id;
  card.classList.toggle("is-purchased", isPurchased);
  visual.className = "reward-product-visual";
  category.className = "reward-product-category";
  category.textContent = product.category.toUpperCase();
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = product.icon;
  title.textContent = product.name;
  price.textContent = `${formatPoint(product.price)} P`;
  button.className = "reward-product-button";
  button.type = "button";
  button.dataset.productDetail = product.id;
  button.disabled = isPurchased;
  button.textContent = isPurchased ? "구매 완료" : "상세 보기";
  button.addEventListener("click", () => openRewardDialog(product.id));

  visual.append(category, icon);
  card.append(visual, title, price, button);
  return card;
}

/** 구매내역 카드 한 장을 만듭니다. */
function createOrderElement(order) {
  const item = document.createElement("article");
  const visual = document.createElement("span");
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  const detail = document.createElement("span");
  const price = document.createElement("strong");
  const orderedAt = new Date(order.createdAt);
  const dateText = Number.isNaN(orderedAt.getTime())
    ? "날짜 정보 없음"
    : new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(orderedAt);

  item.className = "order-item";
  item.dataset.orderProductId = order.productId;
  visual.className = "order-item__visual";
  visual.setAttribute("aria-hidden", "true");
  visual.textContent = order.icon || "🎁";
  copy.className = "order-item__copy";
  title.textContent = order.productName;
  detail.textContent = `구매 완료 · ${dateText}`;
  price.textContent = `−${formatPoint(order.price)} P`;

  copy.append(title, detail);
  item.append(visual, copy, price);
  return item;
}

/** 카테고리 상품, 현재 잔액, 구매내역을 리워드 숍 화면에 함께 그립니다. */
function renderRewardShop() {
  const visibleProducts = rewardProducts.filter(
    (product) => rewardCategory === "all" || product.category === rewardCategory,
  );

  shopBalance.textContent = formatPoint(walletState.balance);
  rewardProductList.replaceChildren();
  visibleProducts.forEach((product) => {
    rewardProductList.append(createRewardProductElement(product));
  });

  orderCount.textContent = `${shopState.orders.length}개`;
  orderList.replaceChildren();

  if (shopState.orders.length === 0) {
    const emptyState = document.createElement("div");
    const emptyTitle = document.createElement("strong");
    emptyState.className = "order-empty";
    emptyTitle.textContent = "아직 구매한 리워드가 없어요";
    emptyState.append(
      emptyTitle,
      document.createTextNode("GREEN POINT로 첫 리워드를 만나 보세요."),
    );
    orderList.append(emptyState);
    return;
  }

  shopState.orders.forEach((order) => {
    orderList.append(createOrderElement(order));
  });
}

/** 상품 상세 다이얼로그를 현재 잔액과 구매 상태에 맞춰 채웁니다. */
function openRewardDialog(productId) {
  const product = rewardProducts.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const isPurchased = hasPurchasedReward(product.id);
  const remainingBalance = walletState.balance - product.price;
  selectedRewardId = product.id;
  dialogVisual.textContent = product.icon;
  dialogCategory.textContent = product.category.toUpperCase();
  dialogTitle.textContent = product.name;
  dialogDescription.textContent = product.description;
  dialogPrice.textContent = formatPoint(product.price);
  dialogRemaining.textContent = formatPoint(remainingBalance);
  dialogRemainingRow.classList.toggle("is-insufficient", remainingBalance < 0);
  purchaseMessage.hidden = true;
  purchaseMessage.dataset.tone = "";
  purchaseButton.disabled = isPurchased;
  purchaseButtonLabel.textContent = isPurchased ? "이미 구매한 상품이에요" : "포인트로 구매하기";

  if (!rewardDialog.open) {
    rewardDialog.showModal();
  }
}

/** 구매 결과나 포인트 부족 사유를 상품 상세 안에 표시합니다. */
function showPurchaseMessage(message, tone) {
  purchaseMessage.hidden = false;
  purchaseMessage.dataset.tone = tone;
  purchaseMessageText.textContent = message;
}

/** 선택한 상품을 DB 함수로 구매해 잔액·거래내역·구매내역을 원자적으로 갱신합니다. */
async function purchaseSelectedReward() {
  const product = rewardProducts.find((item) => item.id === selectedRewardId);

  if (!product) {
    return;
  }

  if (!currentUserId) {
    showPurchaseMessage("로그인 후 GREEN POINT로 상품을 구매할 수 있어요.", "danger");
    showToast("상품 구매를 위해 로그인해 주세요.");
    return;
  }

  if (hasPurchasedReward(product.id)) {
    showPurchaseMessage("이미 구매한 상품이에요. 구매내역에서 확인해 주세요.", "danger");
    purchaseButton.disabled = true;
    return;
  }

  if (walletState.balance < product.price) {
    const shortage = product.price - walletState.balance;
    showPurchaseMessage(`포인트가 ${formatPoint(shortage)} P 부족해요. 미션에 참여해 포인트를 더 모아 주세요.`, "danger");
    dialogRemainingRow.classList.add("is-insufficient");
    showToast("포인트가 부족해 상품을 구매할 수 없어요.");
    return;
  }

  purchaseButton.disabled = true;
  purchaseButtonLabel.textContent = "구매 처리 중...";

  try {
    const { data, error } = await supabaseClient.rpc("purchase_reward", {
      p_reward_id: product.databaseId,
    });

    if (error) {
      throw error;
    }

    if (!data?.ok) {
      if (data?.code === "insufficient_points") {
        showPurchaseMessage(`포인트가 ${formatPoint(Number(data.shortage || 0))} P 부족해요.`, "danger");
        dialogRemainingRow.classList.add("is-insufficient");
      } else if (data?.code === "already_purchased") {
        showPurchaseMessage("이미 구매한 상품이에요. 구매내역에서 확인해 주세요.", "danger");
      } else if (data?.code === "out_of_stock") {
        showPurchaseMessage("상품 재고가 모두 소진됐어요.", "danger");
      } else {
        showPurchaseMessage("현재 상품을 구매할 수 없어요. 잠시 뒤 다시 시도해 주세요.", "danger");
      }
      return;
    }

    await loadAuthenticatedData(currentUserId);
    dialogRemaining.textContent = formatPoint(walletState.balance);
    dialogRemainingRow.classList.remove("is-insufficient");
    purchaseButtonLabel.textContent = "구매 완료";
    showPurchaseMessage("구매가 완료됐어요! 구매내역과 GREEN WALLET에 반영됐어요.", "success");
    showToast(`${product.name} 구매를 완료했어요.`);
  } catch (error) {
    console.error("리워드 구매를 처리하지 못했습니다.", error);
    showPurchaseMessage("구매 처리 중 오류가 발생했어요. 다시 시도해 주세요.", "danger");
  } finally {
    const purchased = hasPurchasedReward(product.id);
    purchaseButton.disabled = purchased;
    purchaseButtonLabel.textContent = purchased ? "구매 완료" : "포인트로 구매하기";
  }
}

/** 현재 에어컨 상태가 미션 성공 조건을 위반하는지 확인합니다. */
function getMissionViolation() {
  if (airconState.sensorStatus === "error") {
    return "센서 오류로 냉방 상태를 확인할 수 없어요. 정상 상태로 바꿔 주세요.";
  }

  if (!airconState.power) {
    return "에어컨 전원이 꺼져 있어요. 전원을 켠 뒤 다시 진행해 주세요.";
  }

  if (airconState.mode !== "cool") {
    return "미션 조건 위반: 운전 모드를 냉방으로 설정해 주세요.";
  }

  const minimumTemperature = currentMission?.minTemperature || 26;

  if (airconState.temperature < minimumTemperature) {
    return `미션 조건 위반: 설정 온도를 ${minimumTemperature}℃ 이상으로 올려 주세요.`;
  }

  return "";
}

/** 에어컨의 센서와 필터 상태를 정상, 주의, 오류 중 하나로 계산합니다. */
function getAirconHealth() {
  if (airconState.sensorStatus === "error") {
    return "error";
  }

  if (airconState.filterPercent < 30) {
    return "warning";
  }

  return "normal";
}

/** 가상 에어컨 데이터를 상태 카드와 홈 요약 카드에 반영합니다. */
function renderAircon() {
  const health = getAirconHealth();
  const hasSensorError = health === "error";
  const needsFilterService = health === "warning";
  const visibleTemperature = hasSensorError ? "--" : airconState.temperature;

  airconCard.dataset.health = health;
  airconCard.classList.toggle("is-off", !airconState.power);
  temperatureLabel.textContent = visibleTemperature;
  controlTemperature.textContent = airconState.temperature;
  powerLabel.textContent = airconState.power ? "ON" : "OFF";
  modeLabel.textContent = hasSensorError ? "확인 불가" : modeNames[airconState.mode];
  fanLabel.textContent = hasSensorError ? "확인 불가" : fanNames[airconState.fan];
  usageLabel.textContent = `${airconState.usageMinutes}분`;
  filterLabel.textContent = needsFilterService
    ? `점검 필요 ${airconState.filterPercent}%`
    : `깨끗함 ${airconState.filterPercent}%`;

  powerButton.classList.toggle("is-on", airconState.power);
  powerButton.setAttribute("aria-pressed", String(airconState.power));
  powerButton.setAttribute("aria-label", `에어컨 전원 ${airconState.power ? "끄기" : "켜기"}`);

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.mode === airconState.mode);
  });

  document.querySelectorAll("[data-fan]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.fan === airconState.fan);
  });

  document.querySelectorAll("button[data-health]").forEach((button) => {
    const selectedHealth = hasSensorError
      ? "sensor"
      : needsFilterService
        ? "filter"
        : "normal";
    button.classList.toggle("is-selected", button.dataset.health === selectedHealth);
  });

  airconStatusBadge.classList.toggle("is-danger", health !== "normal");
  homeAirconStatus.classList.toggle("is-danger", health !== "normal");
  deviceAlert.hidden = health === "normal";

  if (hasSensorError) {
    airconStatusBadge.textContent = "센서 오류";
    airconConnection.textContent = "온도 센서 연결을 확인해 주세요";
    deviceAlertText.textContent = "센서 오류가 감지됐어요. 미션 진행 전에 정상 상태로 복구해 주세요.";
    homeAirconStatus.textContent = "센서 오류";
    homeAirconDetail.textContent = "상태 정보를 확인할 수 없어요";
  } else if (needsFilterService) {
    airconStatusBadge.textContent = "필터 점검 필요";
    airconConnection.textContent = "필터 상태를 확인해 주세요";
    deviceAlertText.textContent = `필터 잔량이 ${airconState.filterPercent}%예요. 깨끗한 냉방을 위해 점검이 필요해요.`;
    homeAirconStatus.textContent = "필터 점검 필요";
    homeAirconDetail.textContent = `필터 잔량 ${airconState.filterPercent}%`;
  } else {
    airconStatusBadge.textContent = airconState.power ? "정상 운전" : "전원 꺼짐";
    airconConnection.textContent = "센서 연결 정상";
    homeAirconStatus.textContent = airconState.power ? "정상 운전" : "전원 꺼짐";
    homeAirconDetail.textContent = `${modeNames[airconState.mode]} ${airconState.temperature}℃ · 사용 ${airconState.usageMinutes}분`;
  }
}

/**
 * 조작 직후 미션 조건을 확인해 사용자에게 미리 경고합니다.
 * 실제 실패 판정은 사용자가 +30분 버튼을 눌러 시간을 진행할 때만 이루어집니다.
 */
function syncMissionWarning() {
  if (missionState.status !== "active") {
    return;
  }

  const violation = getMissionViolation();

  if (violation) {
    missionState.message = violation;
    missionState.messageTone = "warning";
  } else if (missionState.messageTone === "warning") {
    missionState.message = "조건이 다시 정상이에요. +30분 버튼으로 미션을 계속해 보세요.";
    missionState.messageTone = "info";
  }
}

/** 미션 상태를 카드, 진행률, 버튼, 홈 요약에 동시에 반영합니다. */
function renderMission() {
  const progress = Math.min(
    100,
    Math.round((missionState.elapsedMinutes / missionState.targetMinutes) * 100),
  );
  const isReady = missionState.status === "ready";
  const isActive = missionState.status === "active";
  const isSuccess = missionState.status === "success";
  const isFailed = missionState.status === "failed";
  const activeViolation = isActive ? getMissionViolation() : "";

  missionCard.dataset.status = missionState.status;
  missionCard.classList.toggle("has-warning", Boolean(activeViolation));
  homeMissionStatus.classList.toggle("is-danger", isFailed || Boolean(activeViolation));
  homeMissionStatus.classList.toggle("is-success", isSuccess);
  missionProgress.hidden = isReady;
  missionStartButton.disabled = isActive || isSuccess;

  if (isReady) {
    missionBadge.textContent = "참여 가능";
    missionStartLabel.textContent = "미션 참여하기";
    homeMissionStatus.textContent = "참여 가능";
    homeMissionDetail.textContent = weatherRecommendation?.homeDetail || "26℃ 냉방 미션이 열렸어요";
    progressDescription.textContent = "에어컨 시뮬레이션 대기";
  } else if (isActive) {
    missionBadge.textContent = "진행 중";
    missionStartLabel.textContent = "미션 진행 중";
    homeMissionStatus.textContent = "진행 중";
    homeMissionDetail.textContent = `${missionState.elapsedMinutes}분 / ${missionState.targetMinutes}분 진행했어요`;
    progressDescription.textContent = "조건을 유지하고 시간을 진행해 주세요";
  } else if (isSuccess) {
    missionBadge.textContent = "미션 성공";
    missionStartLabel.textContent = `${currentMission?.rewardPoints || DAILY_MISSION_REWARD} GREEN POINT 지급 완료`;
    homeMissionStatus.textContent = "미션 성공";
    homeMissionDetail.textContent = `${currentMission?.rewardPoints || DAILY_MISSION_REWARD} P가 지갑에 적립됐어요`;
    progressDescription.textContent = "목표 시간을 모두 채웠어요";
  } else if (isFailed) {
    missionBadge.textContent = "미션 실패";
    missionStartLabel.textContent = "다시 참여하기";
    homeMissionStatus.textContent = "미션 실패";
    homeMissionDetail.textContent = "조건을 고친 뒤 다시 도전해 보세요";
    progressDescription.textContent = "조건 위반으로 미션이 종료됐어요";
  }

  progressLabel.textContent = `${progress}%`;
  progressTrack.setAttribute("aria-valuenow", String(progress));
  progressBar.style.width = `${progress}%`;
  progressMinutes.textContent = `${missionState.elapsedMinutes}분`;

  missionMessage.hidden = !missionState.message;
  missionMessage.dataset.tone = missionState.messageTone;
  missionMessageText.textContent = missionState.message;

  // 실패 상태에만 Red를 사용하고, 성공 상태는 Green으로 표현합니다.
  if (isFailed) {
    missionMessage.dataset.tone = "warning";
  }
}

/** 가상 에어컨과 미션 화면을 함께 갱신해 두 상태가 항상 일치하도록 합니다. */
function renderSimulation() {
  renderAircon();
  syncMissionWarning();
  renderMission();
  renderWallet();
  renderRewardShop();
}

/** URL의 해시 값에 맞는 화면 하나만 표시합니다. */
function renderScreen(route) {
  const availableRoutes = navigationItems.map((item) => item.dataset.route);
  const safeRoute = availableRoutes.includes(route) ? route : "home";

  screens.forEach((screen) => {
    const isCurrentScreen = screen.dataset.screen === safeRoute;
    screen.hidden = !isCurrentScreen;
    screen.classList.toggle("is-active", isCurrentScreen);
  });

  navigationItems.forEach((item) => {
    const isCurrentItem = item.dataset.route === safeRoute;
    item.classList.toggle("is-active", isCurrentItem);

    if (isCurrentItem) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** 주소 표시줄의 #home, #mission 같은 값을 읽어 현재 화면을 정합니다. */
function getRouteFromHash() {
  return window.location.hash.replace("#", "") || "home";
}

/** 에어컨 조작 후 화면과 미션 경고를 함께 갱신합니다. */
function handleAirconChange(message) {
  saveAppState();
  renderSimulation();
  showToast(message);
}

/** 사용자별 DB 기록이 필요한 기능은 로그인 후에만 실행합니다. */
function requireSignedIn(message = "이 기능을 사용하려면 로그인해 주세요.") {
  if (currentUserId) {
    return true;
  }

  showToast(message);
  window.location.hash = "my";
  return false;
}

window.addEventListener("hashchange", () => {
  renderScreen(getRouteFromHash());
});

// Supabase 모듈은 네트워크로 불러오므로 준비 시점이 달라도 놓치지 않게 이벤트와 현재 값을 함께 확인합니다.
window.addEventListener("greenon:supabase-ready", (event) => {
  initializeSupabase(event.detail.client);
});

window.addEventListener("greenon:supabase-error", () => {
  setAuthConnection("연결 오류", "error");
  setAuthMessage("Supabase 클라이언트를 불러오지 못했어요. 네트워크 연결을 확인해 주세요.", "error");
  setAuthBusy(true);
});

document.querySelectorAll("[data-auth-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode);
  });
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!supabaseClient || !authForm.reportValidity()) {
    return;
  }

  const formData = new FormData(authForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const displayName = String(formData.get("displayName") || "").trim();

  setAuthMessage();
  setAuthBusy(true);

  try {
    if (authMode === "signup") {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        await renderAuthSession(data.session);
        showToast("GreenON 회원가입과 로그인이 완료됐어요.");
      } else {
        setAuthMessage("인증 메일을 보냈어요. 메일의 확인 링크를 누른 뒤 로그인해 주세요.", "success");
        showToast("인증 메일을 확인해 주세요.");
      }
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      await renderAuthSession(data.session);
      showToast("반가워요! GreenON에 로그인했어요.");
    }
  } catch (error) {
    console.error("인증 요청을 처리하지 못했습니다.", error);
    setAuthMessage(getFriendlyAuthError(error), "error");
  } finally {
    setAuthBusy(false);
  }
});

logoutButton.addEventListener("click", async () => {
  if (!supabaseClient) {
    return;
  }

  logoutButton.disabled = true;
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("로그아웃하지 못했습니다.", error);
    setAuthConnection("로그아웃 오류", "error");
    logoutButton.disabled = false;
    return;
  }

  renderSignedOut();
  setAuthConnection("Supabase 연결됨", "success");
  showToast("안전하게 로그아웃했어요.");
});

document.querySelector("[data-explore-button]").addEventListener("click", () => {
  window.location.hash = "mission";
});

document.querySelector("[data-notification-button]").addEventListener("click", () => {
  showToast("가상 에어컨 상태와 미션 진행 소식을 여기에서 확인할 수 있어요.");
});

weatherRefreshButton.addEventListener("click", () => {
  refreshCurrentWeather();
});

// 전체·적립·사용 버튼을 누르면 거래 원본은 바꾸지 않고 보이는 목록만 필터링합니다.
document.querySelectorAll("[data-wallet-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    walletFilter = button.dataset.walletFilter;

    document.querySelectorAll("[data-wallet-filter]").forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("is-selected", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    renderWallet();
  });
});

// 리워드 카테고리 버튼은 상품 원본을 바꾸지 않고 화면에 보일 상품만 선택합니다.
document.querySelectorAll("[data-reward-category]").forEach((button) => {
  button.addEventListener("click", () => {
    rewardCategory = button.dataset.rewardCategory;

    document.querySelectorAll("[data-reward-category]").forEach((categoryButton) => {
      const isSelected = categoryButton === button;
      categoryButton.classList.toggle("is-selected", isSelected);
      categoryButton.setAttribute("aria-pressed", String(isSelected));
    });

    renderRewardShop();
  });
});

document.querySelector("[data-reward-close]").addEventListener("click", () => {
  rewardDialog.close();
});

// 다이얼로그 바깥의 어두운 영역을 눌러도 상품 상세가 닫히게 합니다.
rewardDialog.addEventListener("click", (event) => {
  if (event.target === rewardDialog) {
    rewardDialog.close();
  }
});

purchaseButton.addEventListener("click", purchaseSelectedReward);

// 참여 또는 재도전은 DB 함수로 생성해 같은 날짜의 미션 기록이 중복되지 않게 합니다.
missionStartButton.addEventListener("click", async () => {
  if (!requireSignedIn("미션에 참여하려면 먼저 로그인해 주세요.")) {
    return;
  }

  if (missionState.status === "active" || missionState.status === "success") {
    return;
  }

  if (!currentMission) {
    showToast("오늘의 미션 정보를 불러오는 중이에요.");
    return;
  }

  missionStartButton.disabled = true;

  try {
    const { data, error } = await supabaseClient.rpc("start_daily_mission", {
      p_mission_id: currentMission.id,
    });

    if (error) {
      throw error;
    }

    if (!data?.ok) {
      throw new Error(data?.code || "mission_unavailable");
    }

    missionState.status = data.status;
    missionState.elapsedMinutes = Number(data.progress_minutes || 0);
    missionState.targetMinutes = Number(data.target_minutes || currentMission.targetMinutes);
    missionState.message = data.status === "success"
      ? "오늘 미션 보상은 이미 지급됐어요."
      : "미션을 시작했어요. 홈의 에어컨 패널에서 +30분을 눌러 보세요.";
    missionState.messageTone = data.status === "success" ? "success" : "info";
    renderSimulation();
    showToast(data.status === "success" ? "오늘의 미션을 이미 완료했어요." : "미션을 시작했어요!");
  } catch (error) {
    console.error("미션 참여를 저장하지 못했습니다.", error);
    missionState.message = "미션 참여를 저장하지 못했어요. 다시 시도해 주세요.";
    missionState.messageTone = "warning";
    renderMission();
  } finally {
    missionStartButton.disabled = missionState.status === "active" || missionState.status === "success";
  }
});

powerButton.addEventListener("click", () => {
  if (!requireSignedIn("에어컨을 조작하려면 먼저 로그인해 주세요.")) {
    return;
  }
  airconState.power = !airconState.power;
  handleAirconChange(`에어컨 전원을 ${airconState.power ? "켰어요" : "껐어요"}.`);
});

document.querySelector("[data-temperature-down]").addEventListener("click", () => {
  if (!requireSignedIn("에어컨을 조작하려면 먼저 로그인해 주세요.")) {
    return;
  }
  airconState.temperature = Math.max(18, airconState.temperature - 1);
  handleAirconChange(`설정 온도를 ${airconState.temperature}℃로 낮췄어요.`);
});

document.querySelector("[data-temperature-up]").addEventListener("click", () => {
  if (!requireSignedIn("에어컨을 조작하려면 먼저 로그인해 주세요.")) {
    return;
  }
  airconState.temperature = Math.min(30, airconState.temperature + 1);
  handleAirconChange(`설정 온도를 ${airconState.temperature}℃로 높였어요.`);
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireSignedIn("에어컨을 조작하려면 먼저 로그인해 주세요.")) {
      return;
    }
    airconState.mode = button.dataset.mode;
    handleAirconChange(`운전 모드를 ${modeNames[airconState.mode]}으로 바꿨어요.`);
  });
});

document.querySelectorAll("[data-fan]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireSignedIn("에어컨을 조작하려면 먼저 로그인해 주세요.")) {
      return;
    }
    airconState.fan = button.dataset.fan;
    handleAirconChange(`바람 세기를 ${fanNames[airconState.fan]}으로 바꿨어요.`);
  });
});

// 정상, 필터 점검, 센서 오류 버튼으로 실제 API 없이 비정상 상태를 재현합니다.
document.querySelectorAll("button[data-health]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireSignedIn("기기 상태를 바꾸려면 먼저 로그인해 주세요.")) {
      return;
    }
    const health = button.dataset.health;

    if (health === "normal") {
      airconState.sensorStatus = "normal";
      airconState.filterPercent = 92;
      handleAirconChange("에어컨 상태를 정상으로 복구했어요.");
    } else if (health === "filter") {
      airconState.sensorStatus = "normal";
      airconState.filterPercent = 18;
      handleAirconChange("필터 점검 필요 상태를 시뮬레이션했어요.");
    } else {
      airconState.sensorStatus = "error";
      handleAirconChange("센서 오류 상태를 시뮬레이션했어요.");
    }
  });
});

// +30분 진행은 최신 에어컨 상태를 저장한 뒤 DB가 미션 성공 조건과 보상 지급을 판정합니다.
document.querySelector("[data-advance-time]").addEventListener("click", async (event) => {
  if (!requireSignedIn("시간 시뮬레이션을 진행하려면 먼저 로그인해 주세요.")) {
    return;
  }

  const advanceButton = event.currentTarget;
  advanceButton.disabled = true;

  if (airconState.power) {
    airconState.usageMinutes += 30;
    airconState.filterPercent = Math.max(0, airconState.filterPercent - 1);
  }

  if (missionState.status !== "active") {
    try {
      await flushAirconState();
      renderSimulation();
      showToast("에어컨 사용시간만 30분 진행했어요. 미션 참여 후 다시 눌러 보세요.");
    } catch (error) {
      console.error("에어컨 사용시간을 저장하지 못했습니다.", error);
      showToast("사용시간 저장에 실패했어요.");
    } finally {
      advanceButton.disabled = false;
    }
    return;
  }

  try {
    await flushAirconState();
    const { data, error } = await supabaseClient.rpc("advance_daily_mission", {
      p_mission_id: currentMission.id,
      p_increment_minutes: 30,
    });

    if (error) {
      throw error;
    }

    if (!data?.ok) {
      throw new Error(data?.code || "mission_progress_failed");
    }

    missionState.status = data.status;
    missionState.elapsedMinutes = Number(data.progress_minutes || 0);
    missionState.targetMinutes = Number(data.target_minutes || currentMission.targetMinutes);

    if (data.status === "failed") {
      missionState.message = data.reason || "미션 조건을 지키지 못했어요.";
      missionState.messageTone = "warning";
      showToast("미션 조건을 지키지 못해 이번 도전이 종료됐어요.");
    } else if (data.status === "success") {
      await loadAuthenticatedData(currentUserId);
      missionState.message = data.reward_awarded
        ? `미션 성공! ${formatPoint(Number(data.reward_points || DAILY_MISSION_REWARD))} GREEN POINT가 적립됐어요.`
        : "미션 성공 보상은 오늘 이미 지급됐어요.";
      missionState.messageTone = "success";
      showToast("축하해요! 60분 친환경 냉방 미션에 성공했어요.");
    } else {
      missionState.message = "조건을 잘 지키고 있어요. 30분만 더 유지해 주세요.";
      missionState.messageTone = "info";
      showToast("미션 시간이 30분 진행됐어요.");
    }

    renderSimulation();
  } catch (error) {
    console.error("미션 진행을 저장하지 못했습니다.", error);
    missionState.message = "미션 진행 저장 중 오류가 발생했어요. 다시 시도해 주세요.";
    missionState.messageTone = "warning";
    renderMission();
  } finally {
    advanceButton.disabled = false;
  }
});

// 첫 화면을 그립니다.
renderTodayLabel();
refreshCurrentWeather();

// Supabase 연결 전에는 인증 버튼을 잠그고, 이미 준비됐다면 즉시 세션 확인을 시작합니다.
setAuthBusy(true);

if (window.greenOnSupabase) {
  initializeSupabase(window.greenOnSupabase);
} else if (window.greenOnSupabaseError) {
  setAuthConnection("연결 오류", "error");
  setAuthMessage("Supabase 클라이언트를 불러오지 못했어요. 네트워크 연결을 확인해 주세요.", "error");
}

renderSimulation();
renderScreen(getRouteFromHash());
