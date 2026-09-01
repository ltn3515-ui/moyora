import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';

interface GoogleMapViewProps {
  locationName: string;
  address?: string;
  lat?: number;
  lng?: number;
  height?: string;
  zoom?: number;
  showControls?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  onSelectLocation?: (placeName: string, address: string) => void;
}

const POPULAR_SPOTS = [
  { name: '성수 리필스테이션 파크', address: '서울 성동구 연무장길 12' },
  { name: '싸다김밥 뚝섬역점', address: '대한민국 서울특별시 성동구 아차산로 46' },
  { name: '성수동 카페거리', address: '서울특별시 성동구 성수이로 78' },
  { name: '소문난 성수 감자탕', address: '서울특별시 성동구 연무장길 45' },
  { name: '블루보틀 강남 카페', address: '서울특별시 강남구 테헤란로 129' },
  { name: '여의도 한강공원 여의나루역', address: '서울특별시 영등포구 여의동로 330' },
  { name: '남산타워 팔각정 광장', address: '서울 용산구 남산공원길 105' },
  { name: '인사동 아라아트센터', address: '서울 종로구 인사동9길 26' },
  { name: '홍대 연남동 경의선 숲길', address: '서울특별시 마포구 연남동 242-1' },
];

const NEARBY_MAP_PINS = [
  { id: 'pin-01', name: '성수 리필스테이션 파크', address: '서울 성동구 연무장길 12', top: '48%', left: '40%' },
  { id: 'pin-02', name: '싸다김밥 뚝섬역점', address: '대한민국 서울특별시 성동구 아차산로 46', top: '25%', left: '44%' },
  { id: 'pin-03', name: '소문난 성수 감자탕', address: '서울특별시 성동구 연무장길 45', top: '58%', left: '56%' },
  { id: 'pin-04', name: '올리브영 N 성수', address: '서울특별시 성동구 아차산로 13', top: '68%', left: '82%' },
  { id: 'pin-05', name: '성수근린공원', address: '서울특별시 성동구 성수동2가 273-35', top: '60%', left: '46%' },
  { id: 'pin-06', name: '일미락 성수점', address: '서울특별시 성동구 상원1길 224', top: '30%', left: '62%' }
];

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  locationName,
  address,
  lat,
  lng,
  height = '260px',
  zoom: initialZoom = 15,
  showControls = true,
  showSearch = false,
  onSearch,
  onSelectLocation
}) => {
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' = Roadmap, 'k' = Satellite
  const [zoomLevel, setZoomLevel] = useState<number>(initialZoom);
  const [searchInput, setSearchInput] = useState<string>('');
  const [modalSearchInput, setModalSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);

  // 모달 안에서 활성화된 선택 장소
  const [activeLocName, setActiveLocName] = useState<string>(locationName);
  const [activeAddr, setActiveAddr] = useState<string>(address || '');
  const [showZoomGuideTooltip, setShowZoomGuideTooltip] = useState<boolean>(true);

  const { showToast } = useToast();

  // Props 업데이트 시 내부 state 갱신
  React.useEffect(() => {
    setActiveLocName(locationName);
    if (address) setActiveAddr(address);
  }, [locationName, address]);

  // Construct search query for Google Maps
  const currentQuery = activeLocName
    ? (activeAddr ? `${activeAddr} (${activeLocName})` : activeLocName)
    : (lat && lng ? `${lat},${lng}` : locationName);

  const encodedQuery = encodeURIComponent(currentQuery);
  const embedUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 3));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleModalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalSearchInput.trim()) {
      setActiveLocName(modalSearchInput.trim());
      setActiveAddr(`검색된 장소: ${modalSearchInput.trim()}`);
      setModalSearchInput('');
      showToast(`'${modalSearchInput.trim()}' 장소 위치를 불러왔습니다! 🗺️`, 'info', '🗺️');
    }
  };

  const handleSpotSelect = (spot: { name: string; address: string }) => {
    setActiveLocName(spot.name);
    setActiveAddr(spot.address);
    showToast(`'${spot.name}' 장소가 선택되었습니다! 📍`, 'info', '📍');
  };

  const handleConfirmLocationSelect = () => {
    if (onSelectLocation) {
      onSelectLocation(activeLocName, activeAddr);
    }
    showToast(`장소 '${activeLocName}'(으)로 선택 완료되었습니다! 📍`, 'success', '📍');
    setIsMobileModalOpen(false);
  };

  const handleCopyAddress = () => {
    const textToCopy = activeAddr ? `${activeLocName} (${activeAddr})` : activeLocName;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('주소가 클립보드에 복사되었습니다! 📋', 'success', '📋');
    }).catch(() => {
      showToast('주소 복사에 실패했습니다.', 'error');
    });
  };

  const handleOpenMapModal = () => {
    setActiveLocName(locationName);
    if (address) setActiveAddr(address);
    setIsMobileModalOpen(true);
  };

  return (
    <>
      <MapWrapper style={{ height }}>
        {/* 검색 바 (옵션) */}
        {showSearch && (
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="구글 지도 장소/주소 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <SearchBtn type="submit">검색</SearchBtn>
          </SearchForm>
        )}

        {/* Google Maps 배지 & 컨트롤 바 */}
        <MapHeaderBar>
          <GoogleBadge onClick={handleOpenMapModal} title="모달로 지도 크게 보기 & 장소 선택">
            <GoogleGLogo viewBox="0 0 24 24" width="14" height="14">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </GoogleGLogo>
            <BadgeText>Google Maps</BadgeText>
            <LiveDot title="실시간 구글 지도 연동 중" />
          </GoogleBadge>

          <HeaderControls>
            {/* 지도 버튼 - 클릭 시 지도 모달 오픈 */}
            <TypeToggleBtn
              type="button"
              className={mapType === 'm' ? 'active' : ''}
              onClick={handleOpenMapModal}
              title="클릭하여 지도 모달 열기 및 장소 선택"
            >
              🗺️ 지도 (모달)
            </TypeToggleBtn>
            <TypeToggleBtn
              type="button"
              className={mapType === 'k' ? 'active' : ''}
              onClick={() => setMapType((prev) => (prev === 'k' ? 'm' : 'k'))}
              title="위성 모드 전환"
            >
              위성
            </TypeToggleBtn>

            {/* 모바일 지도 보기 버튼 */}
            <MobileExpandBtn
              type="button"
              onClick={handleOpenMapModal}
              title="모달 모드로 지도 확대 및 장소 선택"
            >
              📱 지도 모달
            </MobileExpandBtn>

            {/* 외부 구글 지도 / 길찾기 링크 */}
            <ExternalLinkHref
              href={externalMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="구글 지도 앱에서 길찾기 및 상세보기"
            >
              📍 길찾기 ↗
            </ExternalLinkHref>
          </HeaderControls>
        </MapHeaderBar>

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <LoadingOverlay>
            <LoadingSpinner />
            <LoadingText>구글 지도 로딩 중...</LoadingText>
          </LoadingOverlay>
        )}

        {/* 클릭 가능한 모바일 확대 클릭 힌트 배지 */}
        <MapClickOverlayHint onClick={handleOpenMapModal} title="클릭하여 모달로 크게 보기 & 장소 선택">
          <span>📱 지도 클릭 시 모달 오픈 · 손가락 줌 / +,- 로 확대 가능</span>
          <ExpandArrow>↗</ExpandArrow>
        </MapClickOverlayHint>

        {/* 구글 지도 프레임 */}
        <MapFrame
          src={embedUrl}
          title={`Google Map - ${activeLocName}`}
          onLoad={() => setIsLoading(false)}
        />

        {/* 오버레이 줌 컨트롤 & 장소 태그 */}
        {showControls && (
          <>
            <ZoomControlGroup>
              <ZoomBtn type="button" onClick={handleZoomIn} title="확대">+</ZoomBtn>
              <ZoomDivider />
              <ZoomBtn type="button" onClick={handleZoomOut} title="축소">-</ZoomBtn>
            </ZoomControlGroup>

            <LocationPill onClick={handleOpenMapModal} title="클릭 시 지도 모달 열기">
              <PillIcon>📍</PillIcon>
              <PillInfo>
                <PillTitle>{activeLocName} <ClickNoticeBadge>지도 모달 ↗</ClickNoticeBadge></PillTitle>
                {activeAddr && <PillAddress>{activeAddr}</PillAddress>}
              </PillInfo>
            </LocationPill>
          </>
        )}
      </MapWrapper>

      {/* 🗺️ 지도 팝업 모달 & 장소 선택기 */}
      {isMobileModalOpen && (
        <MobileModalOverlay onClick={() => setIsMobileModalOpen(false)}>
          <MobileModalCard onClick={(e) => e.stopPropagation()}>
            <MobileTopHeaderBar>
              <MobileHeaderTitleGroup>
                <MobileStatusBadge>🗺️ 구글 지도 & 장소 선택 모달</MobileStatusBadge>
                <MobileLocationName>{activeLocName}</MobileLocationName>
                {activeAddr && <MobileAddressSub>{activeAddr}</MobileAddressSub>}
              </MobileHeaderTitleGroup>
              <MobileCloseBtn onClick={() => setIsMobileModalOpen(false)} aria-label="닫기">✕</MobileCloseBtn>
            </MobileTopHeaderBar>

            {/* 모바일 지도 확대 조작 가이드 안내 팁 바 */}
            <MobileZoomNoticeBanner>
              <NoticeIcon>💡</NoticeIcon>
              <span><strong>모바일 지도 조작 가이드:</strong> 두 손가락 펼치기(Pinch Zoom) 또는 우측 하단 <strong>+ / -</strong> 버튼을 눌러 지도를 확대·축소하세요.</span>
            </MobileZoomNoticeBanner>

            {/* 모달 내부 장소 검색바 */}
            <ModalSearchBox onSubmit={handleModalSearchSubmit}>
              <SearchIcon>🔍</SearchIcon>
              <ModalSearchInput
                type="text"
                placeholder="지도의 원하는 장소/주소 검색..."
                value={modalSearchInput}
                onChange={(e) => setModalSearchInput(e.target.value)}
              />
              <SearchBtn type="submit">검색</SearchBtn>
            </ModalSearchBox>

            {/* 추천 장소 핫 칩 리스트 */}
            <SpotChipScrollRow>
              {POPULAR_SPOTS.map((spot, idx) => (
                <SpotChip
                  key={idx}
                  className={activeLocName === spot.name ? 'active' : ''}
                  onClick={() => handleSpotSelect(spot)}
                >
                  📍 {spot.name}
                </SpotChip>
              ))}
            </SpotChipScrollRow>

            <MobileActionBar>
              <ControlGroupLeft>
                <TypeToggleBtn
                  type="button"
                  className={mapType === 'm' ? 'active' : ''}
                  onClick={() => setMapType('m')}
                >
                  지도
                </TypeToggleBtn>
                <TypeToggleBtn
                  type="button"
                  className={mapType === 'k' ? 'active' : ''}
                  onClick={() => setMapType('k')}
                >
                  위성
                </TypeToggleBtn>
              </ControlGroupLeft>
              <ControlGroupRight>
                <CopyAddrBtn type="button" onClick={handleCopyAddress}>
                  📋 주소 복사
                </CopyAddrBtn>
                <MobileExternalLink
                  href={externalMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📍 길찾기 ↗
                </MobileExternalLink>
              </ControlGroupRight>
            </MobileActionBar>

            <MobileMapContentFrame>
              {/* 구글 지도 iframe */}
              <MapFrame
                src={embedUrl}
                title={`Google Map Modal View - ${activeLocName}`}
              />

              {/* 지도 내 인터랙티브 핀 오버레이 마커들 (지도상 장소 직접 클릭 가능) */}
              <InteractivePinOverlayLayer>
                {NEARBY_MAP_PINS.map((pin) => (
                  <MapPinMarker
                    key={pin.id}
                    style={{ top: pin.top, left: pin.left }}
                    className={activeLocName === pin.name ? 'selected' : ''}
                    onClick={() => handleSpotSelect(pin)}
                    title={`클릭하여 '${pin.name}' 선택하기`}
                  >
                    <PinBubble>
                      <PinIcon>📍</PinIcon>
                      <PinName>{pin.name}</PinName>
                    </PinBubble>
                  </MapPinMarker>
                ))}
              </InteractivePinOverlayLayer>

              {/* 오른쪽 하단 줌 조작 가이드 툴팁 배지 & 줌 컨트롤 */}
              <ZoomGuideControlWrap style={{ bottom: '94px', right: '16px' }}>
                {showZoomGuideTooltip && (
                  <ZoomGuideTooltip onClick={() => setShowZoomGuideTooltip(false)}>
                    <span>🔍 <strong>+ / -</strong>로 지도 확대</span>
                    <TooltipClose>✕</TooltipClose>
                  </ZoomGuideTooltip>
                )}
                <ZoomControlGroupStyle>
                  <ZoomBtn type="button" onClick={handleZoomIn} title="지도 확대">+</ZoomBtn>
                  <ZoomDivider />
                  <ZoomBtn type="button" onClick={handleZoomOut} title="지도 축소">-</ZoomBtn>
                </ZoomControlGroupStyle>
              </ZoomGuideControlWrap>

              {/* 하단 선택 완료 카드 */}
              <MobileBottomPillCard>
                <PillIconLarge>📍</PillIconLarge>
                <MobilePillTextContent>
                  <MobilePillTitle>{activeLocName}</MobilePillTitle>
                  <MobilePillAddr>{activeAddr || '위치 정보를 확인하세요.'}</MobilePillAddr>
                </MobilePillTextContent>
                <SelectConfirmBtn type="button" onClick={handleConfirmLocationSelect}>
                  이 장소 선택 ✨
                </SelectConfirmBtn>
              </MobileBottomPillCard>
            </MobileMapContentFrame>
          </MobileModalCard>
        </MobileModalOverlay>
      )}
    </>
  );
};

