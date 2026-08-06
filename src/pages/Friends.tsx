import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import type { Friend, Group } from '../types';
import { useToast } from '../components/Toast';
import { MessageModal } from '../components/Modal/MessageModal';
import { ExploreModal } from '../components/Modal/ExploreModal';
import { ProfileEditModal } from '../components/Modal/ProfileEditModal';

import neoAvatar from '../assets/neo_avatar.png';
import frodoAvatar from '../assets/frodo_avatar.png';
import muziAvatar from '../assets/muzi_avatar.png';
import conAvatar from '../assets/con_avatar.png';
import jaygAvatar from '../assets/jayg_avatar.png';
import apeachAvatar from '../assets/apeach_avatar.png';
import choonsikAvatar from '../assets/choonsik_avatar.png';
import leetaenoAvatar from '../assets/avatar_leetaeno.png';

import avatarMe from '../assets/avatar_me_circle.png';
import avatarF1 from '../assets/avatar_f1_circle.png';
import avatarF2 from '../assets/avatar_f2_circle.png';
import avatarF3 from '../assets/avatar_f3_circle.png';

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

export const Friends: React.FC = () => {
  const { profile, friends, groups, setSearchOpen } = useAppContext();
  const { showToast } = useToast();

  const [selectedFriendForMessage, setSelectedFriendForMessage] = useState<Friend | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 즐겨찾기 그룹 필터
  const favoriteGroups = groups.filter((g) => g.isFavorite);

  const handleOpenMessageModal = (friend: Friend, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFriendForMessage(friend);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = (_friendName: string, _message: string) => {
    showToast('메세지를 성공적으로 보냈습니다.', 'success', '✅');
  };

  const handleGroupClick = (group: Group) => {
    alert(`"${group.name}" 모임의 상세 화면은 다음 단계에서 제작 및 연결됩니다.`);
  };

  const handleDiscoverClick = () => {
    setIsExploreModalOpen(true);
  };

  return (
    <FriendsContainer>
      {/* 친구 검색바 */}
      <SearchBarContainer onClick={() => setSearchOpen(true)}>
        <SearchIcon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.3-4.3" />
          </svg>
        </SearchIcon>
        <SearchInput type="text" placeholder="친구 검색" readOnly />
      </SearchBarContainer>

      {/* 나의 프로필 카드 */}
      <ProfileCard>
        <ProfileAvatar>
          <img src={profile.profileImage ? AVATAR_MAP[profile.profileImage] : leetaenoAvatar} alt="나의 프로필 사진" />
        </ProfileAvatar>
        <ProfileBody>
          <ProfileName>{profile.name}</ProfileName>
          <ProfileStatus>{profile.statusMessage}</ProfileStatus>
        </ProfileBody>
        <ProfileEditBtn aria-label="프로필 수정" onClick={() => setIsEditModalOpen(true)}>
          <i className="fa-solid fa-pen" style={{ fontSize: '12px' }}></i>
        </ProfileEditBtn>
      </ProfileCard>

      {/* 즐겨찾기 (가로 스크롤) */}
      <Section>
        <SectionHead>
          <SectionTitle>즐겨찾기</SectionTitle>
          <SectionLink onClick={() => alert('즐겨찾기 더보기 기능은 다음 단계에서 연결됩니다.')}>더보기</SectionLink>
        </SectionHead>
        <FavoritesList>
          {favoriteGroups.map((g) => (
            <FavoriteItem key={g.id} onClick={() => handleGroupClick(g)}>
              <FavoriteAvatar style={{ '--ring-color': g.thumbnailColor === 'pink' ? '#FBD3E3' : '#F3E4CE' } as React.CSSProperties}>
                {g.profileImage ? (
                  <img src={AVATAR_MAP[g.profileImage]} alt={g.name} />
                ) : (
                  <span>{g.icon || g.name.charAt(0)}</span>
                )}
              </FavoriteAvatar>
              <FavoriteLabel>{g.name}</FavoriteLabel>
            </FavoriteItem>
          ))}
          <FavoriteItem onClick={() => alert('즐겨찾기 추가 기능은 다음 단계에서 연결됩니다.')}>
            <FavoriteAvatarAdd>+</FavoriteAvatarAdd>
            <FavoriteLabel>추가</FavoriteLabel>
          </FavoriteItem>
        </FavoritesList>
      </Section>

      {/* 친구 리스트 */}
      <Section className="marginTop">
        <SectionHead>
          <SectionTitle>친구</SectionTitle>
        </SectionHead>
        <FriendListCard>
          {friends.map((f) => (
            <FriendListItem key={f.id} onClick={() => handleOpenMessageModal(f)}>
              <FriendAvatarWrap>
                <img src={f.profileImage ? AVATAR_MAP[f.profileImage] : neoAvatar} alt={f.name} />
              </FriendAvatarWrap>
              <FriendItemBody>
                <FriendItemName>
                  {f.name}
                  {f.isNew && <NewBadge>New</NewBadge>}
                </FriendItemName>
                <FriendItemStatus>{f.statusMessage}</FriendItemStatus>
              </FriendItemBody>
              <MessageHoverTag onClick={(e) => handleOpenMessageModal(f, e)}>
                메세지 보내기 →
              </MessageHoverTag>
            </FriendListItem>
          ))}
        </FriendListCard>
      </Section>

      {/* 새로운 친구 탐색 배너 */}
      <Section className="marginTop">
        <DiscoverBanner>
          <DiscoverSparkle>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.8 5.6L19 9l-5.2 1.9L12 16l-1.8-5.1L5 9l5.2-1.4L12 2Z" />
            </svg>
          </DiscoverSparkle>
          <DiscoverTitle>새로운 친구를 찾아보세요!</DiscoverTitle>
          <DiscoverDesc>주변의 흥미로운 모임에 참여하고 인연을 만들어보세요.</DiscoverDesc>
          <DiscoverBtn type="button" onClick={handleDiscoverClick}>탐색하기</DiscoverBtn>
        </DiscoverBanner>
      </Section>

      {/* 메세지 보내기 모달 */}
      <MessageModal
        isOpen={isMessageModalOpen}
        friendsList={friends}
        friend={selectedFriendForMessage}
        onClose={() => setIsMessageModalOpen(false)}
        onSendMessage={handleSendMessage}
      />

      {/* 친구/모임 탐색 모달 */}
      <ExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
      />

      {/* 프로필 편집 모달 */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </FriendsContainer>
  );
};

// Styled Components
const FriendsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

const SearchBarContainer = styled.div`
  margin: 6px 20px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.bgCard};
  cursor: pointer;
`;

const SearchIcon = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textSub};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  width: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSub};
  }
