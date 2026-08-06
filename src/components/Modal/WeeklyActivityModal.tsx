import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

interface WeeklyActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActivityTask {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  category: string;
  icon: string;
}

export const WeeklyActivityModal: React.FC<WeeklyActivityModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAppContext();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<ActivityTask[]>([
    { id: 't1', title: '주간 정기 모임 2회 참석', points: 30, completed: true, category: '모임 활동', icon: '👥' },
    { id: 't2', title: '친구와 1:1 메시지 5회 주고받기', points: 25, completed: true, category: '소통', icon: '💬' },
    { id: 't3', title: '모임 정산 완료 3건 달성', points: 20, completed: true, category: '정산', icon: '💸' },
    { id: 't4', title: '오늘의 1만 보 걸음 채우기', points: 15, completed: true, category: '건강', icon: '👟' },
    { id: 't5', title: '새로운 문화/예술 모임 탐색 및 참여', points: 10, completed: false, category: '탐색', icon: '✨' }
  ]);

  if (!isOpen) return null;

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        showToast(
          nextState
            ? `'${t.title}' 완료! 주간 활동 달성률이 올랐습니다 🎉`
            : `'${t.title}' 완료 취소되었습니다.`,
          nextState ? 'success' : 'info',
          nextState ? '🎉' : 'ℹ️'
        );
        return { ...t, completed: nextState };
      }
      return t;
    });

    setTasks(updated);
    const newTotal = updated.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0);

    const message =
      newTotal >= 100
        ? '🏆 완벽해요! 주간 활동 목표 100%를 달성했습니다!'
        : newTotal >= 80
        ? '🔥 목표 달성까지 한 걸음 남았어요!'
        : '💪 주간 모임 활동을 꾸준히 이어가보세요!';

    updateProfile({
      weeklyActivityPercent: Math.min(newTotal, 100),
      weeklyActivityMessage: message
    });
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitle>⚡ 주간 활동 및 달성 진행률</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 대형 진행률 카드 */}
        <GaugeOverviewCard style={{ background: profile.weeklyActivityPercent >= 100 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #fedd13 0%, #f59e0b 100%)' }}>
          <GaugeHeader>
            <GaugeTitle style={{ color: profile.weeklyActivityPercent >= 100 ? '#ffffff' : '#1f2937' }}>
              이번 주 활동 달성률
            </GaugeTitle>
            <PercentBadge style={{ background: profile.weeklyActivityPercent >= 100 ? '#ffffff' : '#1f2937', color: profile.weeklyActivityPercent >= 100 ? '#059669' : '#fedd13' }}>
              {profile.weeklyActivityPercent}%
            </PercentBadge>
          </GaugeHeader>

          <TrackWrap>
            <TrackFill style={{ width: `${profile.weeklyActivityPercent}%`, background: profile.weeklyActivityPercent >= 100 ? '#ffffff' : '#111827' }} />
          </TrackWrap>

          <GaugeCaption style={{ color: profile.weeklyActivityPercent >= 100 ? '#ecfdf5' : '#78350f' }}>
            {profile.weeklyActivityMessage}
          </GaugeCaption>
        </GaugeOverviewCard>

        <SectionLabel>주간 활동 미션 리스트 ({tasks.filter(t => t.completed).length}/{tasks.length})</SectionLabel>

        {/* 미션 체크 리스트 */}
        <TaskList>
          {tasks.map((task) => (
            <TaskCard key={task.id} className={task.completed ? 'completed' : ''} onClick={() => toggleTask(task.id)}>
              <TaskCheckCircle className={task.completed ? 'checked' : ''}>
                {task.completed ? '✓' : ''}
              </TaskCheckCircle>

              <TaskInfo>
                <TaskCategoryTag>{task.icon} {task.category}</TaskCategoryTag>
                <TaskTitle className={task.completed ? 'done' : ''}>{task.title}</TaskTitle>
              </TaskInfo>

              <PointsBadge className={task.completed ? 'active' : ''}>
                +{task.points}%
              </PointsBadge>
            </TaskCard>
          ))}
        </TaskList>

        <CloseFullBtn type="button" onClick={onClose}>
          확인 완료
        </CloseFullBtn>
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

const GaugeOverviewCard = styled.div`
  border-radius: 22px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
`;

const GaugeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GaugeTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
`;

const PercentBadge = styled.span`
  font-size: 14px;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const TrackWrap = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  overflow: hidden;
`;

const TrackFill = styled.div`
  height: 100%;
  border-radius: 10px;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const GaugeCaption = styled.p`
  margin: 0;
  font-size: 12.5px;
  font-weight: 700;
`;

const SectionLabel = styled.h4`
  margin: 4px 0 -4px;
  font-size: 14px;
  font-weight: 800;
  color: #334155;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TaskCard = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }

  &.completed {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }
`;

const TaskCheckCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  color: transparent;
  flex-shrink: 0;

  &.checked {
    background: #10b981;
    border-color: #10b981;
    color: #ffffff;
  }
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const TaskCategoryTag = styled.span`
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
`;

const TaskTitle = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;

  &.done {
    text-decoration: line-through;
    color: #94a3b8;
  }
`;

const PointsBadge = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #94a3b8;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 12px;

  &.active {
    color: #059669;
    background: #dcfce7;
    border-color: #86efac;
  }
`;

const CloseFullBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.25);
  margin-top: 4px;
`;
