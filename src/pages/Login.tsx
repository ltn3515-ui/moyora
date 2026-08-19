import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../components/Toast';
import { useAppContext } from '../context/AppContext';
// Removed local firebase auth imports; now handled inside AppContext.tsx

import imgLogoFull from '../assets/img_logo_full.png';
import avatarMe from '../assets/avatar_me_circle.png';
import avatarF1 from '../assets/avatar_f1_circle.png';
import avatarF2 from '../assets/avatar_f2_circle.png';
import avatarF3 from '../assets/avatar_f3_circle.png';

// 카카오톡 공식 로고 SVG 컴포넌트
const KakaoTalkOfficialIcon = ({ size = 20, bubbleColor = '#3C1E1E', textColor = '#FEE500' }: { size?: number; bubbleColor?: string; textColor?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill={bubbleColor} d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.848 5.19 4.636 6.574-.204.757-.74 2.738-.847 3.16-.134.532.195.525.41.383.17-.112 2.69-1.83 3.774-2.568.665.097 1.348.151 2.027.151 5.523 0 10-3.477 10-7.765C22 6.477 17.523 3 12 3z"/>
    <text x="12" y="11.8" textAnchor="middle" dominantBaseline="middle" fill={textColor} fontSize="5.8" fontWeight="900" fontFamily="sans-serif">TALK</text>
  </svg>
);

// 구글 멀티컬러 G 공식 로고 SVG 컴포넌트
const GoogleOfficialGIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

type LoginStep = 'kakao' | 'email' | 'google' | 'signup' | 'trouble';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updateProfile, handleGoogleLogin, isGoogleLoading } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // 로그인 단계 상태관리
  const [step, setStep] = useState<LoginStep>('kakao');

  // 모달 팝업 상태관리
  const [isFindEmailModalOpen, setIsFindEmailModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // 이메일 로그인 Form 상태
  const [emailInput, setEmailInput] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [showPw, setShowPw] = useState(false);

  // 회원가입 Form 상태
  const [signupNickname, setSignupNickname] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPwConfirm, setSignupPwConfirm] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 이메일 찾기 모달 Form 상태
  const [findName, setFindName] = useState('');
  const [findPhone, setFindPhone] = useState('');

  // 비밀번호 재설정 모달 Form 상태
  const [resetNewPw, setResetNewPw] = useState('');
  const [resetNewPwConfirm, setResetNewPwConfirm] = useState('');
  const [showResetPw, setShowResetPw] = useState(false);

  // 구글 로그인 시작 (Firebase Auth signInWithPopup 사용)
  const handleGoogleLoginStart = async (forceSelectAccount: boolean = false) => {
    showToast('Google 로그인을 진행하고 있습니다...', 'info', '🔄');

    try {
      const user = await handleGoogleLogin(forceSelectAccount);
      if (user) {
        showToast(`${user.displayName || '구글 사용자'}님, Google 로그인에 성공하였습니다! 🎉`, 'success', '🎉');
        setTimeout(() => {
          navigate('/home');
        }, 800);
      }
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      showToast(`Google 로그인 오류: ${error.message || '네트워크 오류'}`, 'error', '⚠️');
    }
  };

  // 모의 계정 선택 로그인 처리
  const handleMockAccountLogin = (name: string, email: string, avatar: string) => {
    setIsAccountModalOpen(false);
    updateProfile({
      name,
      email,
      profileImage: avatar,
    });
    showToast(`${name}님, Google 로그인에 성공하였습니다! 🎉`, 'success', '🎉');
    setTimeout(() => {
      navigate('/home');
    }, 800);
  };

  // 랜덤 닉네임 생성기
  const handleGenerateNickname = () => {
    const prefixes = ['즐거운', '멋진', '신나는', '열정적인', '다정한', '센스있는', '우아한'];
    const names = ['크루원', '모임왕', '피크닉러', '탐험가', '아티스트', '러너', '컬렉터'];
    const rand = Math.floor(Math.random() * 1000);
    const generated = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]} ${rand}`;
    setSignupNickname(generated);
    showToast(`랜덤 닉네임 '${generated}'가 추천되었습니다! 🎲`, 'info', '🎲');
  };

  // 로그인 완료 처리
  const handleCompleteLogin = (providerName: string) => {
    showToast(`${providerName} 로그인에 성공하였습니다! 환영합니다 🎉`, 'success', '🎉');
    setTimeout(() => {
      navigate('/home');
    }, 600);
  };

  // 회원가입 완료 ➔ 축하 모달 팝업
  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('이용약관 및 개인정보 처리방침 동의가 필요합니다.', 'error', '⚠️');
      return;
    }
    if (signupPw !== signupPwConfirm) {
      showToast('비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error', '⚠️');
      return;
    }
    showToast('회원가입이 정상 처리되었습니다! 🎉', 'success', '🎉');
    setIsCelebrationModalOpen(true);
  };

  // 이메일 찾기 실행
  const handleRunFindEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findPhone) {
      showToast('휴대폰 번호를 입력해주세요.', 'error', '⚠️');
      return;
    }
    showToast(`회원님의 가입 이메일은 '${findName || '홍길동'}***@moyora.com' 입니다. ✉️`, 'success', '✉️');
    setIsFindEmailModalOpen(false);
  };

  // 비밀번호 재설정 실행
  const handleRunResetPw = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPw !== resetNewPwConfirm) {
      showToast('새 비밀번호가 일치하지 않습니다.', 'error', '⚠️');
      return;
    }
    showToast('비밀번호가 성공적으로 변경되었습니다. 로그인해주세요! 🔑', 'success', '🔑');
    setIsResetPasswordModalOpen(false);
    setStep('email');
  };

  return (
    <PageWrapper>
      <MobileFrame>
        {/* ──────── 1. 카카오 로그인 화면 (메인 기본) ──────── */}
        {step === 'kakao' && (
          <ScreenContainer key="kakao">
            <TopNavHeader style={{ justifyContent: 'center' }}>
              <HeaderLogoImg src={imgLogoFull} alt="모여라" />
            </TopNavHeader>

            <HeroIconBadge style={{ background: '#FEE500' }}>
              <KakaoTalkOfficialIcon size={32} bubbleColor="#3C1E1E" textColor="#FEE500" />
            </HeroIconBadge>
            <PageMainTitle>카카오로 로그인</PageMainTitle>
            <PageSubTitle>모여라와 함께 즐거운 일상을 시작해보세요.</PageSubTitle>

            <SocialMembersCard>
              <AvatarCluster>
                <ClusterImg src={avatarMe} alt="멤버" />
                <ClusterImg src={avatarF1} alt="멤버" style={{ marginLeft: -10 }} />
                <ClusterImg src={avatarF2} alt="멤버" style={{ marginLeft: -10 }} />
                <ClusterImg src={avatarF3} alt="멤버" style={{ marginLeft: -10 }} />
              </AvatarCluster>
              <MemberCountPill>현재 1,240명의 친구들이 모였어요!</MemberCountPill>
            </SocialMembersCard>

            <PrimaryKakaoBtn type="button" onClick={() => handleCompleteLogin('카카오')}>
              <KakaoTalkOfficialIcon size={20} bubbleColor="#3C1E1E" textColor="#FEE500" />
              <span>카카오 로그인 &gt;</span>
            </PrimaryKakaoBtn>

            <OtherMethodsSection>
              <SectionDividerText>다른 방법으로 로그인하기</SectionDividerText>
              <MethodRowGroup>
                <MethodChipBtn type="button" onClick={() => setStep('email')}>
                  ✉️ 이메일 로그인
                </MethodChipBtn>
                <MethodChipBtn type="button" onClick={() => setStep('google')}>
                  <GoogleOfficialGIcon size={16} /> 구글 로그인
                </MethodChipBtn>
              </MethodRowGroup>
            </OtherMethodsSection>

            {/* 하단 회원가입 및 로그인 문제 해결 링크 바 */}
            <FooterLinksRow>
              <FooterLinkBtn type="button" onClick={() => setStep('signup')}>
                회원가입
              </FooterLinkBtn>
              <FooterDotDivider>·</FooterDotDivider>
              <FooterLinkBtn type="button" onClick={() => setStep('trouble')}>
                로그인 문제 해결
              </FooterLinkBtn>
            </FooterLinksRow>

            <LegalFooterText>
              로그인 시 모여라의 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </LegalFooterText>
          </ScreenContainer>
        )}

        {/* ──────── 2. 이메일 로그인 화면 ──────── */}
        {step === 'email' && (
          <ScreenContainer key="email">
            <TopNavHeader>
              <BackArrowBtn onClick={() => setStep('kakao')}>←</BackArrowBtn>
              <HeaderLogoImg src={imgLogoFull} alt="모여라" />
            </TopNavHeader>

            <HeroIconBadge style={{ background: '#F59E0B', color: '#fff' }}>✉️</HeroIconBadge>
            <PageMainTitle>모여라</PageMainTitle>
            <PageSubTitle>이메일로 로그인</PageSubTitle>

            <FormCard onSubmit={(e) => { e.preventDefault(); handleCompleteLogin('이메일'); }}>
              <InputGroupField>
                <FieldLabel>이메일 주소</FieldLabel>
                <InputWrapper>
                  <IconPrefix>✉️</IconPrefix>
                  <TextInput
                    type="email"
                    placeholder="example@moyora.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroupField>

              <InputGroupField>
                <FieldLabel>비밀번호</FieldLabel>
                <InputWrapper>
                  <IconPrefix>🔒</IconPrefix>
                  <TextInput
                    type={showPw ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={pwInput}
                    onChange={(e) => setPwInput(e.target.value)}
                    required
                  />
                  <IconButtonRight type="button" onClick={() => setShowPw(!showPw)}>
                    {showPw ? '👁️' : '🙈'}
                  </IconButtonRight>
                </InputWrapper>
              </InputGroupField>

              <RightLinkBtn type="button" onClick={() => setStep('trouble')}>
                이메일/비밀번호 찾기
              </RightLinkBtn>

              <SubmitYellowBtn type="submit">
                로그인 ➔
              </SubmitYellowBtn>
            </FormCard>

            <DividerLineRow>
              <Line />
              <OrText>또는</OrText>
              <Line />
            </DividerLineRow>

            <BottomSignupPrompt>
              아직 계정이 없으신가요?
              <SignupHighlightLink type="button" onClick={() => setStep('signup')}>
                회원가입 하기 ➔
              </SignupHighlightLink>
            </BottomSignupPrompt>
          </ScreenContainer>
        )}

        {/* ──────── 3. 구글 로그인 화면 ──────── */}
        {step === 'google' && (
          <ScreenContainer key="google">
            <TopNavHeader>
              <BackArrowBtn onClick={() => setStep('kakao')}>←</BackArrowBtn>
            </TopNavHeader>

            <PageMainTitle style={{ marginTop: 10 }}>모여라</PageMainTitle>
            <PageSubTitle>일상의 즐거운 모임</PageSubTitle>

            <GoogleAuthBoxCard>
              <GoogleOfficialGIcon size={38} />
              <GoogleBoxTitle>Google로 로그인</GoogleBoxTitle>
              <GoogleBoxSub>Moyora 서비스를 계속하려면 <u style={{ color: '#4285f4' }}>로그인</u>하세요.</GoogleBoxSub>

              <GoogleAccountPill>
                <PillAvatar src={avatarMe} alt="계정" />
                <PillMeta>
                  <strong>김모요</strong>
                  <span>moyora.user@gmail.com</span>
                </PillMeta>
              </GoogleAccountPill>

              <OtherAccountBtn type="button" onClick={() => setIsAccountModalOpen(true)}>
                👤+ 다른 계정 사용
              </OtherAccountBtn>

              <GoogleSubmitBlackBtn 
                type="button" 
                onClick={() => handleGoogleLoginStart(true)}
                disabled={isGoogleLoading}
              >
                <GoogleOfficialGIcon size={18} />
                <span>{isGoogleLoading ? '로그인 처리 중...' : 'Google 계정으로 계속'}</span>
              </GoogleSubmitBlackBtn>
            </GoogleAuthBoxCard>

            <GoogleFooterLinks>
              <span>개인정보 처리방침</span> · <span>이용약관</span>
              <LangSelect>🌐 한국어 ▾</LangSelect>
            </GoogleFooterLinks>
          </ScreenContainer>
        )}

        {/* ──────── 4. 회원가입 화면 ──────── */}
        {step === 'signup' && (
          <ScreenContainer key="signup">
            <TopNavHeader>
              <BackArrowBtn onClick={() => setStep('kakao')}>←</BackArrowBtn>
              <HeaderLogoImg src={imgLogoFull} alt="모여라" />
            </TopNavHeader>

            <PageMainTitle>회원가입</PageMainTitle>
            <PageSubTitle>모여라와 함께 새로운 모임을 시작해보세요!</PageSubTitle>

            <FormCard onSubmit={handleCompleteSignup}>
              <InputGroupField>
                <FieldLabel>닉네임</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type="text"
                    placeholder="멋진 이름을 입력하세요"
                    value={signupNickname}
                    onChange={(e) => setSignupNickname(e.target.value)}
                    required
                  />
                  <IconButtonRight type="button" onClick={handleGenerateNickname} title="랜덤 닉네임 추천">
                    🎲
                  </IconButtonRight>
                </InputWrapper>
              </InputGroupField>

              <InputGroupField>
                <FieldLabel>이메일</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type="email"
                    placeholder="example@moyora.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  <IconSuffix>✉️</IconSuffix>
                </InputWrapper>
              </InputGroupField>

              <InputGroupField>
                <FieldLabel>비밀번호</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type={showSignupPw ? 'text' : 'password'}
                    placeholder="8자 이상 입력하세요"
                    value={signupPw}
                    onChange={(e) => setSignupPw(e.target.value)}
                    required
                  />
                  <IconButtonRight type="button" onClick={() => setShowSignupPw(!showSignupPw)}>
                    {showSignupPw ? '👁️' : '🙈'}
                  </IconButtonRight>
                </InputWrapper>
              </InputGroupField>

              <InputGroupField>
                <FieldLabel>비밀번호 확인</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type={showSignupPw ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={signupPwConfirm}
                    onChange={(e) => setSignupPwConfirm(e.target.value)}
                    required
                  />
                  <IconSuffix>🔒</IconSuffix>
                </InputWrapper>
              </InputGroupField>

              <CheckboxRow onClick={() => setAgreeTerms(!agreeTerms)}>
                <CheckIcon className={agreeTerms ? 'checked' : ''}>
                  {agreeTerms ? '✓' : ''}
                </CheckIcon>
                <CheckboxText>이용약관 및 개인정보 처리방침에 동의합니다.</CheckboxText>
              </CheckboxRow>

              <SubmitDarkBtn type="submit">
                회원가입 ➔
              </SubmitDarkBtn>
            </FormCard>

            <BottomSignupPrompt>
              이미 계정이 있으신가요?
              <SignupHighlightLink type="button" onClick={() => setStep('email')}>
                로그인하기
              </SignupHighlightLink>
            </BottomSignupPrompt>
          </ScreenContainer>
        )}

        {/* ──────── 5. 로그인 문제 해결 화면 (시안 100% 동일) ──────── */}
        {step === 'trouble' && (
          <ScreenContainer key="trouble">
            <TopNavHeader>
              <BackArrowBtn onClick={() => setStep('kakao')}>←</BackArrowBtn>
              <HeaderLogoImg src={imgLogoFull} alt="모여라" />
            </TopNavHeader>

            <PageMainTitle>로그인 문제 해결</PageMainTitle>
            <PageSubTitle>계정 정보를 잊으셨나요? 휴대폰 번호로 간단하게 복구할 수 있습니다.</PageSubTitle>

            {/* 이메일 찾기 옐로우 카드 (@ + FAST) */}
            <TroubleActionCard style={{ background: '#FEDD13' }}>
              <TroubleHeaderRow>
                <CardIconCircle>@</CardIconCircle>
                <CardBadgeTag>FAST</CardBadgeTag>
              </TroubleHeaderRow>
              <TroubleCardTitle>이메일 찾기</TroubleCardTitle>
              <TroubleCardDesc>가입 시 사용한 휴대폰 번호로 이메일 주소의 일부를 확인합니다.</TroubleCardDesc>
              <TroubleCardBtn type="button" onClick={() => setIsFindEmailModalOpen(true)}>
                시작하기
              </TroubleCardBtn>
            </TroubleActionCard>

            {/* 비밀번호 재설정 핑크 카드 (🔑) */}
            <TroubleActionCard style={{ background: '#F491BC', color: '#fff' }}>
              <TroubleHeaderRow>
                <CardIconCircle style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>🔑</CardIconCircle>
              </TroubleHeaderRow>
              <TroubleCardTitle style={{ color: '#fff' }}>비밀번호 재설정</TroubleCardTitle>
              <TroubleCardDesc style={{ color: '#ffffff', opacity: 0.9 }}>
                새로운 비밀번호를 설정하기 위한 본인 인증을 진행합니다.
              </TroubleCardDesc>
              <TroubleCardBtn type="button" onClick={() => setIsResetPasswordModalOpen(true)} style={{ background: '#1f2937', color: '#fff' }}>
                재설정하기
              </TroubleCardBtn>
            </TroubleActionCard>

            {/* 점선 가이드 블루 점선 박스 */}
            <DashedInfoBlueBox>
              <InfoIcon>ℹ️</InfoIcon>
              <InfoText>
                인증번호가 도착하지 않나요? 스팸 문자를 확인하거나 고객센터(1588-0000)로 문의해주세요.
              </InfoText>
            </DashedInfoBlueBox>

            {/* 시안 하단 3D 일러스트 그래픽 바너 */}
            <BottomGraphicBanner>
              <BannerGraphicCircle />
              <BannerGraphicText>로그인 문제 해결 (Vibrant)</BannerGraphicText>
            </BottomGraphicBanner>
          </ScreenContainer>
        )}
      </MobileFrame>

      {/* ──────── 6. 이메일 찾기 모달 (시안 100% 동일) ──────── */}
      {isFindEmailModalOpen && (
        <Overlay onClick={() => setIsFindEmailModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BackArrowBtn onClick={() => setIsFindEmailModalOpen(false)}>←</BackArrowBtn>
              <ModalHeaderTitle>이메일 찾기</ModalHeaderTitle>
            </ModalHeader>

            <YellowFindBanner>
              <BannerBadgeTag>계정 확인</BannerBadgeTag>
              <BannerTitle>본인 인증</BannerTitle>
              <BannerDesc>가입 시 등록했던 휴대폰 번호 또는 복구 정보를 입력하여 이메일 주소를 확인하세요.</BannerDesc>
            </YellowFindBanner>

            <ModalForm onSubmit={handleRunFindEmail}>
              <InputGroupField>
                <FieldLabel>성함</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type="text"
                    placeholder="홍길동"
                    value={findName}
                    onChange={(e) => setFindName(e.target.value)}
                  />
                </InputWrapper>
              </InputGroupField>

              <InputGroupField>
                <FieldLabel>휴대폰 번호</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type="tel"
                    placeholder="010-0000-0000"
                    value={findPhone}
                    onChange={(e) => setFindPhone(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroupField>

              <SubmitDarkBtn type="submit" style={{ marginTop: 12 }}>
                이메일 찾기 🔍
              </SubmitDarkBtn>
            </ModalForm>
          </ModalCard>
        </Overlay>
      )}

      {/* ──────── 7. 비밀번호 재설정 모달 (시안 100% 동일) ──────── */}
      {isResetPasswordModalOpen && (
        <Overlay onClick={() => setIsResetPasswordModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BackArrowBtn onClick={() => setIsResetPasswordModalOpen(false)}>←</BackArrowBtn>
              <ModalHeaderTitle>비밀번호 재설정</ModalHeaderTitle>
            </ModalHeader>

            <ResetCircleIconWrap>
              <ResetCircleIcon>🔄</ResetCircleIcon>
            </ResetCircleIconWrap>

            <ResetGuideText>
              보안을 위해 강력한 비밀번호를 선택해주세요.<br />대문자, 숫자, 특수 문자를 포함하는 것이 좋습니다.
            </ResetGuideText>

            <ModalForm onSubmit={handleRunResetPw}>
              <InputGroupField>
                <FieldLabel>새 비밀번호</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type={showResetPw ? 'text' : 'password'}
                    placeholder="비밀번호 입력"
                    value={resetNewPw}
                    onChange={(e) => setResetNewPw(e.target.value)}
                    required
                  />
                  <IconButtonRight type="button" onClick={() => setShowResetPw(!showResetPw)}>
                    {showResetPw ? '👁️' : '🙈'}
                  </IconButtonRight>
                </InputWrapper>
              </InputGroupField>

              {/* 비밀번호 안전 강도 게이지 */}
              <PwStrengthRow>
                <StrengthLabel>비밀번호 보안 강도</StrengthLabel>
                <StrengthBarWrap>
                  <StrengthFill style={{ width: resetNewPw.length > 8 ? '80%' : resetNewPw.length > 4 ? '45%' : '20%', background: resetNewPw.length > 8 ? '#10b981' : '#f59e0b' }} />
                </StrengthBarWrap>
                <StrengthText>{resetNewPw.length > 8 ? '강함' : resetNewPw.length > 4 ? '보통' : '약함'}</StrengthText>
              </PwStrengthRow>

              <InputGroupField>
                <FieldLabel>비밀번호 확인</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type={showResetPw ? 'text' : 'password'}
                    placeholder="비밀번호 재입력"
                    value={resetNewPwConfirm}
                    onChange={(e) => setResetNewPwConfirm(e.target.value)}
                    required
                  />
                  <IconButtonRight type="button" onClick={() => setShowResetPw(!showResetPw)}>
                    {showResetPw ? '👁️' : '🙈'}
                  </IconButtonRight>
                </InputWrapper>
              </InputGroupField>

              <SubmitDarkBtn type="submit" style={{ marginTop: 12 }}>
                비밀번호 재설정 ✓
              </SubmitDarkBtn>
            </ModalForm>
          </ModalCard>
        </Overlay>
      )}

      {/* ──────── 8. 회원가입 축하 모달창 (Celebration Modal) ──────── */}
      {isCelebrationModalOpen && (
        <Overlay onClick={() => setIsCelebrationModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()} style={{ maxWidth: 390, padding: 28 }}>
            <CelebrationModalContent>
              <PopperIcon>🎉</PopperIcon>

              <CelebGraphicBox>
                <CelebImg src={imgLogoFull} alt="축하 로고" />
              </CelebGraphicBox>

              <CelebTitle>회원가입을 축하합니다!</CelebTitle>

              <CelebDesc>
                모여라의 회원이 되신 것을 진심으로 환영합니다.<br />이제 친구들과 함께 즐거운 모임을 만들어보세요!
              </CelebDesc>

              <CelebSubmitDarkBtn type="button" onClick={() => { setIsCelebrationModalOpen(false); navigate('/home'); }}>
                홈으로 가기 ➔
              </CelebSubmitDarkBtn>

              <CelebProfileWhiteBtn type="button" onClick={() => { setIsCelebrationModalOpen(false); navigate('/profile'); }}>
                프로필 설정하기
              </CelebProfileWhiteBtn>
            </CelebrationModalContent>
          </ModalCard>
        </Overlay>
      )}

      {/* ──────── 9. 구글 계정 선택 및 입력 모달창 (Google Account Chooser/Input Modal) ──────── */}
      {isAccountModalOpen && (
        <Overlay onClick={() => setIsAccountModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()} style={{ maxWidth: 360, padding: '24px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <GoogleOfficialGIcon size={32} />
            </div>
            <ModalHeaderTitle style={{ textAlign: 'center', marginBottom: 6 }}>다른 계정 사용</ModalHeaderTitle>
            <ResetGuideText style={{ textAlign: 'center', color: '#6b7280', fontSize: 12, marginBottom: 16 }}>
              사용할 구글 계정 정보를 입력하거나 실제 Google 인증을 진행하세요.
            </ResetGuideText>
            
            <ModalForm onSubmit={(e) => {
              e.preventDefault();
              if (customEmail && customName) {
                handleMockAccountLogin(customName, customEmail, avatarMe);
              }
            }}>
              <InputGroupField>
                <FieldLabel>구글 이메일 주소</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type="email"
                    placeholder="example@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroupField>
              
              <InputGroupField>
                <FieldLabel>이름 (닉네임)</FieldLabel>
                <InputWrapper>
                  <TextInput
                    type="text"
                    placeholder="홍길동"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroupField>

              <SubmitYellowBtn type="submit" style={{ marginTop: 6 }}>
                입력한 계정으로 로그인 (모의)
              </SubmitYellowBtn>
            </ModalForm>

            <DividerLineRow style={{ margin: '14px 0' }}>
              <Line />
              <OrText>또는</OrText>
              <Line />
            </DividerLineRow>

            {/* Real Firebase Google Login Option */}
            <div 
              onClick={() => {
                setIsAccountModalOpen(false);
                handleGoogleLoginStart(true);
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '12px 14px', 
                borderRadius: 12, 
                border: '1px solid #4285f4', 
                background: '#f0f7ff',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e0efff'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f0f7ff'}
            >
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                background: '#4285f4', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 16,
                color: '#fff'
              }}>
                👤+
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>실제 Google 계정으로 로그인</span>
                <span style={{ fontSize: 11, color: '#2563eb' }}>Firebase Auth 연동 로그인</span>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsAccountModalOpen(false)}
              style={{
                marginTop: 12,
                padding: '12px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                color: '#4b5563',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
            >
              닫기
            </button>
          </ModalCard>
        </Overlay>
      )}
    </PageWrapper>
  );
};

// Keyframe Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
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
`;

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 22px 32px;
  min-height: 720px;
  background: linear-gradient(180deg, #ffffff 0%, #fffbf0 60%, #fef3c7 100%);
  animation: ${fadeIn} 0.35s ease-out forwards;
  box-sizing: border-box;
`;

const TopNavHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const BackArrowBtn = styled.button`
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  font-weight: 800;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const HeaderLogoImg = styled.img`
  height: 48px;
  object-fit: contain;
`;

const HeroIconBadge = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin: 10px 0 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
`;

const PageMainTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.4px;
`;

const PageSubTitle = styled.p`
  margin: 6px 0 20px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
`;

const SocialMembersCard = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  border: 1px solid #fef08a;
  box-sizing: border-box;
`;

const AvatarCluster = styled.div`
  display: flex;
  align-items: center;
`;

const ClusterImg = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  object-fit: cover;
`;

const MemberCountPill = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #854d0e;
  background: #fef9c3;
  padding: 4px 12px;
  border-radius: 20px;
`;

const PrimaryKakaoBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: #fee500;
  color: #191919;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(254, 229, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const OtherMethodsSection = styled.div`
  width: 100%;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const SectionDividerText = styled.span`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
`;

const MethodRowGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const MethodChipBtn = styled.button`
  flex: 1;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #f9fafb;
    border-color: #cbd5e1;
  }
`;

const FooterLinksRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
`;

const FooterLinkBtn = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 700;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    color: #111827;
    text-decoration: underline;
  }
`;

const FooterDotDivider = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const LegalFooterText = styled.p`
  margin-top: auto;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.4;
`;

const FormCard = styled.form`
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
`;

const InputGroupField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #4b5563;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconPrefix = styled.span`
  position: absolute;
  left: 12px;
  font-size: 15px;
`;

const IconSuffix = styled.span`
  position: absolute;
  right: 12px;
  font-size: 15px;
  color: #9ca3af;
`;

const IconButtonRight = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 13px 14px;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  font-size: 14px;
  outline: none;
  background: #f8fafc;
  color: #1e293b;
  box-sizing: border-box;

  &:focus {
    border-color: #fedd13;
    background: #ffffff;
  }
`;

const RightLinkBtn = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #111827;
    text-decoration: underline;
  }
