import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

import ryanAvatar from '../../assets/choonsik_avatar.png';
import tubeAvatar from '../../assets/muzi_avatar.png';
import apeachAvatar from '../../assets/apeach_avatar.png';
import frodoAvatar from '../../assets/frodo_avatar.png';
import neoAvatar from '../../assets/neo_avatar.png';

const MEMBER_AVATARS = [ryanAvatar, tubeAvatar, apeachAvatar, frodoAvatar, neoAvatar];

export interface NewGroupExploreItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  memberCount: number;
  description: string;
  badgeColor: string;
  schedule: string;
  location: string;
  tags: string[];
}

export interface ExploreFriendItem {
  id: string;
  name: string;
  statusMessage: string;
  avatar: string;
  mutualFriends: number;
}

const NEW_GROUPS_LIST: NewGroupExploreItem[] = [
  {
    id: 'exp-g-01',
    name: '성수 오일파스텔 드로잉 🎨',
    category: '문화/클래스',
    icon: '🎨',
    memberCount: 15,
    description: '초보자도 쉽고 재미있게 그리며 힐링하는 주말 색채 미술 크루입니다. 매주 다른 주제로 함께 그림을 그려요.',
    badgeColor: '#FEDD13',
    schedule: '매주 토요일 오후 2시',
    location: '성수동 아트스튜디오',
    tags: ['미술', '힐링', '주말', '초보환영'],
  },
  {
    id: 'exp-g-02',
    name: '서울 야간 한강 런 클럽 🏃‍♂️',
    category: '아웃도어/러닝',
    icon: '🏃‍♂️',
    memberCount: 32,
    description: '시원한 한강 밤바람을 맞으며 함께 달리는 나이트 러닝 클럽. 초보부터 고수까지 모두 환영해요!',
    badgeColor: '#8FC7E8',
    schedule: '매주 화, 목 저녁 8시',
    location: '한강공원 여의도',
    tags: ['러닝', '한강', '야간', '건강'],
  },
  {
    id: 'exp-g-03',
    name: '주말 와인 & 소셜 파티 🍷',
    category: '취미/파티',
    icon: '🍷',
    memberCount: 18,
    description: '다양한 직군의 사람들과 가벼운 와인 한 잔하며 담소를 나누는 소셜 모임. 새로운 인연을 만들어요!',
    badgeColor: '#F491BC',
    schedule: '격주 토요일 저녁 7시',
    location: '홍대 소셜클럽',
    tags: ['와인', '소셜', '네트워킹', '파티'],
  },
  {
    id: 'exp-g-04',
    name: '인문학 심야 북클럽 📖',
    category: '독서/학습',
    icon: '📖',
    memberCount: 9,
    description: '매주 한 권의 책을 읽고 생각을 서로 공유하는 잔잔한 감성 독서 크루. 다양한 시각으로 세상을 봐요.',
    badgeColor: '#A8E6CF',
    schedule: '매주 금요일 오후 9시',
    location: '마포구 독립서점',
    tags: ['독서', '인문학', '토론', '감성'],
  },
];

const EXPLORE_FRIENDS_LIST: ExploreFriendItem[] = [
  { id: 'exp-f-01', name: '라이언', statusMessage: '오늘도 즐겁고 힘차게 아자아자! 🦁', avatar: ryanAvatar, mutualFriends: 5 },
  { id: 'exp-f-02', name: '튜브', statusMessage: '주말 캠핑 및 아웃도어 가실 분 구해요 ⛺', avatar: tubeAvatar, mutualFriends: 3 },
  { id: 'exp-f-03', name: '어피치', statusMessage: '달콤한 디저트 카페 탐방 커뮤니티 🍰', avatar: apeachAvatar, mutualFriends: 8 },
  { id: 'exp-f-04', name: '프로도', statusMessage: '러닝과 크로스핏 운동 매니아 🏋️‍♂️', avatar: frodoAvatar, mutualFriends: 4 },
  { id: 'exp-f-05', name: '네오', statusMessage: '패션과 예술 전시회 같이 가요 👗', avatar: neoAvatar, mutualFriends: 6 },
];

export interface PartnerPlaceItem {
  id: string;
  name: string;
  location: string;
  minCount: number;
  maxCount: number;
  ageGroups: string[];
  benefit: string;
  reason: string;
  emoji: string;
  tag: '맛집' | '핫플레이스' | '와인바' | '카페' | '루프탑' | '파인다이닝';
}

