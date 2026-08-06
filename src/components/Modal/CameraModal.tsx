import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';
import receiptScanPreview from '../../assets/receipt_scan_preview.png';

type ScanMode = 'qr' | 'ocr' | 'gallery';

interface ScanResultData {
  storeName: string;
  amount: number;
  date: string;
  items: { name: string; price: number }[];
}

export const CameraModal: React.FC = () => {
  const { setCameraOpen, addSettlement } = useAppContext();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ScanMode>('qr');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // 시뮬레이션 및 업로드 상태
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // 결과 및 서브 모달 상태
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 수동 입력 폼 상태
  const [manualTitle, setManualTitle] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualCategory, setManualCategory] = useState('식비/모임');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 오디오 비프음 생성 (Web Audio API)
  const playBeepSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      console.log('Audio Context Error', e);
    }
  };

  // 실시간 카메라 스트림 제어
  const startCamera = async () => {
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('이 브라우저는 카메라 스트리밍을 지원하지 않습니다.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('카메라 스트림 시작 실패 (시뮬레이션 모드로 작동합니다):', err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeTab !== 'gallery') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraFacing, activeTab]);

  // 플래시 토글 제어
  const toggleFlashlight = () => {
    const nextState = !flashlightOn;
    setFlashlightOn(nextState);

    // 실제 토치(Torch) 지원 단말 처리
    if (mediaStreamRef.current) {
      const track = mediaStreamRef.current.getVideoTracks()[0];
      if (track && typeof track.applyConstraints === 'function') {
        const capabilities = track.getCapabilities ? track.getCapabilities() : {};
        if ((capabilities as any).torch) {
          track.applyConstraints({ advanced: [{ torch: nextState }] } as any).catch(() => {});
        }
      }
    }
  };

  // 카메라 전/후면 전환
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // 스캔 실행 / 인식 시뮬레이션
  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    playBeepSound();

    setTimeout(() => {
      setIsScanning(false);
      // Mock 스캔 결과 할당
      const sampleResults: ScanResultData[] = [
        {
          storeName: '스타벅스 성수역점',
          amount: 18500,
          date: '2026.08.05 14:30',
          items: [
            { name: '카페 라떼 (Tall)', price: 5000 },
            { name: '자몽 허니 블랙티 (Grande)', price: 6700 },
            { name: '부드러운 생크림 카스테라', price: 6800 }
          ]
        },
        {
          storeName: '맛있는 한식 밥상',
          amount: 36000,
          date: '2026.08.05 12:15',
          items: [
            { name: '제육 볶음 정식 x2', price: 24000 },
            { name: '해물 파전', price: 12000 }
          ]
        },
        {
          storeName: '보드게임 카페 홀릭',
          amount: 24000,
          date: '2026.08.04 19:00',
          items: [
            { name: '3시간 이용권 (3인)', price: 18000 },
            { name: '음료 이용권', price: 6000 }
          ]
        }
      ];

      const result = sampleResults[Math.floor(Math.random() * sampleResults.length)];
      setScanResult(result);
    }, 1500);
  };

  // 갤러리 파일 입력 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        handleTriggerScan();
      };
      reader.readAsDataURL(file);
    }
  };

  // 인식된 영수증 결과를 정산 목록에 반영
  const handleConfirmResult = () => {
    if (!scanResult) return;
    addSettlement(scanResult.storeName, scanResult.amount, '1/N 영수증 정산');
    showToast(`'${scanResult.storeName}' ₩${scanResult.amount.toLocaleString()} 정산 내역이 추가되었습니다!`, 'success');
    setScanResult(null);
    setCameraOpen(false);
  };

  // 직접 입력 제출
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) {
      showToast('가게 또는 항목 이름을 입력해주세요.', 'error');
      return;
    }
    const numAmount = parseInt(manualAmount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('올바른 금액을 입력해주세요.', 'error');
      return;
    }

    addSettlement(manualTitle.trim(), numAmount, manualCategory);
    showToast(`'${manualTitle.trim()}' ₩${numAmount.toLocaleString()} 정산이 추가되었습니다.`, 'success');
    setIsManualInputOpen(false);
    setCameraOpen(false);
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseInt(manualAmount.replace(/[^0-9]/g, ''), 10) || 0;
    setManualAmount((current + addValue).toString());
  };

  return (
    <ModalBackdrop onClick={() => setCameraOpen(false)}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHead>
          <ModalHeadLeft>
            <ModalTitle>영수증 QR 스캔</ModalTitle>
            {isCameraActive && <LiveBadge>LIVE</LiveBadge>}
          </ModalHeadLeft>
          <CloseBtn onClick={() => setCameraOpen(false)} aria-label="닫기">
            <i className="fa-solid fa-xmark" style={{ fontSize: '18px' }}></i>
          </CloseBtn>
        </ModalHead>

        {/* 탭 네비게이션 */}
        <TabContainer>
          <TabBtn 
            className={activeTab === 'qr' ? 'active' : ''} 
            onClick={() => { setActiveTab('qr'); setUploadedImage(null); }}
          >
            <i className="fa-solid fa-qrcode"></i>&nbsp;QR 스캔
          </TabBtn>
          <TabBtn 
            className={activeTab === 'ocr' ? 'active' : ''} 
            onClick={() => { setActiveTab('ocr'); setUploadedImage(null); }}
          >
            <i className="fa-solid fa-receipt"></i>&nbsp;영수증 촬영
          </TabBtn>
          <TabBtn 
            className={activeTab === 'gallery' ? 'active' : ''} 
            onClick={() => { setActiveTab('gallery'); fileInputRef.current?.click(); }}
          >
            <i className="fa-solid fa-image"></i>&nbsp;갤러리
          </TabBtn>
        </TabContainer>

        {/* hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />

        {/* 카메라 프리뷰 뷰파인더 */}
        <CameraPreview className={`${activeTab} ${flashlightOn ? 'flashlight-glow' : ''}`}>
          {/* 비디오 스트림 or 이미지 프리뷰 */}
          {activeTab === 'gallery' && uploadedImage ? (
            <PreviewImage src={uploadedImage} alt="갤러리 선택 영수증" />
          ) : isCameraActive ? (
            <StyledVideo ref={videoRef} autoPlay playsInline muted />
          ) : (
            <PreviewImage src={receiptScanPreview} alt="영수증 스캔 시뮬레이션 프리뷰" />
          )}

          {/* 스캔 프레임 레이아웃 */}
          <ScanFrameArea className={activeTab}>
            <ScanBracket className="tl" />
            <ScanBracket className="tr" />
            <ScanBracket className="bl" />
            <ScanBracket className="br" />
            <LaserSweepLine className={isScanning ? 'scanning' : ''} />
          </ScanFrameArea>

          {/* 조명 밝기 오버레이 스크린 */}
          {flashlightOn && <FlashlightOverlay />}

          {/* 카메라 모드 퀵 컨트롤 (카메라 전환 / 수동 스캔 버튼) */}
          <PreviewControls>
            {activeTab !== 'gallery' && (
              <ControlCircleBtn onClick={toggleCameraFacing} title="카메라 전환">
                <i className="fa-solid fa-camera-rotate"></i>
              </ControlCircleBtn>
            )}

            <ScanActionBtn onClick={handleTriggerScan} disabled={isScanning}>
              {isScanning ? (
                <>
                  <SpinnerIcon /> 스캐닝...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt"></i> 스캔 실행
                </>
              )}
            </ScanActionBtn>
          </PreviewControls>
        </CameraPreview>

        {/* 안내 텍스트 */}
        <CameraGuide>
          {activeTab === 'qr' && '영수증의 QR코드를 사각 틀 안에 맞춰주세요.'}
          {activeTab === 'ocr' && '영수증 전체가 프레임에 들어가도록 촬영해주세요.'}
          {activeTab === 'gallery' && (uploadedImage ? '선택한 이미지를 스캔 중입니다.' : '갤러리에서 영수증 이미지를 선택하세요.')}
        </CameraGuide>

        {/* 하단 툴바 버튼군 */}
        <ToolbarRow>
          {/* 손전등 토글 */}
          <FlashlightBtn 
            className={flashlightOn ? 'is-on' : ''} 
            onClick={toggleFlashlight}
            aria-label="손전등 토글"
            title="손전등 켜기/끄기"
          >
            <i className="fa-solid fa-lightbulb" style={{ fontSize: '18px' }}></i>
          </FlashlightBtn>

          {/* 직접 입력하기 */}
          <ManualInputBtn onClick={() => setIsManualInputOpen(true)}>
            ✏️&nbsp; 직접 입력하기
          </ManualInputBtn>
        </ToolbarRow>

        {/* 도움말 링크 */}
        <HelpLink onClick={() => setIsHelpOpen(true)}>
          <i className="fa-regular fa-circle-question"></i>&nbsp;QR 스캔에 문제가 있나요?
        </HelpLink>

        {/* 브랜드 포인트 스트립 */}
        <BrandStrip>
          <StripYellow />
          <StripPink />
          <StripBlue />
        </BrandStrip>

        {/* ========================================================================= */}
        {/* SUB MODALS & SHEETS */}
        {/* ========================================================================= */}

        {/* 1. 영수증 스캔 결과 확인 시트 */}
        {scanResult && (
          <SheetOverlay onClick={() => setScanResult(null)}>
            <ResultSheetCard onClick={(e) => e.stopPropagation()}>
              <SheetHandle />
              <ResultHead>
                <ResultIconBadge>🧾</ResultIconBadge>
                <div>
                  <ResultTitle>영수증 인식 완료!</ResultTitle>
                  <ResultSub>{scanResult.date}</ResultSub>
                </div>
              </ResultHead>

              <ResultMainBox>
                <ResultStoreName>{scanResult.storeName}</ResultStoreName>
                <ResultTotalAmount>₩{scanResult.amount.toLocaleString()}</ResultTotalAmount>
                <Divider />
                <ItemList>
                  {scanResult.items.map((item, idx) => (
                    <ItemRow key={idx}>
                      <span>{item.name}</span>
                      <span>₩{item.price.toLocaleString()}</span>
                    </ItemRow>
                  ))}
                </ItemList>
              </ResultMainBox>

              <ResultBtnRow>
                <SecondaryBtn onClick={() => setScanResult(null)}>다시 스캔</SecondaryBtn>
                <PrimaryBtn onClick={handleConfirmResult}>정산에 반영하기</PrimaryBtn>
              </ResultBtnRow>
            </ResultSheetCard>
          </SheetOverlay>
        )}

        {/* 2. 직접 입력 시트 */}
        {isManualInputOpen && (
          <SheetOverlay onClick={() => setIsManualInputOpen(false)}>
            <InputSheetCard onClick={(e) => e.stopPropagation()}>
              <SheetHandle />
              <SheetHeaderRow>
                <SheetHeaderTitle>영수증 직접 입력</SheetHeaderTitle>
                <CloseBtn onClick={() => setIsManualInputOpen(false)} aria-label="닫기">
                  <i className="fa-solid fa-xmark"></i>
                </CloseBtn>
              </SheetHeaderRow>

              <FormContainer onSubmit={handleManualSubmit}>
                <FormGroup>
                  <FormLabel>가게 또는 항목명</FormLabel>
                  <FormInput 
                    type="text"
                    placeholder="예: 스타벅스 강남점, 삼겹살 회식"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    autoFocus
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>정산 총 금액 (원)</FormLabel>
                  <FormInput 
                    type="text"
                    placeholder="0"
                    value={manualAmount ? parseInt(manualAmount, 10).toLocaleString() : ''}
                    onChange={(e) => setManualAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                  <QuickAmountRow>
                    <ChipBtn type="button" onClick={() => handleQuickAddAmount(10000)}>+1만원</ChipBtn>
                    <ChipBtn type="button" onClick={() => handleQuickAddAmount(30000)}>+3만원</ChipBtn>
                    <ChipBtn type="button" onClick={() => handleQuickAddAmount(50000)}>+5만원</ChipBtn>
                    <ChipBtn type="button" onClick={() => handleQuickAddAmount(100000)}>+10만원</ChipBtn>
                  </QuickAmountRow>
                </FormGroup>

                <FormGroup>
                  <FormLabel>카테고리</FormLabel>
                  <CategoryChipsRow>
                    {['식비/모임', '카페/디저트', '대관비', '1/N 정산'].map((cat) => (
                      <CategoryChip 
                        key={cat}
                        type="button"
                        className={manualCategory === cat ? 'selected' : ''}
                        onClick={() => setManualCategory(cat)}
                      >
                        {cat}
                      </CategoryChip>
                    ))}
                  </CategoryChipsRow>
                </FormGroup>

                <SubmitFormBtn type="submit">
                  정산 목록에 추가하기
                </SubmitFormBtn>
              </FormContainer>
            </InputSheetCard>
          </SheetOverlay>
        )}

        {/* 3. 도움말 가이드 시트 */}
        {isHelpOpen && (
          <SheetOverlay onClick={() => setIsHelpOpen(false)}>
            <HelpSheetCard onClick={(e) => e.stopPropagation()}>
              <SheetHandle />
              <SheetHeaderRow>
                <SheetHeaderTitle>QR 스캔 도움말</SheetHeaderTitle>
                <CloseBtn onClick={() => setIsHelpOpen(false)} aria-label="닫기">
                  <i className="fa-solid fa-xmark"></i>
                </CloseBtn>
              </SheetHeaderRow>

              <HelpGuideList>
                <HelpGuideItem>
                  <HelpIcon>💡</HelpIcon>
                  <div>
                    <HelpItemTitle>조명이 어두우신가요?</HelpItemTitle>
                    <HelpItemDesc>하단의 손전등 아이콘을 눌러 조명을 켜거나 카메라 위치를 맞춰주세요.</HelpItemDesc>
                  </div>
                </HelpGuideItem>
                <HelpGuideItem>
                  <HelpIcon>📜</HelpIcon>
                  <div>
                    <HelpItemTitle>구겨진 영수증 펴기</HelpItemTitle>
                    <HelpItemDesc>영수증 QR코드가 접혀있거나 구겨진 경우 인식이 어려울 수 있습니다.</HelpItemDesc>
                  </div>
                </HelpGuideItem>
                <HelpGuideItem>
                  <HelpIcon>🖼️</HelpIcon>
                  <div>
                    <HelpItemTitle>갤러리 업로드 이용</HelpItemTitle>
                    <HelpItemDesc>상단 '갤러리' 탭에서 찍어둔 영수증 이미지 파일을 불러와 스캔할 수 있습니다.</HelpItemDesc>
                  </div>
                </HelpGuideItem>
                <HelpGuideItem>
                  <HelpIcon>✏️</HelpIcon>
                  <div>
                    <HelpItemTitle>직접 입력 기능 활용</HelpItemTitle>
                    <HelpItemDesc>인식이 지속 실패할 경우 [직접 입력하기] 버튼으로 손쉽게 등록하세요.</HelpItemDesc>
                  </div>
                </HelpGuideItem>
              </HelpGuideList>

              <PrimaryBtn style={{ width: '100%', marginTop: '16px' }} onClick={() => setIsHelpOpen(false)}>
                확인했습니다
              </PrimaryBtn>
            </HelpSheetCard>
          </SheetOverlay>
        )}

      </ModalCard>
    </ModalBackdrop>
  );
};

