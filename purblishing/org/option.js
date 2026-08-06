/* ==========================================================================
   모여라 - option.js (환경 설정 화면)
   ========================================================================== */

const OPTION_ICONS = {
  person: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7"/></svg>',
  lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/></svg>',
  bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5c0-3.6-2.7-6.5-6-6.5s-6 2.9-6 6.5c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5Z"/><path d="M10.5 19.5a1.7 1.7 0 0 0 3 0"/></svg>',
  globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.3 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.3-3.5-8.5s1.2-6.1 3.5-8.5Z"/></svg>',
  bank: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9.5 12 4l8.5 5.5"/><path d="M4.5 9.5h15V19h-15z"/><path d="M4 19h16M8 9.5V19M12 9.5V19M16 9.5V19"/></svg>',
  doc: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="3.5" width="13" height="17" rx="1.5"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5"/></svg>',
  logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3"/><path d="M13.5 8 18 12l-4.5 4M18 12H9"/></svg>',
  chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l7 7 7-7"/></svg>'
};



function renderOptionProfile() {
  const profile = MoyoraData.getProfile();
  const el = document.getElementById('optionProfileCard');
  const avatarHtml = profile.profileImage
    ? `<img src="${profile.profileImage}" alt="${profile.name}" class="option-profile-card__avatar-img">`
    : `${MoyoraCommon.getInitial(profile.name)}`;

  el.innerHTML = `
    <div class="avatar option-profile-card__avatar" style="background:${profile.profileImage ? 'transparent' : MoyoraCommon.getAvatarColor(profile.avatarColor)}">
      ${avatarHtml}
    </div>
    <div class="option-profile-card__body">
      <p class="option-profile-card__name">${profile.name} 님</p>
      <p class="option-profile-card__email">${profile.email || ''}</p>
    </div>
    <button class="btn option-profile-card__edit" type="button">수정</button>
  `;
}

function renderOptionItem(item) {
  let valueHtml = '';
  if (item.type === 'toggle') {
    const settings = MoyoraData.getAppSettings();
    valueHtml = `<span class="toggle-switch ${settings.notificationsEnabled ? 'is-on' : ''}" data-toggle="notifications" role="switch" aria-checked="${settings.notificationsEnabled}"></span>`;
  } else if (item.type === 'select') {
    const settings = MoyoraData.getAppSettings();
    valueHtml = `
      <span class="option-item__value" style="position: relative;">
        <span id="currentLanguageText">${settings.language}</span>
        ${OPTION_ICONS.chevronDown}
        <select id="languageSelect" class="option-item__select" aria-label="다국어 설정">
          <option value="한국어" ${settings.language === '한국어' ? 'selected' : ''}>한국어</option>
          <option value="영어" ${settings.language === '영어' ? 'selected' : ''}>영어</option>
          <option value="일본어" ${settings.language === '일본어' ? 'selected' : ''}>일본어</option>
          <option value="중국어" ${settings.language === '중국어' ? 'selected' : ''}>중국어</option>
        </select>
      </span>
    `;
  } else if (item.type === 'link') {
    valueHtml = `<span class="option-item__chevron">${OPTION_ICONS.chevronRight}</span>`;
  }

  return `
    <div class="option-item ${item.type === 'action' || item.type === 'link' ? 'option-item--action' : ''}" data-key="${item.key}">
      <span class="option-item__icon option-item__icon--${item.color}">${OPTION_ICONS[item.icon]}</span>
      <span class="option-item__body">
        <span class="option-item__label">${item.label}</span>
        ${item.sublabel ? `<span class="option-item__sublabel">${item.sublabel}</span>` : ''}
      </span>
      ${valueHtml}
    </div>
  `;
}

function renderOptionSections() {
  const sections = MoyoraData.getOptionMenuSections();
  const container = document.getElementById('optionSections');

  container.innerHTML = sections.map((section) => {
    const itemsHtml = section.items
      .map((item) => `<div class="option-list card">${renderOptionItem(item)}</div>`)
      .join('');

    return `
      <div class="section" style="margin-top: var(--space-5);">
        <p class="option-section__label">${section.label}</p>
        ${itemsHtml}
      </div>
    `;
  }).join('');

  bindOptionItemEvents();
}

function bindOptionItemEvents() {
  document.querySelectorAll('[data-toggle="notifications"]').forEach((el) => {
    el.addEventListener('click', () => {
      const isOn = MoyoraData.toggleNotifications();
      el.classList.toggle('is-on', isOn);
      el.setAttribute('aria-checked', String(isOn));
    });
  });

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      MoyoraData.setLanguage(newLang);
      
      const textEl = document.getElementById('currentLanguageText');
      if (textEl) {
        textEl.textContent = newLang;
      }
      console.info(`언어가 '${newLang}'(으)로 변경되었습니다.`);
    });
  }

  document.querySelectorAll('.option-item[data-key="account"]').forEach((el) => {
    el.addEventListener('click', () => {
      window.location.href = 'account.html';
    });
  });

  document.querySelectorAll('.option-item[data-key="logout"]').forEach((el) => {
    el.addEventListener('click', () => {
      console.info('로그아웃 동작은 다음 단계에서 연결될 예정입니다.');
    });
  });

  ['profile-edit', 'password', 'terms'].forEach((key) => {
    document.querySelectorAll(`.option-item[data-key="${key}"]`).forEach((el) => {
      el.addEventListener('click', () => {
        console.info(`'${key}' 화면은 아직 시안이 없어 다음 단계에서 연결될 예정입니다.`);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderOptionProfile();
  renderOptionSections();
  window.MoyoraCommon.renderBottomNav('profile', 'bottomNav');

  const backBtn = document.getElementById('optionBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }
});
