/* ==========================================================================
   모여라 - camera.js (영수증 QR 카메라 모달)
   ========================================================================== */

function bindCloseButton() {
  const closeBtn = document.getElementById('cameraCloseBtn');
  if (!closeBtn) return;
  closeBtn.addEventListener('click', () => {
    window.location.href = 'calculate.html';
  });
}

function bindFlashlightToggle() {
  const btn = document.getElementById('flashlightBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('is-on');
    // 실제 손전등 제어는 getUserMedia의 torch 트랙 제약(ImageCapture)과 연결 예정
  });
}

function bindManualInput() {
  const btn = document.getElementById('manualInputBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    console.info('영수증 직접 입력 화면으로 전환될 예정입니다.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindCloseButton();
  bindFlashlightToggle();
  bindManualInput();
});
