import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../components/Toast';

const ICON_BANK = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10 12 4l9 6" />
    <path d="M4.5 10.5v8M9 10.5v8M15 10.5v8M19.5 10.5v8" />
    <path d="M3 20h18" />
  </svg>
);

const ICON_WALLET = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4Z" />
  </svg>
);

const ICON_CHEVRON_DOWN = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ICON_CHECK_CIRCLE = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const Account: React.FC = () => {
  const { payoutAccount, bankOptions, updatePayoutAccount } = useAppContext();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  // 폼 입력 상태
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    if (accountNumber.trim().length >= 4) {
      setIsVerified(true);
    }
  };

  const handleSave = () => {
    if (!selectedBank || !accountNumber || !isVerified || !holderName) {
      showToast('은행 선택, 계좌 실명 확인, 예금주 입력을 모두 완료해주세요.', 'error', '⚠️');
      return;
    }

    updatePayoutAccount(selectedBank, accountNumber, holderName);
    showToast('대표 계좌가 저장되었습니다!', 'success', '✅');
    setTimeout(() => navigate('/option'), 1200);
  };

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isSaveEnabled = selectedBank && accountNumber && isVerified && holderName;

  return (
    <AccountPageContainer>
      {/* 안내 문구 */}
      <Section>
        <AccountIntro>
          <IntroIconWrapper>{ICON_BANK}</IntroIconWrapper>
          <IntroText>정산금을 받을<br />계좌를 등록해 주세요</IntroText>
        </AccountIntro>
      </Section>

      {/* 현재 등록된 계좌 카드 */}
      <Section className="marginTop">
        <CurrentAccountCard>
          <CardGlow />
          <CardInfoRow>
            <CardInfoLeft>
              <CardIconWrap>{ICON_WALLET}</CardIconWrap>
              <CardTextWrap>
                <CardLabel>현재 등록된 계좌</CardLabel>
                <CardBankName>{payoutAccount.bankName}</CardBankName>
              </CardTextWrap>
            </CardInfoLeft>
            <ChangeBtn onClick={handleScrollToForm}>변경</ChangeBtn>
          </CardInfoRow>
          <CardNumberBox>
            <CardNumberIcon>123</CardNumberIcon>
            <CardNumber>{payoutAccount.accountNumberMasked}</CardNumber>
          </CardNumberBox>
        </CurrentAccountCard>
      </Section>

      {/* 계좌 등록 폼 */}
      <Section ref={formRef}>
        <FormGroup>
          <FormLabel htmlFor="bankSelect">은행 선택</FormLabel>
          <SelectWrap>
            <SelectElement 
              id="bankSelect"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              <option value="" disabled>은행을 선택해 주세요</option>
              {bankOptions.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </SelectElement>
            <SelectChevron>{ICON_CHEVRON_DOWN}</SelectChevron>
          </SelectWrap>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="accountNumberInput">계좌번호</FormLabel>
          <InputRow>
            <InputElement 
              type="text"
              inputMode="numeric"
              id="accountNumberInput"
              placeholder="계좌번호를 입력해 주세요"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                setIsVerified(false); // 번호 수정 시 검증 초기화
              }}
              disabled={isVerified}
            />
            <VerifyBtn 
              type="button" 
              className={isVerified ? 'is-verified' : ''}
              disabled={accountNumber.trim().length < 4 || isVerified}
              onClick={handleVerify}
            >
              {isVerified ? '확인 완료' : '계좌 실명 확인'}
            </VerifyBtn>
          </InputRow>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="holderNameInput">예금주</FormLabel>
          <InputElement 
            type="text"
            id="holderNameInput"
            placeholder="이름을 입력해 주세요"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
          />
        </FormGroup>
      </Section>

      {/* 저장하기 하단 바 */}
      <SaveBar>
        <SaveBtn 
          type="button" 
          disabled={!isSaveEnabled}
          onClick={handleSave}
        >
          저장하기 <SaveCheckIcon>{ICON_CHECK_CIRCLE}</SaveCheckIcon>
        </SaveBtn>
      </SaveBar>
    </AccountPageContainer>
  );
};

// Styled Components
const AccountPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 110px;
  background: ${({ theme }) => theme.colors.bg};
`;

const Section = styled.section`
  padding: 0 20px;

  &.marginTop {
    margin-top: 24px;
  }
`;

const AccountIntro = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const IntroIconWrapper = styled.span`
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #FEDD13;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #85600F;
`;

const IntroText = styled.p`
  font-size: 19px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.45;
  margin: 0;
`;

const CurrentAccountCard = styled.div`
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.bgCard};
  box-shadow: 0 8px 30px rgba(38, 38, 44, 0.04);
  border: 1.5px solid rgba(240, 234, 224, 0.4);
`;

const CardGlow = styled.span`
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(244, 145, 188, 0.35) 0%, rgba(244, 145, 188, 0) 70%);
  pointer-events: none;
`;

const CardInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CardInfoLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardIconWrap = styled.span`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #CDE7F5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4A85A4;
`;

const CardTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CardLabel = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
`;

const CardBankName = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const ChangeBtn = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1.5px solid #DCD8D0;
  background: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  color: #8A8A93;
  transition: background 0.2s, transform 0.15s ease;

  &:active {
    background: #F8F7F4;
    transform: scale(0.97);
  }
`;

const CardNumberBox = styled.div`
  margin-top: 16px;
  padding: 14px 20px;
  border-radius: 20px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: #FFFDF9;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardNumberIcon = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #85600F;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 800;
  color: #85600F;
  padding: 1px 4px;
  line-height: 1;
`;

const CardNumber = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.5px;
`;

const FormGroup = styled.div`
  margin-top: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  margin-left: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #5C5243;
`;

const SelectWrap = styled.div`
  position: relative;
`;

const SelectElement = styled.select`
  width: 100%;
  appearance: none;
  padding: 16px 20px;
  padding-right: 44px;
  border-radius: 999px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: #FFFFFF;
  font-size: 15px;
  font-weight: 700;
  color: #85600F;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #85600F;
  }
`;

const SelectChevron = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #85600F;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const InputElement = styled.input`
  flex: 1;
  min-width: 0;
  padding: 16px 20px;
  border-radius: 999px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: #FFFFFF;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #85600F;
  }

  &::placeholder {
    color: #C4B9A2;
    font-weight: 600;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.grayLight};
    color: ${({ theme }) => theme.colors.textSub};
  }
`;

const VerifyBtn = styled.button`
  flex-shrink: 0;
  background: #1C1C1E;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  padding: 0 24px;
  border-radius: 999px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.4;
  }

  &.is-verified {
    background: ${({ theme }) => theme.colors.green};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SaveBar = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 16px 20px calc(16px + env(safe-area-inset-bottom, 8px));
  background: linear-gradient(to top, ${({ theme }) => theme.colors.bg} 70%, rgba(255, 251, 243, 0));
  z-index: 30;
  display: flex;
  justify-content: center;
  margin-top: auto;
`;

const SaveBtn = styled.button`
  width: 100%;
  height: 56px;
  gap: 8px;
  background: ${({ theme }) => theme.colors.yellow};
  color: #85600F;
  padding: 16px;
  font-size: 17px;
  font-weight: 800;
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveCheckIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
