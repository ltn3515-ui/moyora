import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { MemoryDetailModal } from './MemoryDetailModal';

import picnicImg from '../../assets/picnic.png';
import cafeImg from '../../assets/cafe.png';
import festivalImg from '../../assets/festival.png';
import boardgameImg from '../../assets/boardgame.png';
import namsanImg from '../../assets/namsan.png';

const MOMENT_IMAGES: Record<string, string> = {
  'picnic.png': picnicImg || '/picnic.png',
  'cafe.png': cafeImg || '/cafe.png',
  'festival.png': festivalImg || '/festival.png',
  'boardgame.png': boardgameImg || '/boardgame.png',
  'namsan.png': namsanImg || '/namsan.png'
};

const ICON_MOMENTS = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="14" height="14" rx="3" />
    <path d="M3 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);

const ICON_X_SMALL = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const ICON_ADD_PHOTO = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="5.5" width="19" height="14" rx="3" />
    <circle cx="9" cy="11" r="2" />
    <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L15 16" />
    <path d="M17 3v6M14 6h6" />
  </svg>
);

const ICON_STAR = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

type FilterType = 'all' | '2026' | '2025' | 'favorite';

export const MemoryModal: React.FC = () => {
  const { savedMoments, toggleFavoriteMoment, setMemoryOpen } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedMomentId, setSelectedMomentId] = useState<string | null>(null);

  // 필터링 적용
  const filteredMoments = savedMoments.filter((m) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'favorite') return m.isFavorite;
    return m.year === activeFilter;
  });

  const handleAddPhoto = () => {
    alert('새로운 순간 사진 추가 기능은 다음 단계에서 개발될 예정입니다.');
  };

  return (
    <ModalBackdrop onClick={() => setMemoryOpen(false)}>
      <ModalSheet onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHead>
          <ModalTitle>
            {ICON_MOMENTS}
            저장된 순간들
          </ModalTitle>
          <CloseBtn onClick={() => setMemoryOpen(false)} aria-label="닫기">
            {ICON_X_SMALL}
          </CloseBtn>
        </ModalHead>

        {/* 필터 탭 */}
        <TabsContainer>
          <TabBtn 
            className={activeFilter === 'all' ? 'is-active' : ''} 
            onClick={() => setActiveFilter('all')}
          >
            전체
          </TabBtn>
          <TabBtn 
            className={`tab-2026 ${activeFilter === '2026' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('2026')}
          >
            2026
          </TabBtn>
          <TabBtn 
            className={`tab-2025 ${activeFilter === '2025' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('2025')}
          >
            2025
          </TabBtn>
          <TabBtn 
            className={`tab-favorite ${activeFilter === 'favorite' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('favorite')}
          >
            즐겨찾기
          </TabBtn>

          {/* 사진 추가 버튼 */}
          <AddPhotoTabBtn onClick={handleAddPhoto}>
            {ICON_ADD_PHOTO}
            <span className="add-text">추가</span>
          </AddPhotoTabBtn>
        </TabsContainer>

        {/* 순간들 2열 그리드 */}
        <MemoryGrid className={filteredMoments.length === 0 ? 'empty' : ''}>
          {filteredMoments.map((item) => (
            <MemoryCard 
              key={item.id} 
              className={item.thumbnailColor}
              onClick={() => setSelectedMomentId(item.id)}
            >
              <PhotoWrap>
                {item.image && (
                  <img src={MOMENT_IMAGES[item.image]} alt={item.title} />
                )}
                {/* 즐겨찾기 별 */}
                <FavBtn 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteMoment(item.id);
                  }} 
                  className={item.isFavorite ? 'fav' : ''}
                  aria-label="즐겨찾기 토글"
                >
                  {ICON_STAR}
                </FavBtn>
              </PhotoWrap>
              <CardDate>{item.date}</CardDate>
              <CardTitle>{item.title}</CardTitle>
            </MemoryCard>
          ))}
        </MemoryGrid>

        {/* 상세 내용 모달 */}
        {selectedMomentId && (
          <MemoryDetailModal 
            momentId={selectedMomentId} 
            onClose={() => setSelectedMomentId(null)} 
          />
        )}
      </ModalSheet>
    </ModalBackdrop>
  );
};

// Animations
const backdropFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const sheetSlideUp = keyframes`
  from { transform: translate(-50%, 100%); }
  to { transform: translate(-50%, 0); }
`;

// Styled Components
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(28, 28, 30, 0.42);
  z-index: 100;
  animation: ${backdropFadeIn} 0.2s ease forwards;
`;

const ModalSheet = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  height: calc(100vh - 44px);
  overflow-y: auto;
  scrollbar-width: none;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -12px 32px rgba(38, 38, 44, 0.22);
  padding: 20px 20px 32px;
  z-index: 110;
  animation: ${sheetSlideUp} 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin: 0;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.grayLight};
  color: ${({ theme }) => theme.colors.text};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-bottom: 20px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabBtn = styled.button`
  flex-shrink: 0;
  padding: 9px 16px;
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.grayLight};
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;

  &.is-active {
    background: ${({ theme }) => theme.colors.black};
    color: ${({ theme }) => theme.colors.white};
  }

  &.tab-2026.is-active {
    background: ${({ theme }) => theme.colors.yellow};
    color: ${({ theme }) => theme.colors.text};
  }

  &.tab-2025.is-active {
    background: ${({ theme }) => theme.colors.pinkLight};
    color: ${({ theme }) => theme.colors.text};
  }

  &.tab-favorite.is-active {
    background: ${({ theme }) => theme.colors.blueLight};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const AddPhotoTabBtn = styled.button`
  background: ${({ theme }) => theme.colors.yellow};
  color: #85600F;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  height: 33px;
  border-radius: ${({ theme }) => theme.radius.round};
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
  max-width: 42px;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.yellowDark};
    max-width: 100px;
    padding: 0 16px;
    
    .add-text {
      opacity: 1;
      max-width: 40px;
      margin-left: 6px;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    display: block;
    flex-shrink: 0;
  }

  .add-text {
    font-size: 12px;
    font-weight: 800;
    opacity: 0;
    max-width: 0;
    transition: all 0.25s ease;
    flex-shrink: 0;
  }
`;

const MemoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  &.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 0;

    &::after {
      content: '해당하는 순간이 아직 없어요.';
      font-size: 13px;
      color: ${({ theme }) => theme.colors.textLight};
      font-weight: 600;
    }
  }
`;

const MemoryCard = styled.div`
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(38, 38, 44, 0.1), 0 6px 6px rgba(38, 38, 44, 0.05);
  }

  &.pink { background: ${({ theme }) => theme.colors.pinkLight}; }
  &.yellow { background: ${({ theme }) => theme.colors.yellowLight}; }
  &.blue { background: ${({ theme }) => theme.colors.blueLight}; }
  &.cream { background: ${({ theme }) => theme.colors.creamLight}; }
  &.gray { background: ${({ theme }) => theme.colors.grayLight}; }
`;

const PhotoWrap = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FavBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  color: ${({ theme }) => theme.colors.gray};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(38, 38, 44, 0.15);
  transition: background 0.15s ease, color 0.15s ease;

  &.fav {
    background: ${({ theme }) => theme.colors.blue};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const CardDate = styled.div`
  margin-top: 8px;
  padding: 0 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSub};
`;

const CardTitle = styled.div`
  padding: 2px 4px 4px;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;
`;
