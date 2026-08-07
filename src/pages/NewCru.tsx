import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import imgNewcruHero from '../assets/img_newcru_hero.png';

const ICONS = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5.2c-1.4-.9-3.4-1.2-5.5-1.2-.6 0-1 .4-1 1v12c0 .6.4 1 1 1 2.1 0 4.1.3 5.5 1.2 1.4-.9 3.4-1.2 5.5-1.2.6 0 1-.4 1-1V5c0-.6-.4-1-1-1-2.1 0-4.1.3-5.5 1.2z" />
      <path d="M12 5.2V18" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M3.5 20c0-3.3 2.5-5.7 5.5-5.7s5.5 2.4 5.5 5.7" />
      <path d="M15.3 15c2.2.4 3.7 2.4 3.7 5" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  ),
  ball: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
};

export const NewCru: React.FC = () => {
  const { groupPurposeCategories, addGroup } = useAppContext();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  const [createShareLink, setCreateShareLink] = useState(true);

  const selectPurpose = (id: string) => {
    setSelectedId(id);
    setIsCustomSelected(false);
  };

  const selectCustom = () => {
    setIsCustomSelected(true);
    setSelectedId(null);
  };

  const isEnabled = 
    !!selectedId || (isCustomSelected && customInputValue.trim().length > 0);

  const handleNextStep = () => {
    if (!isEnabled) return;

    let purposeName = '';
    let icon = '👥';

    if (isCustomSelected) {
      purposeName = customInputValue.trim();
    } else {
      const selected = groupPurposeCategories.find((c) => c.id === selectedId);
      purposeName = selected ? selected.name : '';
      if (selected?.icon === 'book') icon = '📚';
      else if (selected?.icon === 'people') icon = '👥';
      else if (selected?.icon === 'bolt') icon = '⚡';
      else if (selected?.icon === 'ball') icon = '⭐️';
    }

    const generatedGroupId = `group-${Date.now()}`;
    addGroup(purposeName, purposeName, icon);

    if (createShareLink) {
      const inviteUrl = `${window.location.origin}/groups?join=${generatedGroupId}`;
      navigator.clipboard.writeText(inviteUrl).then(() => {
        alert(`"${purposeName}" 모임이 성공적으로 생성되었습니다!\n\n🔗 복사된 모임 초대 링크:\n${inviteUrl}\n\n링크가 클립보드에 자동 복사되었습니다. 링크를 친구에게 공유해보세요!`);
        navigate('/groups');
      }).catch(() => {
        alert(`"${purposeName}" 모임이 성공적으로 생성되었습니다!\n\n🔗 모임 초대 링크:\n${inviteUrl}`);
        navigate('/groups');
      });
    } else {
      alert(`"${purposeName}" 모임이 성공적으로 생성되었습니다!`);
      navigate('/groups');
    }
  };

  return (
    <NewCruContainer>
      {/* 진행 상태 */}
      <WizardProgress>
        <ProgressRow>
          <ProgressStep>Step 01</ProgressStep>
          <ProgressCount>6단계 중 1단계</ProgressCount>
        </ProgressRow>
        <ProgressTrack>
          <ProgressFill style={{ width: '16.6%' }} />
        </ProgressTrack>
      </WizardProgress>

      {/* 대표 사진 영역 */}
      <PhotoUpload onClick={() => alert('대표 사진 선택 기능은 다음 단계에서 연결됩니다.')}>
        <PhotoImg src={imgNewcruHero} alt="모임 대표 사진" />
        <PhotoBtn>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginRight: '4px' }}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          사진 추가
        </PhotoBtn>
      </PhotoUpload>

      {/* 타이틀 */}
      <WizardTitle>모임의 목적을<br />알려주세요!</WizardTitle>

      {/* 목적 카테고리 그리드 */}
      <PurposeGrid>
        {groupPurposeCategories.map((c) => (
          <PurposeCard 
            key={c.id} 
            className={`${c.color} ${selectedId === c.id ? 'selected' : ''}`}
            onClick={() => selectPurpose(c.id)}
          >
            <PurposeCardIcon>{ICONS[c.icon as keyof typeof ICONS] || ''}</PurposeCardIcon>
            <PurposeCardLabel>{c.name}</PurposeCardLabel>
          </PurposeCard>
        ))}
      </PurposeGrid>

      {/* 직접 입력 */}
      <PurposeCustom 
        className={isCustomSelected ? 'selected' : ''} 
        onClick={selectCustom}
      >
        <CustomLabel onClick={(e) => { e.stopPropagation(); selectCustom(); }}>
          ✏️&nbsp; 직접입력
        </CustomLabel>
        <CustomInput 
          type="text" 
          placeholder="모임 목적을 입력해주세요" 
          maxLength={16}
          value={customInputValue}
          onChange={(e) => setCustomInputValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </PurposeCustom>

      {/* 초대 링크 활성화 체크박스 */}
      <LinkCreationOptionCard onClick={() => setCreateShareLink(!createShareLink)}>
        <CheckboxInput 
          type="checkbox" 
          checked={createShareLink} 
          onChange={() => {}}
          aria-label="초대 링크 생성 동의"
        />
        <LinkOptionTextWrap>
          <LinkOptionTitle>🔗 모임 초대 링크 만들기 (추천)</LinkOptionTitle>
          <LinkOptionDesc>앱이 설치되지 않은 사람이나 비회원도 링크 하나로 즉시 이 모임에 참여할 수 있습니다.</LinkOptionDesc>
        </LinkOptionTextWrap>
      </LinkCreationOptionCard>

      {/* 다음 단계 푸터 */}
      <WizardFooter>
        <NextStepBtn 
          type="button" 
          className={isEnabled ? 'enabled' : ''} 
          onClick={handleNextStep}
          disabled={!isEnabled}
        >
          다음 단계로 (생성 완료) →
        </NextStepBtn>
      </WizardFooter>
    </NewCruContainer>
  );
};

