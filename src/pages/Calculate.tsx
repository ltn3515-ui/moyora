import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import type { Settlement } from '../types';
import { GameRoomModal } from '../components/Modal/GameRoomModal';
import { SettlementDetailModal } from '../components/Modal/SettlementDetailModal';
import { PaySettlementModal } from '../components/Modal/PaySettlementModal';
import { ShareImageModal } from '../components/Modal/ShareImageModal';
import { SplitCalculatorModal } from '../components/Modal/SplitCalculatorModal';

import galleryThumb from '../assets/gallery_thumb.png';
import workshopThumb from '../assets/workshop_thumb.png';

const THUMB_MAP: Record<string, string> = {
  'gallery_thumb.png': galleryThumb || '/gallery_thumb.png',
  'workshop_thumb.png': workshopThumb || '/workshop_thumb.png'
};

const ICON_TREND_UP = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 17 6-6 4 4 8-9" />
    <path d="M15 6h6v6" />
  </svg>
);

const ICON_CHEVRON_RIGHT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const ICON_SHARE_SMALL = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="2.6" />
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="18" cy="19" r="2.6" />
    <path d="m8.3 10.6 7.4-4.2M8.3 13.4l7.4 4.2" />
  </svg>
);

const ICON_QR = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.2" />
    <rect x="14" y="3" width="7" height="7" rx="1.2" />
    <rect x="3" y="14" width="7" height="7" rx="1.2" />
    <path d="M14 14h3v3h-3z" />
    <path d="M20 14v3M14 20h3M20 20v.01" />
  </svg>
);

const ICON_GAME = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="7.5" width="19" height="10" rx="5" />
    <path d="M7 10.5v4M5 12.5h4" />
    <circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="18.5" cy="13" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const ICON_IMAGE = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="m4.5 16.5 5-5 3.2 3.2L16 11l4 4.5" />
  </svg>
);

const ICON_SHARE_UPLOAD = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v13" />
    <path d="m7 8 5-5 5 5" />
    <path d="M5 15v3.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V15" />
  </svg>
);

