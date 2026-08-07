import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import type { Group } from '../types';
import { MyGroupsModal } from '../components/Modal/MyGroupsModal';
import { GroupDetailModal } from '../components/Modal/GroupDetailModal';
import { CreateGroupModal } from '../components/Modal/CreateGroupModal';
import { ActivityDetailModal } from '../components/Modal/ActivityDetailModal';

import avatarMe from '../assets/avatar_me_circle.png';
import avatarF1 from '../assets/avatar_f1_circle.png';
import avatarF2 from '../assets/avatar_f2_circle.png';
import avatarF3 from '../assets/avatar_f3_circle.png';
import apeachAvatar from '../assets/apeach_avatar.png';
import choonsikAvatar from '../assets/choonsik_avatar.png';
import neoAvatar from '../assets/neo_avatar.png';
import frodoAvatar from '../assets/frodo_avatar.png';
import muziAvatar from '../assets/muzi_avatar.png';
import conAvatar from '../assets/con_avatar.png';
import jaygAvatar from '../assets/jayg_avatar.png';
import leetaenoAvatar from '../assets/avatar_leetaeno.png';

const AVATAR_MAP: Record<string, string> = {
  'avatar_me_circle.png': avatarMe || '/avatar_me_circle.png',
  'avatar_f1_circle.png': avatarF1 || '/avatar_f1_circle.png',
  'avatar_f2_circle.png': avatarF2 || '/avatar_f2_circle.png',
  'avatar_f3_circle.png': avatarF3 || '/avatar_f3_circle.png',
  'apeach_avatar.png': apeachAvatar || '/apeach_avatar.png',
  'choonsik_avatar.png': choonsikAvatar || '/choonsik_avatar.png',
  'neo_avatar.png': neoAvatar || '/neo_avatar.png',
  'frodo_avatar.png': frodoAvatar || '/frodo_avatar.png',
  'muzi_avatar.png': muziAvatar || '/muzi_avatar.png',
  'con_avatar.png': conAvatar || '/con_avatar.png',
  'jayg_avatar.png': jaygAvatar || '/jayg_avatar.png',
  'avatar_leetaeno.png': leetaenoAvatar || '/avatar_leetaeno.png'
};

const COLOR_ICONS: Record<string, string> = {
  yellow: '☀️',
  pink: '📖',
  blue: '⛰️',
  cream: '🎨',
  green: '🌿'
};

const ACTIVITY_ICONS: Record<string, string> = {
  notice: '📢',
  comment: '💬',
  schedule: '📅'
};

