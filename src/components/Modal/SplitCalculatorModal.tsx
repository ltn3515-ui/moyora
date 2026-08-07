import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

interface SplitMember {
  id: string;
  name: string;
  isChecked: boolean;
}

interface SplitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFillAmount?: (amount: number) => void;
}

export const SplitCalculatorModal: React.FC<SplitCalculatorModalProps> = ({
  isOpen,
  onClose,
  onFillAmount,
}) => {
  const { addSettlement } = useAppContext();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [roundingUnit, setRoundingUnit] = useState<number>(10); // 1, 10, 100, 1000

  // 모임원 리스트 연동
  const [members, setMembers] = useState<SplitMember[]>([
    { id: 'm1', name: '나 (이태노)', isChecked: true },
    { id: 'm2', name: '민수', isChecked: true },
    { id: 'm3', name: '지은', isChecked: true },
    { id: 'm4', name: '현우', isChecked: true },
    { id: 'm5', name: '유진', isChecked: false },
    { id: 'm6', name: '지아', isChecked: false },
  ]);

  // 확인 컨펌 창 띄우기 상태
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  // 체크된 멤버수 계산
  const checkedCount = members.filter((m) => m.isChecked).length;

  // 인당 계산 및 잔돈 처리 계산
  const numTotalAmount = parseInt(totalAmount.replace(/[^0-9]/g, ''), 10) || 0;
  
  let perPersonAmount = 0;
  let leftoverAmount = 0;

  if (numTotalAmount > 0 && checkedCount > 0) {
    const rawPerPerson = numTotalAmount / checkedCount;
    // 단수 절사 처리
    if (roundingUnit === 1) {
      perPersonAmount = Math.floor(rawPerPerson);
    } else {
      perPersonAmount = Math.floor(rawPerPerson / roundingUnit) * roundingUnit;
    }
    // 절사 후 남는 잔돈 (방장이 부담할 차액)
    leftoverAmount = numTotalAmount - (perPersonAmount * checkedCount);
  }

  // 전체 선택 토글
  const handleToggleSelectAll = () => {
    const allChecked = members.every((m) => m.isChecked);
    setMembers((prev) => prev.map((m) => ({ ...m, isChecked: !allChecked })));
  };

  const handleMemberToggle = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isChecked: !m.isChecked } : m))
    );
  };

  // 1/N 정산 최종 실행
  const handleApplySettlement = (shouldReflectImmediately: boolean) => {
    if (numTotalAmount <= 0) {
      showToast('정산할 금액을 입력해주세요.', 'error');
      return;
    }
    if (checkedCount <= 0) {
      showToast('정산에 참여할 멤버를 최소 1명 이상 선택해주세요.', 'error');
      return;
    }

    const finalTitle = title.trim() || '모임 정산';

    if (shouldReflectImmediately) {
      // 1. 즉시 반영 처리
      const itemTitle = `[1/N] ${finalTitle} (인당 ₩${perPersonAmount.toLocaleString()})`;
      addSettlement(itemTitle, numTotalAmount, '1/N 정산');
      showToast(`'${finalTitle}' 총액 ₩${numTotalAmount.toLocaleString()} 정산 내역이 즉시 반영되었습니다! 💸`, 'success');
      onClose();
    } else {
      // 2. 값만 입력 필드에 채우기 콜백
      if (onFillAmount) {
        onFillAmount(numTotalAmount);
        showToast('계산된 총 금액이 입력창에 입력되었습니다.', 'info');
      } else {
        showToast('계산이 완료되었습니다. 금액을 복사하여 사용하세요.', 'info');
      }
      onClose();
    }
    setShowConfirm(false);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>🧮 N분의 1 정산 계산기</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        <ContentBody>
          {/* 정산 제목 입력 */}
          <FormGroup>
            <FormLabel>정산 내용</FormLabel>
            <FormInput
              type="text"
              placeholder="예: 성수 삼겹살 모임 회식"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>

          {/* 정산 금액 입력 */}
          <FormGroup>
            <FormLabel>총 정산 금액 (원)</FormLabel>
            <FormInput
              type="text"
              placeholder="0"
              value={totalAmount ? numTotalAmount.toLocaleString() : ''}
              onChange={(e) => setTotalAmount(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </FormGroup>

          {/* 단수 처리 옵션 */}
          <FormGroup>
            <FormLabel>단수 처리 (절사 단위)</FormLabel>
            <RoundingOptionsRow>
              {[
                { label: '원화 그대로', value: 1 },
                { label: '10원 단위 절사', value: 10 },
                { label: '100원 단위 절사', value: 100 },
                { label: '1,000원 단위 절사', value: 1000 },
              ].map((opt) => (
                <RoundingBtn
                  key={opt.value}
                  type="button"
                  className={roundingUnit === opt.value ? 'selected' : ''}
                  onClick={() => setRoundingUnit(opt.value)}
                >
                  {opt.label}
                </RoundingBtn>
              ))}
            </RoundingOptionsRow>
          </FormGroup>

          {/* 정산 인원 선택 */}
          <FormGroup>
            <MemberHeaderRow>
              <FormLabel style={{ margin: 0 }}>정산 멤버 ({checkedCount}명 / {members.length}명)</FormLabel>
              <SelectAllBtn type="button" onClick={handleToggleSelectAll}>
                {members.every((m) => m.isChecked) ? '전체 해제' : '전체 선택'}
              </SelectAllBtn>
            </MemberHeaderRow>
            
            <MemberGrid>
              {members.map((m) => (
                <MemberItem 
                  key={m.id} 
                  className={m.isChecked ? 'checked' : ''}
                  onClick={() => handleMemberToggle(m.id)}
                >
                  <CheckboxCircle className={m.isChecked ? 'checked' : ''}>
                    {m.isChecked && '✓'}
                  </CheckboxCircle>
                  <MemberName>{m.name}</MemberName>
                </MemberItem>
              ))}
            </MemberGrid>
          </FormGroup>

          {/* 정산 계산 결과 보드 */}
          <ResultBoard>
            <ResultRow>
              <ResultLabel>총 정산 금액</ResultLabel>
              <ResultVal>₩ {numTotalAmount.toLocaleString()}</ResultVal>
            </ResultRow>
            <ResultRow>
              <ResultLabel>나눌 인원수</ResultLabel>
              <ResultVal>{checkedCount} 명</ResultVal>
            </ResultRow>
            <Divider />
            <ResultRow className="highlight">
              <ResultLabel>1인당 송금액</ResultLabel>
              <PerPersonVal>₩ {perPersonAmount.toLocaleString()}</PerPersonVal>
            </ResultRow>
            {leftoverAmount > 0 && (
              <LeftoverTip>
                💡 절사 단수 잔돈 <strong>₩{leftoverAmount.toLocaleString()}원</strong>은 결제자(나) 부담 금액에 자동 포함됩니다.
              </LeftoverTip>
            )}
          </ResultBoard>

          {/* 하단 액션 버튼 */}
          <ActionBtnRow>
            <CancelBtn type="button" onClick={onClose}>
              취소
            </CancelBtn>
            <SubmitBtn 
              type="button" 
              onClick={() => setShowConfirm(true)}
              disabled={numTotalAmount <= 0 || checkedCount <= 0}
            >
              정산에 반영하기 💸
            </SubmitBtn>
          </ActionBtnRow>
        </ContentBody>

        {/* ========================================================= */}
        {/* 즉시 반영 여부를 묻는 확인 팝업 다이얼로그 */}
        {/* ========================================================= */}
        {showConfirm && (
          <ConfirmOverlay>
            <ConfirmCard>
              <ConfirmTitle>정산 즉시 반영 확인 ⚡</ConfirmTitle>
              <ConfirmDesc>
                계산된 N분의 1 결과를 정산 목록에 <strong>즉시 반영</strong>하시겠습니까?
                <br />
                <br />
                • 정산 내역에 바로 등록되며, 멤버들에게 알림이 전달됩니다.
              </ConfirmDesc>
              
              <ConfirmBtnRow>
                <ConfirmNoBtn onClick={() => handleApplySettlement(false)}>
                  아니오 (금액만 채우기)
                </ConfirmNoBtn>
                <ConfirmYesBtn onClick={() => handleApplySettlement(true)}>
                  예 (정산 즉시 반영)
                </ConfirmYesBtn>
              </ConfirmBtnRow>
            </ConfirmCard>
          </ConfirmOverlay>
        )}
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
  from { opacity: 0; transform: scale(0.96) translateY(15px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const overlayFade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const dialogPop = keyframes`
  from { transform: scale(0.9) translateY(8px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(38, 38, 44, 0.6);
  z-index: 10005;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.22s ease-out forwards;
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.bg || '#FFFBF3'};
  width: 100%;
  max-width: 440px;
  max-height: 88vh;
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(38, 38, 44, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  animation: ${scaleUp} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 850;
  color: #64748b;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  color: #1e293b;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    border-color: #fedd13;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(254, 221, 19, 0.12);
  }
`;

const RoundingOptionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const RoundingBtn = styled.button`
  padding: 10px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 800;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;

  &.selected {
    border-color: #26262C;
    background: #26262C;
    color: #ffffff;
  }
`;

const MemberHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

const SelectAllBtn = styled.button`
  font-size: 11px;
  font-weight: 800;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
`;

const MemberGrid = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 140px;
  overflow-y: auto;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: #f1f5f9;
  }

  &.checked {
    background: #eff6ff;
  }
`;

const CheckboxCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
  color: transparent;
  transition: all 0.1s;

  &.checked {
    background: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
  }
`;

const MemberName = styled.span`
  font-size: 12px;
  font-weight: 750;
  color: #334155;
`;

const ResultBoard = styled.div`
  background: #ffffff;
  border: 1.5px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(38, 38, 44, 0.02);
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.highlight {
    margin-top: 4px;
  }
`;

const ResultLabel = styled.span`
  font-size: 12.5px;
  font-weight: 750;
  color: #64748b;
`;

const ResultVal = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
`;

const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 4px 0;
`;

const PerPersonVal = styled.span`
  font-size: 18px;
  font-weight: 950;
  color: #2563eb;
`;

const LeftoverTip = styled.div`
  margin-top: 6px;
  font-size: 10.5px;
  color: #475569;
  line-height: 1.45;
  background: #f8fafc;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
`;

const ActionBtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const SubmitBtn = styled.button`
  flex: 1.8;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: #fedd13;
  color: #4c3c03;
  font-size: 13px;
  font-weight: 850;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(254, 221, 19, 0.2);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #fada0a;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(254, 221, 19, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Confirm Dialog overlays
const ConfirmOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(38, 38, 44, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 10010;
  animation: ${overlayFade} 0.18s ease-out forwards;
`;

const ConfirmCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  text-align: center;
  animation: ${dialogPop} 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

const ConfirmTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 900;
  color: #1e293b;
`;

const ConfirmDesc = styled.p`
  margin: 0 0 20px 0;
  font-size: 12px;
  line-height: 1.5;
  color: #475569;
  font-weight: 600;
`;

const ConfirmBtnRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ConfirmYesBtn = styled.button`
  width: 100%;
  padding: 11px;
  background: #fedd13;
  color: #4c3c03;
  font-size: 12.5px;
  font-weight: 800;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #fada0a;
  }
`;

const ConfirmNoBtn = styled.button`
  width: 100%;
  padding: 11px;
  background: #f1f5f9;
  color: #475569;
  font-size: 12.5px;
  font-weight: 750;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #e2e8f0;
  }
`;
