import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

import avatarMe from '../../assets/avatar_me_circle.png';
import leetaenoAvatar from '../../assets/avatar_leetaeno.png';
import apeachAvatar from '../../assets/apeach_avatar.png';
import choonsikAvatar from '../../assets/choonsik_avatar.png';
import neoAvatar from '../../assets/neo_avatar.png';
import frodoAvatar from '../../assets/frodo_avatar.png';
import muziAvatar from '../../assets/muzi_avatar.png';
import avatarF1 from '../../assets/avatar_f1_circle.png';
import avatarF2 from '../../assets/avatar_f2_circle.png';

export interface AvatarOption {
  id: string;
  name: string;
  imageFileName: string;
  src: string;
}

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'av-me', name: '대표 태노', imageFileName: 'avatar_me_circle.png', src: avatarMe },
  { id: 'av-leetaeno', name: '캐주얼 태노', imageFileName: 'avatar_leetaeno.png', src: leetaenoAvatar },
  { id: 'av-apeach', name: '어피치', imageFileName: 'apeach_avatar.png', src: apeachAvatar },
  { id: 'av-choonsik', name: '춘식이', imageFileName: 'choonsik_avatar.png', src: choonsikAvatar },
  { id: 'av-neo', name: '네오', imageFileName: 'neo_avatar.png', src: neoAvatar },
  { id: 'av-frodo', name: '프로도', imageFileName: 'frodo_avatar.png', src: frodoAvatar },
  { id: 'av-muzi', name: '무지', imageFileName: 'muzi_avatar.png', src: muziAvatar },
  { id: 'av-f1', name: '감성 파스텔', imageFileName: 'avatar_f1_circle.png', src: avatarF1 },
  { id: 'av-f2', name: '힐링 아웃도어', imageFileName: 'avatar_f2_circle.png', src: avatarF2 }
];

const AVATAR_MAP: Record<string, string> = {
  'avatar_me_circle.png': avatarMe,
  'avatar_leetaeno.png': leetaenoAvatar,
  'apeach_avatar.png': apeachAvatar,
  'choonsik_avatar.png': choonsikAvatar,
  'neo_avatar.png': neoAvatar,
  'frodo_avatar.png': frodoAvatar,
  'muzi_avatar.png': muziAvatar,
  'avatar_f1_circle.png': avatarF1,
  'avatar_f2_circle.png': avatarF2
};

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAppContext();
  const { showToast } = useToast();

  const [name, setName] = useState(profile.name || '이태노');
  const [statusMessage, setStatusMessage] = useState(profile.statusMessage || '오늘도 모여라와 함께 즐거운 하루!');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(profile.profileImage || 'avatar_me_circle.png');
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  if (!isOpen) return null;

  const currentAvatarSrc = AVATAR_MAP[selectedAvatarFile] || avatarMe;

  const handleSave = () => {
    if (!name.trim()) {
      alert('이름을 입력해 주세요!');
      return;
    }

    updateProfile({
      name: name.trim(),
      statusMessage: statusMessage.trim(),
      profileImage: selectedAvatarFile
    });

    showToast('프로필 정보가 성공적으로 수정되었습니다! ✨', 'success', '✨');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>✏️ 프로필 편집</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 프로필 이미지 변경 영역 */}
        <AvatarEditSection>
          <AvatarWrapper onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}>
            <AvatarImg src={currentAvatarSrc} alt="프로필 이미지" />
            <CameraBadge>📷</CameraBadge>
          </AvatarWrapper>
          <ChangePhotoText onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}>
            프로필 사진 변경 {isAvatarPickerOpen ? '▲' : '▼'}
          </ChangePhotoText>
        </AvatarEditSection>

        {/* 아바타 선택 피커 뷰 */}
        {isAvatarPickerOpen && (
          <AvatarPickerBox>
            <PickerTitle>선택할 프로필 아바타</PickerTitle>
            <AvatarGrid>
              {AVATAR_OPTIONS.map((av) => (
                <AvatarOptionItem
                  key={av.id}
                  className={selectedAvatarFile === av.imageFileName ? 'selected' : ''}
                  onClick={() => {
                    setSelectedAvatarFile(av.imageFileName);
                    setIsAvatarPickerOpen(false);
                  }}
                >
                  <OptionImg src={av.src} alt={av.name} />
                  <span>{av.name}</span>
                </AvatarOptionItem>
              ))}
            </AvatarGrid>
          </AvatarPickerBox>
        )}

        {/* 폼 입력 영역 */}
        <FormSection>
          <InputGroup>
            <FieldLabel>이름 / 닉네임</FieldLabel>
            <StyledInput
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <FieldLabel>상태 메시지</FieldLabel>
            <StyledTextArea
              rows={3}
              placeholder="상태 메시지를 입력하세요 (예: 주말 모임 환영!)"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
            />
          </InputGroup>
        </FormSection>

        {/* 하단 저장 버튼 */}
        <FooterSection>
          <SaveBtn type="button" onClick={handleSave}>
            저장하기 ✨
          </SaveBtn>
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

const AvatarEditSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  cursor: pointer;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fedd13;
  box-shadow: 0 6px 16px rgba(254, 221, 19, 0.3);
`;

const CameraBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #111827;
  color: #ffffff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
`;

const ChangePhotoText = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #3b82f6;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const AvatarPickerBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #fedd13;
  border-radius: 18px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeIn} 0.2s ease-out forwards;
`;

const PickerTitle = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const AvatarOptionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;

  span {
    font-size: 10px;
    font-weight: 700;
    color: #475569;
  }

  &.selected {
    border-color: #f5cf00;
    background: #fef08a;

    span {
      color: #111827;
    }
  }

  &:hover {
    border-color: #fedd13;
  }
`;

const OptionImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #475569;
`;

const StyledInput = styled.input`
  padding: 12px 14px;
  border-radius: 14px;
  border: 1.5px solid #cbd5e1;
  font-size: 14px;
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #fedd13;
  }
`;

const StyledTextArea = styled.textarea`
  padding: 12px 14px;
  border-radius: 14px;
  border: 1.5px solid #cbd5e1;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  resize: none;
  font-family: inherit;

  &:focus {
    border-color: #fedd13;
  }
`;

const FooterSection = styled.div`
  margin-top: 4px;
`;

const SaveBtn = styled.button`
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
