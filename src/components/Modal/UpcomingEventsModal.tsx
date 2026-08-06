import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';
import { useNavigate } from 'react-router-dom';

import festivalImg from '../../assets/festival.png';
import namsanImg from '../../assets/namsan.png';
import picnicImg from '../../assets/picnic.png';
import boardgameImg from '../../assets/boardgame.png';

import avatarF1 from '../../assets/avatar_f1_circle.png';
import avatarF2 from '../../assets/avatar_f2_circle.png';
import avatarF3 from '../../assets/avatar_f3_circle.png';
import avatarMe from '../../assets/avatar_me_circle.png';

interface UpcomingEventItem {
  id: string;
  title: string;
  dDay: string;
  date: string;
  category: string;
  location: string;
  image: string;
  badgeColor: string;
}

const UPCOMING_EVENTS: UpcomingEventItem[] = [
  {
    id: 'up-01',
    title: '🎁 2026 여름 오페라 갈라 축제',
    dDay: 'D-10',
    date: '2026.08.15(토) 14:00',
    category: '공연/예술',
    location: '예술의전당 오페라극장',
    image: festivalImg,
    badgeColor: '#FEDD13'
  },
  {
    id: 'up-02',
    title: '🎲 주말 보드게임 소셜 챔피언십',
    dDay: 'D-11',
    date: '2026.08.16(일) 15:00',
    category: '취미/파티',
    location: '강남 히어로 보드게임 카페',
    image: boardgameImg,
    badgeColor: '#A8E6CF'
  },
  {
    id: 'up-03',
    title: '📦 성수 제로웨이스트 소분 마켓',
    dDay: 'D-13',
    date: '2026.08.18(화) 19:00',
    category: '소분/친환경',
    location: '성수 리필스테이션 파크',
    image: picnicImg,
    badgeColor: '#8FC7E8'
  },
  {
    id: 'up-04',
    title: '🌲 자작나무 숲 힐링 버스킹',
    dDay: 'D-17',
    date: '2026.08.22(토) 10:00',
    category: '야외활동',
    location: '인제 자작나무 숲 야외무대',
    image: festivalImg,
    badgeColor: '#F491BC'
  },
  {
    id: 'up-05',
    title: '📸 남산 야경 출사 & 한강 피크닉',
    dDay: 'D-18',
    date: '2026.08.23(일) 18:30',
    category: '출사/산책',
    location: '남산타워 팔각정 광장',
    image: namsanImg,
    badgeColor: '#FFD3B6'
  }
];

interface UpcomingEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpcomingEventsModal: React.FC<UpcomingEventsModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleEventClick = (title: string) => {
    showToast(`'${title}' 이벤트에 참여 신청되었습니다! 🎁`, 'success', '🎁');
    onClose();
    navigate('/groups');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>🎁 다가오는 이벤트 목록</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        <SubtitleText>최근 일정이 입박한 모여라 이벤트들입니다.</SubtitleText>

        {/* 이벤트 최근순 리스트 */}
        <EventListContainer>
          {UPCOMING_EVENTS.map((item) => (
            <EventCardItem key={item.id} onClick={() => handleEventClick(item.title)}>
              <DDayBadge style={{ background: item.badgeColor }}>
                {item.dDay}
              </DDayBadge>

              <CardBody>
                <CardTitleRow>
                  <CardTitle>{item.title}</CardTitle>
                  <CategoryTag>{item.category}</CategoryTag>
                </CardTitleRow>
                <CardMeta>📅 {item.date}</CardMeta>
                <CardLocation>📍 {item.location}</CardLocation>
              </CardBody>

              <ChevronSide>
                <AvatarGroup>
                  <AvatarMini src={avatarMe} alt="나" />
                  <AvatarMini src={avatarF1} alt="민수" />
                  <AvatarMini src={avatarF2} alt="지은" />
                  <AvatarMini src={avatarF3} alt="현우" />
                </AvatarGroup>
                <ChevronIcon>›</ChevronIcon>
              </ChevronSide>
            </EventCardItem>
          ))}
        </EventListContainer>
      </ModalCard>
    </Overlay>
  );
};

// Keyframe Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px) scale(0.96); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease-out forwards;
`;

const ModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 88vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  color: #111827;
`;

const CloseBtn = styled.button`
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
    color: #111;
  }
`;

const SubtitleText = styled.p`
  margin: -4px 0 0;
  font-size: 13px;
  color: #64748b;
`;

const EventListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const EventCardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ffffff;
    border-color: #fedd13;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const DDayBadge = styled.div`
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  flex-shrink: 0;
  white-space: nowrap;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
  overflow: hidden;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CardTitle = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const CardMeta = styled.span`
  font-size: 11px;
  color: #3b82f6;
  font-weight: 700;
`;

const CardLocation = styled.span`
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChevronSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const AvatarGroup = styled.div`
  display: flex;
  margin-left: -4px;
`;

const AvatarMini = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  margin-left: -4px;
`;

const ChevronIcon = styled.span`
  font-size: 18px;
  color: #94a3b8;
`;
