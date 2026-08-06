import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
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

const PRESET_MESSAGES = [
  '오늘 모임 즐거웠어! 😊',
  '정산 확인 부탁해~ 💸',
  '시간 될 때 연락 줘! 📞',
  '다음 주 모임 장소 정해졌어? 🎉'
];

interface MessageModalProps {
  isOpen: boolean;
  friend?: Friend | null;
  friendsList?: Friend[];
  onClose: () => void;
  onSendMessage?: (friendName: string, message: string) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  friend,
  friendsList,
  onClose,
  onSendMessage
}) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showFriendSelector, setShowFriendSelector] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setIsSending(false);
      setShowFriendSelector(false);

      if (friend) {
        setSelectedFriend(friend);
      } else if (friendsList && friendsList.length > 0) {
        setSelectedFriend(friendsList[0]);
      }
    }
  }, [isOpen, friend, friendsList]);

  if (!isOpen) return null;

  const currentFriend = selectedFriend || friend || (friendsList ? friendsList[0] : null);

  const getAvatar = (f: Friend | null) => {
    if (!f || !f.profileImage) return neoAvatar;
    return AVATAR_MAP[f.profileImage] || '/neo_avatar.png';
  };

  const handleSend = () => {
    if (!message.trim()) {
      alert('메세지 내용을 입력해주세요.');
      return;
    }
    if (!currentFriend) {
      alert('메세지를 받을 친구를 선택해주세요.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      if (onSendMessage) {
        onSendMessage(currentFriend.name, message);
      } else {
        alert(`"${currentFriend.name}" 님에게 메세지가 전송되었습니다!`);
      }
      onClose();
    }, 400);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>메세지 보내기</HeaderTitle>
          <CloseButton onClick={onClose} aria-label="닫기">
            ✕
          </CloseButton>
        </ModalHeader>

        {/* 수신자 선택 영역 (friendsList가 있을 때 가로/목록 선택 및 변경 가능) */}
        {friendsList && friendsList.length > 0 && (
          <SelectorSection>
            <SelectorHeader>
              <SelectorTitle>받는 사람 선택</SelectorTitle>
              <ToggleListBtn
                type="button"
                onClick={() => setShowFriendSelector(!showFriendSelector)}
              >
                {showFriendSelector ? '닫기 ▲' : '전체보기 ▼'}
              </ToggleListBtn>
            </SelectorHeader>

            {/* 가로 아바타 칩 스크롤 */}
            <AvatarChipScroll>
              {friendsList.map((f) => {
                const isSelected = currentFriend?.id === f.id;
                return (
                  <ChipItem
                    key={f.id}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => {
                      setSelectedFriend(f);
                      setShowFriendSelector(false);
                    }}
                  >
                    <ChipAvatarWrap className={isSelected ? 'selected' : ''}>
                      <ChipAvatarImg src={getAvatar(f)} alt={f.name} />
                    </ChipAvatarWrap>
                    <ChipName className={isSelected ? 'selected' : ''}>{f.name}</ChipName>
                  </ChipItem>
                );
              })}
            </AvatarChipScroll>

            {/* 정산 내역 전체보기 스타일의 친구 전체목록 아코디언 드롭다운 */}
            {showFriendSelector && (
              <FriendDropdownList>
                {friendsList.map((f) => {
                  const isSelected = currentFriend?.id === f.id;
                  return (
                    <FriendDropdownItem
                      key={f.id}
                      className={isSelected ? 'active' : ''}
                      onClick={() => {
                        setSelectedFriend(f);
                        setShowFriendSelector(false);
                      }}
                    >
                      <DropdownAvatarWrap>
                        <DropdownAvatarImg src={getAvatar(f)} alt={f.name} />
                      </DropdownAvatarWrap>
                      <DropdownBody>
                        <DropdownName>{f.name}</DropdownName>
                        <DropdownStatus>{f.statusMessage || '모여라 이용 중'}</DropdownStatus>
                      </DropdownBody>
                      {isSelected && <SelectBadge>선택됨 ✅</SelectBadge>}
                    </FriendDropdownItem>
                  );
                })}
              </FriendDropdownList>
            )}
          </SelectorSection>
        )}

        {/* 선택된 수신자 프로필 영단 */}
        {currentFriend && (
          <ProfileSection>
            <AvatarWrap>
              <AvatarImg src={getAvatar(currentFriend)} alt={currentFriend.name} />
            </AvatarWrap>
            <ProfileMeta>
              <FriendName>{currentFriend.name}</FriendName>
              <FriendStatus>{currentFriend.statusMessage || '모여라 이용 중'}</FriendStatus>
            </ProfileMeta>
          </ProfileSection>
        )}

        {/* 메세지 입력 폼 */}
        <InputSection>
          <StyledTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              currentFriend
                ? `${currentFriend.name} 님에게 전할 따뜻한 메세지를 입력하세요...`
                : '따뜻한 메세지를 입력하세요...'
            }
            rows={4}
            maxLength={300}
          />
          <CharCounter>{message.length} / 300자</CharCounter>
        </InputSection>

        {/* 빠른 추천 메세지 태그 */}
        <PresetSection>
          <PresetLabel>추천 메세지</PresetLabel>
          <PresetTags>
            {PRESET_MESSAGES.map((preset, idx) => (
              <PresetChip
                key={idx}
                type="button"
                onClick={() => setMessage(preset)}
              >
                {preset}
              </PresetChip>
            ))}
          </PresetTags>
        </PresetSection>

        {/* 하단 액션 버튼 */}
        <FooterSection>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>
          <SendButton
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || !currentFriend || isSending}
          >
            {isSending ? '전송 중...' : '보내기 🚀'}
          </SendButton>
        </FooterSection>
      </ModalContainer>
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease-out forwards;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 90vh;
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
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.3px;
`;

const CloseButton = styled.button`
  background: #f2f3f5;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: #e5e7eb;
    color: #111;
  }