export const Calculate: React.FC = () => {
  const { participationStats, settlements, settlementInsight, setCameraOpen } = useAppContext();
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [isGameRoomOpen, setIsGameRoomOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isShareImageModalOpen, setIsShareImageModalOpen] = useState(false);
  const [isSplitCalcOpen, setIsSplitCalcOpen] = useState(false);
  const [sheetFilter, setSheetFilter] = useState<'전체' | '정산완료' | '대기중'>('전체');

  const handleOpenDetail = (item?: Settlement) => {
    const target = item || (settlements && settlements.length > 0 ? settlements[0] : null);
    setSelectedSettlement(target);
    setIsDetailOpen(true);
  };

  const handleOpenPay = (item?: Settlement) => {
    const target = item || (settlements && settlements.length > 0 ? settlements[0] : null);
    setSelectedSettlement(target);
    setIsPayModalOpen(true);
  };

  // 트레이드 계산을 위한 차트 그리기 변수들
  const chartWidth = 300;
  const chartHeight = 130;
  const padX = 6;
  const maxValue = 100;
  const pointsCount = participationStats.points.length;
  const step = (chartWidth - padX * 2) / (pointsCount - 1);

  // 각 좌표 매핑 계산
  const coords = participationStats.points.map((p, i) => {
    const x = padX + step * i;
    const y = chartHeight - (p.value / maxValue) * (chartHeight - 14) - 4;
    return { x, y, point: p };
  });

  // SVG 패스 빌드
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${chartHeight} L ${coords[0].x.toFixed(1)} ${chartHeight} Z`;

  // 피크 점 구하기
  const peak = coords.reduce((max, c) => (c.point.value > max.point.value ? c : max), coords[0]);
  const peakPercentX = (peak.x / chartWidth) * 100;
  const peakPercentY = (peak.y / chartHeight) * 100;

  const formatThousands = (n: number) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleShareClick = (item: Settlement) => {
    alert(`"${item.title}" 정산 항목 공유 기능은 다음 단계에서 연결됩니다.`);
  };

  return (
    <>
    <CalculateContainer>
      <CalculateTitle>정산 현황</CalculateTitle>

      {/* 참여 현황 차트 카드 */}
      <Section>
        <ParticipationCard>
          <ParticipationHead>
            <div>
              <ParticipationCardTitle>참여 현황</ParticipationCardTitle>
              <ParticipationCardSubtitle>{participationStats.rangeLabel}</ParticipationCardSubtitle>
            </div>
            <ParticipationRateWrap>
              <ParticipationRateTop>
                {ICON_TREND_UP}
                <span>{participationStats.rate}%</span>
              </ParticipationRateTop>
              <ParticipationRateLabel>참여도</ParticipationRateLabel>
            </ParticipationRateWrap>
          </ParticipationHead>

          <ParticipationChart>
            <ChartGrid>
              {Array.from({ length: 4 }).map((_, idx) => (
                <ChartGridLine key={idx} />
              ))}
            </ChartGrid>
            <ChartSvgWrap>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%" preserveAspectRatio="none">
                <path d={areaPath} fill="rgba(38,38,44,0.08)" stroke="none" />
                <path d={linePath} fill="none" stroke="rgba(38,38,44,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={peak.x.toFixed(1)} cy={peak.y.toFixed(1)} r="4.5" fill="#26262C" />
              </svg>
            </ChartSvgWrap>
            <ChartPeakLabel style={{ left: `${peakPercentX}%`, top: `${peakPercentY}%` }}>
              Peak
            </ChartPeakLabel>
          </ParticipationChart>

          <ChartAxis>
            {participationStats.points.map((p, idx) => (
              <span key={idx}>{p.time}</span>
            ))}
          </ChartAxis>
        </ParticipationCard>
      </Section>

      {/* QR카메라 / 계산기 / 게임룸 / 정산하기 */}
      <Section className="margin3">
        <ActionGrid>
          <ActionCardQr onClick={() => setCameraOpen(true)}>
            <ActionIcon className="qr">{ICON_QR}</ActionIcon>
            <ActionCardTitle>QR 카메라</ActionCardTitle>
            <ActionCardDesc>현장 정산 스캔</ActionCardDesc>
          </ActionCardQr>
          <ActionCardCalc onClick={() => setIsSplitCalcOpen(true)}>
            <ActionIcon className="calc">🧮</ActionIcon>
            <ActionCardTitle>N분의 1 계산기</ActionCardTitle>
            <ActionCardDesc>간편 금액 분할</ActionCardDesc>
          </ActionCardCalc>
          <ActionCardGame onClick={() => setIsGameRoomOpen(true)}>
            <ActionIcon className="game">{ICON_GAME}</ActionIcon>
            <ActionCardTitle>게임 룸</ActionCardTitle>
            <ActionCardDesc>리워드 정산 관리</ActionCardDesc>
          </ActionCardGame>
          <ActionCardPay onClick={() => handleOpenPay()}>
            <ActionIcon className="pay">💸</ActionIcon>
            <ActionCardTitle>정산하기</ActionCardTitle>
            <ActionCardDesc>간편 결제/송금</ActionCardDesc>
          </ActionCardPay>
        </ActionGrid>
      </Section>

      {/* 최근 정산 내역 */}
      <Section className="margin6">
        <SectionHead>
          <SectionTitle>최근 정산 내역</SectionTitle>
          <SectionLink onClick={() => setIsAllOpen(true)}>
            전체보기 {ICON_CHEVRON_RIGHT}
          </SectionLink>
        </SectionHead>
        <SettlementList>
          {settlements.map((item) => {
            const isDone = item.status === 'done';
            return (
              <SettlementItem key={item.id} onClick={() => handleOpenDetail(item)}>
                <SettlementThumb>
                  {item.thumbnail ? (
                    <img src={THUMB_MAP[item.thumbnail]} alt={item.title} />
                  ) : (
                    item.emoji || '💰'
                  )}
                </SettlementThumb>
                <SettlementBody>
                  <SettlementTitleRow>
                    <SettlementItemTitle>{item.title}</SettlementItemTitle>
                    <SettlementStatus className={item.status}>
                      {isDone ? '정산완료' : '대기중'}
                    </SettlementStatus>
                  </SettlementTitleRow>
                  <SettlementMeta>{item.date} · {item.category}</SettlementMeta>
                </SettlementBody>
                <SettlementSide>
                  <SettlementShareBtn onClick={(e) => { e.stopPropagation(); handleShareClick(item); }} aria-label={`${item.title} 공유`}>
                    {ICON_SHARE_SMALL}
                  </SettlementShareBtn>
                  <SettlementAmount className={isDone ? 'positive' : ''}>
                    {isDone ? '+' : ''}₩{formatThousands(item.amount)}
                  </SettlementAmount>
                </SettlementSide>
              </SettlementItem>
            );
          })}
        </SettlementList>
      </Section>

      {/* 인사이트 카드 */}
      <Section className="margin6">
        <InsightCard>
          <InsightText>{settlementInsight.message}</InsightText>
          <InsightBtn onClick={() => handleOpenDetail()}>
            {settlementInsight.ctaLabel}
          </InsightBtn>
        </InsightCard>
      </Section>

      {/* 결과 이미지로 공유 배너 */}
      <Section className="margin4">
        <ShareBanner onClick={() => setIsShareImageModalOpen(true)}>
          <ShareBannerRow>
            <ShareBannerIcon>{ICON_IMAGE}</ShareBannerIcon>
            <ShareBannerText>영수증 내역과 결과를 이미지로 저장하여 공유해보세요!</ShareBannerText>
          </ShareBannerRow>
          <ShareBannerBtn type="button" onClick={(e) => { e.stopPropagation(); setIsShareImageModalOpen(true); }}>
            {ICON_SHARE_UPLOAD}
            전체 결과 이미지로 공유하기
          </ShareBannerBtn>
        </ShareBanner>
      </Section>
    </CalculateContainer>

      {isAllOpen && (
        <>
          <SheetOverlay onClick={() => setIsAllOpen(false)} />
          <SheetPanel>
            <SheetHandle />
            <SheetHeader>
              <SheetTitle>전체 정산 내역</SheetTitle>
              <SheetCount>
                {settlements.filter((item) => {
                  if (sheetFilter === '전체') return true;
                  if (sheetFilter === '정산완료') return item.status === 'done';
                  if (sheetFilter === '대기중') return item.status === 'pending';
                  return true;
                }).length}건
              </SheetCount>
              <SheetCloseBtn onClick={() => setIsAllOpen(false)} aria-label="닫기">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </SheetCloseBtn>
            </SheetHeader>
            <SheetFilterRow>
              {(['전체', '정산완료', '대기중'] as const).map((f) => (
                <SheetFilterChip 
                  key={f} 
                  className={f === sheetFilter ? 'active' : ''}
                  onClick={() => setSheetFilter(f)}
                >
                  {f}
                </SheetFilterChip>
              ))}
            </SheetFilterRow>
            <SheetList>
              {settlements
                .filter((item) => {
                  if (sheetFilter === '전체') return true;
                  if (sheetFilter === '정산완료') return item.status === 'done';
                  if (sheetFilter === '대기중') return item.status === 'pending';
                  return true;
                })
                .map((item) => {
                  const isDone = item.status === 'done';
                  return (
                    <SheetItem key={item.id} onClick={() => handleOpenDetail(item)}>
                      <SettlementThumb>
                        {item.thumbnail ? (
                          <img src={THUMB_MAP[item.thumbnail]} alt={item.title} />
                        ) : (
                          item.emoji || '💰'
                        )}
                      </SettlementThumb>
                      <SettlementBody>
                        <SettlementTitleRow>
                          <SettlementItemTitle>{item.title}</SettlementItemTitle>
                          <SettlementStatus className={item.status}>
                            {isDone ? '정산완료' : '대기중'}
                          </SettlementStatus>
                        </SettlementTitleRow>
                        <SettlementMeta>{item.date} · {item.category}</SettlementMeta>
                      </SettlementBody>
                      <SettlementSide>
                        <SettlementShareBtn onClick={(e) => { e.stopPropagation(); handleShareClick(item); }} aria-label={`${item.title} 공유`}>
                          {ICON_SHARE_SMALL}
                        </SettlementShareBtn>
                        <SettlementAmount className={isDone ? 'positive' : ''}>
                          {isDone ? '+' : ''}₩{formatThousands(item.amount)}
                        </SettlementAmount>
                      </SettlementSide>
                    </SheetItem>
                  );
                })}
            </SheetList>
          </SheetPanel>
        </>
      )}

      {/* 게임 룸 모달 */}
      <GameRoomModal
        isOpen={isGameRoomOpen}
        onClose={() => setIsGameRoomOpen(false)}
      />

      {/* 정산 상세 모달 */}
      <SettlementDetailModal
        isOpen={isDetailOpen}
        settlement={selectedSettlement}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* 정산하기/결제 모달 */}
      <PaySettlementModal
        isOpen={isPayModalOpen}
        settlement={selectedSettlement}
        onClose={() => setIsPayModalOpen(false)}
      />

      {/* 정산 결과 이미지 공유 모달 */}
      <ShareImageModal
        isOpen={isShareImageModalOpen}
        onClose={() => setIsShareImageModalOpen(false)}
      />

      {/* N분의 1 정산 계산기 모달 */}
      <SplitCalculatorModal
        isOpen={isSplitCalcOpen}
        onClose={() => setIsSplitCalcOpen(false)}
      />
    </>
  );
};

// Styled Components
const CalculateContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

const CalculateTitle = styled.h2`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.space5} ${({ theme }) => theme.spacing.space4} ${({ theme }) => theme.spacing.space2};
  font-size: 24px;
  font-weight: 800;
  color: #7A5C29;
  letter-spacing: -0.3px;
  margin: 0;
