import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';
import { GoogleMapView } from '../Map/GoogleMapView';

import neoAvatar from '../../assets/neo_avatar.png';
import frodoAvatar from '../../assets/frodo_avatar.png';
import muziAvatar from '../../assets/muzi_avatar.png';
import conAvatar from '../../assets/con_avatar.png';
import jaygAvatar from '../../assets/jayg_avatar.png';
import apeachAvatar from '../../assets/apeach_avatar.png';
import choonsikAvatar from '../../assets/choonsik_avatar.png';
import leetaenoAvatar from '../../assets/avatar_leetaeno.png';
import avatarMe from '../../assets/avatar_me_circle.png';
import avatarF1 from '../../assets/avatar_f1_circle.png';
import avatarF2 from '../../assets/avatar_f2_circle.png';
import avatarF3 from '../../assets/avatar_f3_circle.png';

const AVATAR_MAP: Record<string, string> = {
  'neo_avatar.png': neoAvatar || '/neo_avatar.png',
  'frodo_avatar.png': frodoAvatar || '/frodo_avatar.png',
  'muzi_avatar.png': muziAvatar || '/muzi_avatar.png',
  'con_avatar.png': conAvatar || '/con_avatar.png',
  'jayg_avatar.png': jaygAvatar || '/jayg_avatar.png',
  'apeach_avatar.png': apeachAvatar || '/apeach_avatar.png',
  'choonsik_avatar.png': choonsikAvatar || '/choonsik_avatar.png',
  'avatar_leetaeno.png': leetaenoAvatar || '/avatar_leetaeno.png',
  'avatar_me_circle.png': avatarMe || '/avatar_me_circle.png',
  'avatar_f1_circle.png': avatarF1 || '/avatar_f1_circle.png',
  'avatar_f2_circle.png': avatarF2 || '/avatar_f2_circle.png',
  'avatar_f3_circle.png': avatarF3 || '/avatar_f3_circle.png'
};

export interface TasteActivityItem {
  id: string;
  title: string;
  date: string;
  category: string;
  icon: string;
  badgeColor: string;
  locationName: string;
  locationAddress: string;
  hostName: string;
  hostAvatar: string;
  fee: number;
  operatingHours: string;
  capacity: number;
  currentCount: number;
  attendees: { name: string; avatar: string }[];
  description: string;
}

