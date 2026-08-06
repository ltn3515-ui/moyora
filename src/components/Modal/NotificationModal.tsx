import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast';
import { useAppContext } from '../../context/AppContext';
import type { NotificationItem } from '../../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { notifications, unreadNotifCount: unreadCount, markAllNotificationsAsRead, markNotificationAsRead } = useAppContext();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // 알림 모달을 열어 알림을 확인하면 자동으로 모든 알림을 읽음 처리하여 빨간 벨 뱃지가 제거되도록 함
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllNotificationsAsRead();
    }
  }, [isOpen, unreadCount, markAllNotificationsAsRead]);

  if (!isOpen) return null;

  const filteredList = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    showToast('모든 알림을 읽음 처리했습니다. ✅', 'info', '✅');
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // 1. 해당 알림 읽음 처리
    markNotificationAsRead(item.id);

    // 2. 안내 토스트 표시
    showToast(`'${item.title}' 관련 페이지로 이동합니다! ➔`, 'success', '🔔');

    // 3. 모달 닫기 및 해당 라우터로 이동
    onClose();
    navigate(item.targetUrl);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitleRow>
            <HeaderTitle>🔔 수신 알림 목록</HeaderTitle>
            {unreadCount > 0 && <UnreadCountBadge>{unreadCount}개 안읽음</UnreadCountBadge>}
          </HeaderTitleRow>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 필터 & 전체 읽음 처리 */}
        <FilterBar>
          <TabGroup>
            <TabChip
              type="button"
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              전체 ({notifications.length})
            </TabChip>
            <TabChip
              type="button"
              className={activeTab === 'unread' ? 'active' : ''}
              onClick={() => setActiveTab('unread')}
            >
              읽지 않음 ({unreadCount})
            </TabChip>
          </TabGroup>

          {unreadCount > 0 && (
            <MarkReadBtn type="button" onClick={handleMarkAllRead}>
              모두 읽음 ✅
            </MarkReadBtn>
          )}
        </FilterBar>

        {/* 알림 리스트 */}
        <NotificationList>
          {filteredList.length === 0 ? (
            <EmptyBox>알림 내역이 없습니다.</EmptyBox>
          ) : (
            filteredList.map((n) => (
              <NotificationCardItem
                key={n.id}
                className={!n.isRead ? 'unread' : ''}
                onClick={() => handleNotificationClick(n)}
              >
                <TypeBadge style={{ background: n.badgeColor }}>
                  {n.icon}
                </TypeBadge>

                <CardBody>
                  <CardHeaderRow>
                    <ItemTitle>{n.title}</ItemTitle>
                    <TimeAgoText>{n.timeAgo}</TimeAgoText>
                  </CardHeaderRow>

                  <MessageText>{n.message}</MessageText>
                  <ActionGuide>클릭하여 해당 페이지로 이동 ➔</ActionGuide>
                </CardBody>

                {!n.isRead && <RedDot />}
              </NotificationCardItem>
            ))
          )}
        </NotificationList>
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
  padding: 20px;
  animation: ${fadeIn} 0.25s ease-out forwards;
`;

const ModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 88vh;
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

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  color: #111827;
`;

const UnreadCountBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  background: #ef4444;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 10px;
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

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const TabChip = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;

  &.active {
    background: #fedd13;
    border-color: #f5cf00;
    color: #111827;
  }
`;

const MarkReadBtn = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: #3b82f6;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 30px 10px;
  font-size: 13px;
  color: #94a3b8;
`;

const NotificationCardItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;

  &.unread {
    background: #ffffff;
    border-color: #fedd13;
    box-shadow: 0 4px 12px rgba(254, 221, 19, 0.15);
  }

  &:hover {
    transform: translateY(-2px);
    border-color: #f5cf00;
  }
`;

const TypeBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
  overflow: hidden;
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemTitle = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

const TimeAgoText = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
`;

const ActionGuide = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #3b82f6;
  margin-top: 2px;
`;

const RedDot = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
`;
