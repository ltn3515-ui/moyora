import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import imgLogoFull from '../assets/img_logo_full.png';
import { NotificationModal } from './Modal/NotificationModal';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showBell?: boolean;
  onBackClick?: () => void;
  onBellClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showBell = false,
  onBackClick,
  onBellClick
}) => {
  const navigate = useNavigate();
  const { unreadNotifCount } = useAppContext();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const hasUnread = unreadNotifCount > 0;

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleBell = () => {
    if (onBellClick) {
      onBellClick();
    } else {
      setIsNotifOpen(true);
    }
  };

  // 타이틀이 없는 경우 홈 로고 헤더로 렌더링
  if (!title) {
    return (
      <>
        <LogoHeaderContainer>
          <LogoLink onClick={() => navigate('/home')}>
            <LogoImage src={imgLogoFull} alt="모여라" />
          </LogoLink>
          {showBell && (
            <BellButton aria-label="알림" onClick={handleBell}>
              🔔{hasUnread && <BellBadge />}
            </BellButton>
          )}
        </LogoHeaderContainer>

        <NotificationModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />
      </>
    );
  }

  // 타이틀이 있는 경우 타이틀 헤더로 렌더링
  return (
    <>
      <AppHeaderContainer>
        {showBackButton ? (
          <HeaderIconButton onClick={handleBack} aria-label="뒤로가기">
            <i className="fa-solid fa-chevron-left"></i>
          </HeaderIconButton>
        ) : (
          <div />
        )}
        <HeaderTitle>{title}</HeaderTitle>
        {showBell ? (
          <HeaderIconButton className="right" aria-label="알림" onClick={handleBell}>
            🔔{hasUnread && <BellBadgeDot />}
          </HeaderIconButton>
        ) : (
          <div />
        )}
      </AppHeaderContainer>

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </>
  );
};

// Styled Components
const LogoHeaderContainer = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  height: 68px;
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
`;

const LogoLink = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.04);
  }
`;

const LogoImage = styled.img`
  height: 48px; /* 눈에 잘 보이도록 로고 이미지 크기 확대 */
  max-width: 180px;
  object-fit: contain;
`;

const BellButton = styled.button`
  position: absolute;
  right: 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.round};
`;

const BellBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.pink};
  border: 1.5px solid ${({ theme }) => theme.colors.bg};
`;

const AppHeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  height: ${({ theme }) => theme.layout.headerHeight};
  padding: 0 ${({ theme }) => theme.spacing.space4};
  background: ${({ theme }) => theme.colors.bg};
`;

const HeaderIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.round};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  position: relative;

  &.right {
    justify-self: end;
  }
`;

const HeaderTitle = styled.h1`
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.2px;
  margin: 0;
`;

const BellBadgeDot = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.pink};
  border: 1.5px solid ${({ theme }) => theme.colors.bg};
`;
