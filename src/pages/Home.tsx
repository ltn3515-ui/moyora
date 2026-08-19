import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { TasteActivityModal } from '../components/Modal/TasteActivityModal';
import { CalendarModal } from '../components/Modal/CalendarModal';
import { UpcomingEventsModal } from '../components/Modal/UpcomingEventsModal';
import { MostSharedModal } from '../components/Modal/MostSharedModal';
import { CreateGroupModal } from '../components/Modal/CreateGroupModal';

import avatarMe from '../assets/avatar_me_circle.png';
import avatarF1 from '../assets/avatar_f1_circle.png';
import avatarF2 from '../assets/avatar_f2_circle.png';
import avatarF3 from '../assets/avatar_f3_circle.png';

import activityArt from '../assets/activity_art.png';
import festivalImg from '../assets/festival.png';
import picnicImg from '../assets/picnic.png';

interface FriendAvatar {
  id: string;
  label: string;
  ring: string;
  photo: string;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAppContext();
  const [isTasteModalOpen, setIsTasteModalOpen] = useState(false);
  const [selectedTasteId, setSelectedTasteId] = useState<string | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [isMostSharedModalOpen, setIsMostSharedModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  const friendsData: FriendAvatar[] = [
    { id: 'me', label: '나의 활동', ring: '#FEDD13', photo: profile.profileImage || avatarMe },
    { id: 'f1', label: '민수', ring: '#F491BC', photo: avatarF1 || '/avatar_f1_circle.png' },
    { id: 'f2', label: '지은', ring: '#8FC7E8', photo: avatarF2 || '/avatar_f2_circle.png' },
    { id: 'f3', label: '현우', ring: '#FEDD13', photo: avatarF3 || '/avatar_f3_circle.png' }
  ];

  const handleFriendClick = (friend: FriendAvatar) => {
    alert(`"${friend.label}" 친구의 프로필 상세 화면은 다음 단계에서 제작 및 연결됩니다.`);
  };

  const handleActivityClick = (activityId: string) => {
    setSelectedTasteId(activityId);
    setIsTasteModalOpen(true);
  };

  return (
    <HomeContainer>
      {/* 인트로 */}
      <IntroSection>
        <IntroTitle>발견하고,<br />만들고, 즐기세요</IntroTitle>
        <IntroSubtitle>열심히 일하고, 즐겁게 놀아요</IntroSubtitle>
      </IntroSection>

      {/* 나의 활동 / 친구 아바타 리스트 */}
      <FriendsRow>
        {friendsData.map((f) => (
          <FriendItem key={f.id} onClick={() => handleFriendClick(f)}>
            <AvatarWrap style={{ '--ring-color': f.ring } as React.CSSProperties}>
              <AvatarImage src={f.photo} alt={`${f.label} 프로필 사진`} />
            </AvatarWrap>
            <FriendLabel>{f.label}</FriendLabel>
          </FriendItem>
        ))}
        <FriendItemAdd onClick={() => navigate('/friends')}>
          <AvatarWrapAdd>+</AvatarWrapAdd>
          <FriendLabel>더보기</FriendLabel>
        </FriendItemAdd>
      </FriendsRow>

      {/* 취향 저격 활동 */}
      <Section>
        <SectionHeader>
          <SectionTitle>취향 저격 활동</SectionTitle>
          <MoreButton aria-label="더보기" onClick={() => { setSelectedTasteId(null); setIsTasteModalOpen(true); }}>⋯</MoreButton>
        </SectionHeader>
        <TasteGrid>
          <TasteCardMain onClick={() => handleActivityClick('act-01')}>
            <ThumbBadgeWrap>
              <ThumbImg src={activityArt} alt="오페라" />
              <CategoryBadge>🎭 오페라</CategoryBadge>
            </ThumbBadgeWrap>
            <TasteCardContent>
              <TasteCardName>여름 오페라 갈라 축제</TasteCardName>
              <TasteCardDate>24.04.23 · 예술의전당</TasteCardDate>
            </TasteCardContent>
          </TasteCardMain>

          <TasteCardPink onClick={() => handleActivityClick('act-02')}>
            <ThumbBadgeWrapSmall>
              <ThumbImgSmall src={festivalImg} alt="페스티벌" />
            </ThumbBadgeWrapSmall>
            <TasteCardContent>
              <TasteCardName>자작나무 숲 페스티벌</TasteCardName>
              <TasteCardDate>24.05.30 · 인제</TasteCardDate>
            </TasteCardContent>
          </TasteCardPink>

          <TasteCardBlue onClick={() => handleActivityClick('act-03')}>
            <ThumbBadgeWrapSmall>
              <ThumbImgSmall src={picnicImg} alt="소분 행사" />
            </ThumbBadgeWrapSmall>
            <TasteCardContent>
              <TasteCardName>성수 소분 & 피크닉</TasteCardName>
              <TasteCardDate>24.05.10 · 성수</TasteCardDate>
            </TasteCardContent>
          </TasteCardBlue>
        </TasteGrid>
      </Section>

      {/* 친구들과 함께하는 이벤트 */}
      <Section className="marginTop">
        <SectionHeader>
          <SectionTitle>친구들과 함께하는 이벤트</SectionTitle>
          <MoreButton aria-label="더보기">⋯</MoreButton>
        </SectionHeader>
        <EventList>
          <EventCard onClick={() => setIsCalendarModalOpen(true)}>
            <EventIcon>📅</EventIcon>
            <EventText>날짜 확인</EventText>
            <EventChevron>›</EventChevron>
          </EventCard>
          <EventCard onClick={() => setIsUpcomingModalOpen(true)}>
            <EventIcon>🎁</EventIcon>
            <EventText>다가오는 이벤트</EventText>
            <EventChevron>›</EventChevron>
          </EventCard>
          <EventCard onClick={() => setIsMostSharedModalOpen(true)}>
            <EventIcon><i className="fa-solid fa-share-nodes"></i></EventIcon>
            <EventText>가장 많이 공유된</EventText>
            <EventChevron>›</EventChevron>
          </EventCard>
        </EventList>

        <CtaCard>
          <CtaText>다음 이벤트를<br />고르셨나요?</CtaText>
          <CtaBtn onClick={() => setIsCreateGroupModalOpen(true)}>
            새 모임 만들기 →
          </CtaBtn>
        </CtaCard>
      </Section>

      {/* 취향 저격 추천 모임 모달 */}
      <TasteActivityModal
        isOpen={isTasteModalOpen}
        initialActivityId={selectedTasteId}
        onClose={() => setIsTasteModalOpen(false)}
      />

      {/* 캘린더 날짜 확인 모달 */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      {/* 다가오는 이벤트 모달 */}
      <UpcomingEventsModal
        isOpen={isUpcomingModalOpen}
        onClose={() => setIsUpcomingModalOpen(false)}
      />

      {/* 가장 많이 공유된 게시물 (좋아요 순) 모달 */}
      <MostSharedModal
        isOpen={isMostSharedModalOpen}
        onClose={() => setIsMostSharedModalOpen(false)}
        onOpenActivityDetail={(activity) => {
          setIsMostSharedModalOpen(false);
          setSelectedTasteId(activity.title);
          setIsTasteModalOpen(true);
        }}
      />

      {/* 6단계 신규 모임 생성 모달 */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

const IntroSection = styled.section`
  padding: 10px 20px 20px;
`;

const IntroTitle = styled.h2`
  font-size: 34px;
  line-height: 1.28;
  font-weight: 800;
  letter-spacing: -0.8px;
  margin: 0;
`;

const IntroSubtitle = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
  letter-spacing: -0.2px;
  margin-bottom: 0;
`;

const FriendsRow = styled.ul`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 4px 20px 0;
  margin-bottom: 28px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-top: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FriendItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.94);
  }
`;

const FriendItemAdd = styled(FriendItem)`
  cursor: pointer;
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2.5px solid ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 0 2px var(--ring-color, ${({ theme }) => theme.colors.yellow});
  box-sizing: border-box;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarWrapAdd = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1.5px solid #DDD6C8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 300;
  color: #B2A796;
  box-shadow: none;
  box-sizing: border-box;
`;

const FriendLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2px;
  letter-spacing: -0.3px;
`;

const Section = styled.section`
  padding: 0 20px;

  &.marginTop {
    margin-top: 28px;
  }
`;

const SectionHeader = styled.div`
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

const MoreButton = styled.button`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
`;

const TasteGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 14px;
`;

const blobAnimation1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10px, -10px) scale(1.05); }
`;

const blobAnimation2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-10px, 8px) scale(0.95); }
`;

const BaseTasteCard = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.black};
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 14px 28px rgba(38, 38, 44, 0.12), 0 10px 10px rgba(38, 38, 44, 0.06);
  }

  &:active {
    transform: scale(0.97);
  }

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    z-index: -1;
  }
