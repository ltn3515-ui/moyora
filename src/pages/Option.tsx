import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { ProfileEditModal } from '../components/Modal/ProfileEditModal';
import { PasswordChangeModal } from '../components/Modal/PasswordChangeModal';
import type { OptionMenuItem } from '../types';

import leetaenoAvatar from '../assets/avatar_leetaeno.png';

const OPTION_ICONS = {
  person: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8.5c0-3.6-2.7-6.5-6-6.5s-6 2.9-6 6.5c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5Z" />
      <path d="M10.5 19.5a1.7 1.7 0 0 0 3 0" />
    </svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.3 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.3-3.5-8.5s1.2-6.1 3.5-8.5Z" />
    </svg>
  ),
  bank: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 9.5 12 4l8.5 5.5" />
      <path d="M4.5 9.5h15V19h-15z" />
      <path d="M4 19h16M8 9.5V19M12 9.5V19M16 9.5V19" />
    </svg>
  ),
  doc: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="3.5" width="13" height="17" rx="1.5" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3" />
      <path d="M13.5 8 18 12l-4.5 4M18 12H9" />
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9l7 7 7-7" />
    </svg>
  )
};

export const Option: React.FC = () => {
  const { profile, appSettings, payoutAccount, optionMenuSections, toggleNotifications, changeLanguage } = useAppContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleItemClick = (item: OptionMenuItem) => {
    if (item.key === 'profile') {
      setIsProfileModalOpen(true);
    } else if (item.key === 'password') {
      setIsPasswordModalOpen(true);
    } else if (item.key === 'account') {
      navigate('/account');
    } else if (item.key === 'logout') {
      showToast('로그아웃 되었습니다. 안녕히 가세요! 👋', 'info');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else if (item.type === 'link') {
      if (item.label.includes('프로필')) {
        setIsProfileModalOpen(true);
      } else if (item.label.includes('비밀번호')) {
        setIsPasswordModalOpen(true);
      } else {
        alert(`"${item.label}" 화면은 아직 시안이 없어 다음 단계에서 연결될 예정입니다.`);
      }
    }
  };

  return (
    <OptionContainer>
      {/* 프로필 요약 카드 */}
      <ProfileSummaryCard>
        <AvatarContainer>
          <img src={leetaenoAvatar} alt={profile.name} />
        </AvatarContainer>
        <ProfileBody>
          <ProfileName>{profile.name} 님</ProfileName>
          <ProfileEmail>{profile.email}</ProfileEmail>
        </ProfileBody>
        <EditBtn onClick={() => setIsProfileModalOpen(true)}>수정</EditBtn>
      </ProfileSummaryCard>

      {/* 메뉴 섹션들 */}
      {optionMenuSections.map((section, secIdx) => (
        <SectionContainer key={secIdx}>
          <SectionLabel>{section.label}</SectionLabel>
          <OptionListCard>
            {section.items.map((item) => {
              const isActionable = item.type === 'action' || item.type === 'link';
              
              return (
                <OptionItem 
                  key={item.key} 
                  className={isActionable ? 'actionable' : ''}
                  onClick={() => isActionable && handleItemClick(item)}
                >
                  <OptionIconWrapper className={item.color}>
                    {OPTION_ICONS[item.icon as keyof typeof OPTION_ICONS]}
                  </OptionIconWrapper>
                  <OptionItemBody>
                    <OptionItemLabel>
                      {item.label}
                      {item.key === 'account' && payoutAccount.bankName && (
                        <AccountBadge>{payoutAccount.bankName}</AccountBadge>
                      )}
                    </OptionItemLabel>
                    {item.sublabel && (
                      <OptionItemSublabel>
                        {item.key === 'account' && payoutAccount.bankName 
                          ? `${payoutAccount.bankName} ${payoutAccount.accountNumberMasked}`
                          : item.sublabel
                        }
                      </OptionItemSublabel>
                    )}
                  </OptionItemBody>

                  {/* 값 유형별 렌더링 */}
                  {item.type === 'toggle' && (
                    <ToggleSwitch 
                      className={appSettings.notificationsEnabled ? 'is-on' : ''} 
                      onClick={toggleNotifications}
                      role="switch"
                      aria-checked={appSettings.notificationsEnabled}
                    />
                  )}

                  {item.type === 'select' && (
                    <SelectValueWrapper>
                      <span>{appSettings.language}</span>
                      {OPTION_ICONS.chevronDown}
                      <SelectElement 
                        aria-label={item.label}
                        value={appSettings.language}
                        onChange={(e) => changeLanguage(e.target.value)}
                      >
                        <option value="한국어">한국어</option>
                        <option value="영어">영어</option>
                        <option value="일본어">일본어</option>
                        <option value="중국어">중국어</option>
                      </SelectElement>
                    </SelectValueWrapper>
                  )}

                  {item.type === 'link' && (
                    <ChevronRightWrapper>{OPTION_ICONS.chevronRight}</ChevronRightWrapper>
                  )}
                </OptionItem>
              );
            })}
          </OptionListCard>
        </SectionContainer>
      ))}

      {/* 앱 버전 */}
      <OptionVersion>Moyora {appSettings.appVersion}</OptionVersion>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* 비밀번호 변경 모달 */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </OptionContainer>
  );
};

// Styled Components
const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

const ProfileSummaryCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 12px 20px 0;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.yellow};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const AvatarContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 3px solid rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const ProfileName = styled.p`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ProfileEmail = styled.p`
  font-size: 13px;
  color: rgba(38, 38, 44, 0.65);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const EditBtn = styled.button`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 700;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const SectionContainer = styled.div`
  padding: 0 20px;
  margin-top: 24px;