export const Groups: React.FC = () => {
  const { groups } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedActivityForModal, setSelectedActivityForModal] = useState<any | null>(null);
  const [isActivityDetailModalOpen, setIsActivityDetailModalOpen] = useState(false);

  // '즐겨찾기'가 아닌 모임들만 리스트에 노출
  const regularGroups = groups.filter((g) => !g.isFavorite);

  // 검색 필터링
  const filteredGroups = regularGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 모든 모임의 최근 활동 수집 및 정렬
  const allActivities = groups
    .flatMap((g) =>
      g.recentActivities.map((act) => ({
        ...act,
        groupId: g.id,
        groupName: g.name
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // 시간 포맷팅 헬퍼
  const timeAgo = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return '방금 전';
    if (min < 60) return `${min}분 전`;
    const hour = Math.floor(min / 60);
    if (hour < 24) return `${hour}시간 전`;
    const day = Math.floor(hour / 24);
    if (day === 1) return '어제';
    return `${day}일 전`;
  };

  const handleGroupCardClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDetailModalOpen(true);
  };

  const handleActivityClick = (act: any) => {
    setSelectedActivityForModal(act);
    setIsActivityDetailModalOpen(true);
  };

  return (
    <>
    <GroupsContainer>
      {/* 검색창 */}
      <SearchBar>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput 
          type="text" 
          placeholder="관심사를 찾아보세요..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      <PageTitleRow>
        <PageTitle>나의 모임</PageTitle>
        <MoreBtn type="button" aria-label="나의 모임 더보기" onClick={() => setIsGroupsModalOpen(true)}>
          더보기 ⋯
        </MoreBtn>
      </PageTitleRow>

      <GroupGrid>
        {filteredGroups.map((g) => {
          // 최대 2명 아바타만 노출
          const visibleMembers = (g.members || []).slice(0, 2);
          const extraCount = g.memberCount - Math.min(2, g.members ? g.members.length : 0);

          return (
            <GroupCard 
              key={g.id} 
              className={g.thumbnailColor}
              onClick={() => handleGroupCardClick(g)}
            >
              <GroupCardIcon>
                {g.profileImage ? (
                  <GroupAvatarImg src={AVATAR_MAP[g.profileImage]} alt={g.name} />
                ) : (
                  g.icon || COLOR_ICONS[g.thumbnailColor] || '👥'
                )}
              </GroupCardIcon>
              <GroupCardBody>
                <GroupCardName>{g.name}</GroupCardName>
                <GroupCardCount>멤버 {g.memberCount}명</GroupCardCount>
              </GroupCardBody>
              <GroupCardMembers>
                {visibleMembers.map((m, idx) => (
                  <MemberAvatar 
                    key={idx} 
                    src={m.avatarUrl ? AVATAR_MAP[m.avatarUrl] : avatarMe} 
                    alt="멤버" 
                  />
                ))}
                {extraCount > 0 && (
                  <MembersMore className={g.thumbnailColor}>
                    +{extraCount}
                  </MembersMore>
                )}
              </GroupCardMembers>
            </GroupCard>
          );
        })}
      </GroupGrid>

      {/* 최근 활동 */}
      <Section>
        <SectionHeader>
          <SectionTitle>최근 활동</SectionTitle>
          <SectionLink onClick={() => setIsActivityOpen(true)}>모두 보기</SectionLink>
        </SectionHeader>
        <ActivityList>
          {allActivities.length === 0 ? (
            <EmptyState>아직 활동 내역이 없어요.</EmptyState>
          ) : (
            allActivities.slice(0, 5).map((act) => (
              <ActivityItemCard key={act.id} onClick={() => handleActivityClick(act)}>
                <ActivityItemIcon className={act.type}>
                  {ACTIVITY_ICONS[act.type] || '🔔'}
                </ActivityItemIcon>
                <ActivityItemBody>
                  <ActivityMessage>{act.message}</ActivityMessage>
                  <ActivityTime>{timeAgo(act.timestamp)}</ActivityTime>
                </ActivityItemBody>
              </ActivityItemCard>
            ))
          )}
        </ActivityList>
      </Section>
    </GroupsContainer>

      {isActivityOpen && (
        <>
          <ActivitySheetOverlay onClick={() => setIsActivityOpen(false)} />
          <ActivitySheetPanel>
            <ActivitySheetHandle />
            <ActivitySheetHeader>
              <ActivitySheetTitle>최근 활동</ActivitySheetTitle>
              <ActivitySheetCount>{allActivities.length}건</ActivitySheetCount>
              <ActivitySheetCloseBtn onClick={() => setIsActivityOpen(false)} aria-label="닫기">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </ActivitySheetCloseBtn>
            </ActivitySheetHeader>
            <ActivityFilterRow>
              {['전체', '공지', '댓글', '일정'].map((f) => (
                <ActivityFilterChip key={f} className={f === '전체' ? 'active' : ''}>{f}</ActivityFilterChip>
              ))}
            </ActivityFilterRow>
            <ActivitySheetList>
              {allActivities.length === 0 ? (
                <EmptyState>활동 내역이 없습니다.</EmptyState>
              ) : (
                allActivities.map((act) => (
                  <ActivitySheetItem key={act.id} onClick={() => handleActivityClick(act)}>
                    <ActivityItemIcon className={act.type}>
                      {ACTIVITY_ICONS[act.type] || '🔔'}
                    </ActivityItemIcon>
                    <ActivityItemBody>
                      <ActivitySheetGroupTag>{act.groupName}</ActivitySheetGroupTag>
                      <ActivityMessage>{act.message}</ActivityMessage>
                      <ActivityTime>{timeAgo(act.timestamp)}</ActivityTime>
                    </ActivityItemBody>
                  </ActivitySheetItem>
                ))
              )}
            </ActivitySheetList>
          </ActivitySheetPanel>
        </>
      )}

      {/* 전체 나의 모임 목록 모달 */}
      <MyGroupsModal
        isOpen={isGroupsModalOpen}
        onClose={() => setIsGroupsModalOpen(false)}
      />

      {/* 모임 상세보기 모달 */}
      <GroupDetailModal
        isOpen={isDetailModalOpen}
        group={selectedGroup}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* 6단계 신규 모임 생성 모달 */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 최근 활동 상세 모달 */}
      <ActivityDetailModal
        isOpen={isActivityDetailModalOpen}
        activity={selectedActivityForModal}
        onClose={() => setIsActivityDetailModalOpen(false)}
      />
    </>
  );
};

// Styled Components
const GroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

const SearchBar = styled.div`
  margin: 6px 20px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.bgCard};
`;

