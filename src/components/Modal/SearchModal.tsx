import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import imgLogoFull from '../../assets/img_logo_full.png';
import { ExploreModal } from './ExploreModal';

const CATEGORY_ICONS = {
  '전시회': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="13" rx="2" />
      <path d="m3 14.5 5-4.5 4 3.5 4-4 5 4.5" />
      <circle cx="8" cy="9" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
  '원데이 클래스': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6.5 11.8v4.2c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.2" />
      <path d="M20.5 9.5v6" />
    </svg>
  ),
  '러닝크루': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="4.5" r="1.8" />
      <path d="m6 21 3.5-5 2-2.5-1-4 4 1 2 3.5 3.5 1.5" />
      <path d="m9.5 14 -4 1.5" />
      <path d="M11.5 9.5 8 8l-2 3" />
    </svg>
  ),
  '보드게임': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="8.3" cy="8.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.7" cy="8.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.3" cy="15.7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.7" cy="15.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
};

const ICON_X_SMALL = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const ICON_SPARKLE = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 3c.5 3.2 1.9 4.6 5 5-3.1.4-4.5 1.8-5 5-.5-3.2-1.9-4.6-5-5 3.1-.4 4.5-1.8 5-5Z" />
    <path d="M19 13c.3 1.7 1 2.4 2.7 2.7-1.7.3-2.4 1-2.7 2.7-.3-1.7-1-2.4-2.7-2.7 1.7-.3 2.4-1 2.7-2.7Z" />
  </svg>
);

const SEARCH_TAG_COLORS = ['pink', 'yellow', 'blue', 'gray'];

export const SearchModal: React.FC = () => {
  const { 
    recentSearches, 
    popularCategories, 
    addRecentSearch, 
    removeRecentSearch, 
    clearRecentSearches, 
    setSearchOpen 
  } = useAppContext();

  const [inputValue, setInputValue] = useState('');
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 마운트 시 포커스
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = inputValue.trim();
      if (query) {
        addRecentSearch(query);
        setInputValue('');
      }
    }
  };

  const handleCategoryClick = (_name: string) => {
    setIsExploreOpen(true);
  };

  return (
    <>
      <ModalBackdrop onClick={() => setSearchOpen(false)}>
        <ModalSheet onClick={(e) => e.stopPropagation()}>
          {/* 모달 헤더 */}
          <ModalHeader>
            <LogoImage src={imgLogoFull} alt="모여라" />
            <CloseButton onClick={() => setSearchOpen(false)} aria-label="닫기">
              <i className="fa-solid fa-xmark"></i>
            </CloseButton>
          </ModalHeader>

          {/* 새로운 모임 및 친구 탐색 하이라이트 배너 */}
          <ExploreHeroBanner onClick={() => setIsExploreOpen(true)}>
            <HeroBannerLeft>
              <HeroBannerTitle>🧭 새로운 모임 & 친구 탐색하기</HeroBannerTitle>
              <HeroBannerSub>신규 모임 참여 신청 및 친구 직접 검색/초대 💌</HeroBannerSub>
            </HeroBannerLeft>
            <HeroBannerChevron>›</HeroBannerChevron>
          </ExploreHeroBanner>

          {/* 검색창 */}
          <SearchBar>
            <SearchIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.3-4.3" />
              </svg>
            </SearchIcon>
            <SearchInput 
              ref={inputRef}
              type="text" 
              placeholder="관심사 또는 친구를 찾아보세요..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </SearchBar>

        {/* 최근 검색어 */}
        <RecentSearchSection>
          <SectionHead>
            <SectionTitle>최근 검색어</SectionTitle>
            {recentSearches.length > 0 && (
              <ClearAllBtn onClick={clearRecentSearches}>전체삭제</ClearAllBtn>
            )}
          </SectionHead>
          <TagsContainer>
            {recentSearches.length === 0 ? (
              <EmptyText>최근 검색어가 없습니다.</EmptyText>
            ) : (
              recentSearches.map((keyword, idx) => {
                const color = SEARCH_TAG_COLORS[idx % SEARCH_TAG_COLORS.length];
                return (
                  <SearchTag key={idx} className={color}>
                    {keyword}
                    <RemoveTagBtn 
                      onClick={() => removeRecentSearch(keyword)}
                      aria-label={`${keyword} 삭제`}
                    >
                      {ICON_X_SMALL}
                    </RemoveTagBtn>
                  </SearchTag>
                );
              })
            )}
          </TagsContainer>
        </RecentSearchSection>

        {/* 인기 카테고리 */}
        <CategorySection>
          <SectionTitle>인기 카테고리</SectionTitle>
          <CategoryGrid>
            {popularCategories.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                className={cat.color}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <CardBlob />
                <CardIcon>{CATEGORY_ICONS[cat.name as keyof typeof CATEGORY_ICONS]}</CardIcon>
                <CardLabel>{cat.name}</CardLabel>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </CategorySection>

        {/* 맞춤 활동 배너 */}
        <BannerSection>
          <BannerIcon>{ICON_SPARKLE}</BannerIcon>
          <BannerContent>
            <BannerTitle>원하는 모임을 찾지 못하셨나요?</BannerTitle>
            <BannerDesc>취향과 관심사를 입력하시면 매칭 활동을 추천해 드립니다.</BannerDesc>
          </BannerContent>
        </BannerSection>
      </ModalSheet>
    </ModalBackdrop>

    {/* 새로운 모임 & 친구 탐색 모달 */}
    <ExploreModal
      isOpen={isExploreOpen}
      onClose={() => setIsExploreOpen(false)}
    />
  </>
);
};

