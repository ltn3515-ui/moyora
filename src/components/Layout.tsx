import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAppContext } from '../context/AppContext';
import { useToast } from './Toast';

import { SearchModal } from './Modal/SearchModal';
import { CameraModal } from './Modal/CameraModal';
import { MemoryModal } from './Modal/MemoryModal';
import { CustomCursor } from './CustomCursor';
import { VirtualKeyboard } from './VirtualKeyboard';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isSearchOpen, isCameraOpen, isMemoryOpen, joinGroupById, appSettings } = useAppContext();
  const { showToast } = useToast();

  useEffect(() => {
    // 쿼리 스트링 파싱
    const params = new URLSearchParams(location.search);
    const joinGroupId = params.get('join');
    if (joinGroupId) {
      const joined = joinGroupById(joinGroupId);
      if (joined) {
        showToast(`초대 링크를 통해 '${joined.name}' 모임에 참가 완료했습니다! 🎉`, 'success');
      } else {
        showToast('존재하지 않거나 만료된 모임 초대 링크입니다. ⚠️', 'error');
      }
      
      // 주소창에서 join 쿼리 파라미터 정리 (히스토리 정리)
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location.search, joinGroupById, showToast]);

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
    <AppShell $blueBg={appSettings.blueBackgroundEnabled}>
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
      
      {/* 모바일 가상 키보드 글로벌 마운트 */}
      <VirtualKeyboard />
    </AppShell>
  );
};

// Styled Components
const AppShell = styled.div<{ $blueBg?: boolean }>`
  position: relative;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  min-height: 100vh;
  margin: 0 auto;
  background: ${({ theme, $blueBg }) => $blueBg ? '#1C5EE6' : theme.colors.bg};
  overflow-x: hidden;
  box-shadow: 0 0 32px rgba(38, 38, 44, 0.15);
  border-left: 1px solid rgba(38, 38, 44, 0.1);
  border-right: 1px solid rgba(38, 38, 44, 0.1);
  display: flex;
  flex-direction: column;
  transition: background 0.3s ease;
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
