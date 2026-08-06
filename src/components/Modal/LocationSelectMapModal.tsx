import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';
import { GoogleMapView } from '../Map/GoogleMapView';

export interface LocationPlace {
  id: string;
  name: string;
  address: string;
  category: string;
  tags: string[];
  lat: number;
  lng: number;
}

const POPULAR_LOCATIONS: LocationPlace[] = [
  {
    id: 'loc-01',
    name: '성수동 카페거리',
    address: '서울특별시 성동구 성수이로 78',
    category: '카페 / 감성 스팟',
    tags: ['인기 스팟', '카페거리', '감성 사진'],
    lat: 37.5445,
    lng: 127.056
  },
  {
    id: 'loc-02',
    name: '여의도 한강공원 여의나루역 2번 출구',
    address: '서울특별시 영등포구 여의동로 330',
    category: '아웃도어 / 피크닉',
    tags: ['한강공원', '러닝 코스', '피크닉'],
    lat: 37.527,
    lng: 126.932
  },
  {
    id: 'loc-03',
    name: '블루보틀 강남 카페',
    address: '서울특별시 강남구 테헤란로 129',
    category: '카페 / 미팅룸',
    tags: ['강남역', '모임 카페', '쾌적'],
    lat: 37.498,
    lng: 127.028
  },
  {
    id: 'loc-04',
    name: '홍대 연남동 경의선 숲길',
    address: '서울특별시 마포구 연남동 242-1',
    category: '산책 / 번개 모임',
    tags: ['연남동', '경의선숲길', '핫플레이스'],
    lat: 37.562,
    lng: 126.924
  }
];

interface LocationSelectMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (place: LocationPlace) => void;
}

export const LocationSelectMapModal: React.FC<LocationSelectMapModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<LocationPlace>(POPULAR_LOCATIONS[0]);

  if (!isOpen) return null;

  const filteredPlaces = POPULAR_LOCATIONS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    onSelectLocation(selectedPlace);
    showToast(`장소 '${selectedPlace.name}'가 저장되었습니다! 📍`, 'success', '📍');
    onClose();
  };

  const handleCustomSearch = (queryStr: string) => {
    if (!queryStr) return;
    const newPlace: LocationPlace = {
      id: `loc-custom-${Date.now()}`,
      name: queryStr,
      address: queryStr,
      category: '검색 장소',
      tags: ['직접 검색', '구글 지도'],
      lat: 37.5665,
      lng: 126.978
    };
    setSelectedPlace(newPlace);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>🗺️ 장소 선택 지도 모달</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 검색 바 */}
        <SearchRow>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="구글 지도 장소 검색 (예: 성수동, 강남역, 한강공원)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleCustomSearch(searchQuery.trim());
              }
            }}
          />
          {searchQuery && (
            <ClearBtn onClick={() => setSearchQuery('')}>✕</ClearBtn>
          )}
        </SearchRow>

        {/* 실시간 구글 지도 컴포넌트 */}
        <GoogleMapView
          locationName={selectedPlace.name}
          address={selectedPlace.address}
          lat={selectedPlace.lat}
          lng={selectedPlace.lng}
          height="280px"
          showSearch={false}
        />

        {/* 장소 검색 리스트 (검색어 입력 시) */}
        {searchQuery && (
          <PlaceSelectList>
            {filteredPlaces.map((place) => (
              <PlaceListOption
                key={place.id}
                className={selectedPlace.id === place.id ? 'selected' : ''}
                onClick={() => setSelectedPlace(place)}
              >
                <strong>{place.name}</strong>
                <span>{place.address}</span>
              </PlaceListOption>
            ))}
          </PlaceSelectList>
        )}

        {/* 선택된 장소 오버레이 디테일 카드 (첨부 이미지 시안 7번째 동일) */}
        <SelectedLocationCard>
          <BadgeRow>
            <HotBadge>인기 장소</HotBadge>
            <PlaceName>{selectedPlace.name}</PlaceName>
          </BadgeRow>
          <AddressText>📍 {selectedPlace.address}</AddressText>

          <TagChipsRow>
            {selectedPlace.tags.map((tag, idx) => (
              <TagChip key={idx}>#{tag}</TagChip>
            ))}
          </TagChipsRow>

          <ConfirmLocationBtn type="button" onClick={handleConfirm}>
            선택 완료 ✨
          </ConfirmLocationBtn>
        </SelectedLocationCard>
      </ModalCard>
    </Overlay>
  );
};

// Keyframe Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px) scale(0.96); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  z-index: 1100; /* CreateGroupModal 위로 팝업 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease-out forwards;
`;

const ModalCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 88vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const CloseBtn = styled.button`
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
    color: #111;
  }
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 16px;
  padding: 10px 14px;
`;

const SearchIcon = styled.span`
  font-size: 14px;
  color: #64748b;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 13px;
  color: #0f172a;
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
`;



const PlaceSelectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
`;

const PlaceListOption = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;

  &.selected {
    border-color: #fedd13;
    background: #fefce8;
  }

  strong { font-size: 13px; color: #0f172a; }
  span { font-size: 11px; color: #64748b; }
`;

const SelectedLocationCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #fedd13;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 6px 16px rgba(254, 221, 19, 0.25);
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HotBadge = styled.span`
  background: #ef4444;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 6px;
`;

const PlaceName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const AddressText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #64748b;
`;

const TagChipsRow = styled.div`
  display: flex;
  gap: 6px;
`;

const TagChip = styled.span`
  font-size: 10px;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
  padding: 3px 8px;
  border-radius: 8px;
`;

const ConfirmLocationBtn = styled.button`
  margin-top: 4px;
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  border: none;
  background: #fedd13;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #f5cf00;
  }
`;
