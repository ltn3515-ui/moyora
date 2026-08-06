/* ==========================================================================
   모여라 - search.js
   [검색 모달] 렌더링 / 이벤트 (최근 검색어 추가·삭제, 인기 카테고리 등)
   ========================================================================== */

const SEARCH_TAG_COLORS = ['pink', 'yellow', 'blue', 'gray'];

const CATEGORY_ICONS = {
  '전시회': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="13" rx="2"/><path d="m3 14.5 5-4.5 4 3.5 4-4 5 4.5"/><circle cx="8" cy="9" r="1.3" fill="currentColor" stroke="none"/></svg>',
  '원데이 클래스': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z"/><path d="M6.5 11.8v4.2c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.2"/><path d="M20.5 9.5v6"/></svg>',
  '러닝크루': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="4.5" r="1.8"/><path d="m6 21 3.5-5 2-2.5-1-4 4 1 2 3.5 3.5 1.5"/><path d="m9.5 14 -4 1.5"/><path d="M11.5 9.5 8 8l-2 3"/></svg>',
  '보드게임': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.3" cy="8.3" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.7" cy="8.3" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="8.3" cy="15.7" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.7" cy="15.7" r="1.1" fill="currentColor" stroke="none"/></svg>'
};

const ICON_X_SMALL = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const ICON_SPARKLE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 3c.5 3.2 1.9 4.6 5 5-3.1.4-4.5 1.8-5 5-.5-3.2-1.9-4.6-5-5 3.1-.4 4.5-1.8 5-5Z"/><path d="M19 13c.3 1.7 1 2.4 2.7 2.7-1.7.3-2.4 1-2.7 2.7-.3-1.7-1-2.4-2.7-2.7 1.7-.3 2.4-1 2.7-2.7Z"/></svg>';

function renderRecentSearches() {
  const container = document.getElementById('searchTags');
  const keywords = window.MoyoraData.getRecentSearches();

  container.innerHTML = keywords.map((keyword, i) => {
    const color = SEARCH_TAG_COLORS[i % SEARCH_TAG_COLORS.length];
    return `
      <span class="search-tag search-tag--${color}">
        ${keyword}
        <button type="button" class="search-tag__remove" data-remove="${keyword}" aria-label="'${keyword}' 삭제">${ICON_X_SMALL}</button>
      </span>
    `;
  }).join('');

  container.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.MoyoraData.removeRecentSearch(btn.dataset.remove);
      renderRecentSearches();
    });
  });
}

function renderPopularCategories() {
  const container = document.getElementById('categoryGrid');
  const categories = window.MoyoraData.getPopularCategories();

  container.innerHTML = categories.map((cat) => `
    <button type="button" class="category-card category-card--${cat.color}" data-category="${cat.id}">
      <span class="category-card__blob" aria-hidden="true"></span>
      <span class="category-card__icon">${CATEGORY_ICONS[cat.name] || ''}</span>
      <span class="category-card__label">${cat.name}</span>
    </button>
  `).join('');

  container.querySelectorAll('[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      console.info(`'${btn.querySelector('.category-card__label').textContent}' 카테고리 검색은 다음 단계에서 연결됩니다.`);
    });
  });
}

function closeSearchModal() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'friends.html';
  }
}

function submitSearch(keyword) {
  const trimmed = keyword.trim();
  if (!trimmed) return;
  window.MoyoraData.addRecentSearch(trimmed);
  renderRecentSearches();
}

function initSearchScreen() {
  document.getElementById('searchBannerIcon').innerHTML = ICON_SPARKLE;

  renderRecentSearches();
  renderPopularCategories();

  document.getElementById('searchCloseBtn').addEventListener('click', closeSearchModal);

  document.getElementById('searchClearAllBtn').addEventListener('click', () => {
    window.MoyoraData.clearRecentSearches();
    renderRecentSearches();
  });

  const input = document.getElementById('searchInput');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitSearch(input.value);
      input.value = '';
    }
  });

  // 시트 바깥(배경) 클릭 시 닫기
  document.getElementById('searchBackdrop').addEventListener('click', closeSearchModal);

  requestAnimationFrame(() => input.focus({ preventScroll: true }));
}

document.addEventListener('DOMContentLoaded', initSearchScreen);
