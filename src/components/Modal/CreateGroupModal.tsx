import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../Toast';
import { LocationSelectMapModal, type LocationPlace } from './LocationSelectMapModal';

import activityArt from '../../assets/activity_art.png';
import cafeImg from '../../assets/cafe.png';
import festivalImg from '../../assets/festival.png';
import avatarMe from '../../assets/avatar_me_circle.png';
import avatarF1 from '../../assets/avatar_f1_circle.png';
import avatarF2 from '../../assets/avatar_f2_circle.png';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const { addGroup } = useAppContext();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);

  // 폼 입력 데이터 상태
  const [purpose, setPurpose] = useState<string>('친목모임');
  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('주말 한강 러닝 크루');
  const [participantCount, setParticipantCount] = useState<number>(4);
  const [selectedPlace, setSelectedPlace] = useState<LocationPlace>({
    id: 'loc-default',
    name: '여의도 한강공원 여의나루역 2번 출구',
    address: '서울특별시 영등포구 여의동로 330',
    category: '아웃도어 / 피크닉',
    tags: ['한강공원', '러닝 코스', '피크닉'],
    lat: 37.527,
    lng: 126.932
  });
  const [selectedDate, setSelectedDate] = useState<number>(15);
  const [timeAmPm, setTimeAmPm] = useState<'AM' | 'PM'>('AM');
  const [timeHour, setTimeHour] = useState<string>('09');
  const [timeMinute, setTimeMinute] = useState<string>('00');

  // 장소 지도 모달 팝업 상태
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectPurposeCard = (selectedPurpose: string) => {
    setPurpose(selectedPurpose);
    setStep(2);
  };

  const handleNext = () => {
    if (step === 2 && !groupName.trim()) {
      alert('모임 이름을 입력해주세요!');
      return;
    }
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCompleteSubmit = () => {
    const finalPurpose = purpose === '직접입력' ? customPurpose || '자유모임' : purpose;
    const finalCategory = `#${finalPurpose} #${selectedPlace.name.slice(0, 4)}`;
    const finalIcon = purpose.includes('독서') ? '📖' : purpose.includes('취미') ? '⚽' : purpose.includes('번개') ? '⚡' : '👥';

    addGroup(groupName, finalCategory, finalIcon);
    showToast(`'${groupName}' 모임 생성이 완성되었습니다! 🎉`, 'success', '🎉');
    onClose();
  };

  return (
    <>
      <Overlay onClick={onClose}>
        <ModalCard onClick={(e) => e.stopPropagation()}>
          {/* 상단 프로그레스 헤더 */}
          <StepHeader>
            <HeaderTitleRow>
              {step > 1 && (
                <BackBtn type="button" onClick={handlePrev}>‹ 이전</BackBtn>
              )}
              <StepIndicatorBadge>{step} / 6 단계</StepIndicatorBadge>
            </HeaderTitleRow>
            <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
          </StepHeader>

          {/* 프로그레스 바 */}
          <ProgressBarWrap>
            <ProgressBarFill style={{ width: `${(step / 6) * 100}%` }} />
          </ProgressBarWrap>

          {/* ──────── STEP 1: 목적 선택 ──────── */}
          {step === 1 && (
            <StepContent>
              <HeroImageWrap>
                <HeroImg src={activityArt} alt="모임 대표 이미지" />
                <PhotoAddBadge>📷 사진 추가</PhotoAddBadge>
              </HeroImageWrap>

              <StepTitle>모임의 목적을 알려주세요!</StepTitle>

              <CategoryGrid>
                <CategoryCard
                  className={purpose === '독서모임' ? 'active' : ''}
                  onClick={() => handleSelectPurposeCard('독서모임')}
                >
                  <CardIcon>📖</CardIcon>
                  <CardTitle>독서모임</CardTitle>
                </CategoryCard>

                <CategoryCard
                  className={purpose === '친목모임' ? 'active' : ''}
                  onClick={() => handleSelectPurposeCard('친목모임')}
                >
                  <CardIcon>👥</CardIcon>
                  <CardTitle>친목모임</CardTitle>
                </CategoryCard>

                <CategoryCard
                  className={purpose === '번개모임' ? 'active' : ''}
                  onClick={() => handleSelectPurposeCard('번개모임')}
                >
                  <CardIcon>⚡</CardIcon>
                  <CardTitle>번개모임</CardTitle>
                </CategoryCard>

                <CategoryCard
                  className={purpose === '취미모임' ? 'active' : ''}
                  onClick={() => handleSelectPurposeCard('취미모임')}
                >
                  <CardIcon>⚽</CardIcon>
                  <CardTitle>취미모임</CardTitle>
                </CategoryCard>
              </CategoryGrid>

              <CustomInputBox>
                <span>🖊️ 직접입력:</span>
                <input
                  type="text"
                  placeholder="모임 목적을 입력해주세요..."
                  value={customPurpose}
                  onChange={(e) => {
                    setCustomPurpose(e.target.value);
                    setPurpose('직접입력');
                  }}
                />
              </CustomInputBox>

              {/* 직접입력 좌측/중앙 하단에 시인성 높인 다음 단계 버튼 배치 */}
              <Step1NextBtn type="button" onClick={handleNext}>
                다음 단계로 →
              </Step1NextBtn>
            </StepContent>
          )}

          {/* ──────── STEP 2: 모임 이름 설정 ──────── */}
          {step === 2 && (
            <StepContent>
              <StepTitle>모임 이름 설정</StepTitle>
              <StepSubtitle>
                모임의 이름과 성격이 잘 드러나는 멋진 이름을 지어주세요.
              </StepSubtitle>

              <InputFormGroup>
                <FormLabel>모임 이름</FormLabel>
                <TextInput
                  type="text"
                  placeholder="예: 주말 아침 독서 클럽"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </InputFormGroup>

              <FooterNav>
                <PrevBtn type="button" onClick={handlePrev}>이전</PrevBtn>
                <NextBtn type="button" onClick={handleNext}>다음 단계로 →</NextBtn>
              </FooterNav>
            </StepContent>
          )}

          {/* ──────── STEP 3: 인원 설정 ──────── */}
          {step === 3 && (
            <StepContent>
              <StepTitle>누구와 함께하시나요?</StepTitle>
              <StepSubtitle>모집할 정원 수와 함께할 친구를 초대해보세요.</StepSubtitle>

              <CounterBox>
                <CounterLabel>PARTICIPANTS</CounterLabel>
                <CounterControls>
                  <CounterBtn
                    type="button"
                    onClick={() => setParticipantCount(Math.max(2, participantCount - 1))}
                  >
                    -
                  </CounterBtn>
                  <CountDisplay>{participantCount} 명</CountDisplay>
                  <CounterBtn
                    type="button"
                    onClick={() => setParticipantCount(participantCount + 1)}
                  >
                    +
                  </CounterBtn>
                </CounterControls>
              </CounterBox>

              <InviteFriendsCard>
                <FriendAvatarGroup>
                  <img src={avatarMe} alt="나" />
                  <img src={avatarF1} alt="친구1" />
                  <img src={avatarF2} alt="친구2" />
                </FriendAvatarGroup>
                <span>친구 목록에서 초대</span>
                <ChevronRight>➔</ChevronRight>
              </InviteFriendsCard>

              <FooterNav>
                <PrevBtn type="button" onClick={handlePrev}>이전</PrevBtn>
                <NextBtn type="button" onClick={handleNext}>다음 단계로 →</NextBtn>
              </FooterNav>
            </StepContent>
          )}

          {/* ──────── STEP 4: 장소 선택 (지도 모달 연동) ──────── */}
          {step === 4 && (
            <StepContent>
              <StepTitle>어디서 만나실 건가요?</StepTitle>
              <StepSubtitle>모임의 만남 장소를 지도로 정확히 선택해주세요.</StepSubtitle>

              {/* 클릭 시 장소 지도 모달 팝업 */}
              <SearchTriggerBox onClick={() => setIsMapModalOpen(true)}>
                <SearchIcon>🔍</SearchIcon>
                <span>장소 검색 (예: 강남역, 한강공원, 성수동)</span>
                <MapTriggerBtn type="button">지도 열기 🗺️</MapTriggerBtn>
              </SearchTriggerBox>

              <PlaceSummaryCard>
                <PlaceIcon>🏢</PlaceIcon>
                <PlaceInfo>
                  <PlaceName>{selectedPlace.name}</PlaceName>
                  <PlaceAddress>{selectedPlace.address}</PlaceAddress>
                </PlaceInfo>
              </PlaceSummaryCard>

              <FooterNav>
                <PrevBtn type="button" onClick={handlePrev}>이전</PrevBtn>
                <NextBtn type="button" onClick={handleNext}>다음 단계로 →</NextBtn>
              </FooterNav>
            </StepContent>
          )}

          {/* ──────── STEP 5: 일정 및 시간 선택 ──────── */}
          {step === 5 && (
            <StepContent>
              <StepTitle>언제 만나실 건가요?</StepTitle>
              <StepSubtitle>모임의 날짜와 시간을 정확하게 선택해 주세요.</StepSubtitle>

              <CalendarBox>
                <CalendarHeader>2026년 8월</CalendarHeader>
                <CalendarGrid>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <DayCell
                      key={d}
                      className={selectedDate === d ? 'selected' : ''}
                      onClick={() => setSelectedDate(d)}
                    >
                      {d}
                    </DayCell>
                  ))}
                </CalendarGrid>
              </CalendarBox>

              <TimePickerBox>
                <TimeLabel>시간 선택</TimeLabel>
                <TimeWheelRow>
                  <AmPmToggle
                    type="button"
                    className={timeAmPm === 'AM' ? 'active' : ''}
                    onClick={() => setTimeAmPm(timeAmPm === 'AM' ? 'PM' : 'AM')}
                  >
                    {timeAmPm}
                  </AmPmToggle>

                  <TimeSelect
                    value={timeHour}
                    onChange={(e) => setTimeHour(e.target.value)}
                  >
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                  </TimeSelect>
                  <span>:</span>
                  <TimeSelect
                    value={timeMinute}
                    onChange={(e) => setTimeMinute(e.target.value)}
                  >
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </TimeSelect>
                </TimeWheelRow>
              </TimePickerBox>

              <FooterNav>
                <PrevBtn type="button" onClick={handlePrev}>이전</PrevBtn>
                <NextBtn type="button" onClick={handleNext}>다음 단계로 →</NextBtn>
              </FooterNav>
            </StepContent>
          )}

          {/* ──────── STEP 6: 최종 확인 및 모임 생성 ──────── */}
          {step === 6 && (
            <StepContent>
              <StepTitle>모임 정보를 확인해주세요!</StepTitle>
              <StepSubtitle>마지막으로 입력하신 내용이 맞는지 확인해 주세요.</StepSubtitle>

              <FinalSummaryCard>
                <SummaryHeader>
                  <GroupTitleText>{groupName}</GroupTitleText>
                  <CategoryTags>#{purpose} #생활스포츠</CategoryTags>
                </SummaryHeader>

                <SummaryDetailRow>
                  <DetailIcon>👥</DetailIcon>
                  <DetailText>모집인원: 2명 - {participantCount}명 / 매주 토요일 {timeAmPm} {timeHour}:{timeMinute}</DetailText>
                </SummaryDetailRow>

                <SummaryDetailRow>
                  <DetailIcon>📍</DetailIcon>
                  <DetailText>장소: {selectedPlace.name} ({selectedPlace.address})</DetailText>
                </SummaryDetailRow>

                <MapThumbnailPreview>
                  <MapThumbImg src={festivalImg || cafeImg} alt="장소 미리보기" />
                  <MapThumbOverlay>📍 {selectedPlace.name}</MapThumbOverlay>
                </MapThumbnailPreview>
              </FinalSummaryCard>

              <FooterNav>
                <PrevBtn type="button" onClick={handlePrev}>이전</PrevBtn>
                <SubmitCompleteBtn type="button" onClick={handleCompleteSubmit}>
                  모임 만들기 ✓
                </SubmitCompleteBtn>
              </FooterNav>
            </StepContent>
          )}
        </ModalCard>
      </Overlay>

      {/* 장소 선택 지도 모달 */}
      <LocationSelectMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={(place) => setSelectedPlace(place)}
      />
    </>
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 800;
  color: #3b82f6;
  cursor: pointer;
