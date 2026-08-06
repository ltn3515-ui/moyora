import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { MessageModal } from '../components/Modal/MessageModal';
import { ActivitySummaryModal } from '../components/Modal/ActivitySummaryModal';
import { ProfileImageModal } from '../components/Modal/ProfileImageModal';
import { WeeklyActivityModal } from '../components/Modal/WeeklyActivityModal';
import { HealthStepModal } from '../components/Modal/HealthStepModal';
import { SleepTrackerModal } from '../components/Modal/SleepTrackerModal';
import type { Friend } from '../types';

import neoAvatar from '../assets/neo_avatar.png';
import frodoAvatar from '../assets/frodo_avatar.png';
import muziAvatar from '../assets/muzi_avatar.png';
import conAvatar from '../assets/con_avatar.png';
import jaygAvatar from '../assets/jayg_avatar.png';
import apeachAvatar from '../assets/apeach_avatar.png';
import choonsikAvatar from '../assets/choonsik_avatar.png';
import leetaenoAvatar from '../assets/avatar_leetaeno.png';
import activityArt from '../assets/activity_art.png';
import activityCreate from '../assets/activity_create.png';

import avatarMe from '../assets/avatar_me_circle.png';
import avatarF1 from '../assets/avatar_f1_circle.png';
import avatarF2 from '../assets/avatar_f2_circle.png';
import avatarF3 from '../assets/avatar_f3_circle.png';

const IMAGE_MAP: Record<string, string> = {
  'neo_avatar.png': neoAvatar || '/neo_avatar.png',
  'frodo_avatar.png': frodoAvatar || '/frodo_avatar.png',
  'muzi_avatar.png': muziAvatar || '/muzi_avatar.png',
  'con_avatar.png': conAvatar || '/con_avatar.png',
  'jayg_avatar.png': jaygAvatar || '/jayg_avatar.png',
  'apeach_avatar.png': apeachAvatar || '/apeach_avatar.png',
  'choonsik_avatar.png': choonsikAvatar || '/choonsik_avatar.png',
  'avatar_leetaeno.png': leetaenoAvatar || '/avatar_leetaeno.png',
  'avatar_me_circle.png': avatarMe || '/avatar_me_circle.png',
  'avatar_f1_circle.png': avatarF1 || '/avatar_f1_circle.png',
  'avatar_f2_circle.png': avatarF2 || '/avatar_f2_circle.png',
  'avatar_f3_circle.png': avatarF3 || '/avatar_f3_circle.png',
  'activity_art.png': activityArt || '/activity_art.png',
  'activity_create.png': activityCreate || '/activity_create.png'
};

// SVG 아이콘 모음
const MENU_ICONS = {
  gear: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5CE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" fill="#7A5CE0" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  image: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="3.5" fill="#5E72E4" />
      <circle cx="8.5" cy="8.5" r="2.5" fill="#FFE066" />
      <path d="m3 16 5.5-5.5a1.5 1.5 0 0 1 2.12 0l3.88 3.88" stroke="#ffffff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11.5 15.5 3.5-3.5a1.5 1.5 0 0 1 2.12 0l3.88 3.88" stroke="#ffffff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 18.5h18" stroke="#3E7FA8" strokeWidth="1.5" />
    </svg>
  ),
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-10deg)', overflow: 'visible' }}>
      <rect x="2" y="5" width="20" height="14" rx="3.5" fill="#8C7BF2" stroke="none" />
      <line x1="20" y1="5" x2="6" y2="17" stroke="#4C35AC" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
};

const CHEVRON_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

interface MenuItem {
  key: string;
  label: string;
  icon: 'gear' | 'image' | 'message';
  color: string;
}