// Keyframes for Modal Animation
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px) scale(0.96); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

// Styled Components
const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  background: #eef2f6;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const SearchForm = styled.form`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

const SearchIcon = styled.span`
  font-size: 14px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  outline: none;
  color: #1f2937;
  font-weight: 500;

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchBtn = styled.button`
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #3367d6;
  }
`;

const MapHeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 5;
`;

const GoogleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  padding: 3px 8px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const GoogleGLogo = styled.svg`
  flex-shrink: 0;
`;

const BadgeText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.2px;
`;

const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TypeToggleBtn = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &.active {
    background: #4285f4;
    color: #ffffff;
    border-color: #4285f4;
    box-shadow: 0 1px 4px rgba(66, 133, 244, 0.3);
  }

  &:hover:not(.active) {
    background: #e2e8f0;
  }
`;

const MobileExpandBtn = styled.button`
  background: #fedd13;
  color: #1e293b;
  border: 1px solid #eab308;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 4px rgba(254, 221, 19, 0.35);

  &:hover {
    background: #f5cf00;
    transform: translateY(-1px);
  }
`;

const ExternalLinkHref = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: #dbeafe;
    color: #1e40af;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 36px; left: 0; right: 0; bottom: 0;
  background: rgba(248, 250, 252, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 4;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #4285f4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
`;

const MapClickOverlayHint = styled.div`
  position: absolute;
  top: 44px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(6px);
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(15, 23, 42, 0.95);
    border-color: #fedd13;
    color: #fedd13;
    transform: translateX(-50%) translateY(-2px);
  }
