/* ==========================================================================
   모여라 - data.js
   공통 데이터 관리 모듈 (mock data + CRUD 함수)
   추후 React 전환 시 이 스키마를 그대로 state/props로 옮길 수 있도록 설계
   ========================================================================== */

/**
 * 나의 프로필
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string|null} profileImage
 * @property {string} avatarColor  - 이미지 없을 때 배경색 토큰
 * @property {string} statusMessage
 * @property {number} weeklyActivityPercent
 * @property {{steps:number}} health
 * @property {{hours:number}} sleep
 * @property {Array<{id:string, title:string, image:string|null, avatarColor:string}>} activitySummary
 */
const myProfile = {
  id: 'user-001',
  name: '이태노',
  role: '창작 매니아',
  email: 'moyora_love@email.com',
  profileImage: 'avatar_leetaeno.png',
  avatarColor: 'pink',
  statusMessage: '행복한 하루 되세요!',
  weeklyActivityPercent: 95,
  weeklyActivityMessage: '목표 달성까지 한 걸음 남았어요!',
  health: { steps: 1200 },
  sleep: { hours: 8.2 },
  activitySummary: [
    { id: 'act-001', title: '아트 페스티벌', image: 'activity_art.png', avatarColor: 'blue' },
    { id: 'act-002', title: '창작 모임', image: 'activity_create.png', avatarColor: 'cream' }
  ]
};

/**
 * 나의 모임 (friends.html의 '즐겨찾기'와 add.html의 '나의 모임 리스트'가 공유하는 데이터)
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 * @property {number} memberCount
 * @property {string} thumbnailColor - yellow | pink | blue | green | cream | gray
 * @property {string|null} icon
 * @property {boolean} isFavorite - friends.html 즐겨찾기 노출 여부
 * @property {string|null} profileImage
 * @property {Array<{id:string, avatarUrl:string|null}>} members
 * @property {string} createdAt - ISOString
 * @property {Array<{id:string, type:'notice'|'comment'|'schedule', message:string, timestamp:string}>} recentActivities
 */
