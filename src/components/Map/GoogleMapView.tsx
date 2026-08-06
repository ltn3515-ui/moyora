import React, { useState } from 'react';
import styled from 'styled-components';

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
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  locationName,
  address,
  lat,
  lng,
  height = '260px',
  zoom: initialZoom = 15,
  showControls = true,
  showSearch = false,
  onSearch
}) => {
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' = Roadmap, 'k' = Satellite
  const [zoomLevel, setZoomLevel] = useState<number>(initialZoom);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Construct search query for Google Maps
  const query = lat && lng 
    ? `${lat},${lng}` 
    : address 
      ? `${address} (${locationName})`
      : locationName;

  const encodedQuery = encodeURIComponent(query);
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

  return (
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
        <GoogleBadge>
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
          {/* 지도 / 위성 모드 전환 */}
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

      {/* 구글 지도 프레임 */}
      <MapFrame
        src={embedUrl}
        title={`Google Map - ${locationName}`}
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

          <LocationPill>
            <PillIcon>📍</PillIcon>
            <PillInfo>
              <PillTitle>{locationName}</PillTitle>
              {address && <PillAddress>{address}</PillAddress>}
            </PillInfo>
          </LocationPill>
        </>
      )}
    </MapWrapper>
  );
};

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
  box-sizing: border-border;
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
`;

const PillAddress = styled.span`
  font-size: 10px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
