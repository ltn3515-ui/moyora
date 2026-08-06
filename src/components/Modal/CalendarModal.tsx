import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 자동 연동된 모임 기본 일정
interface AutoSchedule {
  dateStr: string; // 'YYYY-MM-DD'
  title: string;
  color: string;
  icon: string;
}

const DEFAULT_GROUP_SCHEDULES: AutoSchedule[] = [
  { dateStr: '2026-08-15', title: '오페라 갈라 콘서트', color: '#fedd13', icon: '🎭' },
  { dateStr: '2026-08-18', title: '에코 소분 행사', color: '#8fc7e8', icon: '📦' },
  { dateStr: '2026-08-22', title: '자작나무 숲 페스티벌', color: '#f491bc', icon: '🌲' },
  { dateStr: '2026-08-16', title: '보드게임 모임', color: '#a8e6cf', icon: '🎲' },
  { dateStr: '2026-08-23', title: '남산 야경 출사', color: '#ffd3b6', icon: '📸' }
];

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // 1-based
  const todayDate = today.getDate();

  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(8); // 8월
  const [selectedDay, setSelectedDay] = useState<number>(todayDate);

  // 사용자 지정 날짜별 메모
  const [customEvents, setCustomEvents] = useState<Record<string, string[]>>({
    '2026-08-05': ['이태노 생일 파티 🎉', '팀 정산 완료 ✅'],
    '2026-08-10': ['영화 보기 🎬']
  });

  const [memoText, setMemoText] = useState('');

  if (!isOpen) return null;

  // 해당 월의 1일의 요일과 총 일수 계산
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0(일) ~ 6(토)
  const daysInMonth = new Date(year, month, 0).getDate();

  const formatDateKey = (d: number) => {
    const mStr = String(month).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoText.trim()) return;

    const key = formatDateKey(selectedDay);
    const existing = customEvents[key] || [];
    setCustomEvents({
      ...customEvents,
      [key]: [...existing, memoText.trim()]
    });

    showToast(`${month}월 ${selectedDay}일에 '${memoText.trim()}' 일정이 추가되었습니다! 📝`, 'success', '📝');
    setMemoText('');
  };

  const handleDeleteMemo = (key: string, idx: number) => {
    const existing = customEvents[key] || [];
    const updated = existing.filter((_, i) => i !== idx);
    setCustomEvents({
      ...customEvents,
      [key]: updated
    });
    showToast('일정이 삭제되었습니다.', 'info', '🗑️');
  };

  const selectedDateKey = formatDateKey(selectedDay);
  const currentSelectedCustomEvents = customEvents[selectedDateKey] || [];
  const currentSelectedAutoEvents = DEFAULT_GROUP_SCHEDULES.filter((s) => s.dateStr === selectedDateKey);

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>📅 캘린더 일정 확인</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 연/월 네비게이션 */}
        <MonthNav>
          <NavBtn type="button" onClick={handlePrevMonth}>‹ 이전달</NavBtn>
          <MonthTitle>{year}년 {month}월</MonthTitle>
          <NavBtn type="button" onClick={handleNextMonth}>다음달 ›</NavBtn>
        </MonthNav>

        {/* 캘린더 격자 */}
        <CalendarGridContainer>
          <WeekdayRow>
            <WeekdayCell className="sun">일</WeekdayCell>
            <WeekdayCell>월</WeekdayCell>
            <WeekdayCell>화</WeekdayCell>
            <WeekdayCell>수</WeekdayCell>
            <WeekdayCell>목</WeekdayCell>
            <WeekdayCell>금</WeekdayCell>
            <WeekdayCell className="sat">토</WeekdayCell>
          </WeekdayRow>

          <DaysGrid>
            {/* 이전 달 빈 셀 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <DayCell key={`empty-${i}`} className="empty" />
            ))}

            {/* 이번 달 일자 셀 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateKey = formatDateKey(dayNum);
              const isToday = year === todayYear && month === todayMonth && dayNum === todayDate;
              const isSelected = dayNum === selectedDay;

              // 이 날짜의 모임 자동 일정
              const autoEvents = DEFAULT_GROUP_SCHEDULES.filter((s) => s.dateStr === dateKey);
              // 이 날짜의 사용자 커스텀 일정
              const userMemos = customEvents[dateKey] || [];

              return (
                <DayCell
                  key={dayNum}
                  className={`
                    ${isToday ? 'today' : ''}
                    ${isSelected ? 'selected' : ''}
                  `}
                  onClick={() => setSelectedDay(dayNum)}
                >
                  <DayHeaderRow>
                    <DayNumber className={isToday ? 'today-badge' : ''}>
                      {dayNum}
                    </DayNumber>
                    {isToday && <TodayTag>오늘</TodayTag>}
                  </DayHeaderRow>

                  {/* 자동 등록 모임 일정 칩 */}
                  {autoEvents.map((evt, idx) => (
                    <EventChip key={`auto-${idx}`} style={{ background: evt.color }}>
                      {evt.icon} {evt.title}
                    </EventChip>
                  ))}

                  {/* 사용자 등록 커스텀 일정 칩 */}
                  {userMemos.map((memo, idx) => (
                    <UserChip key={`user-${idx}`}>
                      📝 {memo}
                    </UserChip>
                  ))}
                </DayCell>
              );
            })}
          </DaysGrid>
        </CalendarGridContainer>

        {/* 선택한 날짜 세부 메모 작성 폼 */}
        <SelectedDayDetailBox>
          <DetailTitle>
            📌 {month}월 {selectedDay}일 일정 및 메모
          </DetailTitle>

          {/* 일정 목록 */}
          <EventListSection>
            {currentSelectedAutoEvents.map((evt, idx) => (
              <DetailEventRow key={`detail-auto-${idx}`} style={{ borderColor: evt.color }}>
                <span>{evt.icon} <strong>[모임자동일정]</strong> {evt.title}</span>
              </DetailEventRow>
            ))}

            {currentSelectedCustomEvents.map((memo, idx) => (
              <DetailEventRow key={`detail-user-${idx}`} className="user">
                <span>📝 {memo}</span>
                <DelBtn type="button" onClick={() => handleDeleteMemo(selectedDateKey, idx)}>✕</DelBtn>
              </DetailEventRow>
            ))}

            {currentSelectedAutoEvents.length === 0 && currentSelectedCustomEvents.length === 0 && (
              <EmptyText>등록된 일정이 없습니다. 원하는 텍스트를 입력해 추가하세요!</EmptyText>
            )}
          </EventListSection>

          {/* 메모/텍스트 추가 폼 */}
          <AddMemoForm onSubmit={handleAddMemo}>
            <MemoInput
              type="text"
              placeholder={`${month}월 ${selectedDay}일에 추가할 일정/메모 입력...`}
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
            />
            <AddMemoBtn type="submit">추가 ✍️</AddMemoBtn>
          </AddMemoForm>
        </SelectedDayDetailBox>
      </ModalCard>
    </Overlay>
  );
};