// =============================================================================
// Animations
// =============================================================================
const backdropFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const cardScaleIn = keyframes`
  from { transform: scale(0.93) translateY(12px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
`;

const laserSweep = keyframes`
  0% { top: 6%; opacity: 0.9; }
  50% { top: 88%; opacity: 1; }
  100% { top: 6%; opacity: 0.9; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
`;

const rotateSpinner = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const slideSheetUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

// =============================================================================
// Styled Components
// =============================================================================
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  animation: ${backdropFadeIn} 0.22s ease forwards;
`;

const ModalCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: 32px;
  padding: 22px 22px 0 22px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${cardScaleIn} 0.25s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
`;

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalHeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const LiveBadge = styled.span`
  background: #FF3B30;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 6px;
  letter-spacing: 0.5px;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #F0F0F2;
  color: ${({ theme }) => theme.colors.text};
  transition: background 0.15s ease;

  &:hover {
    background: #E4E4E8;
  }
`;

const TabContainer = styled.div`
  display: flex;
  background: #F0F0F3;
  padding: 4px;
  border-radius: 16px;
  gap: 4px;
`;

const TabBtn = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #71717A;
  background: transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background: #FFFFFF;
    color: #18181B;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const CameraPreview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1.15 / 1;
  border-radius: 24px;
  overflow: hidden;
  background: #09090B;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
  transition: aspect-ratio 0.3s ease;

  &.ocr {
    aspect-ratio: 1.3 / 1;
  }

  &.flashlight-glow::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
    z-index: 5;
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ScanFrameArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 68%;
  height: 68%;
  transition: all 0.3s ease;

  &.ocr {
    width: 84%;
    height: 60%;
  }