`;

const StepIndicatorBadge = styled.span`
  font-size: 12px;
  font-weight: 800;
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 12px;
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

const ProgressBarWrap = styled.div`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #fedd13;
  transition: width 0.3s ease;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const HeroImageWrap = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoAddBadge = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 10px;
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
`;

const StepSubtitle = styled.p`
  margin: -6px 0 0;
  font-size: 13px;
  color: #64748b;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const CategoryCard = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &.active {
    background: #fef08a;
    border-color: #f5cf00;
    box-shadow: 0 4px 12px rgba(254, 221, 19, 0.3);
  }
`;

const CardIcon = styled.span`
  font-size: 26px;
`;

const CardTitle = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
`;

const CustomInputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 700;

  input {
    flex: 1;
    border: none;
    outline: none;
    background: none;
    font-size: 13px;
  }
`;

const InputFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #475569;
`;

const TextInput = styled.input`
  padding: 12px 14px;
  border-radius: 14px;
  border: 1.5px solid #cbd5e1;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #fedd13;
  }
`;

const CounterBox = styled.div`
  background: #f8fafc;
  border: 2px solid #0f172a;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CounterLabel = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 1px;
`;

const CounterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const CounterBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #0f172a;
  background: #ffffff;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #fedd13;
  }
`;

const CountDisplay = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
`;

const InviteFriendsCard = styled.div`
  background: #fdf2f8;
  border: 1.5px solid #fbcfe8;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  span {
    font-size: 13px;
    font-weight: 800;
    color: #9d174d;
  }
