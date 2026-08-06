import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';

interface GameRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RouletteItem {
  id: string;
  label: string;
  amount: number;
  color: string;
}

interface LadderPlayer {
  id: string;
  name: string;
  result: string;
  amount: number;
}

interface LadderBridge {
  id: string;
  fromCol: number; // i 번째와 i+1 번째 기둥 연결
  yPercent: number; // 20% ~ 80% 사이의 Y 위치
}

const ROULETTE_COLORS = ['#FEDD13', '#F491BC', '#8FC7E8', '#A8E6CF', '#FFD3B6', '#D4A5A5', '#B5EAD7'];

export const GameRoomModal: React.FC<GameRoomModalProps> = ({ isOpen, onClose }) => {
  const { addSettlement } = useAppContext();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'roulette' | 'ladder'>('roulette');

  /* ──────────────── 1. 룰렛 관련 상태 ──────────────── */
  const [rouletteItems, setRouletteItems] = useState<RouletteItem[]>([
    { id: '1', label: '민수', amount: 5000, color: '#FEDD13' },
    { id: '2', label: '지은', amount: 10000, color: '#F491BC' },
    { id: '3', label: '현우 (꽝)', amount: 0, color: '#8FC7E8' },
    { id: '4', label: '태노', amount: 20000, color: '#A8E6CF' },
    { id: '5', label: '어피치', amount: 15000, color: '#FFD3B6' },
    { id: '6', label: '춘식이 (커피 쏘기)', amount: 6000, color: '#D4A5A5' }
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const [spinning, setSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [wonRouletteItem, setWonRouletteItem] = useState<RouletteItem | null>(null);

  /* ──────────────── 2. 사다리 관련 상태 ──────────────── */
  const [ladderPlayers, setLadderPlayers] = useState<LadderPlayer[]>([
    { id: '1', name: '민수', result: '20,000원', amount: 20000 },
    { id: '2', name: '태노', result: '5,000원', amount: 5000 },
    { id: '3', name: '현우', result: '커피 쏘기 ☕', amount: 6000 },
    { id: '4', name: '지은', result: '10,000원', amount: 10000 }
  ]);
  const [bridges, setBridges] = useState<LadderBridge[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerResult, setNewPlayerResult] = useState('');
  const [newPlayerAmount, setNewPlayerAmount] = useState('');
  
  const [ladderStarted, setLadderStarted] = useState(false);
  const [ladderFinished, setLadderFinished] = useState(false);
  const [ladderMatches, setLadderMatches] = useState<{ name: string; result: string; amount: number }[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState<number>(0);

  // 사다리 가로 다리(Bridge) 무작위 생성 로직
  const createRandomBridges = (playerCount: number): LadderBridge[] => {
    const newBridges: LadderBridge[] = [];
    const numRows = 6; // Y축 층수
    
    for (let r = 0; r < numRows; r++) {
      const yPercent = 20 + (r * 60) / (numRows - 1) + (Math.random() * 4 - 2);
      // 각 층마다 랜덤하게 가로다리 배치 (연속 겹침 방지)
      let prevConnected = false;
      for (let c = 0; c < playerCount - 1; c++) {
        if (!prevConnected && Math.random() > 0.45) {
          newBridges.push({
            id: `b-${r}-${c}-${Math.random()}`,
            fromCol: c,
            yPercent
          });
          prevConnected = true;
        } else {
          prevConnected = false;
        }
      }
    }
    return newBridges;
  };

  // 특정 참가자의 사다리 빨간색 직각 추적 경로(Path) 계산 함수
  const getLadderPathForPlayer = (startCol: number): string => {
    const N = ladderPlayers.length;
    if (N <= 1) return '';

    const getX = (col: number) => 30 + (col * (320 - 60)) / (N - 1);
    const getY = (yPct: number) => 10 + (yPct * (170 - 10)) / 100;

    const sortedBridges = [...bridges].sort((a, b) => a.yPercent - b.yPercent);

    let currCol = startCol;
    let currY = 10;

    const points: { x: number; y: number }[] = [{ x: getX(currCol), y: currY }];

    for (const b of sortedBridges) {
      const bridgeY = getY(b.yPercent);

      if (b.fromCol === currCol) {
        points.push({ x: getX(currCol), y: bridgeY });
        currCol = currCol + 1;
        points.push({ x: getX(currCol), y: bridgeY });
        currY = bridgeY;
      } else if (b.fromCol === currCol - 1) {
        points.push({ x: getX(currCol), y: bridgeY });
        currCol = currCol - 1;
        points.push({ x: getX(currCol), y: bridgeY });
        currY = bridgeY;
      }
    }

    points.push({ x: getX(currCol), y: 170 });

    return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  };

  const handlePlayerBadgeClick = (idx: number) => {
    setActivePlayerIdx(idx);
    setAnimKey(Date.now());
    showToast(`'${ladderPlayers[idx].name}' 님의 사다리 추적 경로를 그립니다! 🔴`, 'info', '🔴');
  };

  // 모달 열리거나 사다리 플레이어가 바뀔 때 가로 다리 자동 생성
  useEffect(() => {
    if (isOpen) {
      setSpinning(false);
      setWonRouletteItem(null);
      setLadderStarted(false);
      setLadderFinished(false);
      setLadderMatches([]);
      setActivePlayerIdx(null);
      setBridges(createRandomBridges(ladderPlayers.length));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const DEFAULT_ROULETTE_ITEMS: RouletteItem[] = [
    { id: '1', label: '민수', amount: 5000, color: '#FEDD13' },
    { id: '2', label: '지은', amount: 10000, color: '#F491BC' },
    { id: '3', label: '현우 (꽝)', amount: 0, color: '#8FC7E8' },
    { id: '4', label: '태노', amount: 20000, color: '#A8E6CF' },
    { id: '5', label: '어피치', amount: 15000, color: '#FFD3B6' },
    { id: '6', label: '춘식이 (커피 쏘기)', amount: 6000, color: '#D4A5A5' }
  ];

  /* ──────────────── 룰렛 핸들러 ──────────────── */
  const handleAddRouletteItem = () => {
    if (!newLabel.trim()) {
      alert('이름 또는 내용을 입력해주세요.');
      return;
    }
    const amt = parseInt(newAmount.replace(/,/g, ''), 10) || 0;
    const newItem: RouletteItem = {
      id: `r-${Date.now()}`,
      label: newLabel.trim(),
      amount: amt,
      color: ROULETTE_COLORS[rouletteItems.length % ROULETTE_COLORS.length]
    };
    setRouletteItems([...rouletteItems, newItem]);
    setNewLabel('');
    setNewAmount('');
  };

  const handleResetRoulette = () => {
    setRouletteItems(DEFAULT_ROULETTE_ITEMS);
    setRotationDegree(0);
    setWonRouletteItem(null);
    setSpinning(false);
    setNewLabel('');
    setNewAmount('');
    showToast('룰렛 판이 기본 상태로 리셋되었습니다! 🔄', 'info', '🔄');
  };

  const handleQuickAddPreset = (presetLabel: string, presetAmount: number) => {
    const newItem: RouletteItem = {
      id: `r-${Date.now()}-${Math.random()}`,
      label: presetLabel,
      amount: presetAmount,
      color: ROULETTE_COLORS[(rouletteItems.length + Math.floor(Math.random() * 5)) % ROULETTE_COLORS.length]
    };
    setRouletteItems((prev) => [...prev, newItem]);
    showToast(`'${presetLabel}' 항목이 추가되었습니다! ✨`, 'success', '➕');
  };

  const handleRemoveRouletteItem = (id: string) => {
    if (rouletteItems.length <= 2) {
      alert('룰렛 항목은 최소 2개 이상이어야 합니다.');
      return;
    }
    setRouletteItems(rouletteItems.filter((i) => i.id !== id));
  };

  const spinRoulette = () => {
    if (spinning || rouletteItems.length < 2) return;

    setSpinning(true);
    setWonRouletteItem(null);

    const count = rouletteItems.length;
    const selectedIdx = Math.floor(Math.random() * count);
    const itemAngle = 360 / count;

    const targetAngle = 360 * 5 + (count - selectedIdx - 1) * itemAngle + itemAngle / 2;
    const nextRotation = rotationDegree + targetAngle;

    setRotationDegree(nextRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonRouletteItem(rouletteItems[selectedIdx]);
    }, 3500);
  };

  const applyRouletteToSettlement = () => {
    if (!wonRouletteItem) return;
    const title = `[룰렛] ${wonRouletteItem.label}`;
    addSettlement(title, wonRouletteItem.amount, '룰렛 게임 정산');
    showToast('룰렛 결과가 정산에 반영되었습니다!', 'success', '🎯');
    onClose();
  };

  /* ──────────────── 사다리 핸들러 ──────────────── */
  const generateRandomLadder = () => {
    setLadderStarted(false);
    setLadderFinished(false);
    setLadderMatches([]);

    // 가로 다리를 새로 무작위 생성
    const newB = createRandomBridges(ladderPlayers.length);
    setBridges(newB);

    showToast('사다리가 랜덤으로 새로 연결되었습니다! 🎲', 'info', '🎲');
  };

  const handleAddLadderPlayer = () => {
    if (!newPlayerName.trim() || !newPlayerResult.trim()) {
      alert('이름과 결과(내용/벌칙)를 모두 입력해주세요.');
      return;
    }
    const amt = parseInt(newPlayerAmount.replace(/,/g, ''), 10) || 0;
    const newP: LadderPlayer = {
      id: `l-${Date.now()}`,
      name: newPlayerName.trim(),
      result: newPlayerResult.trim(),
      amount: amt
    };
    const updated = [...ladderPlayers, newP];
    setLadderPlayers(updated);
    setBridges(createRandomBridges(updated.length));
    setNewPlayerName('');
    setNewPlayerResult('');
    setNewPlayerAmount('');
  };

  const handleRemoveLadderPlayer = (id: string) => {
    if (ladderPlayers.length <= 2) {
      alert('사다리 참가자는 최소 2명 이상이어야 합니다.');
      return;
    }
    const updated = ladderPlayers.filter((p) => p.id !== id);
    setLadderPlayers(updated);
    setBridges(createRandomBridges(updated.length));
  };

  // 실제 사다리 경로를 추적하여 결과를 정확히 산출하는 알고리즘
  const startLadderGame = () => {
    if (ladderStarted) return;
    setLadderStarted(true);
    setLadderFinished(false);

    // Y% 기준 오름차순 정렬된 다리 목록
    const sortedBridges = [...bridges].sort((a, b) => a.yPercent - b.yPercent);
    const N = ladderPlayers.length;
    const matches: { name: string; result: string; amount: number }[] = [];

    for (let startCol = 0; startCol < N; startCol++) {
      let currCol = startCol;
      for (const b of sortedBridges) {
        if (b.fromCol === currCol) {
          currCol = currCol + 1;
        } else if (b.fromCol === currCol - 1) {
          currCol = currCol - 1;
        }
      }
      matches.push({
        name: ladderPlayers[startCol].name,
        result: ladderPlayers[currCol].result,
        amount: ladderPlayers[currCol].amount
      });
    }

    setTimeout(() => {
      setLadderMatches(matches);
      setLadderFinished(true);
    }, 2200);
  };

  const applyLadderToSettlement = () => {
    if (!ladderFinished || ladderMatches.length === 0) return;
    ladderMatches.forEach((m) => {
      addSettlement(`[사다리] ${m.name} (${m.result})`, m.amount, '사다리 게임 정산');
    });
    showToast('사다리 게임 결과가 정산에 반영되었습니다!', 'success', '🪜');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <ModalHeader>
          <HeaderTitle>🎮 미니 게임 룸</HeaderTitle>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </ModalHeader>

        {/* 탭 네비게이션 */}
        <TabRow>
          <TabButton
            type="button"
            className={activeTab === 'roulette' ? 'active' : ''}
            onClick={() => setActiveTab('roulette')}
          >
            🎯 룰렛 돌리기
          </TabButton>
          <TabButton
            type="button"
            className={activeTab === 'ladder' ? 'active' : ''}
            onClick={() => setActiveTab('ladder')}
          >
            🪜 사다리 타기
          </TabButton>
        </TabRow>

        {/* ──────────────── TAB 1: 룰렛 ──────────────── */}
        {activeTab === 'roulette' && (
          <TabContent>
            {/* 룰렛 휠 UI */}
            <WheelSection>
              <WheelPointer>▼</WheelPointer>
              <WheelWrap style={{ transform: `rotate(${rotationDegree}deg)` }}>
                <SvgWheel viewBox="0 0 200 200">
                  {rouletteItems.map((item, idx) => {
                    const count = rouletteItems.length;
                    const angle = 360 / count;
                    const startAngle = idx * angle;
                    const endAngle = (idx + 1) * angle;

                    const x1 = 100 + 95 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 100 + 95 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 100 + 95 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 100 + 95 * Math.sin((Math.PI * endAngle) / 180);

                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const pathData = `M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                    const textAngle = startAngle + angle / 2;
                    const textRad = (Math.PI * textAngle) / 180;
                    const tx = 100 + 60 * Math.cos(textRad);
                    const ty = 100 + 60 * Math.sin(textRad);

                    return (
                      <g key={item.id}>
                        <path d={pathData} fill={item.color} stroke="#ffffff" strokeWidth="1.5" />
                        <text
                          x={tx}
                          y={ty}
                          fill="#1a1a1a"
                          fontSize="9"
                          fontWeight="800"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                        >
                          {item.label}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx="100" cy="100" r="18" fill="#ffffff" stroke="#222" strokeWidth="2" />
                  <circle cx="100" cy="100" r="6" fill="#fedd13" />
                </SvgWheel>
              </WheelWrap>
            </WheelSection>

            {/* 룰렛 돌리기 & 리셋 버튼 바 */}
            <ActionRow>
              <SpinActionBtn type="button" onClick={spinRoulette} disabled={spinning}>
                {spinning ? '룰렛 회전 중... 🌀' : '룰렛 돌리기 🎯'}
              </SpinActionBtn>
              <ResetRouletteBtn type="button" onClick={handleResetRoulette} disabled={spinning} title="룰렛 초기화">
                🔄 리셋
              </ResetRouletteBtn>
            </ActionRow>

            {/* 룰렛 결과 발표 */}
            {wonRouletteItem && (
              <ResultCard>
                <ResultEmoji>🎉</ResultEmoji>
                <ResultText>
                  당첨 결과: <strong>{wonRouletteItem.label}</strong>
                  {wonRouletteItem.amount > 0 && ` (${wonRouletteItem.amount.toLocaleString()}원)`}
                </ResultText>
                <ApplyBtn type="button" onClick={applyRouletteToSettlement}>
                  게임 결과를 정산에 반영하기 💸
                </ApplyBtn>
              </ResultCard>
            )}

            {/* 룰렛 항목 입출력 관리 */}
            <ItemManageBox>
              <ManageHeaderRow>
                <ManageTitle>룰렛 항목 설정 ({rouletteItems.length}개)</ManageTitle>
                <ClearAllBtn type="button" onClick={handleResetRoulette}>
                  🔄 룰렛 초기화
                </ClearAllBtn>
              </ManageHeaderRow>

              <InputRow>
                <StyledInput
                  type="text"
                  placeholder="이름/내용 (예: 민수)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddRouletteItem(); }}
                />
                <StyledInput
                  type="text"
                  placeholder="금액 (예: 10000)"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddRouletteItem(); }}
                />
                <AddChipBtn type="button" onClick={handleAddRouletteItem}>추가</AddChipBtn>
              </InputRow>

              {/* 원클릭 빠른 항목 추가 프리셋 칩 */}
              <PresetRow>
                <PresetLabelText>💡 빠른 추가:</PresetLabelText>
                <PresetChip type="button" onClick={() => handleQuickAddPreset('☕ 커피 쏘기', 5000)}>
                  + ☕ 커피 쏘기
                </PresetChip>
                <PresetChip type="button" onClick={() => handleQuickAddPreset('💣 꽝', 0)}>
                  + 💣 꽝
                </PresetChip>
                <PresetChip type="button" onClick={() => handleQuickAddPreset('💸 10,000원', 10000)}>
                  + 💸 10,000원
                </PresetChip>
                <PresetChip type="button" onClick={() => handleQuickAddPreset('🍕 피자 쏘기', 25000)}>
                  + 🍕 피자 쏘기
                </PresetChip>
              </PresetRow>

              <ChipContainer>
                {rouletteItems.length === 0 ? (
                  <EmptyChipHint>항목이 없습니다. 위 입력창에 항목을 추가하거나 프리셋을 누르세요.</EmptyChipHint>
                ) : (
                  rouletteItems.map((item) => (
                    <ItemChip key={item.id} style={{ borderColor: item.color }}>
                      <span>{item.label} {item.amount > 0 && `(${item.amount.toLocaleString()}원)`}</span>
                      <RemoveTagBtn onClick={() => handleRemoveRouletteItem(item.id)}>✕</RemoveTagBtn>
                    </ItemChip>
                  ))
                )}
              </ChipContainer>
            </ItemManageBox>
          </TabContent>
        )}

        {/* ──────────────── TAB 2: 사다리 타기 ──────────────── */}
        {activeTab === 'ladder' && (
          <TabContent>
            {/* SVG 기반 완벽 연결 사다리 게임 뷰어 */}
            <LadderViewContainer>
              {/* 상단 이름 헤더 (클릭 시 해당 참가자 빨간색 사다리 타기) */}
              <LadderHeaderRow cols={ladderPlayers.length}>
                {ladderPlayers.map((p, idx) => (
                  <LadderHeaderBadge
                    key={p.id}
                    className={activePlayerIdx === idx ? 'active' : ''}
                    onClick={() => handlePlayerBadgeClick(idx)}
                  >
                    {p.name}
                  </LadderHeaderBadge>
                ))}
              </LadderHeaderRow>
              <LadderGuideTip>💡 이름을 클릭하면 빨간색 선으로 사다리를 내려갑니다!</LadderGuideTip>

              {/* SVG 정교한 사다리 판 (기둥과 가로 다리가 100% 매끄럽게 연결) */}
              <SvgLadderBox viewBox="0 0 320 180">
                {/* 1. 세로 기둥 선 (Vertical Poles) */}
                {ladderPlayers.map((_, idx) => {
                  const N = ladderPlayers.length;
                  const x = 30 + (idx * (320 - 60)) / (N - 1);
                  return (
                    <line
                      key={`col-${idx}`}
                      x1={x}
                      y1="10"
                      x2={x}
                      y2="170"
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* 2. 가로 다리 연결 선 (Horizontal Rungs / Bridges) */}
                {bridges.map((b) => {
                  const N = ladderPlayers.length;
                  const x1 = 30 + (b.fromCol * (320 - 60)) / (N - 1);
                  const x2 = 30 + ((b.fromCol + 1) * (320 - 60)) / (N - 1);
                  const y = 10 + (b.yPercent * (170 - 10)) / 100;
                  return (
                    <line
                      key={b.id}
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* 3. 클릭한 참가자의 빨간색 사다리 추적 애니메이션 선 */}
                {activePlayerIdx !== null && (
                  <RedTracePath
                    key={`red-path-${activePlayerIdx}-${animKey}`}
                    d={getLadderPathForPlayer(activePlayerIdx)}
                  />
                )}
              </SvgLadderBox>

              {/* 하단 결과 항목 푸터 */}
              <LadderFooterRow cols={ladderPlayers.length}>
                {ladderPlayers.map((p) => (
                  <LadderFooterBadge key={p.id} className={ladderFinished ? 'done' : ''}>
                    {p.result}
                  </LadderFooterBadge>
                ))}
              </LadderFooterRow>
            </LadderViewContainer>

            {/* 사다리 게임 조작 버튼 모음 */}
            <LadderActionRow>
              <RandomLadderBtn type="button" onClick={generateRandomLadder} disabled={ladderStarted && !ladderFinished}>
                🎲 사다리 랜덤 생성
              </RandomLadderBtn>
              <SpinActionBtn type="button" onClick={startLadderGame} disabled={ladderStarted}>
                {ladderStarted ? (ladderFinished ? '사다리 결과 완료!' : '사다리 타고 내려가는 중... 🪜') : '사다리 시작 🪜'}
              </SpinActionBtn>
            </LadderActionRow>

            {/* 사다리 결과 및 정산 반영 */}
            {ladderFinished && (
              <ResultCard>
                <ResultEmoji>🏆</ResultEmoji>
                <ResultText>사다리 타기 결과가 모두 매칭되었습니다!</ResultText>
                <LadderResultList>
                  {ladderMatches.map((m, i) => (
                    <LadderResultRow key={i}>
                      <span>👤 {m.name}</span>
                      <strong>➡️ {m.result}</strong>
                    </LadderResultRow>
                  ))}
                </LadderResultList>
                <ApplyBtn type="button" onClick={applyLadderToSettlement}>
                  게임 결과를 정산에 반영하기 💸
                </ApplyBtn>
              </ResultCard>
            )}

            {/* 참가자 및 결과 추가 설정 */}
            <ItemManageBox>
              <ManageTitle>참가자 & 결과 설정</ManageTitle>
              <InputRow>
                <StyledInput
                  type="text"
                  placeholder="참가자 (예: 민수)"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                />
                <StyledInput
                  type="text"
                  placeholder="벌칙/결과 (예: 5000원)"
                  value={newPlayerResult}
                  onChange={(e) => setNewPlayerResult(e.target.value)}
                />
                <StyledInput
                  type="text"
                  placeholder="금액 (숫자만)"
                  value={newPlayerAmount}
                  onChange={(e) => setNewPlayerAmount(e.target.value)}
                  style={{ width: '80px' }}
                />
                <AddChipBtn type="button" onClick={handleAddLadderPlayer}>추가</AddChipBtn>
              </InputRow>

              <ChipContainer>
                {ladderPlayers.map((p) => (
                  <ItemChip key={p.id}>
                    <span>{p.name} ➡️ {p.result}</span>
                    <RemoveTagBtn onClick={() => handleRemoveLadderPlayer(p.id)}>✕</RemoveTagBtn>
                  </ItemChip>
                ))}
              </ChipContainer>
            </ItemManageBox>
          </TabContent>
        )}
      </ModalCard>
    </Overlay>
  );
};

// Keyframes
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

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 19px;
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

const TabRow = styled.div`
  display: flex;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 14px;
  gap: 4px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: #ffffff;
    color: #111827;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* 룰렛 스타일 */
const WheelSection = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WheelPointer = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  font-size: 20px;
  color: #ef4444;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const WheelWrap = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: transform 3.5s cubic-bezier(0.15, 0.9, 0.2, 1);
`;

const SvgWheel = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const SpinActionBtn = styled.button`
  flex: 3;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #fedd13;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(254, 221, 19, 0.4);
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f5cf00;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const ResetRouletteBtn = styled.button`
  flex: 1;
  padding: 14px 12px;
  border-radius: 16px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #94a3b8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div`
  background: #fffbeb;
  border: 1.5px solid #fde68a;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
`;

const ResultEmoji = styled.div`
  font-size: 28px;
`;

const ResultText = styled.div`
  font-size: 14px;
  color: #92400e;

  strong {
    font-size: 16px;
    color: #b45309;
  }
`;

const ApplyBtn = styled.button`
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: #059669;
  }
`;

const ItemManageBox = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
`;

const ManageHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ManageTitle = styled.span`
  font-size: 12.5px;
  font-weight: 800;
  color: #374151;
`;

const ClearAllBtn = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;

  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #b91c1c;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 1.5px solid #d1d5db;
  border-radius: 12px;
  padding: 9px 10px;
  font-size: 12px;
  outline: none;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    border-color: #fedd13;
    box-shadow: 0 0 0 2px rgba(254, 221, 19, 0.25);
  }
`;

const AddChipBtn = styled.button`
  flex-shrink: 0;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.25);
  transition: all 0.15s ease;

  &:hover {
    background: #1f2937;
    transform: translateY(-1px);
  }
`;

const PresetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
`;

const PresetLabelText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
`;

const PresetChip = styled.button`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fef9c3;
    border-color: #fef08a;
    color: #854d0e;
  }
`;

const EmptyChipHint = styled.p`
  margin: 8px 0;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ItemChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`;

const RemoveTagBtn = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    color: #ef4444;
  }
`;

/* 사다리 타기 SVG 스타일 */
const LadderViewContainer = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LadderHeaderRow = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
  gap: 6px;
  text-align: center;
`;

const LadderHeaderBadge = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #1e293b;
  background: #fedd13;
  padding: 5px 4px;
  border-radius: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 4px rgba(254, 221, 19, 0.3);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 4px 8px rgba(254, 221, 19, 0.5);
  }

  &.active {
    background: #ef4444;
    color: #ffffff;
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.5);
  }
`;

const LadderGuideTip = styled.div`
  font-size: 11px;
  color: #ef4444;
  font-weight: 700;
  text-align: center;
  margin-top: -2px;
  margin-bottom: -2px;
`;

const traceRedPathAnim = keyframes`
  from {
    stroke-dashoffset: 1200;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const RedTracePath = styled.path`
  stroke: #ef4444;
  stroke-width: 5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: ${traceRedPathAnim} 1.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  filter: drop-shadow(0 2px 5px rgba(239, 68, 68, 0.4));
`;

const SvgLadderBox = styled.svg`
  width: 100%;
  height: 180px;
`;

const LadderFooterRow = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
  gap: 6px;
  text-align: center;
`;

const LadderFooterBadge = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #3b82f6;
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  padding: 5px 4px;
  border-radius: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;

  &.done {
    background: #dbeafe;
    border-color: #2563eb;
    color: #1e40af;
    font-weight: 800;
  }
`;

const LadderResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const LadderResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 8px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #fde68a;
`;

const LadderActionRow = styled.div`
  display: flex;
  gap: 8px;
`;

const RandomLadderBtn = styled.button`
  flex: 1;
  padding: 12px 10px;
  border-radius: 16px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #94a3b8;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