`;

const ScanBracket = styled.span`
  position: absolute;
  width: 26px;
  height: 26px;
  border: 3.5px solid #FFBE1A;
  border-radius: 6px;
  z-index: 4;

  &.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
  &.tr { top: 0; right: 0; border-left: none; border-bottom: none; }
  &.bl { bottom: 0; left: 0; border-right: none; border-top: none; }
  &.br { bottom: 0; right: 0; border-left: none; border-top: none; }
`;

const LaserSweepLine = styled.div`
  position: absolute;
  left: 2px;
  right: 2px;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #FFBE1A 30%, #F491BC 70%, transparent 100%);
  box-shadow: 0 0 12px #FFBE1A, 0 0 20px #F491BC;
  border-radius: 2px;
  animation: ${laserSweep} 2.2s ease-in-out infinite;
  z-index: 3;

  &.scanning {
    animation-duration: 0.8s;
  }
`;

const FlashlightOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 254, 230, 0.15);
  pointer-events: none;
  z-index: 2;
  animation: ${pulseGlow} 2s infinite ease-in-out;
`;

const PreviewControls = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
`;

const ControlCircleBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.92);
  }
`;

const ScanActionBtn = styled.button`
  margin-left: auto;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 190, 26, 0.9);
  color: #18181B;
  font-size: 13px;
  font-weight: 800;
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const SpinnerIcon = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid #18181B;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${rotateSpinner} 0.8s linear infinite;
`;

