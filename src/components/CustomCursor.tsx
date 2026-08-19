import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // 1. Detect if touch-only (mobile/tablet/devtools emulator without mouse)
    const isTouchOnly =
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(any-pointer: fine)').matches;

    if (isTouchOnly) {
      return;
    }

    // Enable custom cursor mode
    setIsActive(true);
    document.body.classList.add('custom-cursor-active');

    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let rafId: number;
    let isHovering = false;
    let isTouchActive = false;

    const updateVisibility = (visible: boolean) => {
      const opacity = visible && !isTouchActive ? '1' : '0';
      if (cursorRef.current) cursorRef.current.style.opacity = opacity;
      if (ringRef.current) ringRef.current.style.opacity = opacity;
    };

    const onMouseMove = (e: MouseEvent) => {
      isTouchActive = false;
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateVisibility(true);
    };

    const onMouseLeave = () => {
      updateVisibility(false);
    };

    const onMouseEnter = () => {
      updateVisibility(true);
    };

    const onMouseDown = () => {
      if (cursorRef.current) cursorRef.current.classList.add('pressed');
      if (ringRef.current) ringRef.current.classList.add('pressed');
    };

    const onMouseUp = () => {
      if (cursorRef.current) cursorRef.current.classList.remove('pressed');
      if (ringRef.current) ringRef.current.classList.remove('pressed');
    };

    const onTouchStart = () => {
      // Hide cursor on touch interaction to prevent stickiness/afterimages
      isTouchActive = true;
      updateVisibility(false);
    };

    const onHoverCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, [role="button"], input, li');
      if (interactive && !isHovering) {
        isHovering = true;
        if (cursorRef.current) cursorRef.current.classList.add('hovering');
        if (ringRef.current) ringRef.current.classList.add('hovering');
      } else if (!interactive && isHovering) {
        isHovering = false;
        if (cursorRef.current) cursorRef.current.classList.remove('hovering');
        if (ringRef.current) ringRef.current.classList.remove('hovering');
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      // Increased lerp speed from 0.1 to 0.22 to reduce visual lag trail
      ringX = lerp(ringX, mouseX, 0.22);
      ringY = lerp(ringY, mouseY, 0.22);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousemove', onHoverCheck);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchstart', onTouchStart, { passive: true });

    rafId = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', onHoverCheck);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchstart', onTouchStart);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isActive) return null;

  return (
    <>
      {/* 지연 추적 링 */}
      <CursorRing ref={ringRef} />

      {/* 손가락 커서 */}
      <CursorFinger ref={cursorRef}>
        <svg
          width="28"
          height="32"
          viewBox="0 0 28 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 손가락 전체 외형 */}
          <path
            d="M8 14V5.5C8 4.12 9.12 3 10.5 3C11.88 3 13 4.12 13 5.5V13"
            stroke="#26262C"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M13 12.5V10.5C13 9.12 14.12 8 15.5 8C16.88 8 18 9.12 18 10.5V13"
            stroke="#26262C"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M18 12.5V11.5C18 10.12 19.12 9 20.5 9C21.88 9 23 10.12 23 11.5V17C23 22.52 18.52 27 13 27C7.48 27 3 22.52 3 17V14C3 12.62 4.12 11.5 5.5 11.5C6.88 11.5 8 12.62 8 14"
            stroke="#26262C"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 손 내부 채우기 */}
          <path
            d="M8 14V5.5C8 4.12 9.12 3 10.5 3C11.88 3 13 4.12 13 5.5V12.5M13 12.5V10.5C13 9.12 14.12 8 15.5 8C16.88 8 18 9.12 18 10.5V12.5M18 12.5V11.5C18 10.12 19.12 9 20.5 9C21.88 9 23 10.12 23 11.5V17C23 22.52 18.52 27 13 27C7.48 27 3 22.52 3 17V14C3 12.62 4.12 11.5 5.5 11.5C6.88 11.5 8 12.62 8 14"
            fill="#FEDD13"
            fillOpacity="0.9"
          />
        </svg>
      </CursorFinger>
    </>
  );
};

/* ── Styled Components ── */
const CursorFinger = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99999;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  /* 핫스팟: 검지 손가락 끝 기준 */
  margin-left: -3px;
  margin-top: -3px;
  transition: opacity 0.2s ease;
  filter: drop-shadow(0 2px 5px rgba(38, 38, 44, 0.3));

  svg {
    display: block;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &.hovering svg {
    transform: scale(1.18) translateY(-2px);
  }

  &.pressed svg {
    transform: scale(0.88) translateY(3px);
  }
`;

const CursorRing = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 44px;
  height: 44px;
  border: 2px solid rgba(254, 221, 19, 0.55);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: opacity 0.2s ease,
              width 0.28s cubic-bezier(0.25, 0.8, 0.25, 1),
              height 0.28s cubic-bezier(0.25, 0.8, 0.25, 1),
              border-color 0.2s ease,
              background 0.2s ease;

  &.hovering {
    width: 60px;
    height: 60px;
    border-color: rgba(254, 221, 19, 0.85);
    background: rgba(254, 221, 19, 0.07);
  }

  &.pressed {
    width: 34px;
    height: 34px;
    background: rgba(254, 221, 19, 0.18);
  }
`;
