import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '../Toast';

interface MemberStartLocation {
  name: string;
  station: string;
}

interface AiLocationRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOption: (name: string, address: string) => void;
}

interface RecommendPlace {
  id: string;
  name: string;
  address: string;
  avgTime: number;
  reason: string;
  emoji: string;
  badge: string;
  memberTimes: { name: string; time: number; line: string }[];
}

export const AiLocationRecommendModal: React.FC<AiLocationRecommendModalProps> = ({
  isOpen,
  onClose,
  onAddOption,
}) => {
  const { showToast } = useToast();

  // 멤버별 출발역 목록
  const [members, setMembers] = useState<MemberStartLocation[]>([
    { name: '나 (이태노)', station: '성수역' },
    { name: '민수', station: '홍대입구역' },
    { name: '지은', station: '강남역' },
    { name: '현우', station: '수원역' },
  ]);

  const [transitType, setTransitType] = useState<'subway' | 'car'>('subway');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // 추천 결과 리스트
  const recommendations: RecommendPlace[] = [
    {
      id: 'rec-01',
      name: '사당역 (환승 편의 최적지)',
      address: '서울특별시 동작구 사당동 1004-1',
      avgTime: 32,
      emoji: '🚉',
      badge: '대중교통 최적',
      reason: '2호선과 4호선의 교점이며, 경기 남부(수원)에서 이동하는 현우님의 광역버스 소요시간 편차를 크게 줄여주는 교통상의 최적 합류점입니다.',
      memberTimes: [
        { name: '나 (이태노)', time: 28, line: '2호선' },
        { name: '민수', time: 32, line: '2호선' },
        { name: '지은', time: 12, line: '2호선' },
        { name: '현우', time: 56, line: '4호선' },
      ],
    },
    {
      id: 'rec-02',
      name: '한강진역/이태원 (감성 핫플레이스)',
      address: '서울특별시 용산구 한남동 729-7',
      avgTime: 29,
      emoji: '🍷',
      badge: '감성 맛집 밀집',
      reason: '성수와 홍대 중심의 6호선 중간 라인에 위치하며, 2030 연령대 취향 저격 제휴 매장과 카페가 풍부하여 모임 분위기를 높이기 가장 좋습니다.',
      memberTimes: [
        { name: '나 (이태노)', time: 18, line: '2/6호선' },
        { name: '민수', time: 34, line: '6호선' },
        { name: '지은', time: 24, line: '급행/버스' },
        { name: '현우', time: 62, line: '광역버스' },
      ],
    },
    {
      id: 'rec-03',
      name: '신도림역 (대형 몰 & 실내 모임)',
      address: '서울특별시 구로구 신도림동 360-1',
      avgTime: 38,
      emoji: '🏢',
      badge: '실내 약속 추천',
      reason: '1호선과 2호선 환승 중심지로, 날씨에 구애받지 않고 디큐브시티 등 대형 복합쇼핑몰 내에서 쾌적한 만남이 가능한 서부권 최적지입니다.',
      memberTimes: [
        { name: '나 (이태노)', time: 38, line: '2호선' },
        { name: '민수', time: 18, line: '2호선' },
        { name: '지은', time: 28, line: '2호선' },
        { name: '현우', time: 48, line: '1호선' },
      ],
    },
  ];

  if (!isOpen) return null;

  // 출발지 변경 핸들러
  const handleStationChange = (index: number, val: string) => {
    const updated = [...members];
    updated[index].station = val;
    setMembers(updated);
  };

  // 분석 시뮬레이션 시작
  const startAnalysis = () => {
    setIsAnalyzing(true);
    setIsAnalyzed(false);
    showToast('AI가 출발 역 기준 지하철 노선도와 교통 정체 데이터를 분석하고 있습니다... 🤖', 'info', '🤖');

    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      showToast('소요시간 반영 AI 최적 중간지점 추천 완료! 📍', 'success', '✨');
    }, 1800);
  };

  const handleAddRecommendToVote = (rec: RecommendPlace) => {
    onAddOption(rec.name, rec.address);
    showToast(`'${rec.name.split(' (')[0]}'이 장소 투표 후보에 등록되었습니다! 🗳️`, 'success', '📍');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>🤖 AI 대중교통 중간지점 추천</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        <ContentBody>
          {/* 출발지 목록 수정 섹션 */}
          <SectionLabel>👥 멤버별 만남 출발지</SectionLabel>
          <MemberGrid>
            {members.map((m, idx) => (
              <MemberBox key={m.name}>
                <MemberName>{m.name}</MemberName>
                <StationInput
                  type="text"
                  value={m.station}
                  onChange={(e) => handleStationChange(idx, e.target.value)}
                  placeholder="예: 강남역"
                />
              </MemberBox>
            ))}
          </MemberGrid>

          {/* 이동 수단 선택 */}
          <SectionLabel style={{ marginTop: '12px' }}>🚏 이동 수단 필터</SectionLabel>
          <FilterTabs>
            <FilterTabBtn 
              className={transitType === 'subway' ? 'active' : ''} 
              onClick={() => setTransitType('subway')}
            >
              🚇 대중교통 중심
            </FilterTabBtn>
            <FilterTabBtn 
              className={transitType === 'car' ? 'active' : ''} 
              onClick={() => setTransitType('car')}
            >
              🚗 자동차/택시 중심
            </FilterTabBtn>
          </FilterTabs>

          <AnalysisBtn type="button" onClick={startAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? '⚡ AI 소요시간 분석 중...' : '🤖 AI 중간 추천 지점 분석하기'}
          </AnalysisBtn>

          {/* 로딩 애니메이션 */}
          {isAnalyzing && (
            <LoaderCard>
              <LoaderPulse />
              <LoaderText>
                각 멤버별 대중교통(지하철/버스) 배차 간격 및 이동 환승 편차를 연산하고 있습니다.
              </LoaderText>
              <ProgressBarTrack>
                <ProgressBarFill />
              </ProgressBarTrack>
            </LoaderCard>
          )}

          {/* 추천 결과 렌더링 */}
          {isAnalyzed && !isAnalyzing && (
            <RecommendSection>
              <SectionLabel style={{ marginTop: '16px' }}>✨ AI 매칭 중간지점 추천 결과</SectionLabel>
              <RecommendList>
                {recommendations.map((rec, index) => (
                  <RecommendCard key={rec.id}>
                    <CardHeaderRow>
                      <PlaceEmoji>{rec.emoji}</PlaceEmoji>
                      <PlaceInfoCol>
                        <PlaceName>{rec.name}</PlaceName>
                        <PlaceBadge className={index === 0 ? 'top' : ''}>
                          {index + 1}순위 · {rec.badge}
                        </PlaceBadge>
                      </PlaceInfoCol>
                      <PlaceTimeCol>
                        <TimeVal>{rec.avgTime}</TimeVal>
                        <TimeUnit>분 (평균)</TimeUnit>
                      </PlaceTimeCol>
                    </CardHeaderRow>

                    <ReasonBox>
                      💡 {rec.reason}
                    </ReasonBox>

                    {/* 멤버별 상세 소요시간 그래프 */}
                    <MemberTimeList>
                      {rec.memberTimes.map((mt) => {
                        const maxTime = 70;
                        const barWidth = Math.min((mt.time / maxTime) * 100, 100);
                        return (
                          <MemberTimeRow key={mt.name}>
                            <MtName>{mt.name}</MtName>
                            <MtBarTrack>
                              <MtBarFill style={{ width: `${barWidth}%` }} />
                            </MtBarTrack>
                            <MtTimeLabel>{mt.time}분 ({mt.line})</MtTimeLabel>
                          </MemberTimeRow>
                        );
                      })}
                    </MemberTimeList>

                    <AddCandidateBtn type="button" onClick={() => handleAddRecommendToVote(rec)}>
                      이 장소를 투표 후보로 등록 📍
                    </AddCandidateBtn>
                  </RecommendCard>
                ))}
              </RecommendList>
            </RecommendSection>
          )}
        </ContentBody>
      </ModalCard>
    </Overlay>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; backdrop-filter: blur(0px); }
  to { opacity: 1; backdrop-filter: blur(4px); }