const CameraGuide = styled.p`
  text-align: center;
  font-size: 14.5px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  margin: 0;
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FlashlightBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 18px;
  background: #F0F0F2;
  color: #1C1C1E;
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &.is-on {
    background: ${({ theme }) => theme.colors.yellow};
    color: ${({ theme }) => theme.colors.black};
    box-shadow: 0 4px 16px rgba(255, 190, 26, 0.45);
  }
`;

const ManualInputBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 16px;
  background: #18181B;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14.5px;
  font-weight: 700;
  border-radius: 18px;
  box-shadow: 0 4px 14px rgba(24, 24, 27, 0.2);
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

const HelpLink = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
  margin: 0 auto 6px;
`;

const BrandStrip = styled.div`
  display: flex;
  margin-left: -22px;
  margin-right: -22px;
  margin-top: auto;
  height: 8px;
  flex-shrink: 0;
`;

const StripYellow = styled.span`
  flex: 1;
  background: ${({ theme }) => theme.colors.yellow};
`;

const StripPink = styled.span`
  flex: 1;
  background: ${({ theme }) => theme.colors.pink};
`;

const StripBlue = styled.span`
  flex: 1;
  background: ${({ theme }) => theme.colors.blue};
`;

// =============================================================================
// SUB SHEETS & MODALS STYLED COMPONENTS
// =============================================================================
const SheetOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  border-radius: 32px;
  overflow: hidden;
  animation: ${backdropFadeIn} 0.2s ease forwards;
`;

