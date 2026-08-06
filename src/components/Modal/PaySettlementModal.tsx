import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import type { Settlement } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

interface PaySettlementModalProps {
  isOpen: boolean;
  settlement: Settlement | null;
  onClose: () => void;
  onSuccessPay?: (settlementId: string, payMethodName: string) => void;
}

type PayMethodType = 'kakaopay' | 'tosspay' | 'bank_transfer' | 'card';

interface PayMethodOption {
  id: PayMethodType;
  name: string;
  icon: string;
  color: string;
  badgeText: string;
}

const PAY_METHODS: PayMethodOption[] = [
  { id: 'kakaopay', name: '카카오페이', icon: '🟡', color: '#FEE500', badgeText: '간편 결제' },
  { id: 'tosspay', name: '토스페이', icon: '🔵', color: '#0064FF', badgeText: '원클릭 송금' },
  { id: 'bank_transfer', name: '직접 계좌 송금', icon: '🏦', color: '#334155', badgeText: '계좌 복사' },
  { id: 'card', name: '신용 / 체크카드', icon: '💳', color: '#10B981', badgeText: '일반 결제' }
];

export const PaySettlementModal: React.FC<PaySettlementModalProps> = ({
  isOpen,
  settlement,
  onClose,
  onSuccessPay
}) => {
  const { payoutAccount, settlements } = useAppContext();
  const { showToast } = useToast();

  const [activeSettlement, setActiveSettlement] = useState<Settlement | null>(settlement);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PayMethodType>('kakaopay');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (settlement) {
      setActiveSettlement(settlement);
    } else if (settlements && settlements.length > 0) {
      setActiveSettlement(settlements[0]);
    }
  }, [settlement, settlements, isOpen]);

  if (!isOpen || !activeSettlement) return null;

  const targetAmount = activeSettlement.amount.toLocaleString();
  const currentPayMethodObj = PAY_METHODS.find((m) => m.id === selectedMethod)!;

  const handleCopyAccount = () => {
    showToast(`계좌번호 '${payoutAccount.accountNumberMasked}'가 복사되었습니다! 📋`, 'info', '📋');
  };

  const handleSelectItem = (item: Settlement) => {
    setActiveSettlement(item);
    setIsPickerOpen(false);
    showToast(`'${item.title}' 정산 항목이 선택되었습니다. 💸`, 'info', '💸');
  };

  const handleConfirmPay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      showToast(
        `'${currentPayMethodObj.name}'로 '${activeSettlement.title}' ₩${targetAmount}원 정산이 완료되었습니다! 🎉`,
        'success',
        '🎉'
      );

      if (onSuccessPay) {
        onSuccessPay(activeSettlement.id, currentPayMethodObj.name);
      }
      onClose();
    }, 1200);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitleRow>
            <HeaderTitle>💸 정산하기</HeaderTitle>
            <PickerToggleBtn
              type="button"
              onClick={() => setIsPickerOpen(!isPickerOpen)}
            >
              정산 항목 목록 ({settlements.length}) {isPickerOpen ? '▲' : '📋'}
            </PickerToggleBtn>
          </HeaderTitleRow>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 정산할 모임/항목 선택 드롭다운 뷰 */}
        {isPickerOpen && (
          <PickerContainer>
            <PickerHeaderLabel>정산할 모임/내역을 선택해주세요</PickerHeaderLabel>
            <PickerList>
              {settlements.map((item) => {
                const isSelected = item.id === activeSettlement.id;
                return (
                  <PickerItem
                    key={item.id}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => handleSelectItem(item)}
                  >
                    <ItemLeft>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemSub>{item.date} · {item.category}</ItemSub>
                    </ItemLeft>
                    <ItemRight>
                      <ItemAmount>₩{item.amount.toLocaleString()}</ItemAmount>
                      <ItemStatus className={item.status}>
                        {item.status === 'done' ? '완료' : '대기'}
                      </ItemStatus>
                    </ItemRight>
                  </PickerItem>
                );
              })}
            </PickerList>
          </PickerContainer>
        )}

        {/* 1. 정산할 내용 정보 카드 (동적 변경 반영) */}
        <SummaryHeroCard>
          <HeroLabel>선택된 정산 항목</HeroLabel>
          <HeroItemTitle>{activeSettlement.title}</HeroItemTitle>
          <AmountBox>
            <AmountText>₩{targetAmount}</AmountText>
            <CategoryBadge>{activeSettlement.category}</CategoryBadge>
          </AmountBox>
        </SummaryHeroCard>

        {/* 2. 수령 계좌 정보 */}
        <AccountBox>
          <AccountTitleRow>
            <span>정산 수령 계좌 정보</span>
            <CopyBtn type="button" onClick={handleCopyAccount}>계좌 복사 📋</CopyBtn>
          </AccountTitleRow>
          <AccountDetail>
            <strong>{payoutAccount.bankName}</strong> {payoutAccount.accountNumberMasked} (예금주: {payoutAccount.holderName})
          </AccountDetail>
        </AccountBox>

        {/* 3. 정산 방법 선택 (토스페이, 카카오페이, 직접송금 등) */}
        <SectionBox>
          <SectionLabel>💳 정산 방법 선택</SectionLabel>
          <MethodGrid>
            {PAY_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <MethodCard
                  key={method.id}
                  type="button"
                  className={isSelected ? 'selected' : ''}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <MethodIcon>{method.icon}</MethodIcon>
                  <MethodInfo>
                    <MethodName>{method.name}</MethodName>
                    <MethodBadge>{method.badgeText}</MethodBadge>
                  </MethodInfo>
                  <CheckRadio className={isSelected ? 'checked' : ''} />
                </MethodCard>
              );
            })}
          </MethodGrid>
        </SectionBox>

        {/* 하단 최종 정산하기 버튼 */}
        <FooterSection>
          <ConfirmPayBtn
            type="button"
            onClick={handleConfirmPay}
            disabled={isProcessing}
          >
            {isProcessing ? '정산 처리 중...' : `${currentPayMethodObj.name}로 ₩${targetAmount} 정산하기 🚀`}
          </ConfirmPayBtn>
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

