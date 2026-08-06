import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';

// SVG 아이콘 모음
const NAV_ICONS = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3.5a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  friends: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.8 5.5-5.8s5.5 2.5 5.5 5.8" />
      <circle cx="17" cy="8.5" r="2.4" />
      <path d="M15.8 14.6c2.4.3 4.2 2.5 4.2 5.4" />
    </svg>
  ),
  search: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  ),
  groups: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="4.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="14.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="14.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
  profile: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" />
    </svg>
  ),
  calculate: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="3" />
      <line x1="8" y1="6" x2="16" y2="6" strokeWidth="2.2" />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
      <circle cx="16" cy="11" r="1" fill="currentColor" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
      <circle cx="8" cy="19" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  )
};

export const Footer: React.FC = () => {
  const { isSearchOpen, setSearchOpen } = useAppContext();
  const location = useLocation();

  // 검색 모달 오픈 시 다른 탭들의 active 상태를 일시 비활성화하고 검색 탭 활성화 처리
  const isHomeActive = location.pathname === '/home' && !isSearchOpen;
  const isFriendsActive = location.pathname === '/friends' && !isSearchOpen;
  const isGroupsActive = location.pathname === '/groups' && !isSearchOpen;
  const isCalculateActive = location.pathname === '/calculate' && !isSearchOpen;
  const isProfileActive = location.pathname === '/profile' && !isSearchOpen;

  return (
    <BottomNav>
      <NavItemLink to="/home" className={isHomeActive ? 'is-active' : ''} onClick={() => setSearchOpen(false)}>
        {NAV_ICONS.home}
        <span>홈</span>
      </NavItemLink>

      <NavItemLink to="/friends" className={isFriendsActive ? 'is-active' : ''} onClick={() => setSearchOpen(false)}>
        {NAV_ICONS.friends}
        <span>친구</span>
      </NavItemLink>

      <NavSearchBtn 
        type="button" 
        className={isSearchOpen ? 'is-active' : ''} 
        onClick={() => setSearchOpen(!isSearchOpen)}
        data-tooltip="검색"
      >
        <SearchIconWrapper>{NAV_ICONS.search}</SearchIconWrapper>
        <span>검색</span>
      </NavSearchBtn>

      <NavItemLink to="/groups" className={isGroupsActive ? 'is-active' : ''} onClick={() => setSearchOpen(false)}>
        {NAV_ICONS.groups}
        <span>내 모임</span>
      </NavItemLink>

      <NavItemLink to="/calculate" className={isCalculateActive ? 'is-active' : ''} onClick={() => setSearchOpen(false)}>
        {NAV_ICONS.calculate}
        <span>정산</span>
      </NavItemLink>

      <NavItemLink to="/profile" className={isProfileActive ? 'is-active' : ''} onClick={() => setSearchOpen(false)}>
        {NAV_ICONS.profile}
        <span>내 정보</span>
      </NavItemLink>
    </BottomNav>
  );
};

// Styled Components
const BottomNav = styled.nav`
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: calc(480px - 32px);
  height: 64px;
  background: #2D2D2F;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  z-index: 40;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 700;
  transition: color 0.15s ease;

  &.active, &.is-active {
    color: ${({ theme }) => theme.colors.yellow};
  }

  span {
    font-size: 10px;
  }
`;

const NavSearchBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 700;
  position: relative;
  transition: color 0.15s ease;

  &.is-active {
    color: ${({ theme }) => theme.colors.yellow};
    
    span {
      color: ${({ theme }) => theme.colors.yellow};
    }
  }

  span {
    font-size: 10px;
  }
`;

const SearchIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.yellow};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);

  ${NavSearchBtn}.is-active & {
    background: ${({ theme }) => theme.colors.yellow};
    color: ${({ theme }) => theme.colors.black};
  }
`;