// Styled Components
const NewCruContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 96px;
`;

const WizardProgress = styled.div`
  padding: 12px 20px 0;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProgressStep = styled.span`
  font-size: 13.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.pink};
`;

const ProgressCount = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.round};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.pink};
  border-radius: ${({ theme }) => theme.radius.round};
`;

const PhotoUpload = styled.div`
  position: relative;
  margin: 18px 20px 24px;
  height: 150px;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: #EAE3D5;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.92);
`;

const PhotoBtn = styled.span`
  position: absolute;
  bottom: 12px;
  right: 14px;
  background: rgba(38, 38, 44, 0.72);
  color: ${({ theme }) => theme.colors.white};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 10.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  backdrop-filter: blur(4px);
`;

const WizardTitle = styled.h2`
  padding: 0 20px;
  font-size: 25px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.5px;
  margin-bottom: 20px;
  margin-top: 0;
`;

const PurposeGrid = styled.div`
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const PurposeCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 18px;
  min-height: 110px;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
  border: 2px solid transparent;

  &:active {
    transform: scale(0.97);
  }

  &.selected {
    border-color: ${({ theme }) => theme.colors.black};
  }

  &.yellow { background: ${({ theme }) => theme.colors.yellowLight}; color: #5C4A00; }
  &.pink { background: ${({ theme }) => theme.colors.pinkLight}; color: #731A47; }
  &.blue { background: ${({ theme }) => theme.colors.blueLight}; color: #1D4359; }
  &.cream { background: ${({ theme }) => theme.colors.creamLight}; color: #5C3E0C; }
`;

const PurposeCardIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PurposeCardLabel = styled.span`
  font-size: 14.5px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin-top: 14px;
`;

const PurposeCustom = styled.div`
  margin: 14px 20px 0;
  padding: 12px 18px;
  border: 1.8px dashed #B8AF9F;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  background: transparent;

  &.selected {
    border-color: ${({ theme }) => theme.colors.black};
    border-style: solid;
    background: ${({ theme }) => theme.colors.bgCard};
  }
`;

const CustomLabel = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;
`;

const CustomInput = styled.input`
  flex: 1;
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 600;
  }
`;

const WizardFooter = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.bg};
  padding: 16px 20px calc(20px + env(safe-area-inset-bottom));
  z-index: 30;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);
`;

const NextStepBtn = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.radius.round};
  font-weight: 800;
  font-size: 14px;
  padding: 14px 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
  transition: background 0.15s ease, color 0.15s ease;

  &.enabled {
    background: ${({ theme }) => theme.colors.black};
    color: ${({ theme }) => theme.colors.white};
    cursor: pointer;
    
    &:active {
      transform: scale(0.98);
    }
  }
`;

const LinkCreationOptionCard = styled.div`
  margin: 18px 20px 0;
  padding: 16px;
  background: #FFFBF3;
  border: 1.5px solid #F3E4CE;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(38, 38, 44, 0.02);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const CheckboxInput = styled.input`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  accent-color: ${({ theme }) => theme.colors.yellow};
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
`;

const LinkOptionTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LinkOptionTitle = styled.span`
  font-size: 14px;
  font-weight: 850;
  color: ${({ theme }) => theme.colors.text};
`;

const LinkOptionDesc = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textSub};
  line-height: 1.45;
  font-weight: 600;
`;

