import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

export const VirtualKeyboard: React.FC = () => {
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'ko' | 'en' | 'num'>('ko');
  const [isShift, setIsShift] = useState(false);
  const keyboardRef = useRef<HTMLDivElement>(null);

  // 글로벌 포커스 이벤트 감지
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'checkbox' && (target as HTMLInputElement).type !== 'radio') ||
        target.tagName === 'TEXTAREA'
      ) {
        // 이미 가상 키보드 조작 중인 경우는 포커스 스킵 방지
        setActiveInput(target as HTMLInputElement | HTMLTextAreaElement);
        setIsOpen(true);
      }
    };

    const handleBlur = () => {
      // 탭핑 버튼 클릭 시 즉각 닫히는 현상을 방지하기 위해 setTimeout 사용
      setTimeout(() => {
        const activeEl = document.activeElement;
        if (
          !activeEl ||
          (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA' && !keyboardRef.current?.contains(activeEl))
        ) {
          setIsOpen(false);
        }
      }, 150);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  if (!isOpen || !activeInput) return null;

  // 한글 입력 자음/모음 간단 조합 유틸리티 (단순 타이핑 중심 및 한글 조합 처리 지원)
  // 완벽한 초중종성 조합을 대체하기 위해 한글 자판 클릭 시 해당 문자를 커서 위치에 바로 삽입합니다.
  const handleKeyPress = (key: string) => {
    if (!activeInput) return;

    const start = activeInput.selectionStart || 0;
    const end = activeInput.selectionEnd || 0;
    const text = activeInput.value;

    let newText = text;
    let newCursorPos = start;

    if (key === 'BACKSPACE') {
      if (start === end) {
        if (start > 0) {
          newText = text.substring(0, start - 1) + text.substring(end);
          newCursorPos = start - 1;
        }
      } else {
        newText = text.substring(0, start) + text.substring(end);
        newCursorPos = start;
      }
    } else if (key === 'SPACE') {
      newText = text.substring(0, start) + ' ' + text.substring(end);
      newCursorPos = start + 1;
    } else if (key === 'ENTER') {
      if (activeInput.tagName === 'TEXTAREA') {
        newText = text.substring(0, start) + '\n' + text.substring(end);
        newCursorPos = start + 1;
      } else {
        // Input의 경우 Enter는 확인(완료) 역할을 함
        activeInput.blur();
        setIsOpen(false);
        return;
      }
    } else {
      newText = text.substring(0, start) + key + text.substring(end);
      newCursorPos = start + key.length;
    }

    activeInput.value = newText;
    
    // React State 업데이트 바인딩 트리거 (인풋 체인지 이벤트 강제 발생)
    const event = new Event('input', { bubbles: true });
    activeInput.dispatchEvent(event);

    // 포커스 유지 및 커서 위치 복원
    activeInput.focus();
    setTimeout(() => {
      activeInput.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 키보드 자판 레이아웃 정의
  const keysKo = [
    isShift ? ['ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅒ', 'ㅖ'] : ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['SHIFT', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', 'BACKSPACE'],
    ['123', '한/영', 'SPACE', '완료']
  ];

  const keysEn = [
    isShift ? ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'] : ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'],
    ['123', '한/영', 'SPACE', '완료']
  ];

  const keysNum = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['.', ',', '?', '!', "'", 'BACKSPACE'],
    ['가/A', 'SPACE', '완료']
  ];

  const currentKeys = layoutMode === 'ko' ? keysKo : layoutMode === 'en' ? keysEn : keysNum;

  const handleKeyClick = (key: string) => {
    if (key === 'SHIFT') {
      setIsShift(!isShift);
    } else if (key === '123') {
      setLayoutMode('num');
    } else if (key === '한/영') {
      setLayoutMode(layoutMode === 'ko' ? 'en' : 'ko');
    } else if (key === '가/A') {
      setLayoutMode('ko');
    } else if (key === '완료') {
      activeInput.blur();
      setIsOpen(false);
    } else {
      handleKeyPress(key);
      if (isShift) setIsShift(false); // 쉬프트 1회용 자동 해제
    }
  };

  return (
    <KeyboardContainer ref={keyboardRef} tabIndex={-1}>
      <KeyboardHeader>
        <InputPreviewText>
          ⌨️ 모바일 키보드 모드: {activeInput.placeholder || '입력 중...'}
        </InputPreviewText>
        <DoneHeaderBtn onClick={() => { activeInput.blur(); setIsOpen(false); }}>완료</DoneHeaderBtn>
      </KeyboardHeader>
      <KeypadArea>
        {currentKeys.map((row, rowIdx) => (
          <KeyRow key={rowIdx}>
            {row.map((key, keyIdx) => {
              const isSpecial = ['SHIFT', 'BACKSPACE', '123', '한/영', '가/A', 'SPACE', '완료'].includes(key);
              return (
                <KeyButton
                  key={keyIdx}
                  type="button"
                  onClick={() => handleKeyClick(key)}
                  className={`${isSpecial ? 'special' : ''} ${key === 'SPACE' ? 'space' : ''} ${key === '완료' ? 'done' : ''} ${key === 'SHIFT' && isShift ? 'active' : ''}`}
                >
                  {key === 'BACKSPACE' ? '⌫' : key === 'SHIFT' ? '⇧' : key}
                </KeyButton>
              );
            })}
          </KeyRow>
        ))}
      </KeypadArea>
    </KeyboardContainer>
  );
};

/* ═══════════════════════════════════
   Animations & Styled Components
═══════════════════════════════════ */
const slideUp = keyframes`
  from { transform: translate(-50%, 100%); }
  to   { transform: translate(-50%, 0); }
`;

const KeyboardContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 440px;
  background: #d1d5db; /* iOS 키보드 풍 회색 배경 */
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
  z-index: 99999;
  padding: 10px 8px env(safe-area-inset-bottom, 12px) 8px;
  animation: ${slideUp} 0.28s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  box-sizing: border-box;
  user-select: none;
  touch-action: manipulation;
  outline: none;
`;

const KeyboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px 8px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 8px;
`;

const InputPreviewText = styled.span`
  font-size: 12px;
  color: #4b5563;
  font-weight: 700;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DoneHeaderBtn = styled.button`
  font-size: 13.5px;
  font-weight: 800;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
`;

const KeypadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const KeyRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  width: 100%;
`;

const KeyButton = styled.button`
  flex: 1;
  min-width: 0;
  height: 42px;
  background: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.05s ease, transform 0.05s ease;

  &:active {
    background: #e5e7eb;
    transform: scale(0.95);
  }

  &.special {
    background: #acb3bc;
    font-size: 13px;
    font-weight: 700;
    color: #1f2937;
  }

  &.space {
    flex: 4;
  }

  &.done {
    background: #2563eb;
    color: #ffffff;
    font-weight: 800;
  }

  &.active {
    background: #1f2937;
    color: #ffffff;
  }
`;