const PickerToggleBtn = styled.button`
  background: #f1f5f9;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fedd13;
    border-color: #f5cf00;
    color: #111827;
  }
`;

const PickerContainer = styled.div`
  background: #f8fafc;
  border: 1.5px solid #fedd13;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ${fadeIn} 0.2s ease-out forwards;
`;

const PickerHeaderLabel = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
`;

const PickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PickerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #fedd13;
    background: #fefce8;
  }

  &.selected {
    border: 1.5px solid #f5cf00;
    background: #fef08a;
  }
`;

const ItemLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const ItemSub = styled.span`
  font-size: 10px;
  color: #64748b;
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ItemAmount = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const ItemStatus = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;

  &.done {
    background: #dcfce7;
    color: #15803d;
  }

  &.pending {
    background: #fff7ed;
    color: #c2410c;
  }
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

const SummaryHeroCard = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HeroLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
`;

const HeroItemTitle = styled.h4`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
`;

const AmountBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

const AmountText = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
`;

const CategoryBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  background: #e2e8f0;
  color: #475569;
  padding: 3px 8px;
  border-radius: 8px;
`;

const AccountBox = styled.div`
  background: #f1f5f9;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AccountTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 800;
  color: #475569;
`;

const CopyBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const AccountDetail = styled.div`
  font-size: 13px;
  color: #1e293b;
`;

const SectionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const MethodCard = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: #ffffff;
    border-color: #fedd13;
    transform: translateY(-2px);
  }

  &.selected {
    background: #ffffff;
    border-color: #fedd13;
    box-shadow: 0 4px 12px rgba(254, 221, 19, 0.3);
  }
`;

const MethodIcon = styled.span`
  font-size: 22px;
  flex-shrink: 0;
`;

const MethodInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
`;

const MethodName = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const MethodBadge = styled.span`
  font-size: 10px;
  color: #64748b;
`;

const CheckRadio = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  flex-shrink: 0;

  &.checked {
    border-color: #fedd13;
    background: #fedd13;
  }
`;

const FooterSection = styled.div`
  margin-top: 4px;
`;

const ConfirmPayBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #fedd13;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.4);
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f5cf00;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
