import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';
import type { Friend } from '../../types';

import neoAvatar from '../../assets/neo_avatar.png';
import frodoAvatar from '../../assets/frodo_avatar.png';
import muziAvatar from '../../assets/muzi_avatar.png';
import conAvatar from '../../assets/con_avatar.png';
import jaygAvatar from '../../assets/jayg_avatar.png';
import apeachAvatar from '../../assets/apeach_avatar.png';
import choonsikAvatar from '../../assets/choonsik_avatar.png';
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

const ICON_CHECK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ICON_SEARCH = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
);

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  onInviteComplete: (selectedFriends: Friend[], message: string) => void;
  initiallySelectedIds: string[];
}

export const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({
  isOpen,
  onClose,
  groupName,
  onInviteComplete,
  initiallySelectedIds
}) => {
  const { friends } = useAppContext();
  const { showToast } = useToast();

  const [selectedIds, setSelectedIds] = useState<string[]>(initiallySelectedIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteMessage, setInviteMessage] = useState(
    `[${groupName}] 모임에 초대합니다! 함께 즐거운 시간 보내요! 🥳🎈`
  );

  if (!isOpen) return null;

  const filteredFriends = (friends || []).filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectFriend = (friendId: string) => {
    if (selectedIds.includes(friendId)) {
      setSelectedIds((prev) => prev.filter((id) => id !== friendId));
    } else {
      setSelectedIds((prev) => [...prev, friendId]);
    }
  };

  const handleSendInvite = () => {
    if (selectedIds.length === 0) {
      alert('초대할 친구를 한 명 이상 선택해주세요!');
      return;
    }

    const selectedFriends = (friends || []).filter((f) => selectedIds.includes(f.id));
    onInviteComplete(selectedFriends, inviteMessage);

    showToast(
      `✉️ ${selectedFriends.map((f) => f.name).join(', ')}님에게 초대 메시지를 전송했습니다!`,
      'success',
      '✉️'
    );
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>친구 초대하기</HeaderTitle>
          <CloseBtn type="button" onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 친구 검색 */}
        <SearchBox>
          {ICON_SEARCH}
          <SearchInput
            type="text"
            placeholder="친구 이름 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        {/* 친구 리스트 */}
        <FriendsList>
          {filteredFriends.length === 0 ? (
            <EmptyState>검색된 친구가 없습니다.</EmptyState>
          ) : (
            filteredFriends.map((friend) => {
              const isSelected = selectedIds.includes(friend.id);
              const avatarSrc = friend.profileImage ? (AVATAR_MAP[friend.profileImage] || friend.profileImage) : avatarMe;

              return (
                <FriendItem
                  key={friend.id}
                  onClick={() => toggleSelectFriend(friend.id)}
                  className={isSelected ? 'selected' : ''}
                >
                  <AvatarWrap className={friend.avatarColor}>
                    <AvatarImg
                      src={avatarSrc}
                      alt={friend.name}
                    />
                  </AvatarWrap>

                  <FriendInfo>
                    <FriendName>{friend.name}</FriendName>
                    <FriendStatus>{friend.statusMessage || '모요라에서 함께 소통해요!'}</FriendStatus>
                  </FriendInfo>

                  <CheckOption className={isSelected ? 'active' : ''}>
                    {isSelected && ICON_CHECK}
                  </CheckOption>
                </FriendItem>
              );
            })
          )}
        </FriendsList>

        <Divider />

        {/* 초대 메시지 입력 영역 */}
        <MessageSection>
          <MessageTitle>초대 메시지</MessageTitle>
          <MessageTextArea
            rows={3}
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
            placeholder="친구에게 보낼 초대 메시지를 적어주세요."
          />
        </MessageSection>

        {/* 전송 버튼 */}
        <SubmitBtn
          type="button"
          onClick={handleSendInvite}
          disabled={selectedIds.length === 0}
        >
          {selectedIds.length > 0
            ? `${selectedIds.length}명에게 초대 메시지 전송`
            : '초대할 친구를 선택해주세요'}
        </SubmitBtn>
      </ModalCard>
    </Overlay>
  );
};

// Animations
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
  background: rgba(15, 15, 17, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease-out forwards;
`;

const ModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 85vh;
  overflow-y: auto;
  animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
  font-size: 18px;
  font-weight: 850;
  color: #111827;
  margin: 0;
  letter-spacing: -0.4px;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;

  &:hover {
    color: #4b5563;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f3f4f6;
  border-radius: 14px;
  padding: 10px 14px;
  color: #9ca3af;
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  font-size: 13.5px;
  color: #1f2937;
  font-weight: 600;
  width: 100%;

  &::placeholder {
    color: #9ca3af;
  }
`;

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
  }
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;
  border: 1px solid #f3f4f6;

  &:hover {
    background: #f3f4f6;
  }

  &.selected {
    background: rgba(74, 144, 226, 0.05);
    border-color: rgba(74, 144, 226, 0.2);
  }
`;

const AvatarWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.pink { background: #fbcfe8; }
  &.yellow { background: #fef08a; }
  &.blue { background: #bae6fd; }
  &.green { background: #bbf7d0; }
  &.cream { background: #fef3c7; }
  &.gray { background: #e5e7eb; }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
  overflow: hidden;
`;

const FriendName = styled.span`
  font-size: 13.5px;
  font-weight: 800;
  color: #1f2937;
`;

const FriendStatus = styled.span`
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CheckOption = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &.active {
    background: #4a90e2;
    border-color: #4a90e2;
  }
`;

const EmptyState = styled.div`
  padding: 30px 0;
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
`;

const MessageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageTitle = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MessageTextArea = styled.textarea`
  width: 100%;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  outline: none;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #4a90e2;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 48px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #1f2937;
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;