`;

const scaleUp = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const loadProgressBar = keyframes`
  0% { left: -40%; width: 30%; }
  50% { width: 50%; }
  100% { left: 110%; width: 20%; }
`;

const loaderPulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(38, 38, 44, 0.6);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.22s ease-out forwards;
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.bg || '#FFFBF3'};
  width: 100%;
  max-width: 440px;
  max-height: 86vh;
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(38, 38, 44, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${scaleUp} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  border: 1px solid rgba(240, 234, 224, 0.8);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #ffffff;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
`;

const CloseBtn = styled.button`
  background: ${({ theme }) => theme.colors.grayLight || '#E9E6DE'};
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text || '#26262C'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray || '#B7B0A3'};
    transform: rotate(90deg);
  }
`;

const ContentBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
`;

const MemberGrid = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
  border-radius: 18px;
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  box-shadow: 0 4px 12px rgba(38, 38, 44, 0.02);
`;

const MemberBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MemberName = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #475569;
`;

const StationInput = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  font-size: 12.5px;
  font-weight: 700;
  outline: none;
  color: #1e293b;
  background: #f8fafc;

  &:focus {
    border-color: #fedd13;
    background: #ffffff;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 6px;
`;

const FilterTabBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  background: #ffffff;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;

  &.active {
    background: #fedd13;
    color: #4c3c03;
    border-color: #fedd13;
    box-shadow: 0 3px 8px rgba(254, 221, 19, 0.2);
  }
