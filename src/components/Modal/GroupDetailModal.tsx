import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { Group } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast';
import { GoogleMapView } from '../Map/GoogleMapView';

import apeachAvatar from '../../assets/apeach_avatar.png';
import choonsikAvatar from '../../assets/choonsik_avatar.png';
import neoAvatar from '../../assets/neo_avatar.png';
import frodoAvatar from '../../assets/frodo_avatar.png';
import muziAvatar from '../../assets/muzi_avatar.png';
import conAvatar from '../../assets/con_avatar.png';
import jaygAvatar from '../../assets/jayg_avatar.png';
import leetaenoAvatar from '../../assets/avatar_leetaeno.png';
import avatarMe from '../../assets/avatar_me_circle.png';
import avatarF1 from '../../assets/avatar_f1_circle.png';
import avatarF2 from '../../assets/avatar_f2_circle.png';
import avatarF3 from '../../assets/avatar_f3_circle.png';

const AVATAR_MAP: Record<string, string> = {
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
  'avatar_f3_circle.png': avatarF3 || '/avatar_f3_circle.png'
};

const COLOR_ICONS: Record<string, string> = {
  yellow: '☀️',
  pink: '📖',
  blue: '⛰️',
  cream: '🎨',
  green: '🌿'
};

interface GroupDetailModalProps {
  isOpen: boolean;
  group: Group | null;
  onClose: () => void;
}

export const GroupDetailModal: React.FC<GroupDetailModalProps> = ({
  isOpen,
  group,
  onClose
}) => {
  const { toggleFavoriteGroup } = useAppContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!isOpen || !group) return null;

  const handleGoCalculate = () => {
    onClose();
    navigate('/calculate');
  };

  const handleCreateNotice = () => {
    showToast(`'${group.name}' 모임의 새 공지가 등록되었습니다! 📢`, 'success', '📢');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>모임 상세보기</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 상단 모임 히어로 카드 */}
        <HeroCard className={group.thumbnailColor}>
          <HeroAvatarWrap>
            {group.profileImage ? (
              <HeroAvatarImg src={AVATAR_MAP[group.profileImage]} alt={group.name} />
            ) : (
              <HeroIconText>{group.icon || COLOR_ICONS[group.thumbnailColor] || '👥'}</HeroIconText>
            )}
          </HeroAvatarWrap>

          <HeroMeta>
            <TitleRow>
              <HeroTitle>{group.name}</HeroTitle>
              <StarBtn
                type="button"
                className={group.isFavorite ? 'favorite' : ''}
                onClick={() => toggleFavoriteGroup(group.id)}
              >
                ★
              </StarBtn>
            </TitleRow>
            <MemberBadge>참여 멤버 {group.memberCount}명</MemberBadge>
          </HeroMeta>
        </HeroCard>

        {/* 참여 멤버 아바타 리스트 */}
        <SectionBox>
          <SectionLabel>👥 함께하는 멤버</SectionLabel>
          <MemberListScroll>
            <MemberChip>
              <MemberAvatarImg src={avatarMe} alt="나" />
              <MemberName>이태노 (나)</MemberName>
            </MemberChip>
            <MemberChip>
              <MemberAvatarImg src={avatarF1} alt="민수" />
              <MemberName>민수</MemberName>
            </MemberChip>
            <MemberChip>
              <MemberAvatarImg src={avatarF2} alt="지은" />
              <MemberName>지은</MemberName>
            </MemberChip>
            <MemberChip>
              <MemberAvatarImg src={avatarF3} alt="현우" />
              <MemberName>현우</MemberName>
            </MemberChip>
          </MemberListScroll>
        </SectionBox>

        {/* 최근 모임 활동 / 공지 */}
        <SectionBox>
          <SectionLabel>📢 모임 소식 & 최근 활동</SectionLabel>
          <ActivityList>
            {group.recentActivities && group.recentActivities.length > 0 ? (
              group.recentActivities.map((act) => (
                <ActivityItem key={act.id}>
                  <ActivityIcon>
                    {act.type === 'notice' ? '📢' : act.type === 'comment' ? '💬' : '📅'}
                  </ActivityIcon>
                  <ActivityText>{act.message}</ActivityText>
                </ActivityItem>
              ))
            ) : (
              <ActivityItem>
                <ActivityIcon>💡</ActivityIcon>
                <ActivityText>모임의 활발한 참여와 소식을 나누어보세요!</ActivityText>
              </ActivityItem>
            )}
          </ActivityList>
        </SectionBox>

        {/* 모임 위치 & 구글 지도 */}
        <SectionBox>
          <SectionLabel>📍 모임 만남 장소 (구글 지도)</SectionLabel>
          <GoogleMapView
            locationName={group.name}
            address="서울특별시 강남구 테헤란로 101"
            height="180px"
            showControls={true}
          />
        </SectionBox>

        {/* 하단 액션 버튼 */}
        <FooterSection>
          <NoticeBtn type="button" onClick={handleCreateNotice}>
            공지 작성 📢
          </NoticeBtn>
          <CalcBtn type="button" onClick={handleGoCalculate}>
            정산하러 가기 💸
          </CalcBtn>
        </FooterSection>
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
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
  gap: 16px;
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

const HeroCard = styled.div`
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;

  &.yellow { background: #fef08a; }
  &.pink { background: #fbcfe8; }
  &.blue { background: #bae6fd; }
  &.cream { background: #fef3c7; }
  &.green { background: #bbf7d0; }
`;

const HeroAvatarWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`;

const HeroAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroIconText = styled.span`
  font-size: 28px;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeroTitle = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const StarBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;

  &.favorite {
    color: #f59e0b;
  }
`;

const MemberBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`;

const SectionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
`;

const MemberListScroll = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 2px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MemberChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 10px;
  border-radius: 20px;
  flex-shrink: 0;
`;

const MemberAvatarImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const MemberName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #334155;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  padding: 10px 12px;
  border-radius: 12px;
`;

const ActivityIcon = styled.span`
  font-size: 16px;
`;

const ActivityText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #334155;
`;

const FooterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const NoticeBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const CalcBtn = styled.button`
  flex: 2;
  padding: 12px;
  border-radius: 14px;
  border: none;
  background: #fedd13;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(254, 221, 19, 0.4);
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
    transform: translateY(-1px);
  }
`;
