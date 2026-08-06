import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ───────── 타입 ───────── */
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, emoji?: string) => void;
}

/* ───────── Context ───────── */
const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

/* ───────── SVG Icons ───────── */
const ICON_CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ICON_ERROR = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const ICON_INFO = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const ICON_MAP = {
  success: ICON_CHECK,
  error: ICON_ERROR,
  info: ICON_INFO,
};

/* ───────── Provider ───────── */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  // emoji 파라미터는 하위 호환성을 위해 유지하되 사용하지 않음
  const showToast = useCallback((message: string, type: ToastType = 'success', _emoji?: string) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastStack>
        {toasts.map((t) => (
          <ToastItem key={t.id}>
            <ToastIconCircle className={t.type}>
              {ICON_MAP[t.type]}
            </ToastIconCircle>
            <ToastMessage>{t.message}</ToastMessage>
            <ToastProgressBar className={t.type} />
          </ToastItem>
        ))}
      </ToastStack>
    </ToastContext.Provider>
  );
};

/* ───────── Animations ───────── */
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-12px) scale(0.97);
  }
`;

const shrink = keyframes`
  from { width: 100%; }
  to   { width: 0%; }
`;

const popIn = keyframes`
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`;

/* ───────── Styled Components ───────── */
const ToastStack = styled.div`
  position: fixed;
  bottom: 96px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 99990;
  pointer-events: none;
`;

const ToastItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px 14px 14px;
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(38, 38, 44, 0.12),
              0 1px 4px rgba(38, 38, 44, 0.06);
  overflow: hidden;
  animation:
    ${slideUp} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
    ${fadeOut} 0.3s ease 2.9s forwards;
`;

const ToastIconCircle = styled.span`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${popIn} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;

  &.success {
    background: #E8F5A3;
    color: #3A4A00;
  }

  &.error {
    background: #FFE4E4;
    color: #C0392B;
  }

  &.info {
    background: #E3EFFF;
    color: #1A5FA8;
  }
`;

const ToastMessage = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: #26262C;
  line-height: 1.45;
`;

const ToastProgressBar = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 0 2px 2px 0;
  animation: ${shrink} 3.2s linear 0.15s forwards;

  &.success { background: #C8E000; }
  &.error   { background: #E74C3C; }
  &.info    { background: #3498DB; }
`;
