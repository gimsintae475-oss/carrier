/**
 * Motion 공식 JavaScript 라이브러리를 이용한 봄 정원 애니메이션입니다.
 * 핵심 기능은 app.js에 그대로 두고, 이 파일은 장식적인 움직임만 담당합니다.
 * 라이브러리를 불러오지 못해도 앱 기능은 멈추지 않도록 동적 import와 예외 처리를 사용합니다.
 */

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

/** 현재 표시된 화면의 주요 블록을 꽃잎처럼 순서대로 나타냅니다. */
function revealScreen(animate, stagger, route) {
  const screen = document.querySelector(`[data-screen="${route}"]`);

  if (!screen || screen.hidden) {
    return;
  }

  const blocks = [...screen.children].filter((element) => element instanceof HTMLElement);

  animate(
    blocks,
    { opacity: [0, 1], y: [10, 0] },
    {
      duration: 0.45,
      delay: stagger(0.045),
      ease: [0.22, 1, 0.36, 1],
    },
  );
}

async function startSpringMotion() {
  if (reducedMotionQuery.matches) {
    document.documentElement.dataset.motion = "reduced";
    return;
  }

  try {
    // 버전을 고정해 디자인이 예기치 않게 바뀌지 않도록 합니다.
    const { animate, stagger } = await import("https://cdn.jsdelivr.net/npm/motion@12.43.0/+esm");
    document.documentElement.dataset.motion = "ready";

    // Motion 문서의 animate + stagger 패턴을 홈 화면 진입 효과에 적용합니다.
    animate(
      ".motion-reveal",
      { opacity: [0, 1], y: [16, 0] },
      {
        duration: 0.68,
        delay: stagger(0.09),
        ease: [0.22, 1, 0.36, 1],
      },
    );

    // 보미는 바람에 살짝 떠 있는 듯 천천히 움직입니다.
    animate(
      ".bomi-character",
      { y: [0, -8, 0], rotate: [-2, 0.7, -2] },
      { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
    );

    // 꽃과 구름의 시작 시간을 서로 다르게 하여 기계적인 반복감을 줄입니다.
    animate(
      ".hero-bloom",
      { y: [0, -4, 0], rotate: [-3, 4, -3] },
      {
        duration: 3.2,
        repeat: Infinity,
        delay: stagger(0.18),
        ease: "easeInOut",
      },
    );
    animate(
      ".hero-cloud",
      { x: [-9, 12, -9], y: [0, 3, 0] },
      {
        duration: 8,
        repeat: Infinity,
        delay: stagger(0.8),
        ease: "easeInOut",
      },
    );

    // 하단 메뉴로 화면을 바꿀 때마다 새 화면의 카드가 차례로 나타납니다.
    document.querySelectorAll("[data-route]").forEach((link) => {
      link.addEventListener("click", () => {
        window.setTimeout(() => revealScreen(animate, stagger, link.dataset.route), 30);
      });
    });
  } catch (error) {
    // CDN 장애 시 애니메이션만 생략하며 미션·포인트 등 앱 기능은 그대로 사용할 수 있습니다.
    console.info("봄 정원 Motion 효과를 불러오지 못해 기본 화면으로 표시합니다.", error);
    document.documentElement.dataset.motion = "fallback";
  }
}

startSpringMotion();
