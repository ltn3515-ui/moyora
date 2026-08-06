import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { Settlement } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

import galleryThumb from '../../assets/gallery_thumb.png';
import workshopThumb from '../../assets/workshop_thumb.png';

const THUMB_MAP: Record<string, string> = {
  'gallery_thumb.png': galleryThumb || '/gallery_thumb.png',
  'workshop_thumb.png': workshopThumb || '/workshop_thumb.png'
};

interface SettlementDetailModalProps {
  isOpen: boolean;
  settlement: Settlement | null;
  onClose: () => void;
  onToggleStatus?: (id: string) => void;
}

export const SettlementDetailModal: React.FC<SettlementDetailModalProps> = ({
  isOpen,
  settlement,
  onClose,
  onToggleStatus
}) => {
  const { payoutAccount } = useAppContext();
  const { showToast } = useToast();

  if (!isOpen || !settlement) return null;

  const isDone = settlement.status === 'done';
  const amountStr = settlement.amount.toLocaleString();

  // 예시 분담 멤버 3명
  const perPersonAmount = Math.round(settlement.amount / 3);
  const memberList = [
    { name: '이태노 (나)', paid: true, amount: perPersonAmount },
    { name: '민수', paid: isDone, amount: perPersonAmount },
    { name: '지은', paid: isDone, amount: perPersonAmount }
  ];

  const handleShareMessage = () => {
    showToast(`'${settlement.title}' 정산 요청 메시지가 복사되었습니다! 📲`, 'success', '📋');
  };

  const handleToggle = () => {
    if (onToggleStatus) {
      onToggleStatus(settlement.id);
    } else {
      showToast('정산 상태가 변경되었습니다.', 'info', '🔄');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>정산 내역 상세</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 상단 메인 금액 히어로 카드 */}
        <HeroCard>
          <ThumbWrap>
            {settlement.thumbnail ? (
              <ThumbImg src={THUMB_MAP[settlement.thumbnail]} alt={settlement.title} />
            ) : (
              <EmojiWrap>{settlement.emoji || '💰'}</EmojiWrap>
            )}
          </ThumbWrap>

          <HeroMeta>
            <CategoryBadge>{settlement.category}</CategoryBadge>
            <ItemTitle>{settlement.title}</ItemTitle>
            <ItemDate>{settlement.date} 생성</ItemDate>
          </HeroMeta>

          <AmountRow>
            <AmountLabel>총 정산 금액</AmountLabel>
            <AmountValue>₩{amountStr}</AmountValue>
          </AmountRow>

          <StatusBadge className={settlement.status}>
            {isDone ? '✅ 정산 완료' : '⏳ 정산 대기중'}
          </StatusBadge>
        </HeroCard>

        {/* 세부 1/N 정산 참여자 상태 */}
        <DetailSection>
          <SectionTitle>정산 참여 멤버 (1/N)</SectionTitle>
          <MemberList>
            {memberList.map((m, idx) => (
              <MemberRow key={idx}>
                <MemberInfo>
                  <MemberAvatar>{m.name.charAt(0)}</MemberAvatar>
                  <MemberName>{m.name}</MemberName>
                </MemberInfo>
                <MemberSide>
                  <MemberAmount>₩{m.amount.toLocaleString()}</MemberAmount>
                  <PaidBadge className={m.paid ? 'paid' : 'pending'}>
                    {m.paid ? '입금완료' : '미입금'}
                  </PaidBadge>
                </MemberSide>
              </MemberRow>
            ))}
          </MemberList>
        </DetailSection>

        {/* 수령 대표 계좌 정보 */}
        <AccountSection>
          <AccountTitle>정산 수령 대표 계좌</AccountTitle>
          <AccountBox>
            <BankBadge>{payoutAccount.bankName}</BankBadge>
            <AccountNo>{payoutAccount.accountNumberMasked}</AccountNo>
            <AccountHolder>예금주: {payoutAccount.holderName}</AccountHolder>
          </AccountBox>
        </AccountSection>

        {/* 하단 버튼 액션 */}
        <FooterSection>
          <ShareBtn type="button" onClick={handleShareMessage}>
            공유 📲
          </ShareBtn>
          <ToggleStatusBtn type="button" onClick={handleToggle} className={isDone ? 'done' : 'pending'}>
            {isDone ? '대기중으로 변경' : '정산 완료 처리 ✅'}
          </ToggleStatusBtn>
        </FooterSection>
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
  background: rgba(0, 0, 0, 0.55);
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
  max-width: 440px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 90vh;
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

const HeroCard = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  position: relative;
`;

const ThumbWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmojiWrap = styled.div`
  font-size: 30px;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const CategoryBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #e2e8f0;
  padding: 3px 8px;
  border-radius: 8px;
`;

const ItemTitle = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const ItemDate = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

const AmountRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
`;

const AmountLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
`;

const AmountValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
`;

const StatusBadge = styled.div`
  font-size: 12px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 20px;
  margin-top: 4px;

  &.done {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
  }

  &.pending {
    background: #fff7ed;
    color: #c2410c;
    border: 1px solid #ffedd5;
  }
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #334155;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MemberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MemberAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fedd13;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MemberName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
`;

const MemberSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MemberAmount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
`;

const PaidBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;

  &.paid {
    background: #dcfce7;
    color: #166534;
  }

  &.pending {
    background: #fef2f2;
    color: #991b1b;
  }
`;

const AccountSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f1f5f9;
  padding: 12px;
  border-radius: 14px;
`;

const AccountTitle = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #475569;
`;

const AccountBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BankBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  background: #fedd13;
  color: #111827;
  padding: 3px 8px;
  border-radius: 6px;
`;

const AccountNo = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
`;

const AccountHolder = styled.span`
  font-size: 12px;
  color: #64748b;
  margin-left: auto;
`;

const FooterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const ShareBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const ToggleStatusBtn = styled.button`
  flex: 2;
  padding: 12px;
  border-radius: 14px;
  border: none;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;

  &.pending {
    background: #10b981;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

    &:hover {
      background: #059669;
    }
  }

  &.done {
    background: #f3f4f6;
    color: #4b5563;

    &:hover {
      background: #e5e7eb;
    }
  }
`;
