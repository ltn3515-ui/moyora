/* ==========================================================================
   모여라 - calculate.js
   [정산 관리] 화면 렌더링/이벤트 (참여 현황 그래프, 정산 내역, 공유하기 등)
   ========================================================================== */

const ICON_TREND_UP = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>';
const ICON_CHEVRON_RIGHT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
const ICON_SHARE_SMALL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.6 7.4-4.2M8.3 13.4l7.4 4.2"/></svg>';
const ICON_QR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><path d="M14 14h3v3h-3z"/><path d="M20 14v3M14 20h3M20 20v.01"/></svg>';
const ICON_GAME = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7.5" width="19" height="10" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="18.5" cy="13" r="1" fill="currentColor" stroke="none"/></svg>';
const ICON_IMAGE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4.5 16.5 5-5 3.2 3.2L16 11l4 4.5"/></svg>';
const ICON_SHARE_UPLOAD = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"/><path d="m7 8 5-5 5 5"/><path d="M5 15v3.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V15"/></svg>';

function formatThousands(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function renderParticipationChart(stats) {
  document.getElementById('participationRate').textContent = `${stats.rate}%`;

  // 시간축 라벨
  const axis = document.getElementById('chartAxis');
  axis.innerHTML = stats.points.map((p) => `<span>${p.time}</span>`).join('');

  // 점선 그리드(4단)
  const grid = document.getElementById('chartGrid');
  grid.innerHTML = Array.from({ length: 4 }).map(() => '<span class="participation-chart__gridline"></span>').join('');

  // 라인 차트 SVG
  const width = 300;
  const height = 130;
  const padX = 6;
  const maxValue = 100;
  const step = (width - padX * 2) / (stats.points.length - 1);

  const coords = stats.points.map((p, i) => {
    const x = padX + step * i;
    const y = height - (p.value / maxValue) * (height - 14) - 4;
    return { x, y, point: p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height} L ${coords[0].x.toFixed(1)} ${height} Z`;

  const peak = coords.reduce((max, c) => (c.point.value > max.point.value ? c : max), coords[0]);

  const svgWrap = document.getElementById('chartSvgWrap');
  svgWrap.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none">
      <path d="${areaPath}" fill="rgba(38,38,44,0.08)" stroke="none"></path>
      <path d="${linePath}" fill="none" stroke="rgba(38,38,44,0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <circle cx="${peak.x.toFixed(1)}" cy="${peak.y.toFixed(1)}" r="4.5" fill="#26262C"></circle>
    </svg>
  `;

  const peakLabel = document.getElementById('chartPeakLabel');
  const peakPercentX = (peak.x / width) * 100;
  const peakPercentY = (peak.y / height) * 100;
  peakLabel.style.left = `${peakPercentX}%`;
  peakLabel.style.top = `${peakPercentY}%`;
  peakLabel.textContent = 'Peak';
}

function renderSettlements(items) {
  const container = document.getElementById('settlementList');
  container.innerHTML = items.map((item) => {
    const statusLabel = item.status === 'done' ? '정산완료' : '대기중';
    const statusClass = item.status === 'done' ? 'settlement-item__status--done' : 'settlement-item__status--pending';
    const amountSign = item.status === 'done' ? '+' : '';
    const amountClass = item.status === 'done' ? 'settlement-item__amount--positive' : '';
    const thumbContent = item.thumbnail
      ? `<img src="${item.thumbnail}" alt="${item.title}">`
      : (item.emoji || '');

    return `
      <div class="settlement-item">
        <div class="settlement-item__thumb">${thumbContent}</div>
        <div class="settlement-item__body">
          <div class="settlement-item__title-row">
            <span class="settlement-item__title">${item.title}</span>
            <span class="settlement-item__status ${statusClass}">${statusLabel}</span>
          </div>
          <div class="settlement-item__meta">${item.date} · ${item.category}</div>
        </div>
        <div class="settlement-item__side">
          <button type="button" class="settlement-item__share" aria-label="${item.title} 공유" data-share="${item.id}">${ICON_SHARE_SMALL}</button>
          <span class="settlement-item__amount ${amountClass}">${amountSign}₩${formatThousands(item.amount)}</span>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('[data-share]').forEach((btn) => {
    btn.addEventListener('click', () => {
      console.info(`정산 항목 '${btn.dataset.share}' 공유는 다음 단계에서 연결됩니다.`);
    });
  });
}

function renderInsight(insight) {
  document.getElementById('insightText').textContent = insight.message;
  document.getElementById('insightBtn').textContent = insight.ctaLabel;
}

function initCalculateScreen() {
  const stats = window.MoyoraData.getParticipationStats();
  const settlements = window.MoyoraData.getSettlements();
  const insight = window.MoyoraData.getSettlementInsight();

  renderParticipationChart(stats);
  renderSettlements(settlements);
  renderInsight(insight);

  document.getElementById('qrIconSlot').innerHTML = ICON_QR;
  document.getElementById('gameIconSlot').innerHTML = ICON_GAME;
  document.getElementById('shareIconSlot').innerHTML = ICON_IMAGE;
  document.getElementById('shareBtnIconSlot').innerHTML = ICON_SHARE_UPLOAD;
  document.getElementById('settlementMoreLink').innerHTML = `전체보기 ${ICON_CHEVRON_RIGHT}`;
  document.getElementById('participationTrendIcon').innerHTML = ICON_TREND_UP;

  window.MoyoraCommon.renderBottomNav('groups', 'bottomNav');

  document.getElementById('qrCameraBtn').addEventListener('click', () => {
    window.location.href = 'camera.html';
  });

  document.getElementById('gameRoomBtn').addEventListener('click', () => {
    console.info('게임 룸 화면은 다음 단계에서 연결됩니다.');
  });

  document.getElementById('insightBtn').addEventListener('click', () => {
    console.info('정산 내역 상세 화면은 다음 단계에서 연결됩니다.');
  });

  document.getElementById('shareResultBtn').addEventListener('click', () => {
    console.info('전체 결과 이미지 공유 기능은 다음 단계에서 연결됩니다.');
  });
}

document.addEventListener('DOMContentLoaded', initCalculateScreen);