`;

const TasteCardMain = styled(BaseTasteCard)`
  grid-row: span 2;
  background: ${({ theme }) => theme.colors.yellowDark};
  min-height: 292px;

  &::before {
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.28);
    left: -10px;
    top: -20px;
    animation: ${blobAnimation1} 6s ease-in-out infinite;
  }

  &::after {
    width: 120px;
    height: 120px;
    background: rgba(38, 38, 44, 0.05);
    right: -20px;
    bottom: 30px;
    animation: ${blobAnimation2} 8s ease-in-out infinite;
  }
`;

const TasteCardPink = styled(BaseTasteCard)`
  background: ${({ theme }) => theme.colors.pink};
  color: ${({ theme }) => theme.colors.white};

  &::before {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.2);
    right: -20px;
    top: -20px;
    animation: ${blobAnimation1} 5s ease-in-out infinite;
  }
`;

const TasteCardBlue = styled(BaseTasteCard)`
  background: ${({ theme }) => theme.colors.blue};

  &::before {
    width: 90px;
    height: 90px;
    background: rgba(255, 255, 255, 0.24);
    left: -10px;
    bottom: -10px;
    animation: ${blobAnimation2} 7s ease-in-out infinite;
  }
`;

const TasteCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
`;

const ThumbBadgeWrap = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  height: 145px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${TasteCardMain}:hover & {
    transform: scale(1.08);
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 10px;
`;

const ThumbBadgeWrapSmall = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
`;

const ThumbImgSmall = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${BaseTasteCard}:hover & {
    transform: scale(1.1);
  }
`;

const TasteCardName = styled.div`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.3px;
  line-height: 1.25;
`;

const TasteCardDate = styled.div`
  font-size: 11px;
  opacity: 0.8;
  font-weight: 600;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const EventCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: #FFF;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.99);
  }
`;

const EventIcon = styled.div`
  font-size: 20px;
  margin-right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const EventText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  flex-grow: 1;
`;

const EventChevron = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 300;
`;

const CtaCard = styled.div`
  background: #2D2D2F;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px 22px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CtaText = styled.span`
  font-size: 17px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.2px;
`;

const CtaBtn = styled.button`
  background: ${({ theme }) => theme.colors.yellow};
  color: ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.radius.round};
  font-weight: 700;
  font-size: 13px;
  padding: 10px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }
`;
