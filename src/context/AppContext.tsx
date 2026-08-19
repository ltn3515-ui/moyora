import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import avatarMe from '../assets/avatar_me_circle.png';
import type {
  Profile,
  Group,
  Friend,
  PopularCategory,
  GroupPurposeCategory,
  ParticipationStats,
  Settlement,
  AppSettings,
  PayoutAccount,
  OptionMenuSection,
  Moment,
  NotificationItem
} from '../types';

// 초기 Mock 데이터 정의
const initialProfile: Profile = {
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

const initialGroups: Group[] = [
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

const initialFriends: Friend[] = [
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

const initialPopularCategories: PopularCategory[] = [
  { id: 'cat-001', name: '전시회', color: 'pink' },
  { id: 'cat-002', name: '원데이 클래스', color: 'yellow' },
  { id: 'cat-003', name: '러닝크루', color: 'blue' },
  { id: 'cat-004', name: '보드게임', color: 'gray' }
];

const initialGroupPurposeCategories: GroupPurposeCategory[] = [
  { id: 'purpose-001', name: '독서모임', icon: 'book', color: 'yellow' },
  { id: 'purpose-002', name: '친목모임', icon: 'people', color: 'pink' },
  { id: 'purpose-003', name: '번개모임', icon: 'bolt', color: 'blue' },
  { id: 'purpose-004', name: '취미모임', icon: 'ball', color: 'cream' }
];

const initialParticipationStats: ParticipationStats = {
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

const initialSettlements: Settlement[] = [
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

const initialSavedMoments: Moment[] = [
  { 
    id: 'mo-001', 
    title: '한강 피크닉', 
    date: '2026.05.12', 
    year: '2026', 
    image: 'picnic.png', 
    thumbnailColor: 'pink', 
    isFavorite: false,
    description: '날씨 좋은 봄날, 한강 공원에서 잔디밭에 돗자리를 펴고 맛있는 피크닉 도시락을 나누어 먹었습니다. 노을을 바라보며 시원한 강바람과 함께 힐링하는 완벽한 하루였습니다.',
    location: '여의도 한강공원',
    tags: ['피크닉', '노을맛집', '주말힐링', '도시락']
  },
  { 
    id: 'mo-002', 
    title: '홍대 맛집 탐방', 
    date: '2026.04.28', 
    year: '2026', 
    image: 'cafe.png', 
    thumbnailColor: 'yellow', 
    isFavorite: false,
    description: '아늑한 분위기의 카페에서 달콤한 디저트와 함께 깊은 풍미의 에스프레소를 즐겼습니다. 오랫동안 가보고 싶었던 맛집리스트 중 하나였는데, 기대 이상으로 따뜻한 분위기와 훌륭한 맛이었습니다.',
    location: '홍대 커피클럽',
    tags: ['디저트카페', '커피맛집', '홍대핫플', '카페투어']
  },
  { 
    id: 'mo-003', 
    title: '봄바람 페스티벌', 
    date: '2025.03.15', 
    year: '2025', 
    image: 'festival.png', 
    thumbnailColor: 'blue', 
    isFavorite: false,
    description: '화려한 조명과 신나는 음악이 가득했던 페스티벌 현장! 밤하늘을 수놓는 음악 비트와 함께 관객들과 하나되어 밤새도록 춤추고 노래하며 스트레스를 날려버린 날이었습니다.',
    location: '난지 한강공원 젊음의 광장',
    tags: ['라이브뮤직', '콘서트', '야외페스티벌', '꿀잼']
  },
  { 
    id: 'mo-004', 
    title: '다꾸 모임', 
    date: '2025.02.01', 
    year: '2025', 
    image: 'boardgame.png', 
    thumbnailColor: 'cream', 
    isFavorite: true,
    description: '각자 좋아하는 스티커와 다이어리를 잔뜩 들고 모였습니다. 서로의 스티커를 교환하고 꾸미기 팁을 공유하며, 잔잔한 음악 속에서 나만의 기록을 채워나가는 아기자기하고 집중도 높은 시간이었습니다.',
    location: '서교동 크리에이티브 라운지',
    tags: ['다이어리꾸미기', '스튜디오', '취미모임', '아날로그']
  },
  { 
    id: 'mo-005', 
    title: '남산 야경', 
    date: '2025.01.20', 
    year: '2025', 
    image: 'namsan.png', 
    thumbnailColor: 'gray', 
    isFavorite: true,
    description: '남산서울타워에 올라 한눈에 내려다보이는 서울의 환상적인 밤하늘과 불빛들을 감상했습니다. 빌딩 숲이 만들어내는 찬란한 야경을 배경으로 멋진 인생 사진도 남기고 시원한 밤공기를 마셨습니다.',
    location: '남산서울타워 전망대',
    tags: ['서울야경', '드라이브', '인생샷', '야경투어']
  }
];

const optionMenuSections: OptionMenuSection[] = [
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
      { key: 'blueBackground', label: '블루 배경 모드', icon: 'globe', color: 'blue', type: 'toggle' },
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

const bankOptions = ['국민은행', '신한은행', '우리은행', '하나은행', '카카오뱅크', '토스뱅크'];

interface AppContextType {
  profile: Profile;
  groups: Group[];
  friends: Friend[];
  recentSearches: string[];
  popularCategories: PopularCategory[];
  groupPurposeCategories: GroupPurposeCategory[];
  participationStats: ParticipationStats;
  settlements: Settlement[];
  settlementInsight: { message: string; ctaLabel: string };
  addSettlement: (title: string, amount: number, category?: string) => void;
  addActivity: (title: string, image: string | null, avatarColor?: string, memo?: string) => void;
  appSettings: AppSettings;
  payoutAccount: PayoutAccount;
  bankOptions: string[];
  optionMenuSections: OptionMenuSection[];
  savedMoments: Moment[];
  addGroup: (name: string, purpose: string, icon?: string) => void;
  joinGroupById: (groupId: string) => Group | null;
  updateProfile: (updated: Partial<Profile>) => void;
  handleGoogleLogin: (forceSelectAccount?: boolean) => Promise<any>;
  handleLogout: () => Promise<void>;
  isGoogleLoading: boolean;
  updatePayoutAccount: (bankName: string, accountNumber: string, holderName: string) => void;
  toggleNotifications: () => void;
  toggleBlueBackground: () => void;
  changeLanguage: (lang: string) => void;
  toggleFavoriteGroup: (id: string) => void;
  toggleFavoriteMoment: (id: string) => void;
  addMoment: (title: string, date: string, year: string, image: string | null, thumbnailColor: string) => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isCameraOpen: boolean;
  setCameraOpen: (open: boolean) => void;
  isMemoryOpen: boolean;
  setMemoryOpen: (open: boolean) => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    type: 'message',
    icon: '💬',
    title: '민수님의 새로운 댓글',
    message: '"오늘 저녁 오페라 모임 기대되네요!" 댓글을 남겼습니다.',
    timeAgo: '10분 전',
    timestamp: '10분 전',
    targetUrl: '/groups',
    isRead: false,
    badgeColor: '#FEDD13'
  },
  {
    id: 'notif-02',
    type: 'settlement',
    icon: '💰',
    title: '정산 요청 알림',
    message: '성수 카페 정산 15,000원 입금 확인 요청이 도착했습니다.',
    timeAgo: '1시간 전',
    timestamp: '1시간 전',
    targetUrl: '/calculate',
    isRead: false,
    badgeColor: '#8FC7E8'
  },
  {
    id: 'notif-03',
    type: 'event',
    icon: '🎉',
    title: '주말 자작나무 숲 페스티벌',
    message: '신규 모임 참여가 최종 승인되었습니다. 장소를 확인하세요.',
    timeAgo: '3시간 전',
    timestamp: '3시간 전',
    targetUrl: '/groups',
    isRead: true,
    badgeColor: '#F491BC'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile((prev) => ({
          ...prev,
          id: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          profileImage: user.photoURL || avatarMe,
        }));
      } else {
        setProfile(initialProfile);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async (forceSelectAccount: boolean = false) => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      if (forceSelectAccount) {
        provider.setCustomParameters({
          prompt: 'select_account'
        });
      }
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [friends] = useState<Friend[]>(initialFriends);
  const [recentSearches, setRecentSearches] = useState<string[]>(['오메라', '한강 피크닉', '홍대 맛집']);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    notificationsEnabled: true,
    language: '한국어',
    appVersion: 'v2.4.0',
    blueBackgroundEnabled: false
  });
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccount>({
    bankName: '국민은행',
    accountNumberMasked: '1234-56-*******',
    holderName: '이태노'
  });
  const [savedMoments, setSavedMoments] = useState<Moment[]>(initialSavedMoments);
  const [settlements, setSettlements] = useState<Settlement[]>(initialSettlements);

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [isMemoryOpen, setMemoryOpen] = useState(false);

  const addActivity = (title: string, image: string | null, avatarColor: string = 'pink') => {
    const colors = ['pink', 'blue', 'cream', 'yellow', 'green'];
    const selectedColor = avatarColor || colors[Math.floor(Math.random() * colors.length)];
    const newAct = {
      id: `act-${Date.now()}`,
      title,
      image,
      avatarColor: selectedColor
    };
    setProfile((prev) => ({
      ...prev,
      activitySummary: [newAct, ...prev.activitySummary]
    }));
  };

  const updateProfile = (updated: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const addSettlement = (title: string, amount: number, category: string = '게임 정산') => {
    const today = new Date();
    const dateStr = `${String(today.getFullYear()).slice(2)}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    const newSettlement: Settlement = {
      id: `settle-${Date.now()}`,
      title,
      amount,
      status: 'pending',
      date: dateStr,
      category,
      emoji: '🎯',
      thumbnail: null
    };
    setSettlements((prev) => [newSettlement, ...prev]);
  };

  const addGroup = (name: string, purpose: string, icon?: string) => {
    const groupId = `group-${Date.now()}`;
    const newGroup: Group = {
      id: groupId,
      name,
      memberCount: 1,
      thumbnailColor: ['pink', 'cream', 'yellow', 'blue', 'green'][Math.floor(Math.random() * 5)],
      icon: icon || '👥',
      isFavorite: false,
      joinLink: `/join/${groupId}`,
      createdAt: new Date().toISOString(),
      recentActivities: [
        {
          id: `act-init-${Date.now()}`,
          type: 'notice',
          message: `새로운 '${purpose}' 모임이 생성되었습니다.`,
          timestamp: new Date().toISOString()
        }
      ],
      members: [{ avatarUrl: 'avatar_me_circle.png' }]
    };
    setGroups((prev) => [newGroup, ...prev]);
  };

  const joinGroupById = (groupId: string): Group | null => {
    let joinedGroup: Group | null = null;
    setGroups((prev) => {
      const exists = prev.some((g) => g.id === groupId);
      if (exists) {
        return prev.map((g) => {
          if (g.id === groupId) {
            joinedGroup = g;
            const hasMe = g.members.some((m) => m.avatarUrl === 'avatar_me_circle.png');
            return {
              ...g,
              memberCount: hasMe ? g.memberCount : g.memberCount + 1,
              members: hasMe ? g.members : [...g.members, { avatarUrl: 'avatar_me_circle.png' }]
            };
          }
          return g;
        });
      }
      return prev;
    });
    return joinedGroup;
  };

  const updatePayoutAccount = (bankName: string, accountNumber: string, holderName: string) => {
    const masked = accountNumber.length > 6 
      ? accountNumber.substring(0, 6) + '-'.repeat(accountNumber.length - 6)
      : accountNumber;
    setPayoutAccount({
      bankName,
      accountNumberMasked: masked,
      holderName
    });
  };

  const toggleNotifications = () => {
    setAppSettings((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
  };

  const toggleBlueBackground = () => {
    setAppSettings((prev) => ({
      ...prev,
      blueBackgroundEnabled: !prev.blueBackgroundEnabled
    }));
  };

  const changeLanguage = (lang: string) => {
    setAppSettings((prev) => ({
      ...prev,
      language: lang
    }));
  };

  const toggleFavoriteGroup = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isFavorite: !g.isFavorite } : g))
    );
  };

  const toggleFavoriteMoment = (id: string) => {
    setSavedMoments((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  };

  const addMoment = (title: string, date: string, year: string, image: string | null, thumbnailColor: string) => {
    const newMoment: Moment = {
      id: `mo-${Date.now()}`,
      title,
      date,
      year,
      image,
      thumbnailColor,
      isFavorite: false
    };
    setSavedMoments((prev) => [newMoment, ...prev]);
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== query);
      return [query, ...filtered].slice(0, 10); // 최대 10개 관리
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== query));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        groups,
        friends,
        recentSearches,
        popularCategories: initialPopularCategories,
        groupPurposeCategories: initialGroupPurposeCategories,
        participationStats: initialParticipationStats,
        settlements,
        addSettlement,
        addActivity,
        settlementInsight: {
          message: '이번 달 정산이 원활하게 진행되고 있어요!\n미정산 내역 2건을 확인해보세요.',
          ctaLabel: '내역 상세 보기'
        },
        appSettings,
        payoutAccount,
        bankOptions,
        optionMenuSections,
        savedMoments,
        addGroup,
        joinGroupById,
        updateProfile,
        handleGoogleLogin,
        handleLogout,
        isGoogleLoading,
        updatePayoutAccount,
        toggleNotifications,
        toggleBlueBackground,
        changeLanguage,
        toggleFavoriteGroup,
        toggleFavoriteMoment,
        addMoment,
        notifications,
        unreadNotifCount,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        isSearchOpen,
        setSearchOpen,
        isCameraOpen,
        setCameraOpen,
        isMemoryOpen,
        setMemoryOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
