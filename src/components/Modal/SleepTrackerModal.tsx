import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

interface SleepTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTrackerModal: React.FC<SleepTrackerModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAppContext();
  const { showToast } = useToast();

  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:12');

  if (!isOpen) return null;

  // 취침 시간 및 기상 시간으로 수면 시간 안전하게 즉시 계산
  const calculateSleepDuration = (bed: string, wake: string): number => {
    if (!bed || !wake || !bed.includes(':') || !wake.includes(':')) {
      return profile.sleep?.hours || 8.2;
    }
    const [bedH, bedM] = bed.split(':').map(Number);
    const [wakeH, wakeM] = wake.split(':').map(Number);

    if (isNaN(bedH) || isNaN(bedM) || isNaN(wakeH) || isNaN(wakeM)) {
      return profile.sleep?.hours || 8.2;
    }

    let bedMin = bedH * 60 + bedM;
    let wakeMin = wakeH * 60 + wakeM;

    if (wakeMin <= bedMin) {
      wakeMin += 24 * 60; // 자정을 지난 경우
    }

    const diffMin = wakeMin - bedMin;
    const hours = diffMin / 60;
    return parseFloat(hours.toFixed(1));
  };

  const calculatedHours = calculateSleepDuration(bedtime, wakeTime);
  const minutesRemainder = Math.round((calculatedHours % 1) * 60);

  // 빠른 프리셋 선택
  const handleApplyPreset = (bed: string, wake: string) => {
    setBedtime(bed);
    setWakeTime(wake);
  };

  // 수면 시간 저장
  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      sleep: { hours: calculatedHours }
    });
    showToast(`수면 시간이 ${calculatedHours}시간(${bedtime} ~ ${wakeTime})으로 기록되었습니다! 🌙`, 'success', '🌙');
    onClose();
  };

  const getSleepQualityText = (hours: number) => {
    if (hours >= 7.5) return '😴 깊은 숙면 상태 (매우 양호)';
    if (hours >= 6) return '🙂 적정 수면 달성 (양호)';
    return '🥱 수면 부족 (충분한 휴식이 필요해요)';
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitle>🌙 수면 시간 기록 및 입력</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 수면 메인 히어로 카드 */}
        <SleepHeroCard>
          <HeroSubLabel>오늘의 총 수면 시간</HeroSubLabel>
          <SleepHoursBig>
            {calculatedHours} <HourUnit>시간</HourUnit>
          </SleepHoursBig>

          <QualityBadge>
            {getSleepQualityText(calculatedHours)}
          </QualityBadge>
        </SleepHeroCard>

        {/* 취향 수면시간 빠른 선택 */}
        <SectionLabel>추천 수면 패턴 선택</SectionLabel>
        <PresetGroup>
          <PresetBtn type="button" onClick={() => handleApplyPreset('23:00', '07:00')}>
            8.0시간 (23:00 ~ 07:00)
          </PresetBtn>
          <PresetBtn type="button" onClick={() => handleApplyPreset('23:30', '07:30')}>
            8.0시간 (23:30 ~ 07:30)
          </PresetBtn>
          <PresetBtn type="button" onClick={() => handleApplyPreset('22:30', '07:00')}>
            8.5시간 (22:30 ~ 07:00)
          </PresetBtn>
        </PresetGroup>

        {/* 시간 직접 입력 폼 */}
        <FormBox onSubmit={handleSaveSleep}>
          <FormLabelRow>
            <FormLabelTitle>수면/기상 시간 직접 입력</FormLabelTitle>
          </FormLabelRow>

          <TimeInputGrid>
            <TimeGroup>
              <TimeLabel>🛌 잠자리에 든 시간 (취침)</TimeLabel>
              <StyledTimeInput
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                required
              />
            </TimeGroup>

            <TimeGroup>
              <TimeLabel>⏰ 일어나서 깬 시간 (기상)</TimeLabel>
              <StyledTimeInput
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                required
              />
            </TimeGroup>
          </TimeInputGrid>

          <CalcResultBox>
            <span>계산된 총 수면 시간:</span>
            <strong>{calculatedHours}시간 ({Math.floor(calculatedHours)}시간 {minutesRemainder}분)</strong>
          </CalcResultBox>

          <SaveSubmitBtn type="submit">
            수면 시간 저장하기 🌙
          </SaveSubmitBtn>
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

const SleepHeroCard = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border-radius: 22px;
  padding: 20px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.35);
`;

const HeroSubLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  opacity: 0.9;
`;

const SleepHoursBig = styled.h1`
  margin: 0;
  font-size: 38px;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

const HourUnit = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const QualityBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
`;

const SectionLabel = styled.h4`
  margin: 4px 0 -4px;
  font-size: 14px;
  font-weight: 800;
  color: #334155;
`;

const PresetGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PresetBtn = styled.button`
  width: 100%;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: #ffffff;
    border-color: #6366f1;
    color: #4f46e5;
  }
`;

const FormBox = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9fafb;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid #f3f4f6;
`;

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormLabelTitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
`;

const TimeInputGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TimeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeLabel = styled.label`
  font-size: 11.5px;
  font-weight: 700;
  color: #4b5563;
`;

const StyledTimeInput = styled.input`
  width: 100%;
  padding: 11px 12px;
  border-radius: 12px;
  border: 1.5px solid #d1d5db;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    border-color: #6366f1;
  }
`;

const CalcResultBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #1e40af;

  strong {
    font-size: 13px;
    color: #1e3a8a;
  }
`;

const SaveSubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.25);
  margin-top: 4px;
`;
