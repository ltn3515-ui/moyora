/* =========================================
   모여라 - index.js (메인 화면)
   ========================================= */

(function () {
  const friendsData = [
    { id: 'me', label: '나의 활동', ring: 'var(--color-yellow)', photo: 'avatar_me_circle.png' },
    { id: 'f1', label: '민수', ring: 'var(--color-pink)', photo: 'avatar_f1_circle.png' },
    { id: 'f2', label: '지은', ring: 'var(--color-blue)', photo: 'avatar_f2_circle.png' },
    { id: 'f3', label: '현우', ring: 'var(--color-yellow)', photo: 'avatar_f3_circle.png' },
  ];

  function renderFriends() {
    const wrap = document.getElementById('friendsRow');
    if (!wrap) return;

    const items = friendsData
      .map((f) => {
        return `
          <li class="friend-item">
            <div class="friend-item__avatar-wrap" style="--ring-color: ${f.ring}">
              <img class="avatar" src="${f.photo}" alt="${f.label} 프로필 사진">
            </div>
            <span class="friend-item__label">${f.label}</span>
          </li>
        `;
      })
      .join('');

    const addItem = `
      <li class="friend-item friend-item--add" id="btnAddFriend">
        <div class="friend-item__avatar-wrap">+</div>
        <span class="friend-item__label">더보기</span>
      </li>
    `;

    wrap.innerHTML = items + addItem;

    // 친구 프로필 클릭 연동
    wrap.querySelectorAll('.friend-item').forEach((item) => {
      item.addEventListener('click', () => {
        const label = item.querySelector('.friend-item__label').textContent.trim();
        if (item.classList.contains('friend-item--add')) {
          // "더보기" 클릭 시 친구 목록 페이지로 전환
          window.location.href = 'friends.html';
        } else {
          // 개별 친구 클릭 시 안내 메세지
          console.info(`'${label}' 친구 상세 프로필은 다음 단계에서 연결됩니다.`);
          alert(`"${label}" 친구의 프로필 상세 화면은 다음 단계에서 제작 및 연결됩니다.`);
        }
      });
    });
  }

  function bindEvents() {
    const fab = document.getElementById('fabAddGroup');
    if (fab) {
      fab.addEventListener('click', () => {
        window.location.href = 'calculate.html';
      });
    }

    const startBtn = document.getElementById('btnStartEvent');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.location.href = 'add.html';
      });
    }

    // 취향 저격 활동 카드 클릭 연동
    document.querySelectorAll('.taste-grid .taste-card').forEach((card) => {
      card.addEventListener('click', () => {
        const name = card.querySelector('.taste-card__name').textContent.trim();
        console.info(`'${name}' 활동 상세 화면은 다음 단계에서 연결됩니다.`);
        alert(`"${name}" 활동 상세 화면은 다음 단계에서 제작 및 연결됩니다.`);
      });
    });

    // 친구들과 함께하는 이벤트 목록 클릭 연동
    document.querySelectorAll('.event-list .event-item').forEach((item) => {
      item.addEventListener('click', () => {
        const name = item.querySelector('.event-item__text').textContent.trim();
        console.info(`'${name}' 이벤트 화면은 다음 단계에서 연결됩니다.`);
        alert(`"${name}" 이벤트 화면은 다음 단계에서 제작 및 연결됩니다.`);
      });
    });
  }

  function init() {
    window.MoyoraCommon.renderBottomNav('home', 'bottomNav');
    renderFriends();
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