const SheetCardBase = styled.div`
  width: 100%;
  background: #FFFFFF;
  border-radius: 28px 28px 0 0;
  padding: 16px 20px 24px 20px;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2);
  animation: ${slideSheetUp} 0.25s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
`;

const ResultSheetCard = styled(SheetCardBase)`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const InputSheetCard = styled(SheetCardBase)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HelpSheetCard = styled(SheetCardBase)`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SheetHandle = styled.div`
  width: 38px;
  height: 4px;
  background: #E4E4E7;
  border-radius: 2px;
  margin: 0 auto 4px auto;
`;

const SheetHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SheetHeaderTitle = styled.h4`
  font-size: 16px;
  font-weight: 800;
  color: #18181B;
  margin: 0;
`;

const ResultHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ResultIconBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #FEF3C7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;

const ResultTitle = styled.h4`
  font-size: 16px;
  font-weight: 800;
  color: #18181B;
  margin: 0;
`;

const ResultSub = styled.span`
  font-size: 12px;
  color: #71717A;
  font-weight: 600;
`;

const ResultMainBox = styled.div`
  background: #F4F4F5;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ResultStoreName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #52525B;
`;

const ResultTotalAmount = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: #18181B;
  margin-top: 2px;
`;

const Divider = styled.div`
  height: 1px;
  background: #E4E4E7;
  margin: 12px 0;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #3F3F46;
