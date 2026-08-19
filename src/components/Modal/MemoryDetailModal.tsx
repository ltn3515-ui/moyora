import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import type { Moment } from '../../types';

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

const ICON_X = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const ICON_STAR = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ICON_LOCATION = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ICON_CALENDAR = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

interface MemoryDetailModalProps {
  momentId: string;
  onClose: () => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({ momentId, onClose }) => {
  const { savedMoments, toggleFavoriteMoment } = useAppContext();
  const momentItem = savedMoments.find((m) => m.id === momentId);

  if (!momentItem) return null;

  return (
    <Backdrop onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()} className={momentItem.thumbnailColor}>
        {/* 상단 액션 바 */}
        <TopBar>
          <CloseBtn onClick={onClose} aria-label="닫기">
            {ICON_X}
          </CloseBtn>
          <FavBtn 
            onClick={() => toggleFavoriteMoment(momentItem.id)} 
            className={momentItem.isFavorite ? 'fav' : ''}
            aria-label="즐겨찾기 토글"
          >
            {ICON_STAR}
          </FavBtn>
        </TopBar>

        {/* 이미지 영역 */}
        <ImageSection>
          {momentItem.image && (
            <img src={MOMENT_IMAGES[momentItem.image]} alt={momentItem.title} />
          )}
        </ImageSection>

        {/* 정보 영역 */}
        <ContentSection>
          <MetaRow>
            <MetaTag>
              {ICON_CALENDAR}
              <span>{momentItem.date}</span>
            </MetaTag>
            {momentItem.location && (
              <MetaTag className="location">
                {ICON_LOCATION}
                <span>{momentItem.location}</span>
              </MetaTag>
            )}
          </MetaRow>

          <Title>{momentItem.title}</Title>

          {/* 태그 리스트 */}
          {momentItem.tags && momentItem.tags.length > 0 && (
            <TagContainer>
              {momentItem.tags.map((tag, idx) => (
                <TagChip key={idx}>#{tag}</TagChip>
              ))}
            </TagContainer>
          )}

          <Divider />

          {/* 상세 설명 */}
          <DescriptionSection>
            <DescriptionTitle>그날의 기록</DescriptionTitle>
            <DescriptionText>
              {momentItem.description || '작성된 상세 설명이 없습니다. 그날의 아름다운 추억을 기록해 보세요.'}
            </DescriptionText>
          </DescriptionSection>
        </ContentSection>

        {/* 하단 확인 버튼 */}
        <FooterSection>
          <ConfirmBtn onClick={onClose}>돌아가기</ConfirmBtn>
        </FooterSection>
      </Sheet>
    </Backdrop>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translate(-50%, 100%); }
  to { transform: translate(-50%, 0); }
`;

// Styled Components
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 17, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 200;
  animation: ${fadeIn} 0.25s ease forwards;
`;

const Sheet = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  scrollbar-width: none;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -16px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  z-index: 210;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  &::-webkit-scrollbar {
    display: none;
  }

  /* 파스텔 톤 테마 배경 효과 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 180px;
    opacity: 0.15;
    z-index: 0;
    pointer-events: none;
  }
  
  &.pink::before { background: linear-gradient(180deg, ${({ theme }) => theme.colors.pink} 0%, transparent 100%); }
  &.yellow::before { background: linear-gradient(180deg, ${({ theme }) => theme.colors.yellow} 0%, transparent 100%); }
  &.blue::before { background: linear-gradient(180deg, ${({ theme }) => theme.colors.blue} 0%, transparent 100%); }
  &.cream::before { background: linear-gradient(180deg, ${({ theme }) => theme.colors.cream || '#fdf6e2'} 0%, transparent 100%); }
  &.gray::before { background: linear-gradient(180deg, ${({ theme }) => theme.colors.gray} 0%, transparent 100%); }
`;

const TopBar = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  z-index: 10;
  pointer-events: none;

  button {
    pointer-events: auto;
  }
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.9);
    background: ${({ theme }) => theme.colors.grayLight};
  }
`;

const FavBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: ${({ theme }) => theme.colors.textLight};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  &.fav {
    background: ${({ theme }) => theme.colors.blue};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.blue};
  }

  &:active {
    transform: scale(0.9);
  }
`;

const ImageSection = styled.div`
  margin: 0 24px;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 16 / 12;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ContentSection = styled.div`
  padding: 24px 24px 16px;
  z-index: 1;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const MetaTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.grayLight};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};

  svg {
    opacity: 0.8;
  }

  &.location {
    background: rgba(74, 144, 226, 0.08);
    color: ${({ theme }) => theme.colors.blue};
    
    svg {
      color: ${({ theme }) => theme.colors.blue};
    }
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 850;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  line-height: 1.3;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
`;

const TagChip = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textLight};
  background: rgba(0, 0, 0, 0.04);
  padding: 4px 10px;
  border-radius: 8px;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 20px 0;
`;

const DescriptionSection = styled.div`
  margin-bottom: 8px;
`;

const DescriptionTitle = styled.h4`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DescriptionText = styled.p`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  white-space: pre-line;
`;

const FooterSection = styled.div`
  padding: 8px 24px 32px;
  z-index: 1;
`;

const ConfirmBtn = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.bg};
  font-size: 16px;
  font-weight: 800;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.95;
  }
`;
