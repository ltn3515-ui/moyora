import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { Group } from '../../types';
import { CreateGroupModal } from './CreateGroupModal';

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

interface MyGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyGroupsModal: React.FC<MyGroupsModalProps> = ({ isOpen, onClose }) => {
  const { groups, toggleFavoriteGroup } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'favorite'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!isOpen) return null;

  const filteredGroups = groups.filter((g) => {
    if (activeTab === 'favorite' && !g.isFavorite) return false;
    if (searchQuery.trim() && !g.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleGroupClick = (_group: Group) => {
    onClose();
    navigate('/calculate');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>📂 전체 나의 모임 목록</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 상단 검색바 */}
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="모임 이름 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        {/* 필터 탭 */}
        <FilterRow>
          <FilterChip
            type="button"
            className={activeTab === 'all' ? 'active' : ''}
            onClick={() => setActiveTab('all')}
          >
            전체 모임 ({groups.length})
          </FilterChip>
          <FilterChip
            type="button"
            className={activeTab === 'favorite' ? 'active' : ''}
            onClick={() => setActiveTab('favorite')}
          >
            ⭐ 즐겨찾기 ({groups.filter((g) => g.isFavorite).length})
          </FilterChip>
        </FilterRow>

        {/* 모임 간략 리스트 */}
        <GroupListContainer>
          {filteredGroups.length === 0 ? (
            <EmptyBox>해당 조건에 맞는 모임이 없습니다.</EmptyBox>
          ) : (
            filteredGroups.map((group) => {
              const latestActivity = group.recentActivities && group.recentActivities.length > 0
                ? group.recentActivities[0].message
                : '최근 활동이 없습니다.';

              return (
                <GroupListItem key={group.id} onClick={() => handleGroupClick(group)}>
                  <GroupAvatarWrap className={group.thumbnailColor}>
                    {group.profileImage ? (
                      <GroupAvatarImg src={AVATAR_MAP[group.profileImage]} alt={group.name} />
                    ) : (
                      <GroupIconText>{group.icon || COLOR_ICONS[group.thumbnailColor] || '👥'}</GroupIconText>
                    )}
                  </GroupAvatarWrap>

                  <GroupInfo>
                    <GroupTitleRow>
                      <GroupTitle>{group.name}</GroupTitle>
                      <MemberCountBadge>멤버 {group.memberCount}명</MemberCountBadge>
                    </GroupTitleRow>
                    <LatestActivityText>{latestActivity}</LatestActivityText>
                  </GroupInfo>

                  <StarBtn
                    type="button"
                    className={group.isFavorite ? 'favorite' : ''}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteGroup(group.id);
                    }}
                    aria-label="즐겨찾기 토글"
                  >
                    ★
                  </StarBtn>
                </GroupListItem>
              );
            })
          )}
        </GroupListContainer>

        {/* 새 모임 만들기 6단계 마법사 모달 연동 */}
        <FooterBtn
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          ➕ 새 모임 만들기
        </FooterBtn>
      </ModalCard>

      {/* 6단계 신규 모임 생성 모달 */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
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

const SearchBox = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #fedd13;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterChip = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;

  &.active {
    background: #fedd13;
    border-color: #f5cf00;
    color: #111827;
  }
`;

const GroupListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 30px 10px;
  font-size: 13px;
  color: #94a3b8;
`;

const GroupListItem = styled.div`
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

const GroupAvatarWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  &.yellow { background: #fef08a; }
  &.pink { background: #fbcfe8; }
  &.blue { background: #bae6fd; }
  &.cream { background: #fef3c7; }
  &.green { background: #bbf7d0; }
`;

const GroupAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GroupIconText = styled.span`
  font-size: 22px;
`;

const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
  overflow: hidden;
`;

const GroupTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const GroupTitle = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MemberCountBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  background: #e2e8f0;
  color: #475569;
  padding: 2px 6px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const LatestActivityText = styled.span`
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StarBtn = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #cbd5e1;
  cursor: pointer;
  padding: 4px;
  transition: color 0.15s ease;

  &:hover {
    color: #f59e0b;
  }

  &.favorite {
    color: #f59e0b;
  }
`;

const FooterBtn = styled.button`
  width: 100%;
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