`;

const ExpandArrow = styled.span`
  font-size: 12px;
`;

const MapFrame = styled.iframe`
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
`;

const ZoomControlGroup = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const ZoomBtn = styled.button`
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const ZoomDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  width: 100%;
`;

const LocationPill = styled.div`
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 5;
  max-width: calc(100% - 64px);
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(15, 23, 42, 0.96);
    border-color: #fedd13;
  }
`;

const PillIcon = styled.span`
  font-size: 15px;
`;

const PillInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PillTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ClickNoticeBadge = styled.span`
  font-size: 10px;
  background: #fedd13;
  color: #111827;
  padding: 1px 5px;
  border-radius: 6px;
  font-weight: 800;
`;

const PillAddress = styled.span`
  font-size: 10px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ── 모바일 전용 확장 지도 모달 스타일 ── */
const MobileModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease-out forwards;
`;

const MobileModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  height: 90vh;
  border-radius: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  border: 4px solid #1e293b;
  animation: ${slideUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const MobileTopHeaderBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 12px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
`;

const MobileHeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const MobileStatusBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #1e40af;
  background: #dbeafe;
  padding: 2px 8px;
  border-radius: 12px;
  align-self: flex-start;
`;

const MobileLocationName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const MobileAddressSub = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const MobileCloseBtn = styled.button`
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const MobileActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const ControlGroupLeft = styled.div`
  display: flex;
  gap: 6px;
`;