`;

const Section = styled.section`
  padding: 0 20px;

  &.margin3 {
    margin-top: 12px;
  }

  &.margin4 {
    margin-top: 20px;
  }

  &.margin6 {
    margin-top: 28px;
  }
`;

const ParticipationCard = styled.div`
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: linear-gradient(160deg, ${({ theme }) => theme.colors.pink}, #EF7CA9);
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const ParticipationHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ParticipationCardTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

const ParticipationCardSubtitle = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: rgba(38, 38, 44, 0.65);
  font-weight: 600;
`;

const ParticipationRateWrap = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 7px 14px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
`;

const ParticipationRateTop = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12.5px;
  font-weight: 800;
`;

const ParticipationRateLabel = styled.span`
  font-size: 9.5px;
  font-weight: 700;
  opacity: 0.8;
`;

const ParticipationChart = styled.div`
  position: relative;
  margin-top: 20px;
`;

const ChartGrid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 130px;
`;

const ChartGridLine = styled.span`
  border-top: 1px dashed rgba(38, 38, 44, 0.18);
  width: 100%;
`;

const ChartSvgWrap = styled.div`
  position: absolute;
  inset: 0;
  height: 130px;
`;

const ChartPeakLabel = styled.span`
  position: absolute;
  transform: translate(-50%, -130%);
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`;

const ChartAxis = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;

  span {
    font-size: 11px;
    font-weight: 600;
    color: rgba(38, 38, 44, 0.55);
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const BaseActionCard = styled.button`
  padding: 16px 12px;
  border-radius: ${({ theme }) => theme.radius.lg};
  text-align: left;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(38, 38, 44, 0.12), 0 6px 6px rgba(38, 38, 44, 0.06);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const ActionCardQr = styled(BaseActionCard)`
  background: ${({ theme }) => theme.colors.yellow};
`;

const ActionCardGame = styled(BaseActionCard)`
  background: #C4DCF2;
`;

const ActionCardCalc = styled(BaseActionCard)`
  background: #FFE4E4;
`;

const ActionCardPay = styled(BaseActionCard)`
  background: #FEDD13;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.4);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 14px 28px rgba(254, 221, 19, 0.55);
    background: #f5cf00;
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }
`;

const ActionIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &.qr {
    background: #7A5C29;
    color: ${({ theme }) => theme.colors.white};
  }

  &.game {
    background: #3E6D9C;
    color: ${({ theme }) => theme.colors.white};
  }

  &.pay {
    background: #111827;
    color: #FEDD13;
  }
`;

const ActionCardTitle = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 800;

  ${ActionCardQr} & { color: #7A5C29; }
  ${ActionCardGame} & { color: #244C75; }
  ${ActionCardPay} & { color: #111827; }
`;

const ActionCardDesc = styled.div`
  margin-top: 2px;
  font-size: 11px;
  font-weight: 600;

  ${ActionCardQr} & { color: rgba(122, 92, 41, 0.85); }
  ${ActionCardGame} & { color: rgba(36, 76, 117, 0.85); }
  ${ActionCardPay} & { color: rgba(17, 24, 39, 0.8); }
`;

const SectionHead = styled.div`
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
  display: flex;
  align-items: center;
  gap: 2px;
`;

const SettlementList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const SettlementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: transparent;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const SettlementThumb = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.grayLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SettlementBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const SettlementTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const SettlementItemTitle = styled.span`
  font-size: 14.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const SettlementStatus = styled.span`
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 10.5px;
  font-weight: 800;
  white-space: nowrap;

  &.done {
    background: #FEF4CC;
    color: #B58A00;
  }

  &.pending {
    background: #ECECEC;
    color: #7A7A7A;
  }
`;

const SettlementMeta = styled.div`
  margin-top: 3px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  font-weight: 600;
`;

const SettlementSide = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const SettlementShareBtn = styled.button`
  color: ${({ theme }) => theme.colors.textSub};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SettlementAmount = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;

  &.positive {
    color: #A87515;
  }
`;

const InsightCard = styled.div`
  position: relative;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: #ECEBE8;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};

  &::after {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(254, 221, 19, 0.4) 0%, rgba(254, 221, 19, 0) 70%);
    filter: blur(10px);
  }
`;

const InsightText = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #26262C;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
`;

const InsightBtn = styled.button`
  margin-top: 12px;
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }
`;

const ShareBanner = styled.div`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: #FCEEF3;
`;

const ShareBannerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ShareBannerIcon = styled.span`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #FBD5E4;
  color: #E95A8F;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShareBannerText = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #26262C;
  line-height: 1.5;
  margin: 0;
`;

const ShareBannerBtn = styled.button`
  margin-top: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #9D4373;
  color: #FFFFFF;
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 14px;
  font-weight: 700;
  padding: 12px;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

/* ── 전체 정산 내역 바텀시트 ── */
const SheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(38, 38, 44, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9000;
  animation: fadeIn 0.2s ease forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

const SheetPanel = styled.div`
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
  animation: slideUpSheet 0.38s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;

  @keyframes slideUpSheet {
    from { transform: translateX(-50%) translateY(100%); }
    to   { transform: translateX(-50%) translateY(0); }
  }
`;

const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(38, 38, 44, 0.18);
  margin: 12px auto 0;
  flex-shrink: 0;
`;

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px 8px;
  flex-shrink: 0;
`;

const SheetTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  flex: 1;
`;

const SheetCount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
  background: ${({ theme }) => theme.colors.grayLight};
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.round};
`;

const SheetCloseBtn = styled.button`
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

const SheetFilterRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px 12px;
  flex-shrink: 0;
`;

const SheetFilterChip = styled.button`
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

const SheetList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 24px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const SheetItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.bgCard};
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(38, 38, 44, 0.04);
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(38, 38, 44, 0.08);
  }
`;
