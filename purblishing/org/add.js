/* =========================================
   모여라 - add.js (나의 모임 화면)
   ========================================= */

(function () {
  const colorIcons = {
    yellow: '☀️',
    pink: '📖',
    blue: '⛰️',
  };

  const activityIcons = {
    notice: '📢',
    comment: '💬',
    schedule: '📅',
  };

  function timeAgo(isoString) {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return '방금 전';
    if (min < 60) return `${min}분 전`;
    const hour = Math.floor(min / 60);
    if (hour < 24) return `${hour}시간 전`;
    const day = Math.floor(hour / 24);
    if (day === 1) return '어제';
    return `${day}일 전`;
  }

  function renderGroupCard(group) {
    const membersHtml = (group.members || [])
      .slice(0, 2)
      .map((m) => `<img class="avatar" src="${m.avatarUrl}" alt="">`)
      .join('');

    const extraCount = group.memberCount - Math.min(2, group.members.length);
    const moreHtml =
      extraCount > 0
        ? `<div class="group-card__members-more">+${extraCount}</div>`
        : '';

    return `
      <div class="card group-card group-card--${group.thumbnailColor}" data-id="${group.id}">
        <div class="group-card__icon">${group.icon || colorIcons[group.thumbnailColor] || '👥'}</div>
        <div>
          <div class="group-card__name">${group.name}</div>
          <div class="group-card__count">멤버 ${group.memberCount}명</div>
        </div>
        <div class="group-card__members">${membersHtml}${moreHtml}</div>
      </div>
    `;
  }

  function renderGroups() {
    const grid = document.getElementById('groupGrid');
    if (!grid) return;
    const groups = window.MoyeoraData.getGroups();

    const addCard = `
      <button class="card group-card group-card--add" id="btnOpenForm">
        <span class="group-card__add-icon">+</span>
        <span class="group-card__add-label">새 모임 만들기</span>
      </button>
    `;

    grid.innerHTML = groups.map(renderGroupCard).join('') + addCard;

    const openBtn = document.getElementById('btnOpenForm');
    if (openBtn) openBtn.addEventListener('click', openForm);
  }

  function renderActivities() {
    const list = document.getElementById('activityList');
    if (!list) return;
    const activities = window.MoyeoraData.getAllRecentActivities().slice(0, 5);

    if (activities.length === 0) {
      list.innerHTML = `<div class="empty-state">아직 활동 내역이 없어요.</div>`;
      return;
    }

    list.innerHTML = activities
      .map(
        (a) => `
        <div class="card activity-item">
          <div class="activity-item__icon">${activityIcons[a.type] || '🔔'}</div>
          <div class="activity-item__body">
            <div class="activity-item__message">${a.message}</div>
            <div class="activity-item__time">${timeAgo(a.timestamp)}</div>
          </div>
        </div>
      `
      )
      .join('');
  }

  function openForm() {
    const overlay = document.getElementById('formOverlay');
    if (overlay) overlay.classList.add('open');
  }

  function closeForm() {
    const overlay = document.getElementById('formOverlay');
    if (overlay) overlay.classList.remove('open');
    const input = document.getElementById('inputGroupName');
    if (input) input.value = '';
    selectedColor = 'yellow';
    updateColorPicker();
  }

  let selectedColor = 'yellow';

  function updateColorPicker() {
    document.querySelectorAll('.color-picker__dot').forEach((dot) => {
      dot.classList.toggle('selected', dot.dataset.color === selectedColor);
    });
  }

  function bindForm() {
    const overlay = document.getElementById('formOverlay');
    const closeBtn = document.getElementById('btnCloseForm');
    const cancelBtn = document.getElementById('btnCancelForm');
    const submitBtn = document.getElementById('btnSubmitForm');
    const input = document.getElementById('inputGroupName');

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeForm();
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeForm);
    if (cancelBtn) cancelBtn.addEventListener('click', closeForm);

    document.querySelectorAll('.color-picker__dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        selectedColor = dot.dataset.color;
        updateColorPicker();
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const name = (input.value || '').trim();
        if (!name) {
          input.focus();
          return;
        }
        window.MoyeoraData.addGroup({
          name,
          thumbnailColor: selectedColor,
          memberCount: 1,
        });
        closeForm();
        renderGroups();
      });
    }
  }

  function bindNav() {
    const backBtn = document.getElementById('btnBack');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }

  function init() {
    window.MoyoraCommon.renderBottomNav('groups', 'bottomNav');
    renderGroups();
    renderActivities();
    bindForm();
    bindNav();
    updateColorPicker();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
