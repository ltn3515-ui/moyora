import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';
import type { Activity } from '../../types';

import activityArt from '../../assets/activity_art.png';
import activityCreate from '../../assets/activity_create.png';
import cafeImg from '../../assets/cafe.png';
import festivalImg from '../../assets/festival.png';
import namsanImg from '../../assets/namsan.png';
import picnicImg from '../../assets/picnic.png';
import boardgameImg from '../../assets/boardgame.png';

import apeachAvatar from '../../assets/apeach_avatar.png';
import leetaenoAvatar from '../../assets/avatar_leetaeno.png';
import avatarF1 from '../../assets/avatar_f1_circle.png';
import avatarF2 from '../../assets/avatar_f2_circle.png';

const IMAGE_MAP: Record<string, string> = {
  'activity_art.png': activityArt || '/activity_art.png',
  'activity_create.png': activityCreate || '/activity_create.png',
  'cafe.png': cafeImg || '/cafe.png',
  'festival.png': festivalImg || '/festival.png',
  'namsan.png': namsanImg || '/namsan.png',
  'picnic.png': picnicImg || '/picnic.png',
  'boardgame.png': boardgameImg || '/boardgame.png'
};

const DEFAULT_IMAGES = [
  'activity_art.png',
  'activity_create.png',
  'festival.png',
  'namsan.png',
  'picnic.png',
  'boardgame.png'
];

interface ActivitySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivitySummaryModal: React.FC<ActivitySummaryModalProps> = ({ isOpen, onClose }) => {
  const { profile, addActivity } = useAppContext();
  const { showToast } = useToast();

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('문화/예술');

  // 추억 모달 좋아요 카운터
  const [likes, setLikes] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('활동 제목을 입력해주세요.');
      return;
    }
    const randImage = DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
    addActivity(newTitle.trim(), randImage);
    showToast(`새 활동 '${newTitle.trim()}'이 추가되었습니다! 📸`, 'success', '📸');
    setNewTitle('');
    setIsAddFormOpen(false);
  };

  const handleLikeClick = (id: string) => {
    const current = likes[id] || 12;
    setLikes((prev) => ({ ...prev, [id]: current + 1 }));
    showToast('소중한 추억에 하트를 더했습니다! 💖', 'info', '💖');
  };

  const handleShareMemory = (title: string) => {
    showToast(`'${title}' 추억 카드가 복사되었습니다! 📲`, 'success', '💌');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>
            {selectedActivity ? (
              <BackBtn type="button" onClick={() => setSelectedActivity(null)}>
                ‹ 활동 목록
              </BackBtn>
            ) : (
              '🎞️ 나의 추억 활동 요약'
            )}
          </HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* ──────── 뷰 1: 활동 간략 리스트 & 활동 추가 폼 ──────── */}
        {!selectedActivity ? (
          <ListContent>
            <TopNoticeBar>
              <span>함께했던 소중한 활동들을 다시 둘러보세요.</span>
              <AddTriggerBtn type="button" onClick={() => setIsAddFormOpen(!isAddFormOpen)}>
                {isAddFormOpen ? '닫기 ✕' : '활동 추가 ➕'}
              </AddTriggerBtn>
            </TopNoticeBar>

            {/* 활동 입력 폼 */}
            {isAddFormOpen && (
              <AddFormCard onSubmit={handleAddSubmit}>
                <FormTitle>📸 새 활동 추억 등록</FormTitle>
                <FormGroup>
                  <FormLabel>활동 제목</FormLabel>
                  <FormInput
                    type="text"
                    placeholder="예: 성수동 가죽 공예 클래스"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>활동 카테고리</FormLabel>
                  <FormSelect
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="문화/예술">🎨 문화 / 예술</option>
                    <option value="아웃도어/소풍">⛺ 아웃도어 / 소풍</option>
                    <option value="맛집/카페">☕ 맛집 / 카페 탐방</option>
                    <option value="창작/클래스">🧶 창작 / 원데이클래스</option>
                  </FormSelect>
                </FormGroup>

                <SubmitAddBtn type="submit">활동 기록 저장 💾</SubmitAddBtn>
              </AddFormCard>
            )}

            {/* 활동 리스트 */}
            <ActivityGrid>
              {profile.activitySummary.map((act) => {
                const imgUrl = act.image ? IMAGE_MAP[act.image] || activityArt : activityArt;
                return (
                  <ActivityCardItem key={act.id} onClick={() => setSelectedActivity(act)}>
                    <CardThumbWrap className={act.avatarColor}>
                      <CardThumbImg src={imgUrl} alt={act.title} />
                    </CardThumbWrap>

                    <CardBody>
                      <CardTitle>{act.title}</CardTitle>
                      <CardMeta>📅 최근 추억 기록 · 탭하여 상세보기 ➔</CardMeta>
                    </CardBody>
                  </ActivityCardItem>
                );
              })}
            </ActivityGrid>
          </ListContent>
        ) : (
          /* ──────── 뷰 2: 추억을 담은 느낌의 폴라로이드 상세 페이지 ──────── */
          <PolaroidContent>
            <PolaroidFrame>
              <TapeEffect />
              <PolaroidPhotoBox>
                <PolaroidImg
                  src={selectedActivity.image ? IMAGE_MAP[selectedActivity.image] || activityArt : activityArt}
                  alt={selectedActivity.title}
                />
              </PolaroidPhotoBox>

              <PolaroidCaption>
                <MemoryTitle>{selectedActivity.title}</MemoryTitle>
                <MemoryDate>✨ 2026년 봄, 우리들의 아름다운 순간</MemoryDate>
                <MemoryNote>
                  "{selectedActivity.title} 활동에서 친구들과 만나 웃고 이야기 나누었던 소중한 추억의 필름 한 장입니다."
                </MemoryNote>
              </PolaroidCaption>
            </PolaroidFrame>

            {/* 함께한 친구들 */}
            <TogetherSection>
              <TogetherLabel>👥 함께 보낸 친구들</TogetherLabel>
              <FriendChipRow>
                <FriendChip>
                  <FriendAvatar src={leetaenoAvatar} alt="이태노" />
                  <span>이태노</span>
                </FriendChip>
                <FriendChip>
                  <FriendAvatar src={avatarF1} alt="민수" />
                  <span>민수</span>
                </FriendChip>
                <FriendChip>
                  <FriendAvatar src={avatarF2} alt="지은" />
                  <span>지은</span>
                </FriendChip>
                <FriendChip>
                  <FriendAvatar src={apeachAvatar} alt="어피치" />
                  <span>어피치</span>
                </FriendChip>
              </FriendChipRow>
            </TogetherSection>

            {/* 하단 감성 액션 */}
            <MemoryActionRow>
              <LikeBtn type="button" onClick={() => handleLikeClick(selectedActivity.id)}>
                💖 좋아요 {likes[selectedActivity.id] || 12}
              </LikeBtn>

              <ShareBtn type="button" onClick={() => handleShareMemory(selectedActivity.title)}>
                추억 공유 📲
              </ShareBtn>
            </MemoryActionRow>
          </PolaroidContent>
        )}
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

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 800;
  color: #3b82f6;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
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

