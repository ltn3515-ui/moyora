import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';
import { useAppContext } from '../../context/AppContext';

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

export const IMAGE_MAP: Record<string, string> = {
  'avatar_leetaeno.png': leetaenoAvatar,
  'avatar_me_circle.png': avatarMe,
  'apeach_avatar.png': apeachAvatar,
  'choonsik_avatar.png': choonsikAvatar,
  'neo_avatar.png': neoAvatar,
  'frodo_avatar.png': frodoAvatar,
  'muzi_avatar.png': muziAvatar,
  'jayg_avatar.png': jaygAvatar,
  'con_avatar.png': conAvatar,
  'avatar_f1_circle.png': avatarF1,
  'avatar_f2_circle.png': avatarF2,
  'avatar_f3_circle.png': avatarF3,
};

const PRESET_AVATARS = [
  { id: 'avatar_leetaeno.png', label: '이태노', src: leetaenoAvatar },
  { id: 'avatar_me_circle.png', label: '기본 프로필', src: avatarMe },
  { id: 'apeach_avatar.png', label: '어피치', src: apeachAvatar },
  { id: 'choonsik_avatar.png', label: '춘식이', src: choonsikAvatar },
  { id: 'neo_avatar.png', label: '네오', src: neoAvatar },
  { id: 'frodo_avatar.png', label: '프로도', src: frodoAvatar },
  { id: 'muzi_avatar.png', label: '무지', src: muziAvatar },
  { id: 'jayg_avatar.png', label: '제이지', src: jaygAvatar },
  { id: 'con_avatar.png', label: '콘', src: conAvatar },
  { id: 'avatar_f1_circle.png', label: '민수', src: avatarF1 },
  { id: 'avatar_f2_circle.png', label: '지은', src: avatarF2 },
  { id: 'avatar_f3_circle.png', label: '현우', src: avatarF3 },
];

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAppContext();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 현재 프로필 사진 선택 상태
  const [selectedImage, setSelectedImage] = useState<string>(profile.profileImage || 'avatar_leetaeno.png');
  const [customDataUrl, setCustomDataUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  // 미리보기 이미지 결정 (Data URL이 있으면 Data URL, IMAGE_MAP에 존재하면 IMAGE_MAP, 없으면 직접 경로)
  const getPreviewSrc = () => {
    if (customDataUrl) return customDataUrl;
    if (IMAGE_MAP[selectedImage]) return IMAGE_MAP[selectedImage];
    if (selectedImage.startsWith('data:') || selectedImage.startsWith('http')) return selectedImage;
    return leetaenoAvatar;
  };

  // 이미지 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('이미지 용량은 5MB 이하만 가능합니다.', 'error', '⚠️');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomDataUrl(result);
        setSelectedImage(result);
        showToast('커스텀 사진이 업로드되었습니다! 미리보기를 확인하세요.', 'info', '📸');
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 사진 변경 저장
  const handleSave = () => {
    const finalImage = customDataUrl || selectedImage;
    updateProfile({ profileImage: finalImage });
    showToast('프로필 사진이 성공적으로 변경되었습니다! ✨', 'success', '📸');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>🖼️ 프로필 사진 변경</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 현재 대표 이미지 미리보기 */}
        <PreviewSection>
          <PreviewAvatarWrap>
            <PreviewAvatarImg src={getPreviewSrc()} alt="프로필 미리보기" />
            <CameraBadge onClick={() => fileInputRef.current?.click()} title="사진 선택/업로드">
              📸
            </CameraBadge>
          </PreviewAvatarWrap>
          <PreviewHintText>원하는 캐릭터를 선택하거나 내 기기에서 직접 업로드하세요.</PreviewHintText>
        </PreviewSection>

        {/* 내 기기 업로드 버튼 */}
        <UploadBtn type="button" onClick={() => fileInputRef.current?.click()}>
          📁 내 컴퓨터/기기에서 사진 찾기
        </UploadBtn>
        <HiddenFileInput
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <SectionTitle>추천 아바타 선택</SectionTitle>

        {/* 그리드 캐릭터 선택 */}
        <AvatarGrid>
          {PRESET_AVATARS.map((avatar) => {
            const isSelected = !customDataUrl && selectedImage === avatar.id;
            return (
              <AvatarChip
                key={avatar.id}
                type="button"
                className={isSelected ? 'selected' : ''}
                onClick={() => {
                  setCustomDataUrl(null);
                  setSelectedImage(avatar.id);
                }}
              >
                <AvatarChipImg src={avatar.src} alt={avatar.label} />
                <AvatarChipLabel>{avatar.label}</AvatarChipLabel>
                {isSelected && <CheckBadge>✓</CheckBadge>}
              </AvatarChip>
            );
          })}
        </AvatarGrid>

        {/* 하단 실행 버튼 */}
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>
          <SaveButton type="button" onClick={handleSave}>
            변경사항 저장하기 ✨
          </SaveButton>
        </ButtonGroup>
      </ModalCard>
    </Overlay>
  );
};

// Keyframe Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
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
  max-width: 410px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 28px;
  padding: 24px 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
`;

const CloseBtn = styled.button`
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 20px;
`;

const PreviewAvatarWrap = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
`;

const PreviewAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const CameraBadge = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #fedd13;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.1);
  }
`;

const PreviewHintText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #64748b;
  text-align: center;
`;

const UploadBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: #ffffff;
  border: 1.5px dashed #94a3b8;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #fedd13;
    color: #1e293b;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SectionTitle = styled.h4`
  margin: 4px 0 -4px;
  font-size: 14px;
  font-weight: 800;
  color: #334155;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const AvatarChip = styled.button`
  position: relative;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 10px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }

  &.selected {
    background: #fffdf0;
    border-color: #fedd13;
    box-shadow: 0 4px 14px rgba(254, 221, 19, 0.35);
  }
`;

const AvatarChipImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarChipLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const CheckBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fedd13;
  color: #1e293b;
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  background: #f1f5f9;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const SaveButton = styled.button`
  flex: 2;
  padding: 14px;
  background: #fedd13;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.4);

  &:hover {
    background: #fada0A;
  }
`;
