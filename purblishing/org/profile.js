/* ==========================================================================
   모여라 - profile.js
   [내 정보] 화면 렌더링 / 이벤트 (게이지 바 애니메이션 등)
   ========================================================================== */

function renderProfileHero(profile) {
  document.getElementById('profileAvatarImg').src = profile.profileImage;
  document.getElementById('profileAvatarImg').alt = profile.name;
  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('profileRole').textContent = profile.role;
}

function renderWeeklyActivity(profile) {
  document.getElementById('weeklyPercent').textContent = `${profile.weeklyActivityPercent}%`;
  document.getElementById('weeklyCaption').textContent = profile.weeklyActivityMessage;

  // 진입 시 바가 차오르는 느낌을 주기 위해 다음 프레임에 width를 적용
  const fillEl = document.getElementById('weeklyFill');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fillEl.style.width = `${profile.weeklyActivityPercent}%`;
    });
  });
}

function formatThousands(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function renderStats(profile) {
  document.getElementById('healthSteps').textContent = formatThousands(profile.health.steps);
  document.getElementById('sleepHours').textContent = profile.sleep.hours;
}

function renderActivitySummary(profile) {
  const container = document.getElementById('activityScroll');
  container.innerHTML = profile.activitySummary.map((item) => `
    <div class="activity-card">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <span class="activity-card__title">${item.title}</span>
    </div>
  `).join('');
}

function renderMenuList(menuItems) {
  const container = document.getElementById('profileMenuList');
  container.innerHTML = menuItems.map((item) => {
    let href = '#';
    if (item.key === 'settings') href = 'option.html';
    else if (item.key === 'moments') href = 'memory.html';

    return `
      <a href="${href}" class="menu-item" data-menu-key="${item.key}">
        <span class="menu-item__icon menu-item__icon--${item.color}">${MENU_ICONS[item.icon] || ''}</span>
        <span class="menu-item__label">${item.label}</span>
        <span class="menu-item__chevron">${ICON_CHEVRON}</span>
      </a>
    `;
  }).join('');

  container.querySelectorAll('[data-menu-key]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const key = btn.dataset.menuKey;
      if (key !== 'settings' && key !== 'moments') {
        e.preventDefault();
        console.info(`'${key}' 메뉴는 다음 단계에서 연결됩니다.`);
      }
    });
  });
}

const MENU_ICONS = {
  gear: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  image: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4.5 16.5 5-5 3.2 3.2L16 11l4 4.5"/></svg>',
  palette: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.4c1.9 0 3.6-1.6 3.6-3.6C21 6 17 2 12 2Z"/><circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="17" cy="11" r="1.2" fill="currentColor" stroke="none"/></svg>',
  message: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(-10deg); overflow: visible;"><rect x="2" y="5" width="20" height="14" rx="3.5" fill="currentColor" stroke="none" /><line x1="20" y1="5" x2="6" y2="17" stroke="#4C35AC" stroke-width="1.8" stroke-linecap="round" /></svg>'
};

const ICON_CHEVRON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

function initProfileScreen() {
  const profile = window.MoyoraData.getProfile();
  renderProfileHero(profile);
  renderWeeklyActivity(profile);
  renderStats(profile);
  renderActivitySummary(profile);
  renderMenuList(window.MoyoraData.getProfileMenuItems());
  window.MoyoraCommon.renderBottomNav('profile', 'bottomNav');

  document.getElementById('profileEditBtn').addEventListener('click', () => {
    console.info('프로필 사진 수정은 다음 단계에서 연결됩니다.');
  });

  document.getElementById('profileBackBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  document.getElementById('profileBellBtn').addEventListener('click', () => {
    console.info('알림 화면은 다음 단계에서 연결됩니다.');
  });
}

document.addEventListener('DOMContentLoaded', initProfileScreen);