`;

const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
  margin-bottom: 8px;
  margin-left: 4px;
`;

const OptionListCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(38, 38, 44, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: visible;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(38, 38, 44, 0.08), 0 4px 10px rgba(38, 38, 44, 0.04);
  }
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  min-height: 64px;
  background: transparent;
  border-radius: 20px;
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
              background 0.15s ease;

  &.actionable {
    cursor: pointer;

    &:hover {
      background: #FFFBF3;
      transform: translateY(-3px);
      box-shadow: 0 8px 18px rgba(38, 38, 44, 0.08), 0 3px 6px rgba(38, 38, 44, 0.04);
      z-index: 1;
      position: relative;
    }
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  &.actionable:hover + & {
    border-top-color: transparent;
  }
`;

const OptionIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;

  &.pink { background: ${({ theme }) => theme.colors.pinkLight}; color: #C24B7C; }
  &.blue { background: ${({ theme }) => theme.colors.blueLight}; color: #3C7CA6; }
  &.yellow { background: ${({ theme }) => theme.colors.yellowLight}; color: #8A6D00; }
  &.gray { background: ${({ theme }) => theme.colors.grayLight}; color: #6E6656; }
  &.red { background: ${({ theme }) => theme.colors.pinkLight}; color: #E2574C; }
`;

const OptionItemBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OptionItemLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AccountBadge = styled.span`
  background: ${({ theme }) => theme.colors.blueLight};
  color: #3C7CA6;
  font-size: 9.5px;
  font-weight: 800;
  padding: 1.5px 6px;
  border-radius: 4px;
`;

const OptionItemSublabel = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
`;

const ChevronRightWrapper = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
`;

const ToggleSwitch = styled.button`
  flex-shrink: 0;
  position: relative;
  width: 46px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.grayLight};
  transition: background 0.2s ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease;
  }

  &.is-on {
    background: #7A5C29;
    
    &::after {
      transform: translateX(20px);
    }
  }
`;

const SelectValueWrapper = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;

  svg {
    color: #7A5C29;
  }
`;

const SelectElement = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
`;

const OptionVersion = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 28px;
  font-weight: 600;
`;