const ControlGroupRight = styled.div`
  display: flex;
  gap: 6px;
`;

const CopyAddrBtn = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
`;

const MobileExternalLink = styled.a`
  background: #fedd13;
  color: #111827;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(254, 221, 19, 0.35);
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
  }
`;

const MobileMapContentFrame = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background: #e2e8f0;
`;

const MobileBottomPillCard = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 10;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const PillIconLarge = styled.span`
  font-size: 24px;
`;

const MobilePillTextContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const MobilePillTitle = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobilePillAddr = styled.span`
  font-size: 11px;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileBottomCta = styled.a`
  background: #4285f4;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 8px 12px;
  border-radius: 12px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(66, 133, 244, 0.4);
  transition: all 0.15s ease;

  &:hover {
    background: #2b6cb0;
  }
`;

/* ── 장소 검색 & 칩 & 선택 버튼 스타일 ── */
const ModalSearchBox = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalSearchInput = styled.input`
  flex: 1;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 13px;
  outline: none;
  color: #0f172a;
  background: #ffffff;

  &:focus {
    border-color: #4285f4;
  }
`;

const SpotChipScrollRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SpotChip = styled.button`
  flex-shrink: 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &.active {
    background: #fedd13;
    color: #111827;
    border-color: #eab308;
    font-weight: 800;
  }

  &:hover:not(.active) {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }
