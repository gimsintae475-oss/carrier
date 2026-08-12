// Carrier GreenON 날씨 연결 모듈입니다.
// 화면 코드는 공급자별 응답 형식을 몰라도 되도록 공통 데이터 형태로 변환해 전달합니다.
(function createWeatherService() {
  const weatherConfig = window.GREENON_CONFIG?.weather || {};

  // 외부 API가 잠시 응답하지 않아도 화면과 미션 안내를 확인할 수 있는 안전한 샘플입니다.
  const SAMPLE_WEATHER = Object.freeze({
    locationName: weatherConfig.locationName || "서울특별시",
    temperature: 31,
    apparentTemperature: 33,
    humidity: 68,
    weatherCode: 1,
    observedAt: new Date().toISOString(),
    source: "sample",
    condition: "대체로 맑음",
    icon: "🌤️",
  });

  /** WMO 날씨 코드를 사용자가 이해하기 쉬운 이름과 아이콘으로 바꿉니다. */
  function getWeatherCodeInfo(code) {
    if (code === 0) return { condition: "맑음", icon: "☀️", group: "clear" };
    if ([1, 2, 3].includes(code)) return { condition: "구름 조금", icon: "🌤️", group: "cloud" };
    if ([45, 48].includes(code)) return { condition: "안개", icon: "🌫️", group: "fog" };
    if (code >= 51 && code <= 57) return { condition: "이슬비", icon: "🌦️", group: "rain" };
    if (code >= 61 && code <= 67) return { condition: "비", icon: "🌧️", group: "rain" };
    if (code >= 71 && code <= 77) return { condition: "눈", icon: "🌨️", group: "snow" };
    if (code >= 80 && code <= 82) return { condition: "소나기", icon: "🌦️", group: "rain" };
    if (code >= 85 && code <= 86) return { condition: "눈 소나기", icon: "🌨️", group: "snow" };
    if (code >= 95) return { condition: "뇌우", icon: "⛈️", group: "storm" };
    return { condition: "날씨 정보", icon: "⛅", group: "unknown" };
  }

  /** 현재 기온·습도에 맞는 친환경 냉방 미션 설명을 고릅니다. */
  function getMissionRecommendation(weather) {
    const info = getWeatherCodeInfo(Number(weather.weatherCode));

    if (["rain", "storm"].includes(info.group)) {
      return {
        type: "rainy",
        title: "비 오는 날 효율 냉방",
        description: "습기가 많은 날이에요. 문을 닫고 26℃ 이상 냉방을 유지해 에너지 낭비를 줄여 보세요.",
        homeDetail: "비 오는 날 맞춤 26℃ 냉방 미션",
        icon: "🌧️",
      };
    }

    if (Number(weather.temperature) >= 30) {
      return {
        type: "hot",
        title: "폭염 절전 냉방 미션",
        description: "바깥이 30℃ 이상이에요. 설정 온도를 과도하게 낮추지 말고 26℃ 이상을 유지해 주세요.",
        homeDetail: "더운 날 맞춤 26℃ 절전 미션",
        icon: "☀️",
      };
    }

    if (Number(weather.humidity) >= 70) {
      return {
        type: "humid",
        title: "고습도 효율 냉방 미션",
        description: "습도가 높은 날이에요. 문을 닫고 냉방 운전을 유지해 쾌적함과 절전을 함께 챙겨요.",
        homeDetail: "습한 날 맞춤 효율 냉방 미션",
        icon: "💧",
      };
    }

    return {
      type: "mild",
      title: "쾌적한 적정온도 미션",
      description: "비교적 쾌적한 날이에요. 26℃ 이상 냉방으로 시원함과 절전을 함께 지켜 주세요.",
      homeDetail: "쾌적한 날 26℃ 냉방 미션",
      icon: "🍃",
    };
  }

  /** Open-Meteo의 current 응답을 GreenON 공통 날씨 데이터로 변환합니다. */
  async function fetchOpenMeteo() {
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      Number(weatherConfig.timeoutMs) || 6000,
    );
    const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
    endpoint.searchParams.set("latitude", String(weatherConfig.latitude || 37.5665));
    endpoint.searchParams.set("longitude", String(weatherConfig.longitude || 126.978));
    endpoint.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
    );
    endpoint.searchParams.set("timezone", weatherConfig.timezone || "Asia/Seoul");
    endpoint.searchParams.set("forecast_days", "1");

    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`날씨 API 응답 오류: ${response.status}`);
      }

      const payload = await response.json();
      const current = payload.current;
      const temperature = Number(current?.temperature_2m);
      const humidity = Number(current?.relative_humidity_2m);
      const weatherCode = Number(current?.weather_code);

      if (!Number.isFinite(temperature) || !Number.isFinite(humidity) || !Number.isFinite(weatherCode)) {
        throw new Error("날씨 API 데이터 형식이 올바르지 않습니다.");
      }

      const info = getWeatherCodeInfo(weatherCode);
      return {
        locationName: weatherConfig.locationName || "서울특별시",
        temperature,
        apparentTemperature: Number(current.apparent_temperature),
        humidity,
        weatherCode,
        observedAt: current.time || new Date().toISOString(),
        source: "live",
        condition: info.condition,
        icon: info.icon,
      };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  /** 설정된 공급자를 호출하고, 실패하면 오류 정보와 함께 샘플 날씨를 반환합니다. */
  async function getCurrentWeather() {
    try {
      if (weatherConfig.provider !== "open-meteo") {
        throw new Error("지원하지 않는 날씨 공급자입니다.");
      }

      return await fetchOpenMeteo();
    } catch (error) {
      console.error("실시간 날씨를 불러오지 못해 샘플 데이터를 사용합니다.", error);
      return {
        ...SAMPLE_WEATHER,
        observedAt: new Date().toISOString(),
        errorMessage: "실시간 날씨 연결에 실패해 샘플 날씨를 표시하고 있어요.",
      };
    }
  }

  window.greenOnWeather = Object.freeze({
    getCurrentWeather,
    getMissionRecommendation,
    getSampleWeather: () => ({ ...SAMPLE_WEATHER }),
  });
})();