const SearchIcon = styled.span`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textLight};
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: none;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const PageTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 14px;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.4px;
  margin: 0;
`;

const MoreBtn = styled.button`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.black};
    background: #f1f5f9;
  }
`;

const GroupGrid = styled.div`
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const GroupCard = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  min-height: 168px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.black};
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: ${({ theme }) => theme.shadows.card};

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(38, 38, 44, 0.1), 0 6px 6px rgba(38, 38, 44, 0.05);
  }

  &:active {
    transform: scale(0.97);
  }

  &::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    right: -20px;
    bottom: -18px;
    background: rgba(0, 0, 0, 0.07);
    z-index: -1;
  }

  &.yellow { background: ${({ theme }) => theme.colors.yellowDark}; }
  &.pink { background: ${({ theme }) => theme.colors.pink}; color: ${({ theme }) => theme.colors.white}; }
  &.blue { background: ${({ theme }) => theme.colors.blue}; }
  &.cream { background: ${({ theme }) => theme.colors.creamLight}; }
  &.green { background: ${({ theme }) => theme.colors.greenLight}; }
`;

const GroupCardIcon = styled.div`
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const GroupAvatarImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #FFF;
`;

const GroupCardBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const GroupCardName = styled.div`
  font-size: 16.5px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.3px;
`;

const GroupCardCount = styled.div`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.75;
`;

const GroupCardMembers = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
`;

const MemberAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  margin-right: -8px;
  box-sizing: border-box;
  object-fit: cover;
`;

const MembersMore = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.white};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &.yellow { background: #4C3C03; border-color: rgba(255, 255, 255, 0.4); }
  &.pink { background: #5E1C3D; border-color: rgba(255, 255, 255, 0.4); }
  &.blue { background: #1B3C50; border-color: rgba(255, 255, 255, 0.4); }
  &.cream { background: #7C5D29; border-color: rgba(255, 255, 255, 0.4); }
  &.green { background: #1F4C29; border-color: rgba(255, 255, 255, 0.4); }
`;

const Section = styled.section`
  padding: 0 20px;
  margin-top: 28px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin: 0;
`;

const SectionLink = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
`;

const ActivityList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActivityItemCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(38, 38, 44, 0.08);
  }
`;

const ActivityItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  background: #FBEFC7;

  &.comment {
    background: ${({ theme }) => theme.colors.pinkLight};
  }

  &.schedule {
    background: ${({ theme }) => theme.colors.blueLight};
  }
`;

const ActivityItemBody = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
`;

const ActivityTime = styled.div`
  margin-top: 4px;
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 600;
`;

const EmptyState = styled.div`
  padding: 32px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 13px;
  font-weight: 600;
`;

/* ── 최근 활동 바텀시트 ── */
const ActivitySheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(38, 38, 44, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9000;
  animation: fadeInAct 0.2s ease forwards;
  @keyframes fadeInAct { from { opacity: 0; } to { opacity: 1; } }
`;

const ActivitySheetPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  max-height: 82vh;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: 28px 28px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9001;
  animation: slideUpAct 0.38s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
  @keyframes slideUpAct {
    from { transform: translateX(-50%) translateY(100%); }
    to   { transform: translateX(-50%) translateY(0); }
  }
`;

const ActivitySheetHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(38, 38, 44, 0.18);
  margin: 12px auto 0;
  flex-shrink: 0;
`;

const ActivitySheetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px 8px;
  flex-shrink: 0;
`;

const ActivitySheetTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  flex: 1;
`;

const ActivitySheetCount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
  background: ${({ theme }) => theme.colors.grayLight};
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.round};
`;

const ActivitySheetCloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.grayLight};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
  &:hover { background: ${({ theme }) => theme.colors.border}; }
`;

const ActivityFilterRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px 12px;
  flex-shrink: 0;
`;

const ActivityFilterChip = styled.button`
  padding: 6px 16px;
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 12.5px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.grayLight};
  color: ${({ theme }) => theme.colors.textSub};
  border: 1.5px solid transparent;
  transition: all 0.15s ease;
  &.active {
    background: ${({ theme }) => theme.colors.yellow};
    color: #7A5C29;
    border-color: rgba(122, 92, 41, 0.2);
  }
`;

const ActivitySheetList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 24px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ActivitySheetItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.bgCard};
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(38, 38, 44, 0.04);
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(38, 38, 44, 0.08);
  }
`;

const ActivitySheetGroupTag = styled.span`
  display: inline-block;
  margin-bottom: 4px;
  font-size: 10.5px;
  font-weight: 800;
  color: #7A5C29;
  background: ${({ theme }) => theme.colors.yellowLight};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
`;

