# UI·애니메이션 적용 참고

## Motion for JavaScript

- 공식 사이트: https://motion.dev/
- `animate` 문서: https://motion.dev/docs/animate
- `stagger` 문서: https://motion.dev/docs/stagger
- 사용 버전: `motion@12.43.0` (MIT License)

## 실제 적용 위치

`motion-enhancements.js`에서 공식 문서의 `animate()`와 `stagger()` 조합을 다음 영역에 적용했습니다.

- 홈 진입 시 제목·보미 히어로를 순차적으로 표시
- 보미 캐릭터가 바람을 타듯 천천히 위아래로 움직이는 효과
- 히어로 카드 안의 꽃과 구름이 서로 다른 시간차로 움직이는 효과
- 하단 Navigation으로 화면을 전환할 때 카드가 차례로 나타나는 효과

사용자가 운영체제에서 동작 줄이기를 설정한 경우 애니메이션을 실행하지 않습니다. CDN을 불러오지 못한 경우에도 `app.js`의 에어컨·미션·포인트·리워드 기능은 독립적으로 계속 작동합니다.