export const Profile: React.FC = () => {
  const { profile, friends, setMemoryOpen } = useAppContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [gaugeWidth, setGaugeWidth] = useState(0);

  const [selectedFriendForMessage, setSelectedFriendForMessage] = useState<Friend | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isHealthStepModalOpen, setIsHealthStepModalOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { key: 'settings', label: '환경 설정', icon: 'gear', color: 'purple' },
    { key: 'moments', label: '저장된 순간들', icon: 'image', color: 'blue' },
    { key: 'message', label: '메세지', icon: 'message', color: 'message' }
  ];

  useEffect(() => {
    // 게이지 바 애니메이션 효과
    const timer = setTimeout(() => {
      setGaugeWidth(profile.weeklyActivityPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [profile.weeklyActivityPercent]);

  const handleSendMessage = (_friendName: string, _message: string) => {
    showToast('메세지를 성공적으로 보냈습니다.', 'success', '✅');
  };

  const handleMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.key === 'settings') {
      navigate('/option');
    } else if (item.key === 'moments') {
      setMemoryOpen(true);
    } else if (item.key === 'message') {
      e.preventDefault();
      const targetFriend: Friend = friends && friends.length > 0 ? friends[0] : {
        id: 'f1',
        name: '민수',
        statusMessage: '오늘도 즐거운 하루 되세요!',
        profileImage: 'avatar_f1_circle.png',
        avatarColor: 'pink',
        isNew: false
      };
      setSelectedFriendForMessage(targetFriend);
      setIsMessageModalOpen(true);
    } else {
      e.preventDefault();
      alert(`"${item.label}" 메뉴는 다음 단계에서 개발 예정입니다.`);
    }
  };

  const formatSteps = (steps: number) => {
    return steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <ProfileContainer>
      {/* 프로필 히어로 */}
      <ProfileHero>
        <BlobYellow />
        <BlobPink />

        <AvatarWrap>
          <AvatarInner onClick={() => setIsProfileImageModalOpen(true)} style={{ cursor: 'pointer' }}>
            <img
              src={
                profile.profileImage
                  ? profile.profileImage.startsWith('data:') || profile.profileImage.startsWith('http')
                    ? profile.profileImage
                    : IMAGE_MAP[profile.profileImage] || leetaenoAvatar
                  : leetaenoAvatar
              }
              alt={profile.name}
            />
          </AvatarInner>
          <EditAvatarBtn aria-label="프로필 사진 수정" onClick={() => setIsProfileImageModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </EditAvatarBtn>
        </AvatarWrap>

        <HeroName>{profile.name}</HeroName>
        <HeroRole>{profile.role}</HeroRole>
      </ProfileHero>

      {/* 주간 활동 게이지 */}
      <Section>
        <WeeklyCard onClick={() => setIsWeeklyModalOpen(true)} style={{ cursor: 'pointer' }}>
          <WeeklyHead>
            <WeeklyLabel>주간 활동 ⚡</WeeklyLabel>
            <WeeklyPercent>{profile.weeklyActivityPercent}%</WeeklyPercent>
          </WeeklyHead>
          <WeeklyTrack>
            <WeeklyFill style={{ width: `${gaugeWidth}%` }} />
          </WeeklyTrack>
          <WeeklyCaption>{profile.weeklyActivityMessage}</WeeklyCaption>
        </WeeklyCard>
      </Section>

      {/* 건강 / 수면 2분할 */}
      <Section className="statMargin">
        <StatGrid>
          <StatCard className="health" onClick={() => setIsHealthStepModalOpen(true)} style={{ cursor: 'pointer' }}>
            <StatIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="4.5" r="1.8" />
                <path d="m9 21 2-6-2.5-2 .5-4.5L12 7l3 1.5.5 4.5-2.5 2 2 6" />
                <path d="m8 12-3 2" />
                <path d="m16 12 3 2" />
              </svg>
            </StatIcon>
            <StatContent>
              <StatLabel>건강 (걸음 수) 📱</StatLabel>
              <StatValue>
                {formatSteps(profile.health.steps)}
                <StatUnit>걸음</StatUnit>
              </StatValue>
            </StatContent>
          </StatCard>
          
          <StatCard className="sleep" onClick={() => setIsSleepModalOpen(true)} style={{ cursor: 'pointer' }}>
            <StatIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
              </svg>
            </StatIcon>
            <StatContent>
              <StatLabel>수면 🌙</StatLabel>
              <StatValue>
                {profile.sleep.hours}
                <StatUnit>시간</StatUnit>
              </StatValue>
            </StatContent>
          </StatCard>
        </StatGrid>
      </Section>

      {/* 활동 요약 */}
      <Section className="sectionMargin">
        <SectionHead>
          <SectionTitle>활동 요약</SectionTitle>
          <SectionLinkIcon aria-label="활동 요약 더보기" onClick={() => setIsActivityModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </SectionLinkIcon>
        </SectionHead>
        <ActivityScroll>
          {profile.activitySummary.map((item) => (
            <ActivityCard key={item.id} onClick={() => setIsActivityModalOpen(true)}>
              <ActivityImage src={item.image ? IMAGE_MAP[item.image] : activityArt} alt={item.title} loading="lazy" />
              <ActivityCardTitle>{item.title}</ActivityCardTitle>
            </ActivityCard>
          ))}
        </ActivityScroll>
      </Section>

      {/* 메뉴 리스트 */}
      <Section className="sectionMargin">
        <MenuCard>
          {menuItems.map((item) => (
            <MenuItemButton key={item.key} onClick={(e) => handleMenuClick(item, e)}>
              <MenuIconWrapper className={item.color}>
                {MENU_ICONS[item.icon]}
              </MenuIconWrapper>
              <MenuLabel>{item.label}</MenuLabel>
              <MenuChevron>{CHEVRON_ICON}</MenuChevron>
            </MenuItemButton>
          ))}
        </MenuCard>
      </Section>

      {/* 프로필 사진 변경 모달 */}
      <ProfileImageModal
        isOpen={isProfileImageModalOpen}
        onClose={() => setIsProfileImageModalOpen(false)}
      />

      {/* 주간 활동 관리 모달 */}
      <WeeklyActivityModal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
      />

      {/* 스마트폰 걸음 수 연동 모달 */}
      <HealthStepModal
        isOpen={isHealthStepModalOpen}
        onClose={() => setIsHealthStepModalOpen(false)}
      />

      {/* 수면 시간 기록 모달 */}
      <SleepTrackerModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
      />

      {/* 메세지 보내기 모달 */}
      <MessageModal
        isOpen={isMessageModalOpen}
        friendsList={friends}
        friend={selectedFriendForMessage}
        onClose={() => setIsMessageModalOpen(false)}
        onSendMessage={handleSendMessage}
      />

      {/* 활동 요약 더보기 및 추억 모달 */}
      <ActivitySummaryModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />
    </ProfileContainer>
  );
};

// Styled Components
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

const ProfileHero = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 28px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg};
`;

const BlobAnimation = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-10px, 15px) scale(1.1); }
`;

const BlobYellow = styled.span`
  position: absolute;
  top: -40px;
  left: -20px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.yellowLight};
  opacity: 0.7;
  filter: blur(12px);
  z-index: 1;
  animation: ${BlobAnimation} 7s ease-in-out infinite;
`;

const BlobPink = styled.span`
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.pinkLight};
  opacity: 0.6;
  filter: blur(14px);
  z-index: 1;
  animation: ${BlobAnimation} 6s ease-in-out infinite alternate;
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 86px;
  height: 86px;
  margin-bottom: 14px;
  z-index: 2;
`;

const AvatarInner = styled.div`
  width: 86px;
  height: 86px;
  border-radius: 50%;
  border: 3.5px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFF;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EditAvatarBtn = styled.button`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.9);
  }