`;

const SubmitYellowBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: #fedd13;
  color: #111827;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.4);
`;

const SubmitDarkBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: #1f2937;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(31, 41, 55, 0.3);
`;

const DividerLineRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 14px;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: #e2e8f0;
`;

const OrText = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const BottomSignupPrompt = styled.p`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SignupHighlightLink = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 800;
  color: #ec4899;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const GoogleAuthBoxCard = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
`;

const GoogleBoxTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1f2937;
`;

const GoogleBoxSub = styled.p`
  margin: 0;
  font-size: 12px;
  color: #6b7280;
`;

const GoogleAccountPill = styled.div`
  width: 100%;
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
`;

const PillAvatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
`;

const PillMeta = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 13px;
    color: #1e293b;
  }

  span {
    font-size: 11px;
    color: #64748b;
  }
`;

const OtherAccountBtn = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
`;

const GoogleSubmitBlackBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const GoogleFooterLinks = styled.div`
  margin-top: auto;
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LangSelect = styled.span`
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin: 4px 0;
`;

const CheckIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: transparent;

  &.checked {
    background: #4285f4;
    border-color: #4285f4;
    color: #ffffff;
  }
`;

const CheckboxText = styled.span`
  font-size: 12px;
  color: #4b5563;
  font-weight: 600;
`;

