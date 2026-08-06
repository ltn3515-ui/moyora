import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

interface HealthStepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthStepModal: React.FC<HealthStepModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAppContext();
  const { showToast } = useToast();

  const currentSteps = profile.health?.steps || 1200;
  const [customStepInput, setCustomStepInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const targetSteps = 10000;
  const stepPercent = Math.min(Math.round((currentSteps / targetSteps) * 100), 100);

  // 폰과 실시간 걸음 수 센서 동기화 시뮬레이션
  const handleSyncWithPhone = () => {
    setIsSyncing(true);
    showToast('스마트폰 걸음 수 센서와 실시간 연결을 진행합니다... 📱', 'info', '📱');

    setTimeout(() => {
      // 폰 실시간 걸음 수 센서 반응 시뮬레이션 (+1500~4500 랜덤 추가)
      const syncedAddition = Math.floor(Math.random() * 3000) + 1500;
      const nextSteps = currentSteps + syncedAddition;
      updateProfile({
        health: { steps: nextSteps }
      });
      setIsSyncing(false);
      showToast(`스마트폰 센서 동기화 완료! +${syncedAddition.toLocaleString()} 걸음이 반영되었습니다! 👟`, 'success', '👟');
    }, 1200);
  };

  // 빠른 걸음 수 추가
  const handleAddSteps = (amount: number) => {
    const nextSteps = currentSteps + amount;
    updateProfile({
      health: { steps: nextSteps }
    });
    showToast(`+${amount.toLocaleString()} 걸음이 추가되었습니다! 👟`, 'success', '👟');
  };

  // 수동 입력 저장
  const handleSaveCustomSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customStepInput.replace(/,/g, ''), 10);
    if (isNaN(val) || val < 0) {
      showToast('올바른 걸음 수를 입력해주세요.', 'error', '⚠️');
      return;
    }
    updateProfile({
      health: { steps: val }
    });
    showToast(`오늘의 걸음 수가 ${val.toLocaleString()} 걸음으로 변경되었습니다! ✨`, 'success', '✨');
    setCustomStepInput('');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitle>👟 스마트폰 걸음 수 연동</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 메인 걸음 수 가우지 카드 */}
        <StepHeroCard>
          <SensorBadge>
            <LiveDot />
            <span>스마트폰 만보기 센서 연동 활성화</span>
          </SensorBadge>

          <StepCountBig>
            {currentSteps.toLocaleString()} <StepUnit>걸음</StepUnit>
          </StepCountBig>

          <TargetRow>
            <span>목표 달성률 ({stepPercent}%)</span>
            <strong>{currentSteps.toLocaleString()} / {targetSteps.toLocaleString()} 걸음</strong>
          </TargetRow>

          <ProgressTrack>
            <ProgressFill style={{ width: `${stepPercent}%` }} />
          </ProgressTrack>
        </StepHeroCard>

        {/* 폰 실시간 동기화 버튼 */}
        <SyncButton type="button" onClick={handleSyncWithPhone} disabled={isSyncing}>
          {isSyncing ? '📱 폰 센서와 동기화 중...' : '📱 스마트폰과 즉시 동기화하기'}
        </SyncButton>

        {/* 빠른 추가 버튼 그룹 */}
        <QuickAddGroup>
          <QuickBtn type="button" onClick={() => handleAddSteps(500)}>+ 500보</QuickBtn>
          <QuickBtn type="button" onClick={() => handleAddSteps(1000)}>+ 1,000보</QuickBtn>
          <QuickBtn type="button" onClick={() => handleAddSteps(3000)}>+ 3,000보</QuickBtn>
        </QuickAddGroup>

        {/* 걸음 수 직접 입력 폼 */}
        <FormBox onSubmit={handleSaveCustomSteps}>
          <FormLabel>걸음 수 직접 수정</FormLabel>
          <InputRow>
            <StepInput
              type="number"
              placeholder="예: 8500"
              value={customStepInput}
              onChange={(e) => setCustomStepInput(e.target.value)}
            />
            <SaveBtn type="submit">저장</SaveBtn>
          </InputRow>
        </FormBox>
      </ModalCard>
    </Overlay>
  );
};

// Keyframe Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
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
  max-width: 410px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 28px;
  padding: 24px 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
`;

const CloseBtn = styled.button`
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const StepHeroCard = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 22px;
  padding: 20px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
`;

const SensorBadge = styled.div`
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
`;

const LiveDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const StepCountBig = styled.h1`
  margin: 4px 0 0;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

const StepUnit = styled.span`
  font-size: 16px;
  font-weight: 700;
  opacity: 0.9;
`;

const TargetRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.95;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  transition: width 0.4s ease;
`;

const SyncButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #fedd13;
  color: #111827;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.4);
  transition: transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #fada0a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuickAddGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const QuickBtn = styled.button`
  flex: 1;
  padding: 11px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 800;
  color: #334155;
  cursor: pointer;

  &:hover {
    background: #ffffff;
    border-color: #10b981;
    color: #059669;
  }
`;

const FormBox = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f9fafb;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #4b5563;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const StepInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1.5px solid #d1d5db;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #10b981;
  }
`;

const SaveBtn = styled.button`
  padding: 10px 18px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
`;