const MOCK_ACTIVITIES: TasteActivityItem[] = [
  {
    id: 'act-01',
    title: '오페라 갈라 콘서트 🎭',
    date: '2026.08.15(토)',
    category: '공연/예술',
    icon: '🎭',
    badgeColor: '#FEDD13',
    locationName: '예술의전당 오페라극장',
    locationAddress: '서울 서초구 남부순환로 2401',
    hostName: '이태노',
    hostAvatar: 'avatar_leetaeno.png',
    fee: 25000,
    operatingHours: '14:00 ~ 17:00 (3시간 운영)',
    capacity: 10,
    currentCount: 6,
    attendees: [
      { name: '이태노', avatar: 'avatar_leetaeno.png' },
      { name: '민수', avatar: 'avatar_f1_circle.png' },
      { name: '지은', avatar: 'avatar_f2_circle.png' },
      { name: '현우', avatar: 'avatar_f3_circle.png' },
      { name: '어피치', avatar: 'apeach_avatar.png' },
      { name: '춘식이', avatar: 'choonsik_avatar.png' }
    ],
    description: '클래식 오페라의 대표 아리아와 하이라이트 무대를 함께 감상하고 이야기를 나누는 모임입니다.'
  },
  {
    id: 'act-02',
    title: '여름 자작나무 숲 페스티벌 🌲',
    date: '2026.08.22(토)',
    category: '야외활동',
    icon: '⛺',
    badgeColor: '#F491BC',
    locationName: '인제 자작나무 숲 야외무대',
    locationAddress: '강원 인제군 원대리 산 75-22',
    hostName: '민수',
    hostAvatar: 'avatar_f1_circle.png',
    fee: 15000,
    operatingHours: '10:00 ~ 18:00 (8시간 운영)',
    capacity: 12,
    currentCount: 8,
    attendees: [
      { name: '민수', avatar: 'avatar_f1_circle.png' },
      { name: '지은', avatar: 'avatar_f2_circle.png' },
      { name: '네오', avatar: 'neo_avatar.png' },
      { name: '프로도', avatar: 'frodo_avatar.png' },
      { name: '무지', avatar: 'muzi_avatar.png' }
    ],
    description: '시원한 자작나무 숲속에서 버스킹 음악을 듣고 피크닉을 즐기는 힐링 아웃도어 모임입니다.'
  },
  {
    id: 'act-03',
    title: '유기농 에코 소분 행사 🌿',
    date: '2026.08.18(화)',
    category: '소분/친환경',
    icon: '📦',
    badgeColor: '#8FC7E8',
    locationName: '성수 리필스테이션 파크',
    locationAddress: '서울 성동구 연무장길 12',
    hostName: '지은',
    hostAvatar: 'avatar_f2_circle.png',
    fee: 5000,
    operatingHours: '19:00 ~ 21:00 (2시간 운영)',
    capacity: 8,
    currentCount: 5,
    attendees: [
      { name: '지은', avatar: 'avatar_f2_circle.png' },
      { name: '현우', avatar: 'avatar_f3_circle.png' },
      { name: '콘', avatar: 'con_avatar.png' },
      { name: '제이지', avatar: 'jayg_avatar.png' }
    ],
    description: '대용량 제로웨이스트 유기농 생활용품을 합리적인 가격으로 함께 소분하여 나누는 모임입니다.'
  },
  {
    id: 'act-04',
    title: '주말 보드게임 & 소셜 파티 🎲',
    date: '2026.08.16(일)',
    category: '취미/파티',
    icon: '🎲',
    badgeColor: '#A8E6CF',
    locationName: '강남 히어로 보드게임 카페',
    locationAddress: '서울 강남구 테헤란로 101 B1',
    hostName: '현우',
    hostAvatar: 'avatar_f3_circle.png',
    fee: 10000,
    operatingHours: '15:00 ~ 18:00 (3시간 운영)',
    capacity: 8,
    currentCount: 4,
    attendees: [
      { name: '현우', avatar: 'avatar_f3_circle.png' },
      { name: '민수', avatar: 'avatar_f1_circle.png' },
      { name: '춘식이', avatar: 'choonsik_avatar.png' }
    ],
    description: '다양한 머리싸움 보드게임과 함께 시원한 음료를 마시며 친목을 다지는 소셜 클럽입니다.'
  },
  {
    id: 'act-05',
    title: '남산 야경 출사 & 한강 피크닉 🌃',
    date: '2026.08.23(일)',
    category: '출사/산책',
    icon: '📸',
    badgeColor: '#FFD3B6',
    locationName: '남산타워 팔각정 광장',
    locationAddress: '서울 용산구 남산공원길 105',
    hostName: '어피치',
    hostAvatar: 'apeach_avatar.png',
    fee: 8000,
    operatingHours: '18:30 ~ 21:30 (3시간 운영)',
    capacity: 15,
    currentCount: 9,
    attendees: [
      { name: '어피치', avatar: 'apeach_avatar.png' },
      { name: '이태노', avatar: 'avatar_leetaeno.png' },
      { name: '네오', avatar: 'neo_avatar.png' }
    ],
    description: '서울의 야경 스팟을 산책하고 사진을 찍으며 여유롭게 야경 피크닉을 즐기는 모임입니다.'
  },
  /* 아래 항목들은 인기 활동 리스트에서 탭했을 때 상세 화면으로 보여주기 위한 데이터 매핑입니다 */
  {
    id: 'shared-01',
    title: '아트 페스티벌 수제 공예 전시',
    date: '2026.08.20(목)',
    category: '문화/예술',
    icon: '🎨',
    badgeColor: '#F491BC',
    locationName: '인사동 아라아트센터',
    locationAddress: '서울 종로구 인사동9길 26',
    hostName: '이태노',
    hostAvatar: 'avatar_leetaeno.png',
    fee: 12000,
    operatingHours: '11:00 ~ 19:00 (8시간 운영)',
    capacity: 20,
    currentCount: 12,
    attendees: [
      { name: '이태노', avatar: 'avatar_leetaeno.png' },
      { name: '어피치', avatar: 'apeach_avatar.png' }
    ],
    description: '인기 공유 활동 1위! 손끝에서 피어나는 개성 넘치는 수제 공예품 전시를 둘러보며 다채로운 영감을 교감하는 문화 예술 소셜 모임입니다.'
  },
  {
    id: 'shared-02',
    title: '성수 카페거리 감성 출사 모임',
    date: '2026.08.25(화)',
    category: '출사/산책',
    icon: '☕',
    badgeColor: '#FFD3B6',
    locationName: '성수동 대림창고 갤러리',
    locationAddress: '서울 성동구 성수이로 74',
    hostName: '어피치',
    hostAvatar: 'apeach_avatar.png',
    fee: 6000,
    operatingHours: '14:00 ~ 17:00 (3시간 운영)',
    capacity: 8,
    currentCount: 5,
    attendees: [
      { name: '어피치', avatar: 'apeach_avatar.png' },
      { name: '춘식이', avatar: 'choonsik_avatar.png' }
    ],
    description: '트렌디한 성수동 골목길과 개성 넘치는 카페들의 분위기를 필름 및 디지털 카메라에 담는 감성 출사 모임입니다.'
  },
  {
    id: 'shared-03',
    title: '여름 자작나무 숲 버스킹 라이브',
    date: '2026.08.22(토)',
    category: '야외활동',
    icon: '🌲',
    badgeColor: '#A8E6CF',
    locationName: '인제 자작나무 숲 야외무대',
    locationAddress: '강원 인제군 원대리 산 75-22',
    hostName: '민수',
    hostAvatar: 'avatar_f1_circle.png',
    fee: 15000,
    operatingHours: '10:00 ~ 18:00 (8시간 운영)',
    capacity: 12,
    currentCount: 8,
    attendees: [
      { name: '민수', avatar: 'avatar_f1_circle.png' },
      { name: '지은', avatar: 'avatar_f2_circle.png' }
    ],
    description: '인제 자작나무 숲의 청량한 공기 속에서 울려 퍼지는 서정적인 버스킹 음악을 감상하고, 초록빛 자연과 함께 피크닉을 즐기며 힐링하는 아웃도어 소모임입니다.'
  },
  {
    id: 'shared-04',
    title: '한강 망원지구 피크닉 & 힐링',
    date: '2026.08.29(토)',
    category: '야외활동',
    icon: '🧺',
    badgeColor: '#8FC7E8',
    locationName: '망원한강공원 잔디밭',
    locationAddress: '서울 마포구 마포나루길 467',
    hostName: '지은',
    hostAvatar: 'avatar_f2_circle.png',
    fee: 8000,
    operatingHours: '16:00 ~ 20:00 (4시간 운영)',
    capacity: 10,
    currentCount: 6,
    attendees: [
      { name: '지은', avatar: 'avatar_f2_circle.png' },
      { name: '현우', avatar: 'avatar_f3_circle.png' }
    ],
    description: '선선한 강바람이 불어오는 한강 공원에서 잔디밭에 돗자리를 펴고 맛있는 간식과 커피를 함께 즐기며, 붉게 물드는 노을을 감상하고 소통하는 힐링 모임입니다.'
  },
  {
    id: 'shared-05',
    title: '남산 타워 야경 사진 스팟 출사',
    date: '2026.08.30(일)',
    category: '출사/산책',
    icon: '🌃',
    badgeColor: '#FEDD13',
    locationName: '남산타워 팔각정 광장',
    locationAddress: '서울 용산구 남산공원길 105',
    hostName: '현우',
    hostAvatar: 'avatar_f3_circle.png',
    fee: 5000,
    operatingHours: '19:00 ~ 22:00 (3시간 운영)',
    capacity: 15,
    currentCount: 9,
    attendees: [
      { name: '현우', avatar: 'avatar_f3_circle.png' },
      { name: '이태노', avatar: 'avatar_leetaeno.png' }
    ],
    description: '서울 도심의 불빛들이 화려하게 반짝이는 밤하늘을 조망하며, 남산의 숨겨진 사진 스팟을 탐방하고 영롱한 밤하늘 야경의 매력을 함께 촬영하는 출사 모임입니다.'
  }
];