const TroubleActionCard = styled.div`
  width: 100%;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 14px;
  box-sizing: border-box;
`;

const TroubleHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardIconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  color: #1f2937;
`;

const CardBadgeTag = styled.span`
  font-size: 10px;
  font-weight: 800;
  background: #1f2937;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 10px;
`;

const TroubleCardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
`;

const TroubleCardDesc = styled.p`
  margin: 0;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.4;
`;

const TroubleCardBtn = styled.button`
  align-self: flex-end;
  padding: 8px 16px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

const DashedInfoBlueBox = styled.div`
  width: 100%;
  background: #eff6ff;
  border: 1.5px dashed #bfdbfe;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  box-sizing: border-box;
  margin-bottom: 16px;
`;

const InfoIcon = styled.span`
  font-size: 16px;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 11.5px;
  color: #1e40af;
  line-height: 1.45;
  font-weight: 600;
`;

const BottomGraphicBanner = styled.div`
  width: 100%;
  height: 90px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-top: auto;
`;

const BannerGraphicCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fedd13;
  box-shadow: 0 4px 10px rgba(254, 221, 19, 0.4);
`;

const BannerGraphicText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`;

// Celebration Modal Component inside Modal Overlay
const CelebrationModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const PopperIcon = styled.div`
  font-size: 44px;