// Keyframe Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px) scale(0.96); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.25s ease-out forwards;
`;

const ModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 92vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  color: #111827;
`;

const CloseBtn = styled.button`
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
    color: #111;
  }
`;

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 14px;
`;

const MonthTitle = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const NavBtn = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 800;
  color: #3b82f6;
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const CalendarGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  text-align: center;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;
`;

const WeekdayCell = styled.div`
  &.sun { color: #ef4444; }
  &.sat { color: #3b82f6; }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  margin-top: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const DayCell = styled.div`
  min-height: 54px;
  border: 1.5px solid #f1f5f9;
  border-radius: 10px;
  padding: 3px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;

  &.empty {
    border: none;
    cursor: default;
  }

  &:hover:not(.empty) {
    background: #f8fafc;
    border-color: #fedd13;
  }

  &.selected {
    border: 2px solid #fedd13;
    background: #fefce8;
  }

  &.today {
    background: #fff7ed;
    border: 1.5px solid #ffedd5;
  }
`;

const DayHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
`;

const DayNumber = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #334155;

  &.today-badge {
    background: #ef4444;
    color: #ffffff;
    padding: 1px 4px;
    border-radius: 6px;
  }
`;

const TodayTag = styled.span`
  font-size: 8.5px;
  font-weight: 800;
  color: #c2410c;
  white-space: nowrap;
`;

const EventChip = styled.div`
  font-size: 8.5px;
  font-weight: 800;
  color: #111827;
  padding: 1.5px 3px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  box-sizing: border-box;
`;

const UserChip = styled.div`
  font-size: 8.5px;
  font-weight: 800;
  background: #dbeafe;
  color: #1e40af;
  padding: 1.5px 3px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  box-sizing: border-box;
`;

const SelectedDayDetailBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailTitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const EventListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 100px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DetailEventRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-left: 4px solid #fedd13;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: #1e293b;

  &.user {
    border-left-color: #3b82f6;
  }
`;

const EmptyText = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const DelBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    color: #ef4444;
  }
`;

const AddMemoForm = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const MemoInput = styled.input`
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  outline: none;

  &:focus {
    border-color: #fedd13;
  }
`;

const AddMemoBtn = styled.button`
  background: #fedd13;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 800;
  color: #111827;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #f5cf00;
  }
`;
