import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAppContext } from '../context/AppContext';

import { SearchModal } from './Modal/SearchModal';
import { CameraModal } from './Modal/CameraModal';
import { MemoryModal } from './Modal/MemoryModal';
import { CustomCursor } from './CustomCursor';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isSearchOpen, isCameraOpen, isMemoryOpen } = useAppContext();

  const isHideHeaderFooter = location.pathname === '/' || location.pathname === '/login';

  // 현재 라우트에 따른 헤더 정보 동적 결정
  const getHeaderProps = () => {
    switch (location.pathname) {
      case '/home':
        return { showBell: true };
      case '/friends':
        return { title: '친구', showBackButton: true, showBell: true };
      case '/groups':
        return { title: '나의 모임', showBackButton: true };
      case '/profile':
        return { title: '내 정보', showBackButton: true, showBell: true };
      case '/calculate':
        return { title: '정산 관리', showBackButton: true };
      case '/newcru':
        return { title: '모임 생성', showBackButton: true };
      case '/option':
        return { title: '설정', showBackButton: true };
      case '/account':
        return { title: '대표 계좌 관리', showBackButton: true };
      default:
        return null;
    }
  };

  const headerProps = getHeaderProps();

  return (
    <AppShell>
      <CustomCursor />
      {!isHideHeaderFooter && headerProps && (
        <Header 
          title={headerProps.title} 
          showBackButton={headerProps.showBackButton} 
          showBell={headerProps.showBell} 
        />
      )}
      
      <MainContent className={!isHideHeaderFooter ? 'has-header-footer' : ''}>
        {children}
      </MainContent>

      {!isHideHeaderFooter && <Footer />}

      {isSearchOpen && <SearchModal />}
      {isCameraOpen && <CameraModal />}
      {isMemoryOpen && <MemoryModal />}
    </AppShell>
  );
};

// Styled Components
const AppShell = styled.div`
  position: relative;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  min-height: 100vh;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.bg};
  overflow-x: hidden;
  box-shadow: 0 0 32px rgba(38, 38, 44, 0.15);
  border-left: 1px solid rgba(38, 38, 44, 0.1);
  border-right: 1px solid rgba(38, 38, 44, 0.1);
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &.has-header-footer {
    padding-bottom: calc(${({ theme }) => theme.layout.bottomNavHeight} + 16px);
  }
`;