const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TopNoticeBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
`;

const AddTriggerBtn = styled.button`
  background: #fedd13;
  border: none;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  color: #111827;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
  }
`;

const AddFormCard = styled.form`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FormLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
`;

const FormInput = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #fedd13;
  }
`;

const FormSelect = styled.select`
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
`;

const SubmitAddBtn = styled.button`
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 4px;

  &:hover {
    background: #059669;
  }
`;

const ActivityGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActivityCardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
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

const CardThumbWrap = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;

  &.pink { background: #fbcfe8; }
  &.blue { background: #bae6fd; }
  &.cream { background: #fef3c7; }
  &.yellow { background: #fef08a; }
  &.green { background: #bbf7d0; }
`;

const CardThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
`;

const CardMeta = styled.span`
  font-size: 11px;
  color: #3b82f6;
  font-weight: 700;
`;

/* ──────── 추억 감성 폴라로이드 뷰 스타일 ──────── */
const PolaroidContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PolaroidFrame = styled.div`
  background: #fefcf3;
  border: 1px solid #e2d9c8;
  border-radius: 12px;
  padding: 18px 18px 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TapeEffect = styled.div`
  position: absolute;
  top: -10px;
  width: 80px;
  height: 22px;
  background: rgba(254, 221, 19, 0.5);
  transform: rotate(-3deg);
  border-radius: 4px;
`;

const PolaroidPhotoBox = styled.div`
  width: 100%;
  height: 210px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;

const PolaroidImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PolaroidCaption = styled.div`
  width: 100%;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
`;

const MemoryTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  font-family: 'Gowun Batang', serif, sans-serif;
`;

const MemoryDate = styled.span`
  font-size: 12px;
  color: #d97706;
  font-weight: 700;
`;

const MemoryNote = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  font-style: italic;
`;

const TogetherSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TogetherLabel = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #334155;
`;

const FriendChipRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FriendChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
`;

const FriendAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`;

const MemoryActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const LikeBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: 1.5px solid #fca5a5;
  background: #fff1f2;
  color: #e11d48;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ffe4e6;
  }
`;

const ShareBtn = styled.button`
  flex: 1;
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
  }
`;