`;

const ResultBtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const PrimaryBtn = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 16px;
  background: #FEDD13;
  color: #18181B;
  font-size: 14.5px;
  font-weight: 800;
  border: none;
  box-shadow: 0 4px 12px rgba(254, 221, 19, 0.4);
`;

const SecondaryBtn = styled.button`
  padding: 14px 18px;
  border-radius: 16px;
  background: #F4F4F5;
  color: #3F3F46;
  font-size: 14px;
  font-weight: 700;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-size: 12.5px;
  font-weight: 700;
  color: #52525B;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1.5px solid #E4E4E7;
  font-size: 14.5px;
  font-weight: 700;
  color: #18181B;
  outline: none;

  &:focus {
    border-color: #FEDD13;
  }
`;

const QuickAmountRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`;

const ChipBtn = styled.button`
  padding: 6px 10px;
  border-radius: 10px;
  background: #F4F4F5;
  font-size: 12px;
  font-weight: 700;
  color: #52525B;
`;

const CategoryChipsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const CategoryChip = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  background: #F4F4F5;
  font-size: 12.5px;
  font-weight: 700;
  color: #71717A;

  &.selected {
    background: #18181B;
    color: #FEDD13;
  }
`;

const SubmitFormBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  background: #18181B;
  color: #FEDD13;
  font-size: 15px;
  font-weight: 800;
  margin-top: 6px;
`;

const HelpGuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
`;

const HelpGuideItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #F4F4F5;
  padding: 12px 14px;
  border-radius: 16px;
`;

const HelpIcon = styled.span`
  font-size: 20px;
`;

const HelpItemTitle = styled.div`
  font-size: 13.5px;
  font-weight: 800;
  color: #18181B;
`;

const HelpItemDesc = styled.div`
  font-size: 12px;
  color: #71717A;
  margin-top: 2px;
  line-height: 1.35;
`;
