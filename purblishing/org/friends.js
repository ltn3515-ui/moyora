/* ==========================================================================
   모여라 - friends.js (친구 화면)
   ========================================================================== */

function renderAvatarInner(name, image, colorToken) {
  if (image) {
    return `<img src="${image}" alt="${name}">`;
  }
  return MoyoraCommon.getInitial(name);
}

function renderProfileCard() {
  const profile = MoyoraData.getProfile();
  const el = document.getElementById('profileCard');
  el.style.setProperty('--avatar-bg', MoyoraCommon.getAvatarColor(profile.avatarColor));

  el.innerHTML = `
    <div class="avatar profile-card__avatar" style="background:${MoyoraCommon.getAvatarColor(profile.avatarColor)}">
      ${renderAvatarInner(profile.name, profile.profileImage)}
    </div>
    <div class="profile-card__body">
      <p class="profile-card__name">나의 프로필</p>
      <p class="profile-card__status">${profile.statusMessage} 💗</p>
    </div>
    <button class="profile-card__edit" type="button" aria-label="프로필 수정">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
      </svg>
    </button>
  `;
}

function renderFavorites() {
  const groups = MoyoraData.getFavoriteGroups();
  const el = document.getElementById('favoritesList');

  const ringColors = {
    pink: 'var(--color-pink)',
    cream: 'var(--color-yellow)',
    yellow: 'var(--color-yellow)',
    blue: 'var(--color-blue)',
    green: 'var(--color-green)'
  };

  const itemsHtml = groups.map((group) => `
    <li class="favorite-item">
      <div class="avatar favorite-item__avatar" style="--ring-color: ${ringColors[group.thumbnailColor] || '#D8D0C0'}">
        ${renderAvatarInner(group.name, group.profileImage)}
      </div>
      <span class="favorite-item__label">${group.name}</span>
    </li>
  `).join('');

  const addItemHtml = `
    <li class="favorite-item">
      <button class="avatar favorite-item__avatar favorite-item__avatar--add" type="button" aria-label="즐겨찾기 추가">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
      <span class="favorite-item__label">추가</span>
    </li>
  `;

  el.innerHTML = itemsHtml + addItemHtml;
}

function renderFriendList() {
  const list = MoyoraData.getFriends();
  const el = document.getElementById('friendList');

  el.innerHTML = list.map((friend) => `
    <li class="friend-item" data-id="${friend.id}">
      <div class="avatar friend-item__avatar" style="background:${MoyoraCommon.getAvatarColor(friend.avatarColor)}">
        ${renderAvatarInner(friend.name, friend.profileImage)}
      </div>
      <div class="friend-item__body">
        <p class="friend-item__name">${friend.name}</p>
        <p class="friend-item__status">${friend.statusMessage}</p>
      </div>
      ${friend.isNew ? '<span class="friend-item__badge">New</span>' : ''}
    </li>
  `).join('');

  // 클릭 이벤트 바인딩
  el.querySelectorAll('.friend-item').forEach((item) => {
    item.addEventListener('click', () => {
      const friendId = item.getAttribute('data-id');
      const friend = list.find((f) => f.id === friendId);
      if (friend) {
        alert(`"${friend.name}"님에게 메세지 보내기 모달창이 열립니다. (모달창 컴포넌트는 추후 제작될 예정입니다.)`);
      }
    });
  });
}

function bindSearchBarHandoff() {
  const input = document.getElementById('friendSearchInput');
  if (!input) return;
  input.addEventListener('focus', () => {
    input.blur();
    window.location.href = 'search.html';
  });
}

function bindNav() {
  const backBtn = document.getElementById('btnBack');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  const fab = document.querySelector('.friends-fab');
  if (fab) {
    fab.addEventListener('click', () => {
      alert("새로운 친구 추가 화면은 다음 단계에서 연결될 예정입니다.");
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProfileCard();
  renderFavorites();
  renderFriendList();
  bindSearchBarHandoff();
  bindNav();
  MoyoraCommon.renderBottomNav('friends', 'bottomNav');
});