const PARTNER_PLACES_LIST: PartnerPlaceItem[] = [
  {
    id: 'place-01',
    name: '성수 피치스 도원 (복합문화공간)',
    location: '성수동',
    minCount: 2,
    maxCount: 20,
    ageGroups: ['20대 초반', '20대 후반'],
    benefit: '모여라 회원 전원 무료 음료 쿠폰 🥤 (에너지 드링크 or 아메리카노)',
    reason: '🚗 주차 지원 및 트렌디한 스트릿카 전시 & 20대 감성에 맞춘 힙한 인테리어 구성',
    emoji: '🏎️',
    tag: '핫플레이스'
  },
  {
    id: 'place-02',
    name: '성수 온량 (이탈리안 레스토랑)',
    location: '성수동',
    minCount: 2,
    maxCount: 6,
    ageGroups: ['20대 후반', '30대 초반'],
    benefit: '4인 이상 방문 예약 시 하우스 와인 1병 & 생바질 샐러드 무료 제공 🍷',
    reason: '🍽️ 차분하고 앤티크한 분위기로 20-30대 소규모 프라이빗 친목 및 커플 모임 최적화',
    emoji: '🍝',
    tag: '맛집'
  },
  {
    id: 'place-03',
    name: '홍대 스티키파티 (캐주얼 와인바)',
    location: '홍대/합정',
    minCount: 4,
    maxCount: 12,
    ageGroups: ['20대 초반', '20대 후반'],
    benefit: '6인 단체룸 예약 시 제휴 안주 플레이트(치즈 & 과일) 무료 제공 🧀',
    reason: '🍷 가성비 좋은 하우스 와인 리스트와 인스타 감성 조명, 20대 사교 모임에 최적',
    emoji: '🥂',
    tag: '와인바'
  },
  {
    id: 'place-04',
    name: '여의도 고메블루 (스테이크 다이닝)',
    location: '여의도',
    minCount: 2,
    maxCount: 8,
    ageGroups: ['30대 초반', '40대 이상'],
    benefit: '모여라 회원 단체 결제 시 총 결제 금액 10% 캐시백 & 디저트 제공 🍰',
    reason: '👔 고급 프라이빗 룸 완비 및 비즈니스 미팅, 30대 이상 직장인 친목 회식 특화',
    emoji: '🥩',
    tag: '파인다이닝'
  },
  {
    id: 'place-05',
    name: '강남역 땀땀 (퓨전 베트남 음식)',
    location: '강남역',
    minCount: 2,
    maxCount: 10,
    ageGroups: ['20대 초반', '20대 후반', '30대 초반'],
    benefit: '메인 디시 3개 이상 주문 시 수제 짜조 1접시 서비스 🥟',
    reason: '🍜 줄 서서 먹는 매운 소곱창 쌀국수로 유명하며 대규모 캐주얼 모임에 적합한 접근성',
    emoji: '🍲',
    tag: '맛집'
  },
  {
    id: 'place-06',
    name: '성수 어반루프 (루프탑 비어 가든)',
    location: '성수동',
    minCount: 6,
    maxCount: 30,
    ageGroups: ['20대 후반', '30대 초반', '40대 이상'],
    benefit: '10인 이상 대관/예약 시 수제 맥주 피처 2개 무료 서비스 🍺',
    reason: '🌃 탁 트인 성수동 야경을 즐길 수 있는 루프탑 테이블, 넓은 대규모 단체 친목 추천',
    emoji: '🌃',
    tag: '루프탑'
  },
  {
    id: 'place-07',
    name: '합정 멜로우베이커리 (감성 디저트 카페)',
    location: '홍대/합정',
    minCount: 2,
    maxCount: 5,
    ageGroups: ['20대 초반', '20대 후반'],
    benefit: '모든 음료 주문 시 수제 마카롱 1개씩 추가 증정 🍰',
    reason: '🧁 20대 인스타 감성의 아기자기한 파스텔톤 포토존 및 수제 타르트 전문 맛집',
    emoji: '🧁',
    tag: '카페'
  }
];

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExploreModal: React.FC<ExploreModalProps> = ({ isOpen, onClose }) => {
  const { addGroup, groups } = useAppContext();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'groups' | 'friends' | 'places'>('groups');
  const [friendQuery, setFriendQuery] = useState('');
  const [joinedGroupIds, setJoinedGroupIds] = useState<Record<string, boolean>>({});
  const [invitedFriendIds, setInvitedFriendIds] = useState<Record<string, boolean>>({});
  const [detailGroup, setDetailGroup] = useState<NewGroupExploreItem | null>(null);

  // 맛집/핫플 제휴 필터 상태
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [headcount, setHeadcount] = useState<number>(4);
  const [ageGroup, setAgeGroup] = useState<string>('20대 후반');
  const [locationFilter, setLocationFilter] = useState<string>('성수동');
  const [downloadedCoupons, setDownloadedCoupons] = useState<Record<string, boolean>>({});
  const [sharedPlaces, setSharedPlaces] = useState<Record<string, boolean>>({});

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    const g = groups.find((group) => group.id === groupId);
    if (g) {
      setHeadcount(g.memberCount);
      // 모임 명을 통한 자동 위치 연계
      if (g.name.includes('성수') || g.name.includes('드로잉')) {
        setLocationFilter('성수동');
      } else if (g.name.includes('홍대') || g.name.includes('합정') || g.name.includes('소셜')) {
        setLocationFilter('홍대/합정');
      } else if (g.name.includes('여의도') || g.name.includes('러닝') || g.name.includes('한강')) {
        setLocationFilter('여의도');
      } else if (g.name.includes('강남')) {
        setLocationFilter('강남역');
      }
    }
  };

  // 제휴 맛집/핫플 필터링
  const filteredPlaces = PARTNER_PLACES_LIST.filter((place) => {
    // 1. 위치
    if (place.location !== locationFilter) return false;
    // 2. 인원
    if (headcount < place.minCount || headcount > place.maxCount) return false;
    // 3. 연령대
    if (!place.ageGroups.includes(ageGroup)) return false;
    return true;
  });

  // 폴백 장소 (매칭 장소가 전혀 없는 경우)
  const displayPlaces = filteredPlaces.length > 0 
    ? filteredPlaces 
    : PARTNER_PLACES_LIST.filter(place => place.location === locationFilter);

  if (!isOpen) return null;

  const filteredFriends = EXPLORE_FRIENDS_LIST.filter(
    (f) =>
      f.name.toLowerCase().includes(friendQuery.toLowerCase()) ||
      f.statusMessage.toLowerCase().includes(friendQuery.toLowerCase())
  );

  const handleJoinGroup = (g: NewGroupExploreItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (joinedGroupIds[g.id]) {
      showToast('이미 참여 신청된 모임입니다! 📌', 'info');
      return;
    }
    addGroup(g.name, g.category, g.icon);
    setJoinedGroupIds((prev) => ({ ...prev, [g.id]: true }));
    showToast(`'${g.name}' 모임에 참여하였습니다! 🎉`, 'success');
  };

  const handleSendInvite = (friendName: string, friendId: string) => {
    if (invitedFriendIds[friendId]) {
      showToast('이미 초대 메시지를 보냈습니다! 💌', 'info');
      return;
    }
    setInvitedFriendIds((prev) => ({ ...prev, [friendId]: true }));
    showToast(`${friendName}님에게 친구 초대 메시지를 보냈습니다! 💌`, 'success');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>

        {/* ── 헤더 ── */}
        <ModalHeader>
          {detailGroup ? (
            <BackBtn type="button" onClick={() => setDetailGroup(null)}>← 목록으로</BackBtn>
          ) : (
            <HeaderTitle>🧭 새로운 모임 &amp; 친구 탐색</HeaderTitle>
          )}
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* ══════════════════════════
            상세 페이지 뷰
        ══════════════════════════ */}
        {detailGroup ? (
          <DetailContainer>
            {/* 히어로 헤더 */}
            <DetailHeroCard style={{ background: detailGroup.badgeColor }}>
              <DetailHeroIcon>{detailGroup.icon}</DetailHeroIcon>
              <DetailHeroText>
                <DetailHeroCatBadge>{detailGroup.category}</DetailHeroCatBadge>
                <DetailHeroName>{detailGroup.name}</DetailHeroName>
              </DetailHeroText>
            </DetailHeroCard>

            {/* 통계 그리드 */}
            <DetailStatGrid>
              <StatBlock>
                <StatBlockEmoji>👥</StatBlockEmoji>
                <StatBlockLabel>멤버</StatBlockLabel>
                <StatBlockValue>{detailGroup.memberCount}명</StatBlockValue>
              </StatBlock>
              <StatBlock>
                <StatBlockEmoji>📅</StatBlockEmoji>
                <StatBlockLabel>일정</StatBlockLabel>
                <StatBlockValue>{detailGroup.schedule}</StatBlockValue>
              </StatBlock>
              <StatBlock>
                <StatBlockEmoji>📍</StatBlockEmoji>
                <StatBlockLabel>장소</StatBlockLabel>
                <StatBlockValue>{detailGroup.location}</StatBlockValue>
              </StatBlock>
            </DetailStatGrid>

            {/* 멤버 아바타 스택 */}
            <MembersSection>
              <MembersSectionLabel>함께하는 멤버</MembersSectionLabel>
              <AvatarsStack>
                {MEMBER_AVATARS.slice(0, Math.min(5, detailGroup.memberCount)).map((src, i) => (
                  <StackedAvatar
                    key={i}
                    src={src}
                    alt=""
                    style={{ zIndex: 10 - i, marginLeft: i === 0 ? 0 : -12 }}
                  />
                ))}
                {detailGroup.memberCount > 5 && (
                  <MoreCircle>+{detailGroup.memberCount - 5}</MoreCircle>
                )}
              </AvatarsStack>
            </MembersSection>

            {/* 모임 소개 */}
            <DescSection>
              <DescLabel>모임 소개</DescLabel>
              <DescText>{detailGroup.description}</DescText>
            </DescSection>

            {/* 태그 */}
            <TagsWrap>
              {detailGroup.tags.map((tag) => (
                <TagChip key={tag} style={{ background: detailGroup.badgeColor + '55' }}>
                  #{tag}
                </TagChip>
              ))}
            </TagsWrap>

            {/* 참여하기 CTA */}
            <JoinBtnMain
              type="button"
              className={joinedGroupIds[detailGroup.id] ? 'joined' : ''}
              onClick={(e) => handleJoinGroup(detailGroup, e)}
            >
              {joinedGroupIds[detailGroup.id]
                ? '이미 참여한 모임이에요 ✅'
                : '지금 바로 참여하기 🙋‍♂️'}
            </JoinBtnMain>
          </DetailContainer>
        ) : (
          <>
            {/* ── 탭 네비게이션 ── */}
            <TabRow>
              <TabBtn
                type="button"
                className={activeTab === 'groups' ? 'active' : ''}
                onClick={() => setActiveTab('groups')}
              >
                모임 탐색 🧭
              </TabBtn>
              <TabBtn
                type="button"
                className={activeTab === 'friends' ? 'active' : ''}
                onClick={() => setActiveTab('friends')}
              >
                친구 탐색 🔍
              </TabBtn>
              <TabBtn
                type="button"
                className={activeTab === 'places' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('places');
                  if (groups && groups.length > 0 && !selectedGroupId) {
                    handleGroupSelect(groups[0].id);
                  }
                }}
              >
                제휴 맛집/핫플 🎁
              </TabBtn>
            </TabRow>

            {/* ══════════════════════
                탭 1: 플립 카드 리스트
            ══════════════════════ */}
            {activeTab === 'groups' && (
              <ContentContainer>
                <SubNotice>✨ 카드에 마우스를 올리면 뒤집혀요! 클릭하면 상세 페이지를 볼 수 있어요.</SubNotice>
                <GroupExploreList>
                  {NEW_GROUPS_LIST.map((g) => {
                    const isJoined = joinedGroupIds[g.id];
                    return (
                      <FlipCardContainer key={g.id} onClick={() => setDetailGroup(g)}>
                        <FlipCardInner>
                          {/* ── 앞면 ── */}
                          <FlipCardFront style={{ background: g.badgeColor }}>
                            <FrontTopRow>
                              <FrontIcon>{g.icon}</FrontIcon>
                              <FrontCatTag>{g.category}</FrontCatTag>
                            </FrontTopRow>
                            <FrontBottomRow>
                              <FrontGroupName>{g.name}</FrontGroupName>
                              <FrontMemberBadge>👥 {g.memberCount}명 참여 중</FrontMemberBadge>
                            </FrontBottomRow>
                            {isJoined && <FrontJoinedStamp>참여 완료 ✅</FrontJoinedStamp>}
                          </FlipCardFront>

                          {/* ── 뒷면 ── */}
                          <FlipCardBack style={{ borderColor: g.badgeColor }}>
                            <BackTopRow>
                              <BackSmallIcon>{g.icon}</BackSmallIcon>
                              <BackGroupName>{g.name}</BackGroupName>
                            </BackTopRow>
                            <BackDescription>{g.description}</BackDescription>
                            <BackMetaCol>
                              <BackMetaItem>📅 {g.schedule}</BackMetaItem>
                              <BackMetaItem>📍 {g.location}</BackMetaItem>
                            </BackMetaCol>
                            <BackBtnRow>
                              <BackDetailBtn
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setDetailGroup(g); }}
                              >
                                상세 보기 →
                              </BackDetailBtn>
                              <BackJoinBtn
                                type="button"
                                className={isJoined ? 'joined' : ''}
                                style={{ background: isJoined ? '#dcfce7' : g.badgeColor }}
                                onClick={(e) => handleJoinGroup(g, e)}
                              >
                                {isJoined ? '참여 완료 ✅' : '참여하기 🙋'}
                              </BackJoinBtn>
                            </BackBtnRow>
                          </FlipCardBack>
                        </FlipCardInner>
                      </FlipCardContainer>
                    );
                  })}
                </GroupExploreList>
              </ContentContainer>
            )}

            {/* ══════════════════════
                탭 2: 친구 탐색
            ══════════════════════ */}
            {activeTab === 'friends' && (
              <ContentContainer>
                <SearchBox>
                  <SearchIconSpan>🔍</SearchIconSpan>
                  <SearchInput
                    type="text"
                    placeholder="찾고 싶은 친구 이름 또는 키워드 직접 입력..."
                    value={friendQuery}
                    onChange={(e) => setFriendQuery(e.target.value)}
                  />
                  {friendQuery && (
                    <ClearInputBtn type="button" onClick={() => setFriendQuery('')}>✕</ClearInputBtn>
                  )}
                </SearchBox>
                <SubNotice>함께 아는 친구 및 취향이 비슷한 추천 친구 리스트입니다.</SubNotice>
                <FriendExploreList>
                  {filteredFriends.length === 0 ? (
                    <EmptyState>검색된 친구가 없습니다. 직접 이름을 입력해 초대를 보내보세요!</EmptyState>
                  ) : (
                    filteredFriends.map((friend) => {
                      const isInvited = invitedFriendIds[friend.id];
                      return (
                        <FriendCardItem key={friend.id}>
                          <AvatarImg src={friend.avatar} alt={friend.name} />
                          <FriendMetaCol>
                            <FriendNameRow>
                              <FriendName>{friend.name}</FriendName>
                              <MutualBadge>함께 아는 친구 {friend.mutualFriends}명</MutualBadge>
                            </FriendNameRow>
                            <FriendStatus>{friend.statusMessage}</FriendStatus>
                          </FriendMetaCol>
                          <InviteBtn
                            type="button"
                            className={isInvited ? 'invited' : ''}
                            onClick={() => handleSendInvite(friend.name, friend.id)}
                          >
                            {isInvited ? '초대 발송됨 💌' : '초대 메세지 💌'}
                          </InviteBtn>
                        </FriendCardItem>
                      );
                    })
                  )}
                </FriendExploreList>
              </ContentContainer>
            )}

            {/* ══════════════════════
                탭 3: 제휴 맛집/핫플
            ══════════════════════ */}
            {activeTab === 'places' && (
              <ContentContainer>
                {/* 1. 상단 모임 분석 카드 */}
                {selectedGroupId && (
                  <AnalysisHeroCard>
                    <AnalysisIcon>💡</AnalysisIcon>
                    <AnalysisText>
                      <strong>선택 모임 조건 매칭:</strong> {groups.find(g => g.id === selectedGroupId)?.name} <br />
                      인원 {headcount}명 · 연령 {ageGroup} · 위치 {locationFilter} 정보를 기반으로 제휴 혜택을 매칭했습니다!
                    </AnalysisText>
                  </AnalysisHeroCard>
                )}

                {/* 2. 필터 조정 폼 */}
                <FilterTuneArea>
                  <FilterFieldRow>
                    <FilterInputLabel>모임 선택</FilterInputLabel>
                    <FilterSelect
                      value={selectedGroupId}
                      onChange={(e) => handleGroupSelect(e.target.value)}
                    >
                      <option value="" disabled>모임을 선택하세요</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({g.memberCount}명)</option>
                      ))}
                    </FilterSelect>
                  </FilterFieldRow>

                  <FilterFieldRow>
                    <FilterInputLabel>모임 인원</FilterInputLabel>
                    <SegmentGroup>
                      {[2, 4, 6, 10].map((num) => (
                        <SegmentBtn
                          key={num}
                          type="button"
                          className={
                            (num === 2 && headcount <= 3) ||
                            (num === 4 && headcount >= 4 && headcount <= 5) ||
                            (num === 6 && headcount >= 6 && headcount <= 9) ||
                            (num === 10 && headcount >= 10)
                              ? 'active'
                              : ''
                          }
                          onClick={() => setHeadcount(num)}
                        >
                          {num === 10 ? '10명+' : `${num}명`}
                        </SegmentBtn>
                      ))}
                    </SegmentGroup>
                  </FilterFieldRow>

                  <FilterFieldRow>
                    <FilterInputLabel>타겟 연령</FilterInputLabel>
                    <SegmentGroup>
                      {['20대 초반', '20대 후반', '30대 초반', '40대 이상'].map((age) => (
                        <SegmentBtn
                          key={age}
                          type="button"
                          className={ageGroup === age ? 'active' : ''}
                          onClick={() => setAgeGroup(age)}
                        >
                          {age}
                        </SegmentBtn>
                      ))}
                    </SegmentGroup>
                  </FilterFieldRow>

                  <FilterFieldRow>
                    <FilterInputLabel>활동 위치</FilterInputLabel>
                    <SegmentGroup>
                      {['성수동', '홍대/합정', '여의도', '강남역'].map((loc) => (
                        <SegmentBtn
                          key={loc}
                          type="button"
                          className={locationFilter === loc ? 'active' : ''}
                          onClick={() => setLocationFilter(loc)}
                        >
                          {loc.split('/')[0]}
                        </SegmentBtn>
                      ))}
                    </SegmentGroup>
                  </FilterFieldRow>
                </FilterTuneArea>

                <SubNotice>🎁 가맹 장소 방문 시 아래 제휴 혜택 배너를 제시해주세요!</SubNotice>

                {/* 3. 제휴 추천 맛집 카드 리스트 */}
                <PartnerExploreList>
                  {displayPlaces.length === 0 ? (
                    <EmptyState>선택한 조건의 추천 정보가 없습니다. 필터를 다르게 설정해 보세요.</EmptyState>
                  ) : (
                    displayPlaces.map((place) => {
                      const hasCoupon = downloadedCoupons[place.id];
                      const isShared = sharedPlaces[place.id];
                      return (
                        <PartnerCard key={place.id}>
                          <PartnerCardTop>
                            <PartnerEmojiBadge>{place.emoji}</PartnerEmojiBadge>
                            <PartnerNameCol>
                              <PartnerPlaceName>{place.name}</PartnerPlaceName>
                              <PartnerTagBadge>{place.tag}</PartnerTagBadge>
                            </PartnerNameCol>
                            <PartnerLocTag>{place.location}</PartnerLocTag>
                          </PartnerCardTop>

                          <PartnerBenefitBox>
                            <BenefitTag>제휴 혜택</BenefitTag>
                            <BenefitText>{place.benefit}</BenefitText>
                          </PartnerBenefitBox>

                          <PartnerReasonText>
                            <strong>추천 이유:</strong> {place.reason}
                          </PartnerReasonText>

                          <PartnerActionRow>
                            <CouponBtn
                              type="button"
                              className={hasCoupon ? 'claimed' : ''}
                              onClick={() => {
                                if (hasCoupon) return;
                                setDownloadedCoupons(prev => ({ ...prev, [place.id]: true }));
                                showToast(`[${place.name.split(' (')[0]}] 제휴 쿠폰 발급 완료! 🎟️`, 'success', '🎟️');
                              }}
                            >
                              {hasCoupon ? '쿠폰 발급 완료 ✅' : '제휴 쿠폰 받기 🎟️'}
                            </CouponBtn>

                            <ShareToGroupBtn
                              type="button"
                              className={isShared ? 'shared' : ''}
                              onClick={() => {
                                setSharedPlaces(prev => ({ ...prev, [place.id]: true }));
                                showToast(`'${place.name.split(' (')[0]}' 정보를 모임방에 공유했습니다! 📲`, 'success', '📲');
                              }}
                            >
                              {isShared ? '공유 완료 📲' : '모임방 공유 📤'}
                            </ShareToGroupBtn>
                          </PartnerActionRow>
                        </PartnerCard>
                      );
                    })
                  )}
                </PartnerExploreList>
              </ContentContainer>
            )}
          </>
        )}
      </ModalCard>
    </Overlay>
  );
};