const myGroups = [
  {
    id: 'group-001',
    name: '어피치',
    memberCount: 12,
    thumbnailColor: 'pink',
    icon: null,
    isFavorite: true,
    profileImage: 'apeach_avatar.png',
    members: [],
    createdAt: '2026-01-10T09:00:00+09:00',
    recentActivities: []
  },
  {
    id: 'group-002',
    name: '춘식이',
    memberCount: 8,
    thumbnailColor: 'cream',
    icon: null,
    isFavorite: true,
    profileImage: 'choonsik_avatar.png',
    members: [],
    createdAt: '2026-02-02T09:00:00+09:00',
    recentActivities: []
  },
  {
    id: 'group-003',
    name: 'Morning Flow',
    memberCount: 12,
    thumbnailColor: 'yellow',
    icon: '☀️',
    isFavorite: false,
    members: [{ avatarUrl: 'avatar_me_circle.png' }, { avatarUrl: 'avatar_f1_circle.png' }],
    createdAt: '2026-01-15T09:00:00+09:00',
    recentActivities: [
      {
        id: 'act-1',
        type: 'notice',
        message: 'Morning Flow에 새로운 공지사항이 올라왔습니다.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'group-004',
    name: 'Fiction Junkies',
    memberCount: 8,
    thumbnailColor: 'pink',
    icon: '📖',
    isFavorite: false,
    members: [{ avatarUrl: 'avatar_f2_circle.png' }, { avatarUrl: 'avatar_f3_circle.png' }],
    createdAt: '2026-01-20T09:00:00+09:00',
    recentActivities: [
      {
        id: 'act-2',
        type: 'comment',
        message: 'Fiction Junkies에서 3개의 새로운 댓글이 있습니다.',
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'group-005',
    name: 'Peak Seekers',
    memberCount: 24,
    thumbnailColor: 'blue',
    icon: '⛰️',
    isFavorite: false,
    members: [{ avatarUrl: 'avatar_f1_circle.png' }, { avatarUrl: 'avatar_me_circle.png' }],
    createdAt: '2026-01-25T09:00:00+09:00',
    recentActivities: [
      {
        id: 'act-3',
        type: 'schedule',
        message: 'Peak Seekers의 정기 산행 일정이 확정되었습니다.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ]
  }
];

/**
 * 친구 목록
 * @typedef {Object} Friend
 * @property {string} id
 * @property {string} name
 * @property {string|null} profileImage
 * @property {string} avatarColor
 * @property {string} statusMessage
 * @property {boolean} isNew
 */
const friends = [
  {
    id: 'friend-001',
    name: '네오',
    profileImage: 'neo_avatar.png',
    avatarColor: 'pink',
    statusMessage: '오늘 날씨 너무 좋아요!',
    isNew: true
  },
  {
    id: 'friend-002',
    name: '프로도',
    profileImage: 'frodo_avatar.png',
    avatarColor: 'cream',
    statusMessage: '열공 중...',
    isNew: false
  },
  {
    id: 'friend-003',
    name: '무지',
    profileImage: 'muzi_avatar.png',
    avatarColor: 'yellow',
    statusMessage: '카페 가실 분?',
    isNew: false
  },
  {
    id: 'friend-004',
    name: '콘',
    profileImage: 'con_avatar.png',
    avatarColor: 'green',
    statusMessage: '비밀 연구 중',
    isNew: false
  },
  {
    id: 'friend-005',
    name: '제이지',
    profileImage: 'jayg_avatar.png',
    avatarColor: 'gray',
    statusMessage: 'Keep it real!',
    isNew: false
  }
];

/** 검색 - 최근 검색어 */
let recentSearches = ['오메라', '한강 피크닉', '홍대 맛집'];

/** 검색 - 인기 카테고리 */
const popularCategories = [
  { id: 'cat-001', name: '전시회', color: 'pink' },
  { id: 'cat-002', name: '원데이 클래스', color: 'yellow' },
  { id: 'cat-003', name: '러닝크루', color: 'blue' },
  { id: 'cat-004', name: '보드게임', color: 'gray' }
];

/** 신규 모임 생성 - 목적 카테고리 (newcru.html Step 01) */
const groupPurposeCategories = [
  { id: 'purpose-001', name: '독서모임', icon: 'book', color: 'yellow' },
  { id: 'purpose-002', name: '친목모임', icon: 'people', color: 'pink' },
  { id: 'purpose-003', name: '번개모임', icon: 'bolt', color: 'blue' },
  { id: 'purpose-004', name: '취미모임', icon: 'ball', color: 'cream' }
];

/**
 * 신규 모임 생성 위저드 단계 정의 (newcru.html)
 * @typedef {Object} WizardStep
 * @property {number} step
 * @property {number} totalSteps
 * @property {string} title
 */
const newGroupWizard = {
  totalSteps: 6,
  currentStep: 1,
  title: '모임의 목적을 알려주세요!'
};

/**
 * 참여 현황 (calculate.html 그래프)
 * @typedef {Object} ParticipationStats
 * @property {number} rate - 참여도 %
 * @property {string} rangeLabel
 * @property {Array<{time:string, value:number}>} points - 시간대별 트래픽 포인트
 * @property {string} peakTime
 */
const participationStats = {
  rate: 73,
  rangeLabel: '최근 24시간 실시간 트래픽',
  points: [
    { time: '09:00', value: 22 },
    { time: '12:00', value: 48 },
    { time: '15:00', value: 92 },
    { time: '18:00', value: 58 },
    { time: '21:00', value: 34 }
  ],
  peakTime: '15:00'
};

/**
 * 정산 내역
 * @typedef {Object} Settlement
 * @property {string} id
 * @property {string} title
 * @property {string|null} thumbnail
 * @property {string|null} emoji - 썸네일 없을 때 대체 이모지
 * @property {'done'|'pending'} status
 * @property {string} date
 * @property {string} category
 * @property {number} amount
 */
const settlements = [
  {
    id: 'settle-001',
    title: '갤러리 수수료',
    thumbnail: 'gallery_thumb.png',
    emoji: null,
    status: 'done',
    date: '2024.05.15',
    category: '모임 정기 정산',
    amount: 45000
  },
  {
    id: 'settle-002',
    title: '워크숍 허브',
    thumbnail: 'workshop_thumb.png',
    emoji: null,
    status: 'pending',
    date: '2024.05.14',
    category: '대관비 정산',
    amount: 128000
  },
  {
    id: 'settle-003',
    title: '페스티벌 뒤풀이',
    thumbnail: null,
    emoji: '🎉',
    status: 'done',
    date: '2024.05.12',
    category: '1/N 정산',
    amount: 12500
  }
];

/** 정산 인사이트 안내 카드 */
const settlementInsight = {
  message: '이번 달 정산이 원활하게 진행되고 있어요!\n미정산 내역 2건을 확인해보세요.',
  ctaLabel: '내역 상세 보기'
};

/**
 * 앱 환경 설정 (option.html)
 * @typedef {Object} AppSettings
 * @property {boolean} notificationsEnabled
 * @property {string} language
 * @property {string} appVersion
 */
const appSettings = {
  notificationsEnabled: true,
  language: '한국어',
  appVersion: 'v2.4.0'
};

/**
 * 대표 계좌 정보 (option.html 서브텍스트 + account.html)
 * @typedef {Object} PayoutAccount
 * @property {string} bankName
 * @property {string} accountNumberMasked
 * @property {string} holderName
 */
const payoutAccount = {
  bankName: '국민은행',
  accountNumberMasked: '1234-56-*******',
  holderName: ''
};

/** 은행 선택 옵션 (account.html select) */
const bankOptions = ['국민은행', '신한은행', '우리은행', '하나은행', '카카오뱅크', '토스뱅크'];

/** 환경설정 화면의 메뉴 리스트 정의 */
const optionMenuSections = [
  {
    label: '계정 및 보안',
    items: [
      { key: 'profile-edit', label: '프로필 설정', icon: 'person', color: 'pink', type: 'link' },
      { key: 'password', label: '비밀번호 변경', icon: 'lock', color: 'blue', type: 'link' }
    ]
  },
  {
    label: '환경 및 앱 설정',
    items: [
      { key: 'notifications', label: '알림 설정', icon: 'bell', color: 'yellow', type: 'toggle' },
      { key: 'language', label: '다국어 설정', icon: 'globe', color: 'pink', type: 'select' },
      { key: 'account', label: '대표 계좌 관리', sublabel: '정산 수급 계좌 설정', icon: 'bank', color: 'blue', type: 'link' }
    ]
  },
  {
    label: '기타',
    items: [
      { key: 'terms', label: '서비스 이용약관 및 정책', icon: 'doc', color: 'gray', type: 'link', standalone: true },
      { key: 'logout', label: '로그아웃', icon: 'logout', color: 'red', type: 'action', standalone: true }
    ]
  }
];

/**
 * 저장된 순간들 (memory.html)
 * @typedef {Object} Moment
 * @property {string} id
 * @property {string} title - 장소/이벤트명
 * @property {string} date - 'YYYY.MM.DD'
 * @property {string} year - 필터용 ('2026' | '2025' | ...)
 * @property {string|null} image
 * @property {string} thumbnailColor - 이미지 없을 때 카드 배경 토큰
 * @property {boolean} isFavorite - 즐겨찾기 필터 노출 여부
 */
const savedMoments = [
  { id: 'mo-001', title: '한강 피크닉', date: '2026.05.12', year: '2026', image: 'moment_hangang.png', thumbnailColor: 'pink', isFavorite: false },
  { id: 'mo-002', title: '홍대 맛집 탐방', date: '2026.04.28', year: '2026', image: 'moment_hongdae.png', thumbnailColor: 'yellow', isFavorite: false },
  { id: 'mo-003', title: '봄바람 페스티벌', date: '2025.03.15', year: '2025', image: 'moment_festival.png', thumbnailColor: 'blue', isFavorite: false },
  { id: 'mo-004', title: '다꾸 모임', date: '2025.02.01', year: '2025', image: 'moment_dakku.png', thumbnailColor: 'cream', isFavorite: true },
  { id: 'mo-005', title: '남산 야경', date: '2025.01.20', year: '2025', image: 'moment_namsan.png', thumbnailColor: 'gray', isFavorite: true }
];

/* ==========================================================================
   접근 함수 (CRUD)
   ========================================================================== */

const MoyoraData = {
  // Profile
  getProfile() {
    return myProfile;
  },

  // Friends
  getFriends() {
    return friends;
  },
  getFriendById(id) {
    return friends.find((f) => f.id === id) || null;
  },

  // Groups
  getGroups() {
    return myGroups.filter((g) => !g.isFavorite);
  },
  getFavoriteGroups() {
    return myGroups.filter((g) => g.isFavorite);
  },
  getGroupById(id) {
    return myGroups.find((g) => g.id === id) || null;
  },
  addGroup(newGroupInput) {
    const group = {
      id: `group-${Date.now()}`,
      memberCount: 1,
      thumbnailColor: 'yellow',
      icon: null,
      isFavorite: false,
      members: [],
      createdAt: new Date().toISOString(),
      recentActivities: [],
      ...newGroupInput
    };
    myGroups.push(group);
    return group;
  },
  addRecentActivity(groupId, activity) {
    const group = MoyoraData.getGroupById(groupId);
    if (!group) return null;
    const entry = { id: `act-${Date.now()}`, timestamp: new Date().toISOString(), ...activity };
    group.recentActivities.unshift(entry);
    return entry;
  },
  getAllRecentActivities() {
    const all = [];
    myGroups.forEach((g) => {
      if (g.recentActivities) {
        all.push(...g.recentActivities);
      }
    });
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Search
  getRecentSearches() {
    return recentSearches;
  },
  addRecentSearch(keyword) {
    if (!keyword) return recentSearches;
    recentSearches = [keyword, ...recentSearches.filter((k) => k !== keyword)];
    return recentSearches;
  },
  removeRecentSearch(keyword) {
    recentSearches = recentSearches.filter((k) => k !== keyword);
    return recentSearches;
  },
  clearRecentSearches() {
    recentSearches = [];
    return recentSearches;
  },
  getPopularCategories() {
    return popularCategories;
  },
  getProfileMenuItems() {
    return [
      { key: 'settings', label: '환경 설정', icon: 'gear', color: 'purple' },
      { key: 'moments', label: '저장된 순간들', icon: 'image', color: 'blue' },
      { key: 'message', label: '메세지', icon: 'message', color: 'message' }
    ];
  },

  // New group wizard (newcru.html)
  getGroupPurposeCategories() {
    return groupPurposeCategories;
  },
  getNewGroupWizardMeta() {
    return newGroupWizard;
  },

  // Settlement (calculate.html)
  getParticipationStats() {
    return participationStats;
  },
  getSettlements() {
    return settlements;
  },
  getSettlementInsight() {
    return settlementInsight;
  },

  // App settings (option.html)
  getAppSettings() {
    return appSettings;
  },
  toggleNotifications() {
    appSettings.notificationsEnabled = !appSettings.notificationsEnabled;
    return appSettings.notificationsEnabled;
  },
  setLanguage(lang) {
    appSettings.language = lang;
    return appSettings;
  },
  getOptionMenuSections() {
    return optionMenuSections;
  },

  // Payout account (option.html / account.html)
  getPayoutAccount() {
    return payoutAccount;
  },
  updatePayoutAccount(patch) {
    Object.assign(payoutAccount, patch);
    return payoutAccount;
  },
  getBankOptions() {
    return bankOptions;
  },

  // Saved moments (memory.html)
  getSavedMoments() {
    return savedMoments;
  },
  getMomentsByYear(year) {
    return savedMoments.filter((m) => m.year === year);
  },
  getFavoriteMoments() {
    return savedMoments.filter((m) => m.isFavorite);
  }
};

// 브라우저 전역에서 사용
window.MoyoraData = MoyoraData;
window.MoyeoraData = MoyoraData;