`;

const SelectConfirmBtn = styled.button`
  background: #fedd13;
  color: #111827;
  font-size: 13px;
  font-weight: 800;
  padding: 8px 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(254, 221, 19, 0.4);
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* ── 모바일 확대 안내 팁 뷰 ── */
const MobileZoomNoticeBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
  padding: 8px 16px;
  font-size: 11.5px;
  color: #1e40af;
  line-height: 1.35;

  strong {
    color: #1d4ed8;
  }
`;

const NoticeIcon = styled.span`
  font-size: 14px;
  flex-shrink: 0;
`;

/* ── 지도 내 인터랙티브 핀 오버레이 레이어 ── */
const InteractivePinOverlayLayer = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none; /* 지도 프레임 기본 스크롤 투과 */
  z-index: 8;
`;

const MapPinMarker = styled.div`
  position: absolute;
  pointer-events: auto; /* 마커 부분만 클릭 이벤트 발생 */
  cursor: pointer;
  transform: translate(-50%, -100%);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translate(-50%, -115%) scale(1.08);
    z-index: 10;
  }

  &.selected {
    transform: translate(-50%, -115%) scale(1.12);
    z-index: 12;
  }
`;

const PinBubble = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(6px);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border: 1.5px solid #ffffff;

  ${MapPinMarker}.selected & {
    background: #1e293b;
    border-color: #fedd13;
    box-shadow: 0 0 16px rgba(254, 221, 19, 0.7);
  }
`;

const PinIcon = styled.span`
  font-size: 13px;
`;

const PinName = styled.span`
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;

  ${MapPinMarker}.selected & {
    color: #fedd13;
  }
`;

/* ── 줌 조작 안내 툴팁 및 줌 컨트롤 그룹 ── */
const ZoomGuideControlWrap = styled.div`
  position: absolute;
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const ZoomGuideTooltip = styled.div`
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(254, 221, 19, 0.6);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  animation: bounce 2s infinite;

  strong {
    color: #fedd13;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
`;

const TooltipClose = styled.span`
  font-size: 10px;
  color: #94a3b8;
  padding: 1px 3px;

  &:hover {
    color: #ffffff;
  }
`;

const ZoomControlGroupStyle = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;
