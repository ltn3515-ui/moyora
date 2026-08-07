import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';

interface GroupActivityDetail {
  id: string;
  type: 'notice' | 'comment' | 'schedule';
  message: string;
  timestamp: string;
  groupId?: string;
  groupName?: string;
}

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: GroupActivityDetail | null;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  isOpen,
  onClose,
  activity
}) => {
  const { showToast } = useToast();

  // 1. 공지사항 상태 (읽음 확인)
  const [isReadConfirmed, setIsReadConfirmed] = useState(false);
  const [readers, setReaders] = useState([
    { name: '김미영', read: true },
    { name: '이영식', read: true },
    { name: '박철수', read: false },
    { name: '나 (이태노)', read: false }
  ]);

  // 2. 댓글 상태 (대화 스레드)
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([
    { id: '1', author: '김철수', content: '저도 이번 일정 완전 찬성입니다! 🙋‍♂️', time: '10분 전' },
    { id: '2', author: '박영희', content: '시간 맞춰서 갈게요. 장소 안내 감사합니다~', time: '5분 전' }
  ]);

  // 3. 일정 상태 (RSVP 투표)
  const [selectedRsvp, setSelectedRsvp] = useState<string | null>(null);
  const [rsvpCounts, setRsvpCounts] = useState({
    attend: 5,
    absent: 1,
    undecided: 2
  });

  if (!isOpen || !activity) return null;

  const handleReadConfirmToggle = (index: number) => {
    const updated = [...readers];
    const item = updated[index];
    const isMe = item.name.includes('나');
    
    item.read = !item.read;
    setReaders(updated);

    if (isMe) {
      setIsReadConfirmed(item.read);
      if (item.read) {
        showToast('📢 공지사항을 확인 완료 상태로 변경했습니다!', 'success', '📢');
      } else {
        showToast('공지사항 확인을 취소했습니다.', 'info', '📢');
      }
    } else {
      showToast(`${item.name}님의 확인 상태를 변경했습니다.`, 'info', '👤');
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: String(Date.now()),
      author: '나 (이태노)',
      content: replyText.trim(),
      time: '방금 전'
    };

    setReplies((prev) => [...prev, newReply]);
    setReplyText('');
    showToast('💬 댓글 답글이 전송되었습니다!', 'success', '💬');
  };

  const handleRsvpVote = (choice: 'attend' | 'absent' | 'undecided') => {
    if (selectedRsvp === choice) return;

    const newCounts = { ...rsvpCounts };
    // 이전 선택 차감
    if (selectedRsvp) {
      newCounts[selectedRsvp as keyof typeof rsvpCounts] -= 1;
    }
    // 새 선택 증가
    newCounts[choice] += 1;

    setRsvpCounts(newCounts);
    setSelectedRsvp(choice);

    const labels = { attend: '참석 👍', absent: '불참 👎', undecided: '미정 🤷‍♂️' };
    showToast(`일정 참여 여부를 [${labels[choice]}]으로 투표했습니다!`, 'success', '📅');
  };

  // 투표 백분율 계산
  const totalVotes = rsvpCounts.attend + rsvpCounts.absent + rsvpCounts.undecided;
  const percentAttend = totalVotes ? Math.round((rsvpCounts.attend / totalVotes) * 100) : 0;
  const percentAbsent = totalVotes ? Math.round((rsvpCounts.absent / totalVotes) * 100) : 0;
  const percentUndecided = totalVotes ? Math.round((rsvpCounts.undecided / totalVotes) * 100) : 0;

  const getActivityTypeLabel = () => {
    switch (activity.type) {
      case 'notice': return '📢 공지사항';
      case 'comment': return '💬 댓글 소식';
      case 'schedule': return '📅 모임 일정';
      default: return '🔔 최근 활동';
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitleInfo>
            <ActivityBadge className={activity.type}>{getActivityTypeLabel()}</ActivityBadge>
            <GroupName>{activity.groupName || '모여라 모임'}</GroupName>
          </HeaderTitleInfo>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        <ContentBody>
          <ActivityMessageText>
            {activity.message}
          </ActivityMessageText>

          {/* ── 1. 공지사항 상세 뷰 ── */}
          {activity.type === 'notice' && (
            <DetailSection>
              <SectionLabel>📢 공지 세부 사항</SectionLabel>
              <NoticeCard>
                이번 주 모임 진행 시 꼭 숙지해주셔야 할 중요 내용입니다.
                일정이 겹치거나 장소 이동에 변동이 있으신 분은 모임방에 사전 연락 바랍니다.
                모두 투표 및 일정 참석 상태를 최신화해 주세요!
              </NoticeCard>

              <SectionLabel style={{ marginTop: '20px' }}>👥 공지 읽음 확인 ({readers.filter(r => r.read).length}/{readers.length})</SectionLabel>
              <ReaderList>
                {readers.map((reader, index) => (
                  <ReaderRow 
                    key={reader.name} 
                    onClick={() => handleReadConfirmToggle(index)}
                    className={reader.read ? 'read' : ''}
                  >
                    <Checkbox className={reader.read ? 'checked' : ''}>
                      {reader.read && '✓'}
                    </Checkbox>
                    <ReaderName>{reader.name}</ReaderName>
                    <ReadBadge className={reader.read ? 'read' : ''}>
                      {reader.read ? '확인함' : '미확인'}
                    </ReadBadge>
                  </ReaderRow>
                ))}
              </ReaderList>

              <MainActionButton 
                onClick={() => {
                  const meIndex = readers.findIndex(r => r.name.includes('나'));
                  if (meIndex !== -1 && !readers[meIndex].read) {
                    handleReadConfirmToggle(meIndex);
                  } else {
                    showToast('이미 공지를 읽었습니다!', 'info', '📢');
                  }
                }}
                className={isReadConfirmed ? 'confirmed' : ''}
              >
                {isReadConfirmed ? '✓ 공지 확인 완료' : '📢 공지 확인 완료하기'}
              </MainActionButton>
            </DetailSection>
          )}

          {/* ── 2. 댓글 상세 뷰 ── */}
          {activity.type === 'comment' && (
            <DetailSection>
              <SectionLabel>💬 댓글 대화 목록</SectionLabel>
              <CommentThread>
                {replies.map((reply) => (
                  <CommentBubbleCard key={reply.id} className={reply.author.includes('나') ? 'me' : ''}>
                    <CommentMeta>
                      <CommentAuthor>{reply.author}</CommentAuthor>
                      <CommentTime>{reply.time}</CommentTime>
                    </CommentMeta>
                    <CommentText>{reply.content}</CommentText>
                  </CommentBubbleCard>
                ))}
              </CommentThread>

              <ReplyForm onSubmit={handleSendReply}>
                <ReplyInput
                  type="text"
                  placeholder="따뜻한 답글을 남겨주세요..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <ReplySubmitBtn type="submit" disabled={!replyText.trim()}>전송</ReplySubmitBtn>
              </ReplyForm>
            </DetailSection>
          )}

          {/* ── 3. 일정 상세 뷰 ── */}
          {activity.type === 'schedule' && (
            <DetailSection>
              <SectionLabel>📍 일정 안내</SectionLabel>
              <ScheduleCard>
                <ScheduleRow>
                  <ScheduleLabel>📅 일시</ScheduleLabel>
                  <ScheduleVal>8월 12일 (토) 오후 6:00</ScheduleVal>
                </ScheduleRow>
                <ScheduleRow>
                  <ScheduleLabel>📍 장소</ScheduleLabel>
                  <ScheduleVal>성수동 피치스 도원</ScheduleVal>
                </ScheduleRow>
              </ScheduleCard>

              {/* 모의 약도 지도 컴포넌트 */}
              <SectionLabel style={{ marginTop: '16px' }}>🗺️ 빠른 위치 약도</SectionLabel>
              <MockMapContainer>
                <MockGridOverlay />
                <MockPin />
                <MockPulseCircle />
                <MockLocationTooltip>피치스 도원</MockLocationTooltip>
                <MapLogo>MoYoRa MAP</MapLogo>
              </MockMapContainer>

              <SectionLabel style={{ marginTop: '20px' }}>🗳️ 참석 여부 투표</SectionLabel>
              <RsvpButtonGroup>
                <RsvpBtn 
                  onClick={() => handleRsvpVote('attend')} 
                  className={selectedRsvp === 'attend' ? 'selected attend' : ''}
                >
                  <RsvpEmoji>👍</RsvpEmoji> 참석 ({rsvpCounts.attend})
                </RsvpBtn>
                <RsvpBtn 
                  onClick={() => handleRsvpVote('absent')} 
                  className={selectedRsvp === 'absent' ? 'selected absent' : ''}
                >
                  <RsvpEmoji>👎</RsvpEmoji> 불참 ({rsvpCounts.absent})
                </RsvpBtn>
                <RsvpBtn 
                  onClick={() => handleRsvpVote('undecided')} 
                  className={selectedRsvp === 'undecided' ? 'selected undecided' : ''}
                >
                  <RsvpEmoji>🤷‍♂️</RsvpEmoji> 미정 ({rsvpCounts.undecided})
                </RsvpBtn>
              </RsvpButtonGroup>

              <VoteProgressContainer>
                <ProgressBarRow>
                  <ProgressLabel>참석 ({percentAttend}%)</ProgressLabel>
                  <ProgressTrack>
                    <ProgressFill style={{ width: `${percentAttend}%`, background: '#8FCB9B' }} />
                  </ProgressTrack>
                </ProgressBarRow>
                <ProgressBarRow>
                  <ProgressLabel>불참 ({percentAbsent}%)</ProgressLabel>
                  <ProgressTrack>
                    <ProgressFill style={{ width: `${percentAbsent}%`, background: '#F491BC' }} />
                  </ProgressTrack>
                </ProgressBarRow>
                <ProgressBarRow>
                  <ProgressLabel>미정 ({percentUndecided}%)</ProgressLabel>
                  <ProgressTrack>
                    <ProgressFill style={{ width: `${percentUndecided}%`, background: '#B7B0A3' }} />
                  </ProgressTrack>
                </ProgressBarRow>
              </VoteProgressContainer>
            </DetailSection>
          )}
        </ContentBody>
      </ModalCard>
    </Overlay>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; backdrop-filter: blur(0px); }
  to { opacity: 1; backdrop-filter: blur(4px); }
`;

const scaleUp = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const pulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(38, 38, 44, 0.55);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.22s ease-out forwards;
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.bg || '#FFFBF3'};
  width: 100%;
  max-width: 420px;
  max-height: 88vh;
  border-radius: 28px;
  box-shadow: 0 20px 45px rgba(38, 38, 44, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${scaleUp} 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  border: 1px solid rgba(240, 234, 224, 0.8);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #ffffff;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
`;

const HeaderTitleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActivityBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  color: #26262C;

  &.notice { background: #FFF1A8; }
  &.comment { background: #FBD3E3; }
  &.schedule { background: #CDE7F5; }
`;

const GroupName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub || '#8A8A93'};
`;

const CloseBtn = styled.button`
  background: ${({ theme }) => theme.colors.grayLight || '#E9E6DE'};
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray || '#B7B0A3'};
    transform: rotate(90deg);
  }
`;

const ContentBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ActivityMessageText = styled.h2`
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
  line-height: 1.45;
  margin: 0;
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(38, 38, 44, 0.03);
  border: 1px solid rgba(240, 234, 224, 0.5);
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionLabel = styled.div`
  font-size: 12.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSub || '#8A8A93'};
  margin-bottom: 8px;
`;

const NoticeCard = styled.div`
  background: #ffffff;
  border-left: 4px solid ${({ theme }) => theme.colors.yellow || '#FEDD13'};
  padding: 12px 14px;
  border-radius: 4px 14px 14px 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
  line-height: 1.5;
  font-weight: 500;
`;

const ReaderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #ffffff;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
`;

const ReaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bg || '#FFFBF3'};
  }
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid ${({ theme }) => theme.colors.textLight || '#B4B4BC'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  transition: all 0.15s ease;

  &.checked {
    background: ${({ theme }) => theme.colors.yellow || '#FEDD13'};
    border-color: ${({ theme }) => theme.colors.yellow || '#FEDD13'};
    color: #7A5C29;
  }
`;

const ReaderName = styled.span`
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
`;

const ReadBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textLight || '#B4B4BC'};
  padding: 2px 6px;
  border-radius: 6px;

  &.read {
    background: ${({ theme }) => theme.colors.greenLight || '#D8F0DD'};
    color: #2F693A;
  }
`;

const MainActionButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 16px;
  background: ${({ theme }) => theme.colors.yellow || '#FEDD13'};
  color: #7A5C29;
  font-size: 14px;
  font-weight: 800;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(254, 221, 19, 0.35);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(254, 221, 19, 0.45);
  }

  &.confirmed {
    background: ${({ theme }) => theme.colors.green || '#8FCB9B'};
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(143, 203, 155, 0.3);
    &:hover {
      box-shadow: 0 6px 16px rgba(143, 203, 155, 0.4);
    }
  }
`;

const CommentThread = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
`;

const CommentBubbleCard = styled.div`
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 18px 18px 18px 4px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(38, 38, 44, 0.02);

  &.me {
    background: #FFFCEB;
    border-color: ${({ theme }) => theme.colors.yellowLight || '#FFF1A8'};
    border-radius: 18px 18px 4px 18px;
    align-self: flex-end;
    width: 90%;
  }
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommentAuthor = styled.span`
  font-size: 11.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
`;

const CommentTime = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textLight || '#B4B4BC'};
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
  font-weight: 500;
`;

const ReplyForm = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 14px;
  background: #ffffff;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
  box-shadow: 0 4px 12px rgba(38, 38, 44, 0.03);
`;

const ReplyInput = styled.input`
  flex: 1;
  border: none;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
  font-weight: 600;
`;

const ReplySubmitBtn = styled.button`
  background: ${({ theme }) => theme.colors.yellow || '#FEDD13'};
  color: #7A5C29;
  border: none;
  padding: 8px 16px;
  border-radius: 14px;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #fada0a;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.grayLight || '#E9E6DE'};
    color: ${({ theme }) => theme.colors.textLight || '#B4B4BC'};
    cursor: not-allowed;
  }
`;

const ScheduleCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(38, 38, 44, 0.03);
`;

const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ScheduleLabel = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSub || '#8A8A93'};
  background: ${({ theme }) => theme.colors.bg || '#FFFBF3'};
  padding: 4px 8px;
  border-radius: 8px;