// Animations
const backdropFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const sheetSlideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

// Styled Components
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(38, 38, 44, 0.42);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  animation: ${backdropFadeIn} 0.2s ease forwards;
`;

const ModalSheet = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: 24px 24px 0 0;
  padding: 22px 20px calc(24px + env(safe-area-inset-bottom));
  animation: ${sheetSlideUp} 0.25s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const ExploreHeroBanner = styled.div`
  margin: 12px 0 8px;
  background: #fedd13;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.35);
  transition: all 0.2s ease;

  &:hover {
    background: #f5cf00;
    transform: translateY(-2px);
  }
`;

const HeroBannerLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HeroBannerTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #111827;
`;

const HeroBannerSub = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #374151;
`;

const HeroBannerChevron = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #111827;
`;

const LogoImage = styled.img`
  height: 22px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ECEBE8;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.bg};
  margin-bottom: 24px;
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

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const RecentSearchSection = styled.div`
  margin-bottom: 26px;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ClearAllBtn = styled.button`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 700;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const EmptyText = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 600;
  padding: 4px 0;
`;

const SearchTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  border: 1.5px solid transparent;

  &.pink { background: ${({ theme }) => theme.colors.pinkLight}; }
  &.yellow { background: ${({ theme }) => theme.colors.yellowLight}; }
  &.blue { background: ${({ theme }) => theme.colors.blueLight}; }
  &.gray { background: ${({ theme }) => theme.colors.grayLight}; }
`;

const RemoveTagBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSub};
  padding: 0;
`;

const CategorySection = styled.div`
  margin-bottom: 24px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
`;

const CardBlob = styled.span`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  bottom: -16px;
  right: -16px;
  background: rgba(0, 0, 0, 0.04);
  z-index: -1;
`;

const CategoryCard = styled.button`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1.5px solid transparent;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }

  &.pink { background: ${({ theme }) => theme.colors.pinkLight}; color: #C24B7C; }
  &.yellow { background: ${({ theme }) => theme.colors.yellowLight}; color: #8A6D00; }
  &.blue { background: ${({ theme }) => theme.colors.blueLight}; color: #3C7CA6; }
  &.gray { background: ${({ theme }) => theme.colors.grayLight}; color: #6E6656; }
`;

const CardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CardLabel = styled.span`
  font-size: 13.5px;
  font-weight: 800;
`;

const BannerSection = styled.div`
  background: #EDF7FF;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BannerIcon = styled.span`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #C4E4FF;
  color: #3E8DDA;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BannerTitle = styled.div`
  font-size: 12.5px;
  font-weight: 800;
  color: #1F3E5A;
`;

const BannerDesc = styled.div`
  font-size: 10.5px;
  color: #4C7293;
  font-weight: 600;
  line-height: 1.35;
`;