`;

const FriendAvatarGroup = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: -8px;
    border: 2px solid #ffffff;
  }
`;

const ChevronRight = styled.span`
  font-size: 16px;
  color: #9d174d;
`;

const SearchTriggerBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  span {
    font-size: 12px;
    color: #64748b;
  }
`;

const SearchIcon = styled.span`
  font-size: 14px;
`;

const MapTriggerBtn = styled.button`
  background: #fedd13;
  border: none;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
  color: #111827;
  cursor: pointer;
`;

const PlaceSummaryCard = styled.div`
  background: #f1f5f9;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PlaceIcon = styled.span`
  font-size: 24px;
`;

const PlaceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlaceName = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

const PlaceAddress = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const CalendarBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CalendarHeader = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
`;

const DayCell = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;

  &.selected {
    background: #111827;
    color: #ffffff;
  }
`;

const TimePickerBox = styled.div`
  background: #fef9c3;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimeLabel = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #854d0e;
`;

const TimeWheelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 800;
`;

const AmPmToggle = styled.button`
  background: #ffffff;
  border: 1px solid #ca8a04;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  &.active {
    background: #ca8a04;
    color: #ffffff;
  }
`;

const TimeSelect = styled.select`
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #ca8a04;
  font-size: 16px;
  font-weight: 800;
`;