`;

const ScheduleVal = styled.strong`
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
`;

const MockMapContainer = styled.div`
  position: relative;
  height: 120px;
  background: #E5E9F0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
`;

const MockGridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px);
  background-size: 20px 20px;
`;

const MockPin = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  background: #FF5A5F;
  border: 2px solid #ffffff;
  border-radius: 50% 50% 50% 0;
  transform: translate(-50%, -100%) rotate(-45deg);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  z-index: 2;
`;

const MockPulseCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 90, 95, 0.35);
  z-index: 1;
  animation: ${pulse} 1.8s infinite ease-out;
`;

const MockLocationTooltip = styled.div`
  position: absolute;
  top: calc(50% - 34px);
  left: 50%;
  transform: translateX(-50%);
  background: #26262C;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
  white-space: nowrap;
  z-index: 3;
`;

const MapLogo = styled.div`
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 9px;
  font-weight: 900;
  color: rgba(38, 38, 44, 0.35);
`;

const RsvpButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const RsvpBtn = styled.button`
  flex: 1;
  padding: 10px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
  border: 1.5px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.textSub || '#8A8A93'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    background: ${({ theme }) => theme.colors.bg || '#FFFBF3'};
    color: ${({ theme }) => theme.colors.text || '#26262C'};
  }

  &.selected {
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(38, 38, 44, 0.08);
    transform: translateY(-1px);
    
    &.attend { background: #8FCB9B; }
    &.absent { background: #F491BC; }
    &.undecided { background: #B7B0A3; }
  }
`;

const RsvpEmoji = styled.span`
  font-size: 14px;
`;

const VoteProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  background: #ffffff;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
`;

const ProgressBarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProgressLabel = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: #F1EFF5;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
`;