interface TasteActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialActivityId?: string | null;
}

export const TasteActivityModal: React.FC<TasteActivityModalProps> = ({
  isOpen,
  onClose,
  initialActivityId = null
}) => {
  const { addGroup } = useAppContext();
  const { showToast } = useToast();

  const [selectedActivity, setSelectedActivity] = useState<TasteActivityItem | null>(null);
  const [joinedIds, setJoinedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialActivityId) {
        const found = MOCK_ACTIVITIES.find(
          (a) => a.id === initialActivityId || a.title.includes(initialActivityId)
        );
        setSelectedActivity(found || null);
      } else {
        setSelectedActivity(null);
      }
    }
  }, [isOpen, initialActivityId]);

  if (!isOpen) return null;

  const handleJoin = (act: TasteActivityItem) => {
    if (joinedIds[act.id]) {
      showToast('이미 참석 완료된 모임입니다! 📌', 'info', '📌');
      return;
    }

    // 내 모임 목록(groups)에 추가
    addGroup(act.title, act.category, act.icon);
    setJoinedIds((prev) => ({ ...prev, [act.id]: true }));

    showToast(`'${act.title}' 모임에 참석하셨습니다! 내 모임에서 확인해보세요. 🎉`, 'success', '🎉');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <ModalHeader>
          <HeaderTitle>
            {selectedActivity ? (
              <BackBtn type="button" onClick={() => setSelectedActivity(null)}>
                ‹ 모임 목록
              </BackBtn>
            ) : (
              '✨ 취향 저격 추천 모임'
            )}
          </HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* ──────── 뷰 1: 추천 모임 간략 리스트 ──────── */}
        {!selectedActivity ? (
          <ListContent>
            <SubtitleText>당신의 취향을 맞춰줄 인기 추천 모임들입니다.</SubtitleText>

            <ActivityList>
              {MOCK_ACTIVITIES.map((act) => {
                const isJoined = joinedIds[act.id];
                return (
                  <ActivityCardItem key={act.id} onClick={() => setSelectedActivity(act)}>
                    <CardBadge style={{ background: act.badgeColor }}>
                      {act.icon}
                    </CardBadge>
                    <CardBody>
                      <CardTitleRow>
                        <CardTitle>{act.title}</CardTitle>
                        <CategoryTag>{act.category}</CategoryTag>
                      </CardTitleRow>
                      <CardMeta>📅 {act.date} · 📍 {act.locationName}</CardMeta>
                      <CardMetaSub>
                        💰 회비: ₩{act.fee.toLocaleString()} · 👥 정원: {act.currentCount}/{act.capacity}명
                      </CardMetaSub>
                    </CardBody>
                    <ChevronSide>
                      {isJoined ? (
                        <JoinedBadge>참석중</JoinedBadge>
                      ) : (
                        <ChevronIcon>›</ChevronIcon>
                      )}
                    </ChevronSide>
                  </ActivityCardItem>
                );
              })}
            </ActivityList>
          </ListContent>
        ) : (
          /* ──────── 뷰 2: 모임 상세 정보 & 장소 지도 뷰어 ──────── */
          <DetailContent>
            <DetailHeroCard style={{ background: selectedActivity.badgeColor }}>
              <HeroBadge>{selectedActivity.category}</HeroBadge>
              <HeroTitle>{selectedActivity.title}</HeroTitle>
              <HeroDate>📅 {selectedActivity.date}</HeroDate>
            </DetailHeroCard>

            <DescriptionBox>{selectedActivity.description}</DescriptionBox>

            {/* 지도 뷰어 (실시간 구글 지도 인터랙티브 연동) */}
            <SectionBox>
              <SectionLabel>📍 모임 장소 & 지도</SectionLabel>
              <LocationTextRow>
                <strong>{selectedActivity.locationName}</strong>
                <span>{selectedActivity.locationAddress}</span>
              </LocationTextRow>

              <GoogleMapView
                locationName={selectedActivity.locationName}
                address={selectedActivity.locationAddress}
                height="220px"
              />
            </SectionBox>

            {/* 모임 만든 사람 (Host) */}
            <SectionBox>
              <SectionLabel>👑 모임 개설자</SectionLabel>
              <HostRow>
                <HostAvatarWrap>
                  <HostAvatarImg src={AVATAR_MAP[selectedActivity.hostAvatar] || leetaenoAvatar} alt={selectedActivity.hostName} />
                </HostAvatarWrap>
                <HostMeta>
                  <HostName>{selectedActivity.hostName}</HostName>
                  <HostStatus>모임 주최자 · 모여라 호스트</HostStatus>
                </HostMeta>
              </HostRow>
            </SectionBox>

            {/* 회비 & 운영시간 & 정원 정보 */}
            <SectionBox>
              <SectionLabel>⏱️ 모임 상세 조건</SectionLabel>
              <InfoGrid>
                <InfoItem>
                  <InfoItemLabel>💰 참가 회비</InfoItemLabel>
                  <InfoItemValue>₩{selectedActivity.fee.toLocaleString()}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>🕒 모임 운영시간</InfoItemLabel>
                  <InfoItemValue>{selectedActivity.operatingHours}</InfoItemValue>
                </InfoItem>
                <InfoItem>
                  <InfoItemLabel>👥 참석 정원</InfoItemLabel>
                  <InfoItemValue>{selectedActivity.currentCount} / {selectedActivity.capacity}명</InfoItemValue>
                </InfoItem>
              </InfoGrid>
            </SectionBox>

            {/* 참석한 사람들의 프로필 아이콘 */}
            <SectionBox>
              <SectionLabel>🙋‍♂️ 현재 참석한 멤버 ({selectedActivity.attendees.length}명)</SectionLabel>
              <AttendeeRow>
                {selectedActivity.attendees.map((att, i) => (
                  <AttendeeChip key={i}>
                    <AttendeeAvatarWrap>
                      <AttendeeAvatarImg src={AVATAR_MAP[att.avatar] || neoAvatar} alt={att.name} />
                    </AttendeeAvatarWrap>
                    <AttendeeName>{att.name}</AttendeeName>
                  </AttendeeChip>
                ))}
              </AttendeeRow>
            </SectionBox>

            {/* 하단 참석하기 버튼 */}
            <FooterActionBox>
              <JoinBtn
                type="button"
                className={joinedIds[selectedActivity.id] ? 'joined' : ''}
                onClick={() => handleJoin(selectedActivity)}
              >
                {joinedIds[selectedActivity.id] ? '참석 완료됨 ✅ (나의 모임에 추가됨)' : '모임 참석하기 🙋‍♂️'}
              </JoinBtn>
            </FooterActionBox>
          </DetailContent>
        )}
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
  max-width: 440px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 90vh;
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

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 800;
  color: #3b82f6;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
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