`;

const CelebGraphicBox = styled.div`
  width: 130px;
  height: 80px;
  background: #fef9c3;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1.5px solid #fef08a;
`;

const CelebImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CelebTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #1f2937;
`;

const CelebDesc = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
`;

const CelebSubmitDarkBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.3);
`;

const CelebProfileWhiteBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #ffffff;
  color: #374151;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

// Modals
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
  max-width: 380px;
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModalHeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const YellowFindBanner = styled.div`
  background: #fedd13;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
`;

const BannerBadgeTag = styled.span`
  align-self: flex-end;
  font-size: 10px;
  font-weight: 800;
  background: #000000;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 8px;
`;

const BannerTitle = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const BannerDesc = styled.p`
  margin: 0;
  font-size: 11.5px;
  color: #374151;
  line-height: 1.4;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResetCircleIconWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0 4px;
`;

const ResetCircleIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fbcfe8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #be185d;
`;

const ResetGuideText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #4b5563;
  text-align: center;
  line-height: 1.45;
`;

const PwStrengthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -2px 0 4px;
`;

const StrengthLabel = styled.span`
  font-size: 11px;
  color: #6b7280;
`;

const StrengthBarWrap = styled.div`
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  transition: width 0.3s ease, background 0.3s ease;
`;

const StrengthText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
`;
