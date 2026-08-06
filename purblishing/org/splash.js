/* =========================================
   모여라 - splash.js (스플래시 화면)
   로고 노출 후 자동으로 메인(index.html) 전환
   ========================================= */

(function () {
  const SPLASH_DURATION = 1800; // ms
  const FADE_DURATION = 350; // ms

  function goToMain() {
    const screen = document.getElementById('screen-splash');
    if (screen) {
      screen.classList.add('fade-out');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, FADE_DURATION);
  }

  function init() {
    setTimeout(goToMain, SPLASH_DURATION);

    // 사용자가 탭하면 바로 넘어갈 수 있도록 허용
    document.addEventListener('click', goToMain, { once: true });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