`;

const HeroName = styled.h2`
  font-size: 21px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.4px;
  margin: 0 0 6px;
  z-index: 2;
`;

const HeroRole = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSub};
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.round};
  letter-spacing: -0.1px;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(38, 38, 44, 0.03);
`;

const Section = styled.section`
  padding: 0 20px;

  &.statMargin {
    margin-top: 12px;
  }

  &.sectionMargin {
    margin-top: 28px;
  }
`;

const WeeklyCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 20px 22px;
`;

const WeeklyHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const WeeklyLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
`;

const WeeklyPercent = styled.span`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.pink};
`;

const WeeklyTrack = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.round};
  overflow: hidden;
  margin-bottom: 12px;
`;

const WeeklyFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.pink};
  border-radius: ${({ theme }) => theme.radius.round};
  width: 0%;
  transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1);
`;

const WeeklyCaption = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  margin: 0;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;

  &.health {
    border-left: 4px solid ${({ theme }) => theme.colors.blue};
  }

  &.sleep {
    border-left: 4px solid ${({ theme }) => theme.colors.cream};
  }
`;

const StatIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const StatUnit = styled.span`
  font-size: 11px;
  font-weight: 600;
  margin-left: 2px;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin: 0;
`;

const SectionLinkIcon = styled.button`
  color: ${({ theme }) => theme.colors.textSub};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateX(2px);
  }
`;

const ActivityScroll = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ActivityCard = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 140px;
  height: 100px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }
`;

const ActivityImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85);
`;

const ActivityCardTitle = styled.span`
  position: absolute;
  bottom: 10px;
  left: 12px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
`;

const MenuCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 6px 0;
`;

const MenuItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 14px 20px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease;

  &:hover {
    background: #FFFBF3;
  }

  & + &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 74px; /* 20px(padding) + 38px(icon) + 16px(gap) = 74px */
    right: 20px;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const MenuIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 8px rgba(140, 123, 242, 0.12);
  border: 1px solid rgba(220, 215, 235, 0.35);
  flex-shrink: 0;
`;

const MenuLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  flex-grow: 1;
  text-align: left;
`;

const MenuChevron = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
`;
