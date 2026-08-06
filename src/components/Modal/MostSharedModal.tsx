import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';
import type { Activity } from '../../types';

import activityArt from '../../assets/activity_art.png';
import activityCreate from '../../assets/activity_create.png';
import cafeImg from '../../assets/cafe.png';
import festivalImg from '../../assets/festival.png';
import namsanImg from '../../assets/namsan.png';
import picnicImg from '../../assets/picnic.png';

import apeachAvatar from '../../assets/apeach_avatar.png';
import leetaenoAvatar from '../../assets/avatar_leetaeno.png';
import avatarF1 from '../../assets/avatar_f1_circle.png';
import avatarF2 from '../../assets/avatar_f2_circle.png';
import avatarF3 from '../../assets/avatar_f3_circle.png';

export interface SharedActivityItem extends Activity {
  likesCount: number;
  shareCount: number;
  authorName: string;
  authorAvatar: string;
}

const MOST_SHARED_ITEMS: SharedActivityItem[] = [
  {
    id: 'shared-01',
    title: '아트 페스티벌 수제 공예 전시',
    image: 'activity_art.png',
    avatarColor: 'pink',
    likesCount: 142,
    shareCount: 89,
    authorName: '이태노',
    authorAvatar: leetaenoAvatar
  },
  {
    id: 'shared-02',
    title: '성수 카페거리 감성 출사 모임',
    image: 'cafe.png',
    avatarColor: 'yellow',
    likesCount: 118,
    shareCount: 72,
    authorName: '어피치',
    authorAvatar: apeachAvatar
  },
  {
    id: 'shared-03',
    title: '여름 자작나무 숲 버스킹 라이브',
    image: 'festival.png',
    avatarColor: 'blue',
    likesCount: 95,
    shareCount: 54,
    authorName: '민수',
    authorAvatar: avatarF1
  },
  {
    id: 'shared-04',
    title: '한강 망원지구 피크닉 & 힐링',
    image: 'picnic.png',
    avatarColor: 'green',
    likesCount: 87,
    shareCount: 46,
    authorName: '지은',
    authorAvatar: avatarF2
  },
  {
    id: 'shared-05',
    title: '남산 타워 야경 사진 스팟 출사',
    image: 'namsan.png',
    avatarColor: 'cream',
    likesCount: 76,
    shareCount: 38,
    authorName: '현우',
    authorAvatar: avatarF3
  }
];

const IMAGE_MAP: Record<string, string> = {
  'activity_art.png': activityArt,
  'activity_create.png': activityCreate,
  'cafe.png': cafeImg,
  'festival.png': festivalImg,
  'namsan.png': namsanImg,
  'picnic.png': picnicImg
};

interface MostSharedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenActivityDetail?: (activity: Activity) => void;
}

export const MostSharedModal: React.FC<MostSharedModalProps> = ({
  isOpen,
  onClose,
  onOpenActivityDetail
}) => {
  const { showToast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<SharedActivityItem | null>(null);

  if (!isOpen) return null;

  const handleItemClick = (item: SharedActivityItem) => {
    setSelectedActivity(item);
    if (onOpenActivityDetail) {
      onOpenActivityDetail(item);
    } else {
      showToast(`'${item.title}' 활동 상세 화면으로 이동합니다. 💖`, 'info', '💖');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>
            {selectedActivity ? (
              <BackBtn type="button" onClick={() => setSelectedActivity(null)}>
                ‹ 인기 활동 목록
              </BackBtn>
            ) : (
              '🔥 많이 공유된 활동 (좋아요 순)'
            )}
          </HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {!selectedActivity ? (
          /* ──────── 뷰 1: 좋아요 순 공유 활동 목록 ──────── */
          <ListContent>
            <SubtitleText>사용자들이 가장 많이 공유하고 하트(💖)를 누른 인기 활동들입니다.</SubtitleText>

            <ActivityList>
              {MOST_SHARED_ITEMS.map((item, idx) => (
                <ActivityCardItem key={item.id} onClick={() => handleItemClick(item)}>
                  <RankBadge className={idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : ''}>
                    {idx + 1}
                  </RankBadge>

                  <ThumbWrap className={item.avatarColor}>
                    <ThumbImg src={(item.image && IMAGE_MAP[item.image]) || activityArt} alt={item.title} />
                  </ThumbWrap>

                  <CardBody>
                    <CardTitleRow>
                      <CardTitle>{item.title}</CardTitle>
                    </CardTitleRow>
                    <AuthorMeta>
                      <AuthorAvatar src={item.authorAvatar} alt={item.authorName} />
                      <span>{item.authorName}</span>
                    </AuthorMeta>
                  </CardBody>

                  <StatsSide>
                    <LikeTag>💖 {item.likesCount}</LikeTag>
                    <ShareTag>📲 {item.shareCount}회 공유</ShareTag>
                  </StatsSide>
                </ActivityCardItem>
              ))}
            </ActivityList>
          </ListContent>
        ) : (
          /* ──────── 뷰 2: 활동 상세 폴라로이드 화면 ──────── */
          <PolaroidContent>
            <PolaroidFrame>
              <TapeEffect />
              <PolaroidPhotoBox>
                <PolaroidImg src={(selectedActivity.image && IMAGE_MAP[selectedActivity.image]) || activityArt} alt={selectedActivity.title} />
              </PolaroidPhotoBox>

              <PolaroidCaption>
                <MemoryTitle>{selectedActivity.title}</MemoryTitle>
                <MemoryAuthorRow>
                  <AuthorAvatar src={selectedActivity.authorAvatar} alt={selectedActivity.authorName} />
                  <span>작성자: {selectedActivity.authorName} · 💖 좋아요 {selectedActivity.likesCount}개</span>
                </MemoryAuthorRow>
                <MemoryNote>
                  "많은 회원들이 공감하고 공유한 인기 활동의 추억 필름입니다. 탭하여 이 순간을 함께 나누어보세요!"
                </MemoryNote>
              </PolaroidCaption>
            </PolaroidFrame>
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

const HeaderTitle = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: #111827;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 14px;
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
  gap: 12px;
`;

const SubtitleText = styled.p`
  margin: -4px 0 0;
  font-size: 12px;
  color: #64748b;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ActivityCardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ffffff;
    border-color: #fedd13;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const RankBadge = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.top1 { background: #ef4444; color: #ffffff; }
  &.top2 { background: #f59e0b; color: #ffffff; }
  &.top3 { background: #3b82f6; color: #ffffff; }
`;

const ThumbWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;

  &.pink { background: #fbcfe8; }
  &.yellow { background: #fef08a; }
  &.blue { background: #bae6fd; }
  &.green { background: #bbf7d0; }
  &.cream { background: #fef3c7; }
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
  overflow: hidden;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
`;

const CardTitle = styled.span`
  font-size: 13.5px;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AuthorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #64748b;
`;

const AuthorAvatar = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
`;

const StatsSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
`;

const LikeTag = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #e11d48;
  background: #ffe4e6;
  padding: 3px 8px;
  border-radius: 8px;
`;

const ShareTag = styled.span`
  font-size: 10px;
  color: #64748b;
  font-weight: 700;
`;

/* 폴라로이드 상세 뷰 */
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
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
`;

const MemoryAuthorRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
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