/* ═══════════════════════════════════
   Keyframe Animations
═══════════════════════════════════ */
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px) scale(0.96); opacity: 0; }
  to   { transform: translateY(0)    scale(1);    opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(24px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

/* ═══════════════════════════════════
   Modal Shell
═══════════════════════════════════ */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
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
  padding: 22px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 88vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-sizing: border-box;

  &::-webkit-scrollbar { display: none; }
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

const BackBtn = styled.button`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  background: #f1f5f9;
  padding: 7px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover { background: #e2e8f0; }
`;

const CloseBtn = styled.button`
  background: #f3f4f6;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 15px;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s ease;

  &:hover { background: #e5e7eb; color: #111; }
`;

/* ── Tab ── */
const TabRow = styled.div`
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 16px;
`;

const TabBtn = styled.button`
  flex: 1;
  padding: 9px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  background: none;
  cursor: pointer;
  transition: all 0.18s ease;

  &.active {
    background: #ffffff;
    color: #111827;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.09);
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SubNotice = styled.span`
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.5;
`;

/* ═══════════════════════════════════
   Flip Card
═══════════════════════════════════ */
const GroupExploreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 2px 4px; /* top padding so lift isn't clipped */
`;

const FlipCardContainer = styled.div`
  height: 178px;
  perspective: 900px;
  cursor: pointer;
  transition: transform 0.28s cubic-bezier(0.25, 0.8, 0.25, 1),
              filter  0.28s ease;

  &:hover {
    transform: translateY(-7px);
    filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.14));
  }

  &:hover > div {
    transform: rotateY(180deg);
  }
`;

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.52s cubic-bezier(0.4, 0.2, 0.2, 1);
  border-radius: 18px;
`;

/* ── 앞면 ── */
const FlipCardFront = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  box-sizing: border-box;
`;

const FrontTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const FrontIcon = styled.span`
  font-size: 34px;
  line-height: 1;
`;

const FrontCatTag = styled.span`
  font-size: 10px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.72);
  color: #111827;
  padding: 3px 9px;
  border-radius: 8px;
`;

const FrontBottomRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FrontGroupName = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
`;

const FrontMemberBadge = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.55);
`;

const FrontJoinedStamp = styled.span`
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(255, 255, 255, 0.88);
  color: #15803d;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 8px;
`;

/* ── 뒷면 ── */
const FlipCardBack = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: rotateY(180deg);
  border-radius: 18px;
  background: #ffffff;
  border: 2.5px solid transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px;
  box-sizing: border-box;
  gap: 5px;
`;

const BackTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`;

const BackSmallIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const BackGroupName = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BackDescription = styled.p`
  margin: 0;
  font-size: 11.5px;
  color: #475569;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

const BackMetaCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BackMetaItem = styled.span`
  font-size: 10.5px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BackBtnRow = styled.div`
  display: flex;
  gap: 6px;
`;

const BackDetailBtn = styled.button`
  flex: 1;
  padding: 7px 6px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #0f172a;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover { background: #e2e8f0; }
`;

const BackJoinBtn = styled.button`
  flex: 1;
  padding: 7px 6px;
  border-radius: 10px;
  border: none;
  color: #111827;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease;

  &:hover { opacity: 0.85; }

  &.joined {
    background: #dcfce7 !important;
    color: #15803d;
    cursor: default;
  }
`;

/* ═══════════════════════════════════
   상세 페이지 (Detail View)
═══════════════════════════════════ */
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${slideInRight} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const DetailHeroCard = styled.div`
  border-radius: 20px;
  padding: 20px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const DetailHeroIcon = styled.span`
  font-size: 46px;
  line-height: 1;
  flex-shrink: 0;
`;

const DetailHeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const DetailHeroCatBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.72);
  color: #111827;
  padding: 3px 9px;
  border-radius: 8px;
  align-self: flex-start;
`;

const DetailHeroName = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
`;

const DetailStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const StatBlock = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`;

const StatBlockEmoji = styled.span`
  font-size: 20px;
  line-height: 1;
`;

const StatBlockLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
`;

const StatBlockValue = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
`;

const MembersSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MembersSectionLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

const AvatarsStack = styled.div`
  display: flex;
  align-items: center;
`;

const StackedAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
`;

const MoreCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  margin-left: -12px;
`;

const DescSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DescLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

const DescText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.65;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 14px;
`;

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TagChip = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #0f172a;
  padding: 4px 11px;
  border-radius: 10px;
`;

const JoinBtnMain = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: #fedd13;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:hover:not(.joined) { transform: translateY(-2px); opacity: 0.9; }
  &:active:not(.joined) { transform: translateY(0); }

  &.joined {
    background: #dcfce7;
    color: #15803d;
    cursor: default;
  }
`;

/* ═══════════════════════════════════
   친구 탐색
═══════════════════════════════════ */
const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 14px;
  padding: 8px 12px;
`;

const SearchIconSpan = styled.span`
  font-size: 14px;
  color: #64748b;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 13px;
  color: #0f172a;
`;

const ClearInputBtn = styled.button`
  background: none;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
`;

const FriendExploreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 360px;
  overflow-y: auto;

  &::-webkit-scrollbar { display: none; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 10px;
  font-size: 13px;
  color: #94a3b8;
`;

const FriendCardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
`;

const AvatarImg = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const FriendMetaCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
  overflow: hidden;
`;

const FriendNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const FriendName = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

const MutualBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #3b82f6;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 6px;
`;

const FriendStatus = styled.span`
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InviteBtn = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #111827;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover { background: #f8fafc; border-color: #fedd13; }

  &:hover { background: #f8fafc; border-color: #fedd13; }

  &.invited {
    background: #dbeafe;
    border-color: #3b82f6;
    color: #1e40af;
  }
`;

/* ── 탭 3: 제휴 맛집/핫플 관련 스타일 컴포넌트 ── */
const AnalysisHeroCard = styled.div`
  background: #fdfaf3;
  border: 1.5px solid #f4eedc;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(38, 38, 44, 0.02);
`;

const AnalysisIcon = styled.div`
  font-size: 20px;
  line-height: 1;
`;

const AnalysisText = styled.div`
  font-size: 12.5px;
  font-weight: 550;
  line-height: 1.5;
  color: #334155;
  
  strong {
    color: #0f172a;
    font-weight: 800;
  }
`;

const FilterTuneArea = styled.div`
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
`;

const FilterFieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FilterInputLabel = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  width: 64px;
  flex-shrink: 0;
`;

const FilterSelect = styled.select`
  flex: 1;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  color: #1e293b;
  outline: none;

  &:focus {
    border-color: #fedd13;
  }
`;

const SegmentGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-grow: 1;
`;

const SegmentBtn = styled.button`
  flex: 1;
  padding: 8px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  background: #f8fafc;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #f1f5f9;
    color: #334155;
  }

  &.active {
    background: #fedd13;
    color: #4c3c03;
    border-color: #fedd13;
    box-shadow: 0 2px 6px rgba(254, 221, 19, 0.2);
  }
`;

const PartnerExploreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
`;

const PartnerCard = styled.div`
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 6px 14px rgba(38, 38, 44, 0.03);
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(38, 38, 44, 0.08);
  }
`;

const PartnerCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PartnerEmojiBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fffbeb;
  border: 1.5px solid #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const PartnerNameCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
`;

const PartnerPlaceName = styled.span`
  font-size: 14.5px;
  font-weight: 800;
  color: #1e293b;
`;

const PartnerTagBadge = styled.span`
  align-self: flex-start;
  font-size: 9.5px;
  font-weight: 800;
  color: #8a7018;
  background: #fef3c7;
  padding: 1px 6px;
  border-radius: 6px;
`;

const PartnerLocTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const PartnerBenefitBox = styled.div`
  background: #fff8e6;
  border: 1.5px dashed #fedd13;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BenefitTag = styled.span`
  font-size: 10px;
  font-weight: 850;
  color: #b45309;
  text-transform: uppercase;
`;

const BenefitText = styled.span`
  font-size: 12.5px;
  font-weight: 800;
  color: #78350f;
  line-height: 1.4;
`;

const PartnerReasonText = styled.p`
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #475569;
  font-weight: 600;

  strong {
    color: #0f172a;
    font-weight: 800;
  }
`;

const PartnerActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const CouponBtn = styled.button`
  flex: 1.2;
  padding: 10px;
  border-radius: 10px;
  background: #fedd13;
  color: #4c3c03;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #fada0a;
  }

  &.claimed {
    background: #dcfce7;
    color: #166534;
    cursor: default;
  }
`;

const ShareToGroupBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  background: #ffffff;
  color: #475569;
  border: 1.5px solid #cbd5e1;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &.shared {
    background: #f1f5f9;
    color: #94a3b8;
    border-color: #e2e8f0;
    cursor: default;
  }
`;
