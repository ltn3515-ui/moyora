import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  // 비밀번호 유효성 검사 규칙
  const isMinLength = newPassword.length >= 8;
  const hasLetterAndNum = /[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const isMatching = newPassword !== '' && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast('현재 비밀번호를 입력해주세요.', 'error', '⚠️');
      return;
    }
    if (!isMinLength || !hasLetterAndNum) {
      showToast('새 비밀번호는 8자 이상 영문과 숫자를 조합해야 합니다.', 'error', '⚠️');
      return;
    }
    if (!isMatching) {
      showToast('새 비밀번호가 일치하지 않습니다.', 'error', '⚠️');
      return;
    }

    // 성공 처리
    showToast('비밀번호가 성공적으로 변경되었습니다! 🔐', 'success', '🔐');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitle>🔒 비밀번호 변경</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        <NoticeBox>
          <span>💡 안전한 계정 관리를 위해 주기적으로 비밀번호를 변경해 주세요.</span>
        </NoticeBox>

        <FormBox onSubmit={handleSubmit}>
          {/* 현재 비밀번호 */}
          <FieldGroup>
            <FieldLabel>현재 비밀번호</FieldLabel>
            <InputWrap>
              <StyledInput
                type={showCurrent ? 'text' : 'password'}
                placeholder="현재 비밀번호 입력"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <ToggleEyeBtn type="button" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? '👁️' : '🙈'}
              </ToggleEyeBtn>
            </InputWrap>
          </FieldGroup>

          {/* 새 비밀번호 */}
          <FieldGroup>
            <FieldLabel>새 비밀번호</FieldLabel>
            <InputWrap>
              <StyledInput
                type={showNew ? 'text' : 'password'}
                placeholder="8자 이상 영문 + 숫자 조합"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <ToggleEyeBtn type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? '👁️' : '🙈'}
              </ToggleEyeBtn>
            </InputWrap>
          </FieldGroup>

          {/* 새 비밀번호 확인 */}
          <FieldGroup>
            <FieldLabel>새 비밀번호 확인</FieldLabel>
            <InputWrap>
              <StyledInput
                type={showConfirm ? 'text' : 'password'}
                placeholder="새 비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <ToggleEyeBtn type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? '👁️' : '🙈'}
              </ToggleEyeBtn>
            </InputWrap>
          </FieldGroup>

          {/* 실시간 유효성 체크 뱃지 */}
          <ValidationBox>
            <RuleChip className={isMinLength ? 'valid' : ''}>
              {isMinLength ? '✓ 8자 이상' : '○ 8자 이상'}
            </RuleChip>
            <RuleChip className={hasLetterAndNum ? 'valid' : ''}>
              {hasLetterAndNum ? '✓ 영문+숫자 조합' : '○ 영문+숫자 조합'}
            </RuleChip>
            <RuleChip className={isMatching ? 'valid' : ''}>
              {isMatching ? '✓ 비밀번호 일치' : '○ 비밀번호 일치'}
            </RuleChip>
          </ValidationBox>

          <SubmitBtn type="submit">
            비밀번호 변경하기 🔐
          </SubmitBtn>
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

const NoticeBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 12px;
  color: #1e40af;
  font-weight: 600;
`;

const FormBox = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 12.5px;
  font-weight: 700;
  color: #374151;
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 11px 40px 11px 14px;
  border-radius: 12px;
  border: 1.5px solid #d1d5db;
  font-size: 13.5px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ToggleEyeBtn = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
  padding: 4px;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const ValidationBox = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const RuleChip = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #94a3b8;
  border: 1px solid #e2e8f0;

  &.valid {
    background: #dcfce7;
    color: #15803d;
    border-color: #86efac;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.25);
  margin-top: 6px;
  transition: transform 0.15s ease;

  &:hover {
    background: #1f2937;
    transform: translateY(-1px);
  }
`;