const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SubtitleText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActivityCardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ffffff;
    border-color: #fedd13;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const CardBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
  overflow: hidden;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CardTitle = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const CardMeta = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const CardMetaSub = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #3b82f6;
`;

const ChevronSide = styled.div`
  display: flex;
  align-items: center;
`;

const ChevronIcon = styled.span`
  font-size: 20px;
  color: #94a3b8;
`;

const JoinedBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  background: #dcfce7;
  color: #15803d;
  padding: 4px 8px;
  border-radius: 8px;
`;

/* 모임 상세 뷰 스타일 */
const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailHeroCard = styled.div`
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #111827;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const HeroBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.6);
  padding: 3px 8px;
  border-radius: 8px;
  align-self: flex-start;
`;

const HeroTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
`;

const HeroDate = styled.span`
  font-size: 12px;
  font-weight: 700;
  opacity: 0.85;
`;

const DescriptionBox = styled.div`
  background: #f8fafc;
  border-left: 4px solid #fedd13;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  color: #334155;
  line-height: 1.4;
`;

const SectionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
`;

const LocationTextRow = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;

  strong {
    font-size: 13px;
    color: #0f172a;
  }

  span {
    color: #64748b;
  }
`;



const HostRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
`;

const HostAvatarWrap = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fedd13;
`;

const HostAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HostMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const HostName = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

const HostStatus = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const InfoItem = styled.div`
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:nth-child(3) {
    grid-column: span 2;
  }
`;

const InfoItemLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
`;

const InfoItemValue = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const AttendeeRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 2px 8px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const AttendeeChip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const AttendeeAvatarWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #cbd5e1;
`;

const AttendeeAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AttendeeName = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #475569;
`;

const FooterActionBox = styled.div`
  margin-top: 6px;
`;

const JoinBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #fedd13;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.4);
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
    transform: translateY(-1px);
  }

  &.joined {
    background: #dcfce7;
    color: #166534;
    box-shadow: none;
  }
`;