`;

const ProfileCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 12px 20px 24px;
  padding: 20px 24px;
  background: ${({ theme }) => theme.colors.yellow};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const ProfileAvatar = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.white};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #FFF;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProfileName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ProfileStatus = styled.p`
  font-size: 13px;
  color: rgba(38, 38, 44, 0.75);
  font-weight: 600;
  margin: 0;
`;

const ProfileEditBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.07);
  color: ${({ theme }) => theme.colors.text};
  transition: background 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
  }
`;

const Section = styled.section`
  padding: 0 20px;

  &.marginTop {
    margin-top: 28px;
  }
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

const SectionLink = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
`;

const FavoritesList = styled.ul`
  display: flex;
  gap: 26px;
  overflow-x: auto;
  padding: 8px 10px 4px;
  scrollbar-width: none;
  margin: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FavoriteItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const FavoriteAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 0 2px var(--ring-color, #DDD6C8);
  background: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FavoriteAvatarAdd = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: transparent;
  border: 1.5px dashed #C5BCAD;
  color: #B2A796;
  box-shadow: none;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const FavoriteLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-top: 2px;
  letter-spacing: -0.3px;
`;

const FriendListCard = styled.ul`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  margin: 0;
`;

const FriendListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              background 0.2s ease,
              z-index 0s;
  z-index: 0;
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: 12px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(38, 38, 44, 0.09), 0 4px 8px rgba(38, 38, 44, 0.05);
    background: #FFFBF3;
    z-index: 1;
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover + & {
    border-top-color: transparent;
  }
`;

const MessageHoverTag = styled.span`
  margin-left: auto;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.yellow};
  font-size: 11px;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radius.round};
  white-space: nowrap;
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;

  ${FriendListItem}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const FriendAvatarWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
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

const FriendItemBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FriendItemName = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NewBadge = styled.span`
  background: ${({ theme }) => theme.colors.pink};
  color: ${({ theme }) => theme.colors.white};
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.round};
  text-transform: uppercase;
`;

const FriendItemStatus = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
`;

const DiscoverBanner = styled.div`
  position: relative;
  background: #F3E4CE;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  text-align: center;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const DiscoverSparkle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.yellowDark};
  margin-bottom: 6px;
`;

const DiscoverTitle = styled.p`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const DiscoverDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
  margin: 4px 0 16px;
  line-height: 1.4;
`;

const DiscoverBtn = styled.button`
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 13px;
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radius.round};
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }
`;