`;

const SelectorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f9fafb;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
`;

const SelectorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SelectorTitle = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #4b5563;
`;

const ToggleListBtn = styled.button`
  font-size: 11px;
  color: #6b7280;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;

  &:hover {
    color: #111827;
    background: #e5e7eb;
  }
`;

const AvatarChipScroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 2px 8px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChipItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &.selected {
    transform: scale(1.04);
  }
`;

const ChipAvatarWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  box-sizing: border-box;

  &.selected {
    border-color: #fedd13;
    box-shadow: 0 0 0 2px rgba(254, 221, 19, 0.4);
  }
`;

const ChipAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ChipName = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;

  &.selected {
    font-weight: 800;
    color: #111827;
  }
`;

const FriendDropdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 160px;
  overflow-y: auto;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #e5e7eb;
`;

const FriendDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #edf0f3;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fffbeb;
    border-color: #fde68a;
  }

  &.active {
    background: #fef3c7;
    border-color: #fedd13;
  }
`;

const DropdownAvatarWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1.5px solid #fedd13;
`;

const DropdownAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DropdownBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const DropdownName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
`;

const DropdownStatus = styled.span`
  font-size: 11px;
  color: #6b7280;
`;

const SelectBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #d97706;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid #edf0f3;
`;

const AvatarWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fedd13;
  flex-shrink: 0;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`;

const FriendName = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: #1f2937;
`;

const FriendStatus = styled.span`
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  color: #1f2937;

  &:focus {
    border-color: #fedd13;
    box-shadow: 0 0 0 3px rgba(254, 221, 19, 0.25);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CharCounter = styled.span`
  font-size: 11px;
  color: #9ca3af;
  align-self: flex-end;
`;

const PresetSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PresetLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #4b5563;
`;

const PresetTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const PresetChip = styled.button`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fedd13;
    border-color: #fcc400;
    color: #111827;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const FooterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  color: #4b5563;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const SendButton = styled.button`
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

  &:hover:not(:disabled) {
    background: #f5cf00;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(254, 221, 19, 0.5);
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    box-shadow: none;
    cursor: not-allowed;
  }
`;
