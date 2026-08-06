/* ==========================================================================
   모여라 - common.js
   공통 유틸: 하단 네비게이션 렌더링, 색상 토큰 매핑, 화면 전환 스텁
   ========================================================================== */

/** avatarColor 토큰 → 실제 배경색 CSS 변수 매핑 */
const AVATAR_COLOR_MAP = {
  pink: 'var(--color-pink-light)',
  yellow: 'var(--color-yellow-light)',
  blue: 'var(--color-blue-light)',
  green: 'var(--color-green-light)',
  cream: 'var(--color-cream-light)',
  gray: 'var(--color-gray-light)'
};

function getAvatarColor(token) {
  return AVATAR_COLOR_MAP[token] || AVATAR_COLOR_MAP.gray;
}

/** 이름에서 아바타용 첫 글자를 뽑는다 (이미지가 없을 때 사용) */
function getInitial(name) {
  return name ? name.charAt(0) : '';
}

const NAV_ITEMS = [
  { key: 'home', label: '홈', href: 'index.html' },
  { key: 'friends', label: '친구', href: 'friends.html' },
  { key: 'search', label: '검색', href: '#', isMain: true },
  { key: 'groups', label: '내 모임', href: 'add.html' },
  { key: 'profile', label: '내 정보', href: 'profile.html' }
];

const NAV_ICONS = {
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3.5a1 1 0 0 0 1-1v-9"/></svg>',
  friends: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.5-5.8 5.5-5.8s5.5 2.5 5.5 5.8"/><circle cx="17" cy="8.5" r="2.4"/><path d="M15.8 14.6c2.4.3 4.2 2.5 4.2 5.4"/></svg>',
  search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.3-4.3"/></svg>',
  groups: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="4.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="14.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="14.5" width="7" height="7" rx="1.5"/></svg>',
  profile: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7"/></svg>'
};

/**
 * 하단 네비게이션을 지정된 컨테이너에 렌더링한다.
 * @param {string} activeKey - 'home' | 'friends' | 'groups' | 'profile'
 * @param {string} containerId
 */
function renderBottomNav(activeKey, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const itemsHtml = NAV_ITEMS.map((item) => {
    const isActive = item.key === activeKey;

    if (item.isMain) {
      return `
        <a class="bottom-nav__item bottom-nav__item--main" href="${item.href}" data-nav="${item.key}" data-tooltip="${item.label}">
          <span class="bottom-nav__main-btn">${NAV_ICONS.search}</span>
          <span>${item.label}</span>
        </a>
      `;
    }

    return `
      <a class="bottom-nav__item ${isActive ? 'is-active' : ''}" href="${item.href}" data-nav="${item.key}" data-tooltip="${item.label}">
        ${NAV_ICONS[item.key]}
        <span>${item.label}</span>
      </a>
    `;
  }).join('');

  container.innerHTML = itemsHtml;

  // 아직 만들어지지 않은 화면으로의 이동은 막고 안내만 표시(향후 단계에서 연결 예정)
  container.querySelectorAll('[data-nav]').forEach((el) => {
    const key = el.getAttribute('data-nav');
    if (key === 'search') {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'search.html';
      });
    } else if (key !== activeKey) {
      el.addEventListener('click', (e) => {
        // 아직 존재하지 않는 화면(다음 단계에서 제작 예정)
        const notYetBuilt = [];
        if (notYetBuilt.includes(key)) {
          e.preventDefault();
          console.info(`'${key}' 화면은 다음 단계에서 제작될 예정입니다.`);
        }
      });
    }
  });
}

window.MoyoraCommon = {
  getAvatarColor,
  getInitial,
  renderBottomNav
};