const FinalSummaryCard = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SummaryHeader = styled.div`
  background: #fef08a;
  padding: 12px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupTitleText = styled.h4`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
`;

const CategoryTags = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: #854d0e;
`;

const SummaryDetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailIcon = styled.span`
  font-size: 18px;
`;

const DetailText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #334155;
`;

const MapThumbnailPreview = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const MapThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MapThumbOverlay = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
`;

const Step1NextBtn = styled.button`
  width: 100%;
  margin-top: 14px;
  padding: 16px;
  border-radius: 20px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.4);
  transition: all 0.2s ease;

  &:hover {
    background: #1f2937;
    transform: translateY(-2px);
  }
`;

const FooterNav = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  position: sticky;
  bottom: 0;
  background: #ffffff;
  padding-top: 12px;
  padding-bottom: 6px;
  z-index: 10;
  border-top: 1px solid #f1f5f9;
`;

const PrevBtn = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 16px;
  border: 1.5px solid #cbd5e1;
  background: #f8fafc;
  font-size: 15px;
  font-weight: 800;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const NextBtn = styled.button`
  flex: 2;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.35);
  transition: all 0.15s ease;

  &:hover {
    background: #1f2937;
    transform: translateY(-1px);
  }
`;

const SubmitCompleteBtn = styled.button`
  flex: 2;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #fedd13;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(254, 221, 19, 0.45);
  transition: all 0.15s ease;

  &:hover {
    background: #f5cf00;
    transform: translateY(-1px);
  }
`;
