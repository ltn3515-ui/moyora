import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

import receiptPreview from '../../assets/receipt_scan_preview.png';
import neoAvatar from '../../assets/neo_avatar.png';
import frodoAvatar from '../../assets/frodo_avatar.png';
import muziAvatar from '../../assets/muzi_avatar.png';
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
  'apeach_avatar.png': apeachAvatar || '/apeach_avatar.png',
  'choonsik_avatar.png': choonsikAvatar || '/choonsik_avatar.png',
  'avatar_leetaeno.png': leetaenoAvatar || '/avatar_leetaeno.png',
  'avatar_me_circle.png': avatarMe || '/avatar_me_circle.png',
  'avatar_f1_circle.png': avatarF1 || '/avatar_f1_circle.png',
  'avatar_f2_circle.png': avatarF2 || '/avatar_f2_circle.png',
  'avatar_f3_circle.png': avatarF3 || '/avatar_f3_circle.png'
};

interface ShareImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareImageModal: React.FC<ShareImageModalProps> = ({ isOpen, onClose }) => {
  const { friends } = useAppContext();
  const { showToast } = useToast();

  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>(['friend-001', 'friend-002']);

  if (!isOpen) return null;

  const toggleSelectFriend = (id: string) => {
    if (selectedFriendIds.includes(id)) {
      setSelectedFriendIds(selectedFriendIds.filter((fId) => fId !== id));
    } else {
      setSelectedFriendIds([...selectedFriendIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFriendIds.length === friends.length) {
      setSelectedFriendIds([]);
    } else {
      setSelectedFriendIds(friends.map((f) => f.id));
    }
  };

  const handleConfirmShare = () => {
    if (selectedFriendIds.length === 0) {
      alert('공유할 대상을 1명 이상 선택해주세요.');
      return;
    }

    const selectedFriends = friends.filter((f) => selectedFriendIds.includes(f.id));
    const targetNames = selectedFriends.map((f) => f.name).join(', ');

    showToast(
      `정산 결과 이미지가 ${targetNames} 님에게 성공적으로 공유되었습니다! 📸`,
      'success',
      '📸'
    );

    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>🖼️ 정산 결과 이미지 공유</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 이미지 프리뷰 */}
        <PreviewBox>
          <PreviewLabel>공유할 정산 영수증 결과 카드</PreviewLabel>
          <PreviewImgWrap>
            <PreviewImg src={receiptPreview} alt="정산 결과 카드" />
          </PreviewImgWrap>
        </PreviewBox>

        {/* 누구에게 보낼지 선택 목록 */}
        <TargetSection>
          <TargetHeaderRow>
            <TargetTitle>👥 공유 대상 선택 ({selectedFriendIds.length}명 선택됨)</TargetTitle>
            <SelectAllBtn type="button" onClick={handleSelectAll}>
              {selectedFriendIds.length === friends.length ? '전체 해제' : '전체 선택'}
            </SelectAllBtn>
          </TargetHeaderRow>

          <FriendList>
            {friends.map((friend) => {
              const isSelected = selectedFriendIds.includes(friend.id);
              return (
                <FriendItem
                  key={friend.id}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => toggleSelectFriend(friend.id)}
                >
                  <FriendLeft>
                    <AvatarImg src={(friend.profileImage && AVATAR_MAP[friend.profileImage]) || avatarF1} alt={friend.name} />
                    <FriendInfo>
                      <FriendName>{friend.name}</FriendName>
                      <FriendStatus>{friend.statusMessage || '모여라 친구'}</FriendStatus>
                    </FriendInfo>
                  </FriendLeft>

                  <CheckIcon className={isSelected ? 'checked' : ''}>
                    {isSelected ? '✓' : ''}
                  </CheckIcon>
                </FriendItem>
              );
            })}
          </FriendList>
        </TargetSection>

        {/* 하단 공유하기 버튼 */}
        <FooterSection>
          <ShareSubmitBtn type="button" onClick={handleConfirmShare}>
            {selectedFriendIds.length}명에게 결과 이미지 공유하기 📲
          </ShareSubmitBtn>
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

const PreviewBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const PreviewLabel = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
`;

const PreviewImgWrap = styled.div`
  width: 100%;
  max-height: 120px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TargetSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TargetHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TargetTitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const SelectAllBtn = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: #3b82f6;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ffffff;
    border-color: #fedd13;
  }

  &.selected {
    background: #ffffff;
    border-color: #fedd13;
    box-shadow: 0 4px 12px rgba(254, 221, 19, 0.2);
  }
`;

const FriendLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvatarImg = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FriendName = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const FriendStatus = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const CheckIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;

  &.checked {
    background: #fedd13;
    border-color: #f5cf00;
    color: #111827;
  }
`;

const FooterSection = styled.div`
  margin-top: 4px;
`;

const ShareSubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #fedd13;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.4);
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
    transform: translateY(-1px);
  }
`;
