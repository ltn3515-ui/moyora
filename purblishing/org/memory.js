/* ==========================================================================
   모여라 - memory.js
   [저장된 순간들 모달] 렌더링/이벤트 (DOM 기반 필터링)
   ========================================================================== */

const ICON_MOMENTS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="14" height="14" rx="3"/><path d="M3 15V6a2 2 0 0 1 2-2h9"/></svg>';
const ICON_X_SMALL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const ICON_ADD_PHOTO = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="14" rx="3"/><circle cx="9" cy="11" r="2"/><path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L15 16"/><path d="M17 3v6M14 6h6"/></svg>';

let activeFilter = 'all';

function filterGrid() {
  const cards = document.querySelectorAll('#memoryGrid .memory-card');
  const container = document.getElementById('memoryGrid');
  
  let visibleCount = 0;
  
  cards.forEach((card) => {
    const year = card.getAttribute('data-year');
    const isFav = card.getAttribute('data-favorite') === 'true';
    
    let show = false;
    if (activeFilter === 'all') {
      show = true;
    } else if (activeFilter === 'favorite') {
      show = isFav;
    } else {
      show = (year === activeFilter);
    }
    
    if (show) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Handle empty state
  if (visibleCount === 0) {
    container.classList.add('memory-grid--empty');
  } else {
    container.classList.remove('memory-grid--empty');
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('#memoryTabs .memory-tab[data-filter]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove('is-active'));
      // Add active class to clicked tab
      tab.classList.add('is-active');
      
      activeFilter = tab.getAttribute('data-filter');
      filterGrid();
    });
  });
}

function closeMemoryModal() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'profile.html';
  }
}

function initMemoryScreen() {
  document.getElementById('memoryTitleIcon').innerHTML = ICON_MOMENTS;
  document.getElementById('memoryCloseIcon').innerHTML = ICON_X_SMALL;
  document.getElementById('memoryAddIcon').innerHTML = ICON_ADD_PHOTO;

  initTabs();
  filterGrid();

  document.getElementById('memoryCloseBtn').addEventListener('click', closeMemoryModal);
  document.getElementById('memoryBackdrop').addEventListener('click', closeMemoryModal);

  document.getElementById('memoryAddBtn').addEventListener('click', () => {
    console.info('사진 추가 기능은 다음 단계에서 연결됩니다.');
    alert('새로운 순간 사진 추가 기능은 다음 단계에서 개발될 예정입니다.');
  });
}

document.addEventListener('DOMContentLoaded', initMemoryScreen);
