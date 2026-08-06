import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import imgLogoFull from '../assets/img_logo_full.png';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const goToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    // 프로그레스 바 애니메이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    const timer = setTimeout(goToLogin, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <PageWrapper>
      <MobileFrame onClick={goToLogin} title="클릭 시 로그인 화면으로 이동">
        <SplashContainer>
          {/* 상단 장식 빛 글로우 링 */}
          <GlowRing />

          <SplashContent>
            {/* 세련된 펄스 애니메이션 로고 */}
            <LogoWrap>
              <SplashLogo src={imgLogoFull} alt="모여라 스플래시 로고" />
            </LogoWrap>

            <BrandTitle>모여라</BrandTitle>
            <SplashTagline>모임과 정산을 한번에!</SplashTagline>
            <SubDesc>일상의 즐거운 모임을 발견해보세요</SubDesc>

            {/* 프로그레스 로딩 바 */}
            <ProgressWrap>
              <ProgressBar style={{ width: `${progress}%` }} />
            </ProgressWrap>
            <LoadingText>앱을 준비 중입니다... ({progress}%)</LoadingText>
          </SplashContent>

          <FooterText>© 2026 MOYORA ALL RIGHTS RESERVED</FooterText>
        </SplashContainer>
      </MobileFrame>
    </PageWrapper>
  );
};

// Keyframe Animations
const splashIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.85;
  }
`;

const logoFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #4b5563;
  padding: 20px 10px;
  box-sizing: border-box;
`;

const MobileFrame = styled.div`
  width: 100%;
  max-width: 410px;
  min-height: 720px;
  background: #ffffff;
  border-radius: 36px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
`;

const SplashContainer = styled.div`
  min-height: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #fffdf2 0%, #fef08a 50%, #fedd13 100%);
  padding: 60px 24px 40px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
`;

const GlowRing = styled.div`
  position: absolute;
  top: 15%;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(254, 240, 138, 0.9) 0%, rgba(254, 221, 19, 0) 70%);
  animation: ${pulseGlow} 2.5s ease-in-out infinite;
  pointer-events: none;
`;

const SplashContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 2;
  margin-auto: auto;
  animation: ${splashIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const LogoWrap = styled.div`
  animation: ${logoFloat} 3s ease-in-out infinite;
  margin-bottom: 8px;
`;

const SplashLogo = styled.img`
  height: 110px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08));
`;

const BrandTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  color: #1f2937;
  letter-spacing: -0.6px;
`;

const SplashTagline = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #854d0e;
  letter-spacing: -0.3px;
`;

const SubDesc = styled.span`
  font-size: 12px;
  color: #713f12;
  font-weight: 600;
`;

const ProgressWrap = styled.div`
  width: 180px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 24px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #111827;
  border-radius: 10px;
  transition: width 0.1s linear;
`;

const LoadingText = styled.span`
  font-size: 11px;
  color: #713f12;
  font-weight: 700;
`;

const FooterText = styled.p`
  font-size: 10px;
  font-weight: 700;
  color: #854d0e;
  letter-spacing: 0.5px;
  z-index: 2;
  margin: 0;
`;
