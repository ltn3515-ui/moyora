import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';
import { GoogleMapView } from '../Map/GoogleMapView';

interface VoteOption {
  id: string;
  name: string;
  address: string;
  votes: number;
  votedUsers: string[];
}

interface LocationVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
}

const INITIAL_OPTIONS: VoteOption[] = [
  {
    id: 'opt-01',
    name: '성수동 어니언 카페 ☕',
    address: '서울특별시 성동구 아차산로9길 8',
    votes: 4,
    votedUsers: ['민수', '지은', '현우', '유진'],
  },
  {
    id: 'opt-02',
    name: '서울숲 야외 피크닉 존 🌳',
    address: '서울특별시 성동구 뚝섬로 273',
    votes: 6,
    votedUsers: ['네오', '프로도', '무지', '콘', '제이지', '튜브'],
  },
  {
    id: 'opt-03',
    name: '뚝섬 한강공원 3주차장 텐트 구역 ⛺',
    address: '서울특별시 광진구 자양동 704',
    votes: 2,
    votedUsers: ['라이언', '춘식이'],
  },
];

export const LocationVoteModal: React.FC<LocationVoteModalProps> = ({
  isOpen,
  onClose,
  groupName,
}) => {
  const { showToast } = useToast();
  const [options, setOptions] = useState<VoteOption[]>(INITIAL_OPTIONS);
  const [myVoteId, setMyVoteId] = useState<string | null>(null);
  const [activeMapId, setActiveMapId] = useState<string | null>('opt-02'); // 기본으로 가장 표가 많은 곳 지도 활성화
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  // 전체 투표 수 계산
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  // 투표 핸들러
  const handleVote = (optionId: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((opt) => {
        // 이미 해당 옵션에 투표했었던 경우 취소 처리
        if (myVoteId === optionId && opt.id === optionId) {
          setMyVoteId(null);
          return {
            ...opt,
            votes: opt.votes - 1,
            votedUsers: opt.votedUsers.filter((user) => user !== '이태노'),
          };
        }
        // 이전에 다른 곳에 투표했다가 변경하는 경우 기존 투표 차감 후 타겟 증가
        if (opt.id === optionId) {
          setMyVoteId(optionId);
          return {
            ...opt,
            votes: opt.votes + 1,
            votedUsers: [...opt.votedUsers, '이태노'],
          };
        }
        if (opt.id === myVoteId) {
          return {
            ...opt,
            votes: opt.votes - 1,
            votedUsers: opt.votedUsers.filter((user) => user !== '이태노'),
          };
        }
        return opt;
      })
    );

    if (myVoteId === optionId) {
      showToast('장소 투표가 성공적으로 취소되었습니다.', 'info');
    } else {
      const target = options.find((o) => o.id === optionId);
      showToast(`'${target?.name}' 장소에 투표했습니다! 📍`, 'success');
    }
  };

  // 새로운 장소 후보 등록
  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) {
      showToast('장소 이름을 입력해주세요.', 'error');
      return;
    }

    const newOpt: VoteOption = {
      id: `opt-${Date.now()}`,
      name: newPlaceName.trim(),
      address: newPlaceAddress.trim() || '온라인 혹은 상세 정보참고',
      votes: 0,
      votedUsers: [],
    };

    setOptions((prev) => [...prev, newOpt]);
    setNewPlaceName('');
    setNewPlaceAddress('');
    setIsAdding(false);
    showToast('새로운 장소 후보가 추가되었습니다! 🆕', 'success');
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>📍 장소 투표하기</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        <GroupLabel>📢 {groupName} 모임 정기 만남 장소</GroupLabel>

        {/* 투표 카드 리스트 */}
        <VoteList>
          {options.map((opt) => {
            const isVoted = myVoteId === opt.id;
            const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

            return (
              <VoteItemCard key={opt.id} className={isVoted ? 'voted' : ''}>
                <VoteClickArea onClick={() => handleVote(opt.id)}>
                  <VoteCheckbox className={isVoted ? 'checked' : ''}>
                    {isVoted && '✓'}
                  </VoteCheckbox>
                  <VoteDetails>
                    <OptionName>{opt.name}</OptionName>
                    <OptionAddress>{opt.address}</OptionAddress>
                  </VoteDetails>
                  <VoteCountBadge>
                    <strong>{opt.votes}표</strong>
                    <span>({percent}%)</span>
                  </VoteCountBadge>
                </VoteClickArea>

                {/* 프로그레스바 */}
                <ProgressBg>
                  <ProgressFill style={{ width: `${percent}%` }} />
                </ProgressBg>

                {/* 가입자 아바타 목록 및 지도 보기 버튼 */}
                <CardFooterRow>
                  <VotedUsersPreview>
                    {opt.votedUsers.length > 0 ? (
                      <>
                        <VotedThumbIcon>👥</VotedThumbIcon>
                        <VotedUsersListText>
                          {opt.votedUsers.slice(0, 3).join(', ')}
                          {opt.votedUsers.length > 3 && ` 외 ${opt.votedUsers.length - 3}명`}
                        </VotedUsersListText>
                      </>
                    ) : (
                      <NoVoteText>가장 먼저 투표해보세요!</NoVoteText>
                    )}
                  </VotedUsersPreview>

                  <MapToggleBtn
                    type="button"
                    className={activeMapId === opt.id ? 'active' : ''}
                    onClick={() => setActiveMapId(activeMapId === opt.id ? null : opt.id)}
                  >
                    {activeMapId === opt.id ? '📍 지도 숨기기' : '🗺️ 지도 보기'}
                  </MapToggleBtn>
                </CardFooterRow>

                {/* 구글 지도 프리뷰 */}
                {activeMapId === opt.id && (
                  <MapContainer>
                    <GoogleMapView
                      locationName={opt.name}
                      address={opt.address}
                      height="140px"
                      showControls={false}
                    />
                  </MapContainer>
                )}
              </VoteItemCard>
            );
          })}
        </VoteList>

        {/* 새 후보 등록 폼 */}
        {isAdding ? (
          <AddForm onSubmit={handleAddOption}>
            <FormTitle>🆕 새로운 장소 추천하기</FormTitle>
            <FormInput
              type="text"
              placeholder="장소 이름 (예: 강남 쉐어스페이스)"
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              required
            />
            <FormInput
              type="text"
              placeholder="장소 주소 (선택 사항)"
              value={newPlaceAddress}
              onChange={(e) => setNewPlaceAddress(e.target.value)}
            />
            <FormBtnRow>
              <CancelBtn type="button" onClick={() => setIsAdding(false)}>
                취소
              </CancelBtn>
              <SubmitBtn type="submit">후보 추가하기</SubmitBtn>
            </FormBtnRow>
          </AddForm>
        ) : (
          <AddSuggestBtn type="button" onClick={() => setIsAdding(true)}>
            ➕ 다른 장소 직접 추천하기
          </AddSuggestBtn>
        )}

        <FooterSection>
          <CloseMainBtn type="button" onClick={onClose}>
            완료
          </CloseMainBtn>
        </FooterSection>
      </ModalCard>
    </Overlay>
  );
};