`;

const AnalysisBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #26262C;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(38, 38, 44, 0.15);
  margin-top: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: #111115;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoaderCard = styled.div`
  background: #ffffff;
  border: 1px solid #fee2e2;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.03);
  animation: ${loaderPulse} 1.5s ease-in-out infinite;
`;

const LoaderPulse = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  opacity: 0.8;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid #fecaca;
    opacity: 0.5;
  }
`;

const LoaderText = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #ef4444;
  line-height: 1.4;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 4px;
  background: #fee2e2;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div`
  position: absolute;
  height: 100%;
  background: #ef4444;
  border-radius: 2px;
  animation: ${loadProgressBar} 1.6s ease-in-out infinite;
`;

const RecommendSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecommendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecommendCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border || '#F0EAE0'};
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(38, 38, 44, 0.03);
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PlaceEmoji = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const PlaceInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-grow: 1;
`;

const PlaceName = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
`;

const PlaceBadge = styled.span`
  align-self: flex-start;
  font-size: 9px;
  font-weight: 850;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 5px;

  &.top {
    background: #dcfce7;
    color: #166534;
  }
`;

const PlaceTimeCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
`;

const TimeVal = styled.span`
  font-size: 20px;
  font-weight: 900;
  color: #1e293b;
`;

const TimeUnit = styled.span`
  font-size: 9px;
  font-weight: 750;
  color: #64748b;
  margin-top: -2px;
`;

const ReasonBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #475569;
  font-weight: 600;
  border: 1px solid #f1f5f9;
`;

const MemberTimeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
`;

const MemberTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MtName = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
  width: 68px;
  flex-shrink: 0;
`;

const MtBarTrack = styled.div`
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
`;

const MtBarFill = styled.div`
  height: 100%;
  background: #8fc7e8;
  border-radius: 3px;
`;

const MtTimeLabel = styled.span`
  font-size: 10.5px;
  font-weight: 750;
  color: #334155;
  width: 68px;
  text-align: right;
  flex-shrink: 0;
`;

const AddCandidateBtn = styled.button`
  width: 100%;
  padding: 11px;
  border: none;
  background: #fedd13;
  color: #4c3c03;
  font-size: 12.5px;
  font-weight: 800;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 6px rgba(254, 221, 19, 0.15);

  &:hover {
    background: #fada0a;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(254, 221, 19, 0.25);
  }
`;
