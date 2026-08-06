/* ==========================================================================
   모여라 - account.js
   [대표 계좌 관리] 화면 렌더링/이벤트 (은행 선택, 계좌 실명 확인, 저장하기)
   ========================================================================== */

const ICON_BANK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 12 4l9 6"/><path d="M4.5 10.5v8M9 10.5v8M15 10.5v8M19.5 10.5v8"/><path d="M3 20h18"/></svg>';
const ICON_WALLET = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4Z" /></svg>';
const ICON_CHEVRON_DOWN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const ICON_CHECK_CIRCLE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';

let isVerified = false;

function renderCurrentAccount(account) {
  document.getElementById('currentBankName').textContent = account.bankName;
  document.getElementById('currentAccountNumber').textContent = account.accountNumberMasked;
}

function renderBankOptions(bankOptions, selectedBank) {
  const select = document.getElementById('bankSelect');
  const placeholder = '<option value="" disabled selected>은행을 선택해 주세요</option>';
  const options = bankOptions.map((bank) => `<option value="${bank}">${bank}</option>`).join('');
  select.innerHTML = placeholder + options;
  if (selectedBank) select.value = selectedBank;
}

function updateVerifyButtonState() {
  const input = document.getElementById('accountNumberInput');
  const verifyBtn = document.getElementById('verifyBtn');
  verifyBtn.disabled = input.value.trim().length < 4;
}

function handleVerify() {
  const verifyBtn = document.getElementById('verifyBtn');
  isVerified = true;
  verifyBtn.textContent = '확인 완료';
  verifyBtn.classList.add('is-verified');
  verifyBtn.disabled = true;
  document.getElementById('accountNumberInput').disabled = true;
}

function handleSave() {
  const bank = document.getElementById('bankSelect').value;
  const accountNumber = document.getElementById('accountNumberInput').value.trim();
  const holderName = document.getElementById('holderNameInput').value.trim();

  if (!bank || !accountNumber || !isVerified || !holderName) {
    console.info('은행 선택, 계좌 실명 확인, 예금주 입력을 모두 완료해주세요.');
    return;
  }

  window.MoyoraData.updatePayoutAccount({
    bankName: bank,
    accountNumberMasked: accountNumber,
    holderName
  });

  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'option.html';
  }
}

function initAccountScreen() {
  const account = window.MoyoraData.getPayoutAccount();
  const bankOptions = window.MoyoraData.getBankOptions();

  document.getElementById('introIcon').innerHTML = ICON_BANK;
  document.getElementById('cardIconSlot').innerHTML = ICON_WALLET;
  document.getElementById('numberIconSlot').innerHTML = '123';
  document.getElementById('selectChevron').innerHTML = ICON_CHEVRON_DOWN;
  document.getElementById('saveCheckIcon').innerHTML = ICON_CHECK_CIRCLE;

  renderCurrentAccount(account);
  renderBankOptions(bankOptions, account.bankName);

  document.getElementById('accountNumberInput').addEventListener('input', updateVerifyButtonState);
  document.getElementById('verifyBtn').addEventListener('click', handleVerify);
  document.getElementById('saveBtn').addEventListener('click', handleSave);

  document.getElementById('changeBtn').addEventListener('click', () => {
    document.getElementById('bankSelect').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('backBtn').addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'option.html';
    }
  });
}

document.addEventListener('DOMContentLoaded', initAccountScreen);
