/* =========================================
   모여라 - newcru.js (신규 생성 위저드 - Step 01)
   ========================================= */

(function () {
  const ICONS = {
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.2c-1.4-.9-3.4-1.2-5.5-1.2-.6 0-1 .4-1 1v12c0 .6.4 1 1 1 2.1 0 4.1.3 5.5 1.2 1.4-.9 3.4-1.2 5.5-1.2.6 0 1-.4 1-1V5c0-.6-.4-1-1-1-2.1 0-4.1.3-5.5 1.2z"/><path d="M12 5.2V18"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.5 20c0-3.3 2.5-5.7 5.5-5.7s5.5 2.4 5.5 5.7"/><path d="M15.3 15c2.2.4 3.7 2.4 3.7 5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  };

  let selectedId = null;
  let isCustomSelected = false;

  function renderProgress() {
    const meta = window.MoyoraData.getNewGroupWizardMeta();
    const stepEl = document.getElementById('wizardStepLabel');
    const countEl = document.getElementById('wizardStepCount');
    const fillEl = document.getElementById('wizardProgressFill');
    const titleEl = document.getElementById('wizardTitle');

    if (stepEl) stepEl.textContent = `Step 0${meta.currentStep}`;
    if (countEl) countEl.textContent = `${meta.totalSteps}단계 중 ${meta.currentStep}단계`;
    if (fillEl) fillEl.style.width = `${(meta.currentStep / meta.totalSteps) * 100}%`;
    if (titleEl) titleEl.textContent = meta.title;
  }

  function renderPurposeGrid() {
    const grid = document.getElementById('purposeGrid');
    if (!grid) return;
    const categories = window.MoyoraData.getGroupPurposeCategories();

    grid.innerHTML = categories
      .map(
        (c) => `
        <button type="button" class="purpose-card purpose-card--${c.color}" data-id="${c.id}">
          <span class="purpose-card__icon">${ICONS[c.icon] || ''}</span>
          <span class="purpose-card__label">${c.name}</span>
        </button>
      `
      )
      .join('');

    grid.querySelectorAll('.purpose-card').forEach((card) => {
      card.addEventListener('click', () => selectPurpose(card.dataset.id));
    });
  }

  function selectPurpose(id) {
    selectedId = id;
    isCustomSelected = false;
    updateSelectionUI();
  }

  function selectCustom() {
    isCustomSelected = true;
    selectedId = null;
    updateSelectionUI();
    const input = document.getElementById('customInput');
    if (input) input.focus();
  }

  function updateSelectionUI() {
    document.querySelectorAll('.purpose-card').forEach((card) => {
      card.classList.toggle('selected', card.dataset.id === selectedId);
    });

    const customBtn = document.getElementById('customOption');
    const customInput = document.getElementById('customInput');
    if (customBtn) customBtn.classList.toggle('selected', isCustomSelected);

    const hasSelection =
      !!selectedId || (isCustomSelected && customInput && customInput.value.trim().length > 0);

    const nextBtn = document.getElementById('btnNextStep');
    if (nextBtn) nextBtn.classList.toggle('enabled', hasSelection);
  }

  function bindCustomOption() {
    const customBtn = document.getElementById('customOption');
    const customLabel = document.getElementById('customLabel');
    const customInput = document.getElementById('customInput');

    if (customLabel) {
      customLabel.addEventListener('click', selectCustom);
    }
    if (customBtn) {
      customBtn.addEventListener('click', (e) => {
        if (!isCustomSelected) selectCustom();
      });
    }
    if (customInput) {
      customInput.addEventListener('input', updateSelectionUI);
      customInput.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  function bindNextStep() {
    const nextBtn = document.getElementById('btnNextStep');
    if (!nextBtn) return;
    nextBtn.addEventListener('click', () => {
      if (!nextBtn.classList.contains('enabled')) return;

      const customInput = document.getElementById('customInput');
      const purposeName = isCustomSelected
        ? (customInput ? customInput.value.trim() : '')
        : (window.MoyoraData.getGroupPurposeCategories().find((c) => c.id === selectedId) || {}).name;

      const draft = { purpose: purposeName, purposeId: selectedId, isCustom: isCustomSelected };
      try {
        sessionStorage.setItem('moyeora_new_group_draft', JSON.stringify(draft));
      } catch (e) {
        /* storage unavailable, fail silently */
      }

      // Step 02 이후 화면은 다음 단계에서 제작 예정
      console.info('선택한 모임 목적:', draft);
      alert(`"${purposeName}" 선택 완료!\n다음 단계(Step 02) 화면은 이어서 제작할 예정입니다.`);
    });
  }

  function bindPhotoUpload() {
    const photoBtn = document.getElementById('btnAddPhoto');
    if (photoBtn) {
      photoBtn.style.cursor = 'pointer';
      photoBtn.addEventListener('click', () => {
        console.info('사진 추가하기 (파일 업로드 연동 예정)');
      });
    }
  }

  function bindBack() {
    const backBtn = document.getElementById('btnBack');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'add.html';
      });
    }
  }

  function init() {
    renderProgress();
    renderPurposeGrid();
    bindCustomOption();
    bindNextStep();
    bindBack();
    bindPhotoUpload();
    updateSelectionUI();

    if (window.MoyoraCommon) {
      window.MoyoraCommon.renderBottomNav('groups', 'bottomNav');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