/* ═══════════════════════════════════
   Animations & Styled Components
═══════════════════════════════════ */
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px) scale(0.96); opacity: 0; }
  to   { transform: translateY(0)    scale(1);    opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  z-index: 1100;
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

const GroupLabel = styled.div`
  font-size: 13.5px;
  font-weight: 800;
  color: #7A5C29;
  background: #FFFBF3;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #F3E4CE;
`;

const VoteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VoteItemCard = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;

  &.voted {
    border-color: #fedd13;
    background: #FFFDF8;
  }
`;

const VoteClickArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const VoteCheckbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
  background: #ffffff;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &.checked {
    background: #fedd13;
    border-color: #fedd13;
    color: #111827;
  }
`;

const VoteDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
`;

const OptionName = styled.span`
  font-size: 13.5px;
  font-weight: 800;
  color: #1e293b;
`;

const OptionAddress = styled.span`
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
`;

const VoteCountBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  flex-shrink: 0;

  strong {
    font-size: 13px;
    font-weight: 800;
    color: #1e293b;
  }
`;

const ProgressBg = styled.div`
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  width: 100%;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #fedd13;
  border-radius: 3px;
  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const CardFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VotedUsersPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const VotedThumbIcon = styled.span`
  font-size: 13px;
`;

const VotedUsersListText = styled.span`
  font-size: 11px;
  color: #64748b;
  font-weight: 700;
`;

const NoVoteText = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
`;

const MapToggleBtn = styled.button`
  font-size: 11px;
  font-weight: 800;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
  }

  &.active {
    background: #e2e8f0;
    border-color: #94a3b8;
  }
`;

const MapContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-top: 4px;
`;

const AddSuggestBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1.8px dashed #cbd5e1;
  border-radius: 14px;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #1e293b;
  }
`;

const AddForm = styled.form`
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormTitle = styled.h4`
  margin: 0 0 2px 0;
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  background: #ffffff;
  color: #1e293b;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
    font-weight: 600;
  }
`;

const FormBtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelBtn = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
  background: #e2e8f0;
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

const SubmitBtn = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
  background: #fedd13;
  color: #111827;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

const FooterSection = styled.div`
  margin-top: 6px;
`;

const CloseMainBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #111827;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  border-radius: 14px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;
