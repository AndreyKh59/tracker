// ============================================
// FitPulse — app-auth.js
// Визард профиля (входное окно / онбординг)
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  // ===== Состояние визарда =====
  var currentStep = 1;
  var totalSteps = 5;
  var formData = {
    name: '',
    gender: '',
    weight: 0,
    height: 0,
    goal: '',
    targetWeight: 0,
  };

  // ===== Инициализация визарда =====
  FP.initWizard = function() {
    renderStepDots();
    updateProgress();
    setupListeners();
    prefillDefaults();
  };

  // ===== Предзаполнение по умолчанию =====
  function prefillDefaults() {
    var weightInput = document.getElementById('inputWeight');
    var heightInput = document.getElementById('inputHeight');
    if (weightInput.value) {
      formData.weight = parseFloat(weightInput.value);
      toggleNextBtn(3, true);
    }
    if (heightInput.value) {
      formData.height = parseFloat(heightInput.value);
      toggleNextBtn(4, true);
    }
  }

  // ===== Слушатели =====
  function setupListeners() {
    var nameInput = document.getElementById('inputName');
    nameInput.addEventListener('input', function() {
      toggleNextBtn(1, this.value.trim().length > 0);
    });
    nameInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.value.trim()) nextStep();
    });

    document.getElementById('inputWeight').addEventListener('input', function() {
      toggleNextBtn(3, parseFloat(this.value) > 0);
    });

    document.getElementById('inputHeight').addEventListener('input', function() {
      toggleNextBtn(4, parseFloat(this.value) > 0);
    });

    document.getElementById('inputTargetWeight').addEventListener('input', function() {
      checkFinishBtn();
    });
  }

  // ===== Шаги визарда =====
  function renderStepDots() {
    var container = document.getElementById('stepDots');
    container.innerHTML = '';
    for (var i = 1; i <= totalSteps; i++) {
      var dot = document.createElement('div');
      dot.className = 'step-dot' + (i === currentStep ? ' active' : '') + (i < currentStep ? ' done' : '');
      container.appendChild(dot);
    }
  }

  function updateProgress() {
    var pct = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.setProperty('--progress', pct + '%');
  }

  function showStep(n) {
    document.querySelectorAll('.step').forEach(function(el) { el.classList.remove('active'); });
    var target = document.querySelector('.step[data-step="' + n + '"]');
    if (target) target.classList.add('active');
    currentStep = n;
    renderStepDots();
    updateProgress();
  }

  function toggleNextBtn(step, enabled) {
    var stepEl = document.querySelector('.step[data-step="' + step + '"]');
    if (!stepEl) return;
    var btn = stepEl.querySelector('.btn-next');
    if (btn) btn.disabled = !enabled;
  }

  window.nextStep = function() {
    saveStepData(currentStep);
    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
      prefillStep(currentStep + 1);
    }
  };

  window.prevStep = function() {
    if (currentStep > 1) {
      showStep(currentStep - 1);
      prefillStep(currentStep - 1);
    }
  };

  function saveStepData(step) {
    switch(step) {
      case 1: formData.name = document.getElementById('inputName').value.trim(); break;
      case 2: break;
      case 3: formData.weight = parseFloat(document.getElementById('inputWeight').value) || 0; break;
      case 4: formData.height = parseFloat(document.getElementById('inputHeight').value) || 0; break;
      case 5: formData.targetWeight = parseFloat(document.getElementById('inputTargetWeight').value) || formData.weight; break;
    }
  }

  function prefillStep(step) {
    switch(step) {
      case 1:
        if (formData.name) { document.getElementById('inputName').value = formData.name; toggleNextBtn(1, true); }
        setTimeout(function() { document.getElementById('inputName').focus(); }, 100);
        break;
      case 2:
        if (formData.gender) {
          document.querySelectorAll('.gender-layer').forEach(function(c) { c.classList.remove('selected', 'dimmed'); });
          document.querySelector('.gender-layer[data-value="' + formData.gender + '"]').classList.add('selected');
          document.querySelector('.gender-layer:not([data-value="' + formData.gender + '"])').classList.add('dimmed');
          document.querySelectorAll('.gender-btn').forEach(function(b) { b.classList.toggle('selected', b.dataset.value === formData.gender); });
          toggleNextBtn(2, true);
        }
        break;
      case 3:
        if (formData.weight) { document.getElementById('inputWeight').value = formData.weight; toggleNextBtn(3, true); }
        break;
      case 4:
        if (formData.height) { document.getElementById('inputHeight').value = formData.height; toggleNextBtn(4, true); }
        break;
      case 5:
        if (formData.goal) {
          document.querySelectorAll('#profileWizard .step[data-step="5"] .choice-card').forEach(function(c) { c.classList.toggle('selected', c.dataset.value === formData.goal); });
          toggleNextBtn(5, true);
          checkFinishBtn();
        }
        break;
    }
  }

  // ===== Выбор карточки =====
  window.selectChoice = function(el, field) {
    var val = el.dataset.value;
    if (field === 'gender') {
      document.querySelectorAll('.gender-layer').forEach(function(c) { c.classList.remove('selected', 'dimmed'); });
      document.querySelector('.gender-layer[data-value="' + val + '"]').classList.add('selected');
      document.querySelector('.gender-layer:not([data-value="' + val + '"])').classList.add('dimmed');
      document.querySelectorAll('.gender-btn').forEach(function(b) { b.classList.toggle('selected', b.dataset.value === val); });
      formData.gender = val;
      toggleNextBtn(2, true);
    } else if (field === 'goal') {
      el.parentElement.querySelectorAll('.choice-card').forEach(function(c) { c.classList.remove('selected'); });
      el.classList.add('selected');
      formData.goal = val;
      var showTarget = (val === 'lose' || val === 'gain');
      document.getElementById('targetWeightGroup').style.display = showTarget ? 'block' : 'none';
      if (!showTarget) { formData.targetWeight = formData.weight; }
      else if (!formData.targetWeight && formData.weight) {
        var diff = val === 'lose' ? -5 : 5;
        formData.targetWeight = Math.round((formData.weight + diff) * 10) / 10;
        document.getElementById('inputTargetWeight').value = formData.targetWeight;
      }
      checkFinishBtn();
    }
  };

  function checkFinishBtn() {
    var targetW = document.getElementById('inputTargetWeight').value;
    var goalOk = !!formData.goal;
    var targetOk = true;
    if (formData.goal === 'lose' || formData.goal === 'gain') { targetOk = parseFloat(targetW) > 0; }
    toggleNextBtn(5, goalOk && targetOk);
  }

  // ===== Завершение профиля =====
  window.finishProfile = function() {
    saveStepData(5);
    if (formData.goal === 'maintain') formData.targetWeight = formData.weight;
    if (!formData.targetWeight) formData.targetWeight = formData.weight;

    var age = 20;
    var bmr = 10 * formData.weight + 6.25 * formData.height - 5 * age;
    if (formData.gender === 'male') bmr += 5;
    else bmr -= 161;
    var tdee = Math.round(bmr * 1.55);

    var profile = {
      name: formData.name,
      gender: formData.gender,
      weight: formData.weight,
      height: formData.height,
      goal: formData.goal,
      targetWeight: formData.targetWeight,
      dailyCalorieTarget: tdee,
      bmr: Math.round(bmr),
      age: age,
    };

    FP.saveProfile(profile);
    FP.showApp(profile);
  };

})();
