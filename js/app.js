// ============================================
// FitPulse — app.js
// ============================================

(function() {
  'use strict';

  // ===== Состояние =====
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

  var KEYS = {
    PROFILE: 'fitpulse_profile',
  };

  // ===== База продуктов (~50 позиций) =====
  var FOOD_DB = [
    // Мясо
    { id:1,  name:'Куриная грудка',     cat:'Мясо',   cal:165, p:31, f:3.6, c:0 },
    { id:2,  name:'Куриное бедро',       cat:'Мясо',   cal:209, p:26, f:11,  c:0 },
    { id:3,  name:'Говядина',            cat:'Мясо',   cal:250, p:26, f:15,  c:0 },
    { id:4,  name:'Свинина',             cat:'Мясо',   cal:242, p:19, f:18,  c:0 },
    { id:5,  name:'Индейка',             cat:'Мясо',   cal:189, p:29, f:7,   c:0 },
    { id:6,  name:'Куриная котлета',     cat:'Мясо',   cal:190, p:18, f:12,  c:6 },
    // Рыба
    { id:7,  name:'Лосось',              cat:'Рыба',   cal:208, p:20, f:13,  c:0 },
    { id:8,  name:'Тунец',               cat:'Рыба',   cal:132, p:28, f:1,   c:0 },
    { id:9,  name:'Треска',              cat:'Рыба',   cal:82,  p:18, f:0.7, c:0 },
    { id:10, name:'Креветки',            cat:'Рыба',   cal:99,  p:24, f:0.3, c:0.2 },
    { id:11, name:'Скумбрия',            cat:'Рыба',   cal:262, p:17, f:22,  c:0 },
    // Крупы
    { id:12, name:'Овсянка (варёная)',   cat:'Крупы',  cal:88,  p:3,  f:1.5, c:15 },
    { id:13, name:'Гречка (варёная)',    cat:'Крупы',  cal:110, p:4.2, f:1.1, c:21 },
    { id:14, name:'Рис белый (варёный)', cat:'Крупы',  cal:130, p:2.7, f:0.3, c:28 },
    { id:15, name:'Рис бурый (варёный)', cat:'Крупы',  cal:112, p:2.3, f:0.8, c:24 },
    { id:16, name:'Булгур (варёный)',    cat:'Крупы',  cal:83,  p:3.1, f:0.2, c:19 },
    { id:17, name:'Перловка (варёная)',  cat:'Крупы',  cal:123, p:3.4, f:0.4, c:28 },
    // Молочные
    { id:18, name:'Творог 5%',           cat:'Молочные', cal:121, p:17, f:5,  c:1.8 },
    { id:19, name:'Творог обезжиренный', cat:'Молочные', cal:78,  p:18, f:0.5,c:3.3 },
    { id:20, name:'Молоко 2.5%',         cat:'Молочные', cal:52,  p:2.8, f:2.5,c:4.7 },
    { id:21, name:'Кефир 1%',            cat:'Молочные', cal:40,  p:3,  f:1,  c:4 },
    { id:22, name:'Йогурт натуральный',  cat:'Молочные', cal:60,  p:4,  f:1.5,c:6 },
    { id:23, name:'Сыр твёрдый',         cat:'Молочные', cal:350, p:25, f:27, c:0 },
    // Овощи
    { id:24, name:'Помидор',             cat:'Овощи',  cal:18,  p:0.9, f:0.2, c:3.9 },
    { id:25, name:'Огурец',              cat:'Овощи',  cal:15,  p:0.7, f:0.1, c:3.6 },
    { id:26, name:'Брокколи',            cat:'Овощи',  cal:34,  p:2.8, f:0.4, c:7 },
    { id:27, name:'Морковь',             cat:'Овощи',  cal:35,  p:1.3, f:0.1, c:8 },
    { id:28, name:'Картофель (варёный)', cat:'Овощи',  cal:82,  p:2,  f:0.1, c:17 },
    { id:29, name:'Капуста',             cat:'Овощи',  cal:25,  p:1.3, f:0.1, c:6 },
    { id:30, name:'Перец болгарский',    cat:'Овощи',  cal:27,  p:1.3, f:0,   c:5.3 },
    { id:31, name:'Шпинат',              cat:'Овощи',  cal:23,  p:2.9, f:0.4, c:3.6 },
    // Фрукты
    { id:32, name:'Яблоко',              cat:'Фрукты', cal:52,  p:0.3, f:0.2, c:14 },
    { id:33, name:'Банан',               cat:'Фрукты', cal:89,  p:1.1, f:0.3, c:23 },
    { id:34, name:'Апельсин',            cat:'Фрукты', cal:47,  p:0.9, f:0.1, c:12 },
    { id:35, name:'Груша',               cat:'Фрукты', cal:57,  p:0.4, f:0.1, c:15 },
    { id:36, name:'Виноград',            cat:'Фрукты', cal:69,  p:0.7, f:0.2, c:18 },
    { id:37, name:'Киви',                cat:'Фрукты', cal:61,  p:1.1, f:0.5, c:15 },
    // Хлеб и выпечка
    { id:38, name:'Хлеб белый',          cat:'Хлеб',   cal:265, p:9,  f:3.2, c:49 },
    { id:39, name:'Хлеб цельнозерновой', cat:'Хлеб',   cal:247, p:13, f:3.4, c:41 },
    { id:40, name:'Батон',               cat:'Хлеб',   cal:270, p:8,  f:3,   c:52 },
    { id:41, name:'Лаваш',               cat:'Хлеб',   cal:274, p:9,  f:1.2, c:56 },
    // Сладости
    { id:42, name:'Мёд',                 cat:'Сладости', cal:304, p:0.3, f:0,  c:82 },
    { id:43, name:'Шоколад тёмный',      cat:'Сладости', cal:546, p:5,  f:31, c:60 },
    { id:44, name:'Печенье овсяное',     cat:'Сладости', cal:437, p:7,  f:14, c:71 },
    // Напитки
    { id:45, name:'Кофе чёрный',         cat:'Напитки', cal:2,   p:0.3, f:0,  c:0 },
    { id:46, name:'Чай зелёный',         cat:'Напитки', cal:1,   p:0,   f:0,  c:0 },
    { id:47, name:'Сок апельсиновый',    cat:'Напитки', cal:45,  p:0.7, f:0.2,c:10 },
    { id:48, name:'Сок яблочный',        cat:'Напитки', cal:46,  p:0.1, f:0.1,c:11 },
    // Бобовые и орехи
    { id:49, name:'Чечевица (варёная)',  cat:'Бобовые', cal:116, p:9,  f:0.4, c:20 },
    { id:50, name:'Нут (варёный)',       cat:'Бобовые', cal:164, p:8.9,f:2.6, c:27 },
    { id:51, name:'Фасоль (варёная)',    cat:'Бобовые', cal:127, p:8.7,f:0.5, c:22 },
    { id:52, name:'Миндаль',             cat:'Орехи',  cal:579, p:21, f:50,  c:22 },
    { id:53, name:'Грецкий орех',        cat:'Орехи',  cal:654, p:15, f:65,  c:14 },
    { id:54, name:'Арахис',              cat:'Орехи',  cal:567, p:26, f:49,  c:16 },
    // Яйца
    { id:55, name:'Яйцо куриное (1 шт, 60г)', cat:'Яйца', cal:155, p:13, f:11, c:1.1 },
  ];

  var FOOD_CATEGORIES = ['Все','Мясо','Рыба','Крупы','Молочные','Овощи','Фрукты','Хлеб','Сладости','Напитки','Бобовые','Орехи','Яйца'];

  // ===== Состояние питания =====
  var currentMealType = 'breakfast'; // для модалки
  var selectedFood = null;           // выбранный продукт в модалке
  var activeCategory = 'Все';

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', function() {
    var saved = loadProfile();
    if (saved) {
      showApp(saved);
    } else {
      renderStepDots();
      updateProgress();
      setupListeners();
      prefillDefaults();
    }
  });

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

  // ===== Числовые кнопки ± =====
  window.adjustNum = function(inputId, delta) {
    var inp = document.getElementById(inputId);
    var val = parseFloat(inp.value) || 0;
    val = Math.max(parseFloat(inp.min) || 0, val + delta);
    val = Math.min(parseFloat(inp.max) || 999, val);
    inp.value = Math.round(val * 10) / 10;
    inp.dispatchEvent(new Event('input'));
  };

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

    saveProfile(profile);
    showApp(profile);
  };

  // ===== Показать основное приложение =====
  function showApp(profile) {
    document.getElementById('profileWizard').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('headerUser').textContent = profile.name;
    renderDashboard(profile);
    renderProfileView(profile);
    renderNutritionView(profile);
    renderWorkoutView(profile);
    setupNutritionListeners();
  }

  // ===== Дашборд =====
  function renderDashboard(profile) {
    document.getElementById('greeting').textContent = 'Привет, ' + profile.name;

    var months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    var weekdays = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
    var now = new Date();
    document.getElementById('todayDate').textContent =
      weekdays[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()];

    updateDashboardStats(profile);
  }

  function updateDashboardStats(profile) {
    var dayData = getDayMeals();
    var totals = calcDayTotals(dayData);
    document.getElementById('dashCal').textContent = totals.cal;
    document.getElementById('dashBurned').textContent = 0;
    document.getElementById('dashWeight').textContent = profile.weight;
    var hint = document.getElementById('dashEmptyHint');
    if (hint) hint.style.display = totals.cal === 0 ? 'block' : 'none';
  }

  // ===== Профиль =====
  function renderProfileView(profile) {
    var goalLabels = { lose: 'Похудеть', maintain: 'Поддерживать форму', gain: 'Набрать массу' };
    var genderLabels = { male: 'Мужской', female: 'Женский' };

    document.getElementById('profileSummary').innerHTML =
      '<div class="profile-row"><span class="profile-key">Имя</span><span class="profile-val">' + profile.name + '</span></div>' +
      '<div class="profile-row"><span class="profile-key">Пол</span><span class="profile-val">' + (genderLabels[profile.gender] || '—') + '</span></div>' +
      '<div class="profile-row"><span class="profile-key">Вес</span><span class="profile-val">' + profile.weight + ' кг</span></div>' +
      '<div class="profile-row"><span class="profile-key">Рост</span><span class="profile-val">' + profile.height + ' см</span></div>' +
      '<div class="profile-row"><span class="profile-key">Цель</span><span class="profile-val"><span class="profile-badge">' + (goalLabels[profile.goal] || '—') + '</span></span></div>' +
      '<div class="profile-row"><span class="profile-key">Целевой вес</span><span class="profile-val">' + profile.targetWeight + ' кг</span></div>' +
      '<div class="profile-row"><span class="profile-key">Норма калорий</span><span class="profile-val" style="color:var(--accent);">' + profile.dailyCalorieTarget + ' ккал/день</span></div>' +
      '<button class="reset-btn" onclick="resetApp()">Сбросить все данные</button>';
  }

  // ===== Навигация =====
  window.navigate = function(view) {
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    var el = document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1));
    if (el) el.classList.add('active');
    document.querySelectorAll('.sidebar-btn, .bottomnav-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.view === view);
    });

    // Обновляем данные при переходе
    if (view === 'dashboard' || view === 'nutrition' || view === 'workouts') {
      var profile = loadProfile();
      if (profile) {
        renderNutritionView(profile);
        renderWorkoutView(profile);
        updateDashboardStats(profile);
      }
    }
  };

  // ===== Сброс =====
  window.resetApp = function() {
    if (!confirm('Вы уверены? Все данные будут удалены.')) return;
    localStorage.removeItem(KEYS.PROFILE);
    // Удаляем данные питания
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('fitpulse_meals_') === 0) keys.push(localStorage.key(i));
    }
    keys.forEach(function(k) { localStorage.removeItem(k); });
    // Удаляем данные тренировок
    var keys2 = [];
    for (var j = 0; j < localStorage.length; j++) {
      if (localStorage.key(j).indexOf('fitpulse_workouts_') === 0) keys2.push(localStorage.key(j));
    }
    keys2.forEach(function(k) { localStorage.removeItem(k); });
    location.reload();
  };

  // ===== localStorage =====
  function loadProfile() {
    try { return JSON.parse(localStorage.getItem(KEYS.PROFILE)); }
    catch(e) { return null; }
  }
  function saveProfile(p) {
    try { localStorage.setItem(KEYS.PROFILE, JSON.stringify(p)); }
    catch(e) { console.error('Save error:', e); }
  }

  // ============================================
  //  ПИТАНИЕ
  // ============================================

  function todayKey() {
    var d = new Date();
    return 'fitpulse_meals_' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }

  function getDayMeals() {
    try { return JSON.parse(localStorage.getItem(todayKey())) || { breakfast:[], lunch:[], dinner:[], snacks:[] }; }
    catch(e) { return { breakfast:[], lunch:[], dinner:[], snacks:[] }; }
  }

  function saveDayMeals(data) {
    try { localStorage.setItem(todayKey(), JSON.stringify(data)); }
    catch(e) { console.error('Save meals error:', e); }
  }

  function calcDayTotals(dayData) {
    var cal=0, p=0, f=0, c=0;
    ['breakfast','lunch','dinner','snacks'].forEach(function(meal) {
      (dayData[meal] || []).forEach(function(item) {
        cal += item.cal || 0;
        p += item.protein || 0;
        f += item.fat || 0;
        c += item.carbs || 0;
      });
    });
    return { cal: Math.round(cal), protein: Math.round(p*10)/10, fat: Math.round(f*10)/10, carbs: Math.round(c*10)/10 };
  }

  function calcMealKcal(items) {
    var cal = 0;
    (items || []).forEach(function(item) { cal += item.cal || 0; });
    return Math.round(cal);
  }

  function getMacroTargets(profile) {
    // Распределение макросов по цели
    var calTarget = profile.dailyCalorieTarget || 2000;
    var proteinPct, fatPct, carbsPct;
    if (profile.goal === 'lose') { proteinPct = 0.35; fatPct = 0.25; carbsPct = 0.40; }
    else if (profile.goal === 'gain') { proteinPct = 0.30; fatPct = 0.25; carbsPct = 0.45; }
    else { proteinPct = 0.25; fatPct = 0.30; carbsPct = 0.45; }

    return {
      protein: Math.round(calTarget * proteinPct / 4), // 1г белка = 4 ккал
      fat: Math.round(calTarget * fatPct / 9),          // 1г жира = 9 ккал
      carbs: Math.round(calTarget * carbsPct / 4),      // 1г углеводов = 4 ккал
    };
  }

  // ===== Рендер вкладки Питание =====
  function renderNutritionView(profile) {
    // Дата
    var months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    var now = new Date();
    document.getElementById('nutritionDate').textContent =
      now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();

    var dayData = getDayMeals();
    var totals = calcDayTotals(dayData);
    var calTarget = profile.dailyCalorieTarget || 2000;
    var macros = getMacroTargets(profile);

    // Кольцо
    var left = Math.max(0, calTarget - totals.cal);
    var pct = Math.min(totals.cal / calTarget, 1);
    var circumference = 2 * Math.PI * 52; // r=52
    var offset = circumference * (1 - pct);
    var ring = document.getElementById('calorieRing');
    ring.style.strokeDashoffset = offset;
    ring.classList.toggle('over', totals.cal > calTarget);

    document.getElementById('ringCalLeft').textContent = totals.cal > calTarget ? '+' + (totals.cal - calTarget) : left;
    document.getElementById('ringCalLeft').style.color = totals.cal > calTarget ? 'var(--danger)' : 'var(--accent)';

    // Макросы
    document.getElementById('macroProtein').textContent = totals.protein + ' / ' + macros.protein + ' г';
    document.getElementById('macroFat').textContent = totals.fat + ' / ' + macros.fat + ' г';
    document.getElementById('macroCarbs').textContent = totals.carbs + ' / ' + macros.carbs + ' г';

    var pPct = Math.min((totals.protein / macros.protein) * 100, 100);
    var fPct = Math.min((totals.fat / macros.fat) * 100, 100);
    var cPct = Math.min((totals.carbs / macros.carbs) * 100, 100);
    document.getElementById('barProtein').style.width = pPct + '%';
    document.getElementById('barFat').style.width = fPct + '%';
    document.getElementById('barCarbs').style.width = cPct + '%';

    // Приёмы пищи
    var mealNames = { breakfast:'Завтрак', lunch:'Обед', dinner:'Ужин', snacks:'Перекусы' };
    ['breakfast','lunch','dinner','snacks'].forEach(function(meal) {
      var items = dayData[meal] || [];
      document.getElementById('mealKcal_' + meal).textContent = calcMealKcal(items) + ' ккал';
      renderMealItems(meal, items);
    });
  }

  function renderMealItems(meal, items) {
    var container = document.getElementById('mealItems_' + meal);
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '';
      return;
    }

    var html = '';
    items.forEach(function(item, idx) {
      html += '<div class="food-item">' +
        '<div class="food-info">' +
          '<div class="food-name">' + escHtml(item.name) + '</div>' +
          '<div class="food-detail">' + item.weight + ' г  ·  Б ' + item.protein + '  Ж ' + item.fat + '  У ' + item.carbs + '</div>' +
        '</div>' +
        '<span class="food-kcal">' + item.cal + '</span>' +
        '<button class="food-delete" onclick="removeFood(\'' + meal + '\',' + idx + ')">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>';
    });
    container.innerHTML = html;
  }

  function escHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== Раскрыть/свернуть приём пищи =====
  window.toggleMeal = function(meal) {
    var card = document.querySelector('.meal-card[data-meal="' + meal + '"]');
    if (card) card.classList.toggle('open');
  };

  // ===== Удалить продукт =====
  window.removeFood = function(meal, idx) {
    var dayData = getDayMeals();
    if (dayData[meal] && dayData[meal].length > idx) {
      dayData[meal].splice(idx, 1);
      saveDayMeals(dayData);
      var profile = loadProfile();
      renderNutritionView(profile);
      updateDashboardStats(profile);
    }
  };

  // ===== Модалка — добавить продукт =====
  window.openFoodModal = function(mealType) {
    currentMealType = mealType;
    selectedFood = null;
    activeCategory = 'Все';

    var modal = document.getElementById('foodModal');
    modal.classList.add('open');

    // Сбросить состояние
    document.getElementById('foodSearch').value = '';
    document.getElementById('portionPanel').style.display = 'none';
    document.getElementById('foodResults').style.display = 'block';

    renderCategories();
    renderFoodResults('');

    // Фокус на поиск
    setTimeout(function() { document.getElementById('foodSearch').focus(); }, 300);
  };

  window.closeFoodModal = function() {
    var modal = document.getElementById('foodModal');
    modal.classList.remove('open');
    selectedFood = null;
  };

  function setupNutritionListeners() {
    var searchInput = document.getElementById('foodSearch');
    searchInput.addEventListener('input', function() {
      renderFoodResults(this.value.trim());
    });

    // Закрытие по клику на оверлей
    document.getElementById('foodModal').addEventListener('click', function(e) {
      if (e.target === this) closeFoodModal();
    });

    // Изменение порции
    document.getElementById('portionInput').addEventListener('input', function() {
      updatePortionPreview();
    });
  }

  function renderCategories() {
    var container = document.getElementById('foodCategories');
    var html = '';
    FOOD_CATEGORIES.forEach(function(cat) {
      html += '<button class="cat-chip' + (cat === activeCategory ? ' active' : '') + '" onclick="filterCategory(\'' + cat + '\')">' + cat + '</button>';
    });
    container.innerHTML = html;
    // Прокрутить к активному чипу
    var activeChip = container.querySelector('.cat-chip.active');
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  window.filterCategory = function(cat) {
    activeCategory = cat;
    renderCategories();
    renderFoodResults(document.getElementById('foodSearch').value.trim());
  };

  function renderFoodResults(query) {
    var results = FOOD_DB;

    // Фильтр по категории
    if (activeCategory !== 'Все') {
      results = results.filter(function(f) { return f.cat === activeCategory; });
    }

    // Фильтр по поиску
    if (query) {
      var q = query.toLowerCase();
      results = results.filter(function(f) { return f.name.toLowerCase().indexOf(q) !== -1; });
    }

    var container = document.getElementById('foodResults');
    if (results.length === 0) {
      container.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      return;
    }

    var html = '';
    results.forEach(function(food) {
      html += '<div class="food-result" onclick="selectFood(' + food.id + ')">' +
        '<div class="food-result-info">' +
          '<div class="food-result-name">' + escHtml(food.name) + '</div>' +
          '<div class="food-result-macros">Б ' + food.p + '  ·  Ж ' + food.f + '  ·  У ' + food.c + '</div>' +
        '</div>' +
        '<span class="food-result-kcal">' + food.cal + ' ккал</span>' +
        '<div class="food-result-add">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;
  }

  window.selectFood = function(foodId) {
    selectedFood = FOOD_DB.find(function(f) { return f.id === foodId; });
    if (!selectedFood) return;

    // Показать панель порции
    document.getElementById('foodResults').style.display = 'none';
    document.getElementById('portionPanel').style.display = 'block';
    document.getElementById('portionFoodName').textContent = selectedFood.name;
    document.getElementById('portionMacros').textContent = 'на 100 г:  ' + selectedFood.cal + ' ккал  ·  Б ' + selectedFood.p + '  ·  Ж ' + selectedFood.f + '  ·  У ' + selectedFood.c;
    document.getElementById('portionInput').value = 100;
    updatePortionPreview();
  };

  function updatePortionPreview() {
    if (!selectedFood) return;
    var grams = parseFloat(document.getElementById('portionInput').value) || 100;
    var ratio = grams / 100;
    var cal = Math.round(selectedFood.cal * ratio);
    document.getElementById('portionPreview').textContent = cal + ' ккал  ·  Б ' + (Math.round(selectedFood.p * ratio * 10)/10) + '  ·  Ж ' + (Math.round(selectedFood.f * ratio * 10)/10) + '  ·  У ' + (Math.round(selectedFood.c * ratio * 10)/10);
  }

  window.adjustPortion = function(delta) {
    var inp = document.getElementById('portionInput');
    var val = parseFloat(inp.value) || 100;
    val = Math.max(10, val + delta);
    val = Math.min(2000, val);
    inp.value = val;
    updatePortionPreview();
  };

  window.confirmAddFood = function() {
    if (!selectedFood) return;
    var grams = parseFloat(document.getElementById('portionInput').value) || 100;
    var ratio = grams / 100;

    var item = {
      name: selectedFood.name,
      weight: Math.round(grams),
      cal: Math.round(selectedFood.cal * ratio),
      protein: Math.round(selectedFood.p * ratio * 10) / 10,
      fat: Math.round(selectedFood.f * ratio * 10) / 10,
      carbs: Math.round(selectedFood.c * ratio * 10) / 10,
    };

    var dayData = getDayMeals();
    if (!dayData[currentMealType]) dayData[currentMealType] = [];
    dayData[currentMealType].push(item);
    saveDayMeals(dayData);

    // Закрыть модалку
    closeFoodModal();

    // Обновить вид
    var profile = loadProfile();
    renderNutritionView(profile);
    updateDashboardStats(profile);

    // Раскрыть приём пищи куда добавили
    var card = document.querySelector('.meal-card[data-meal="' + currentMealType + '"]');
    if (card && !card.classList.contains('open')) card.classList.add('open');
  };

  // ============================================
  //  ТРЕНИРОВКИ — ПЛАНИРОВЩИК
  // ============================================

  // База упражнений: location → type → exercises
  var EXERCISE_DB = {
    gym: {
      strength: [
        { id:'gs1', name:'Жим лёжа', met:6.0 },
        { id:'gs2', name:'Присед со штангой', met:7.0 },
        { id:'gs3', name:'Становая тяга', met:7.5 },
        { id:'gs4', name:'Тяга верхнего блока', met:5.5 },
        { id:'gs5', name:'Жим ногами', met:5.0 },
        { id:'gs6', name:'Разгибание ног', met:4.0 },
        { id:'gs7', name:'Сгибание рук (бицепс)', met:4.0 },
        { id:'gs8', name:'Махи гантелями', met:4.5 },
        { id:'gs9', name:'Гиперэкстензия', met:3.5 },
        { id:'gs10', name:'Жим гантелей сидя', met:5.0 },
        { id:'gs11', name:'Тяга в наклоне', met:6.0 },
        { id:'gs12', name:'Разведение гантелей', met:4.0 },
      ],
      cardio: [
        { id:'gc1', name:'Беговая дорожка', met:9.8 },
        { id:'gc2', name:'Эллипс', met:7.5 },
        { id:'gc3', name:'Велотренажёр', met:7.0 },
        { id:'gc4', name:'Скакалка', met:10.0 },
        { id:'gc5', name:'Гребной тренажёр', met:8.0 },
      ],
    },
    home: {
      strength: [
        { id:'hs1', name:'Отжимания', met:6.0 },
        { id:'hs2', name:'Приседания', met:5.0 },
        { id:'hs3', name:'Выпады', met:5.5 },
        { id:'hs4', name:'Планка', met:3.5 },
        { id:'hs5', name:'Скручивания', met:3.5 },
        { id:'hs6', name:'Подъём ног', met:4.0 },
        { id:'hs7', name:'Отжимания узким хватом', met:6.5 },
        { id:'hs8', name:'Бёрпи', met:8.0 },
        { id:'hs9', name:'Отжимания на трицепс', met:5.0 },
        { id:'hs10', name:'Ягодичный мостик', met:4.5 },
      ],
      cardio: [
        { id:'hc1', name:'Скакалка', met:10.0 },
        { id:'hc2', name:'Бёрпи', met:8.0 },
        { id:'hc3', name:'Джампинг джек', met:7.0 },
        { id:'hc4', name:'Бег на месте', met:7.5 },
        { id:'hc5', name:'Велосипед (лёжа)', met:5.0 },
        { id:'hc6', name:'Заход на скамью', met:6.0 },
      ],
    },
    street: {
      workout: [
        { id:'sw1', name:'Подтягивания', met:7.0 },
        { id:'sw2', name:'Отжимания на брусьях', met:7.5 },
        { id:'sw3', name:'Выход силой', met:8.5 },
        { id:'sw4', name:'Подъём ног к перекладине', met:5.5 },
        { id:'sw5', name:'Отжимания (разные хваты)', met:6.0 },
        { id:'sw6', name:'Приседания с прыжком', met:7.0 },
        { id:'sw7', name:'Лазание по канату', met:8.0 },
      ],
      running: [
        { id:'sr1', name:'Бег трусцой', met:7.0 },
        { id:'sr2', name:'Бег интервальный', met:10.0 },
        { id:'sr3', name:'Спринт', met:12.0 },
        { id:'sr4', name:'Ходьба быстрая', met:5.0 },
        { id:'sr5', name:'Велосипед', met:7.5 },
      ],
    },
  };

  var LOCATION_LABELS = { gym:'Зал', home:'Дома', street:'Улица' };
  var TYPE_LABELS = {
    gym:   { strength:'Силовая', cardio:'Кардио' },
    home:  { strength:'Силовая', cardio:'Кардио' },
    street:{ workout:'Воркаут', running:'Бег' },
  };

  var DAY_NAMES_SHORT = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  var MONTH_NAMES = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

  // Состояние модалки тренировки
  var wkLocation = '';
  var wkType = '';
  var wkExercises = [];
  var wkSelectedExercise = null;
  var wkSelectedDate = ''; // 'YYYY-M-D' формат

  // ===== Ключ хранилища по дате =====
  function workoutsKey(dateStr) {
    return 'fitpulse_workouts_' + dateStr;
  }

  function todayDateStr() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }

  function getDateWorkouts(dateStr) {
    try { return JSON.parse(localStorage.getItem(workoutsKey(dateStr))) || []; }
    catch(e) { return []; }
  }

  function saveDateWorkouts(dateStr, data) {
    try { localStorage.setItem(workoutsKey(dateStr), JSON.stringify(data)); }
    catch(e) { console.error('Save workouts error:', e); }
  }

  // Получить все запланированные тренировки (сканируем localStorage)
  function getAllPlannedWorkouts() {
    var result = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf('fitpulse_workouts_') === 0) {
        var dateStr = key.replace('fitpulse_workouts_', '');
        try {
          var workouts = JSON.parse(localStorage.getItem(key)) || [];
          workouts.forEach(function(wk) {
            result.push({
              dateStr: dateStr,
              id: wk.id || (dateStr + '_' + wk.time),
              location: wk.location,
              type: wk.type,
              exercises: wk.exercises,
              totalCal: wk.totalCal,
              totalDuration: wk.totalDuration,
              time: wk.time,
              done: !!wk.done,
            });
          });
        } catch(e) { /* skip */ }
      }
    }
    // Сортируем по дате, потом по времени
    result.sort(function(a, b) {
      var pa = a.dateStr.split('-');
      var pb = b.dateStr.split('-');
      var da = new Date(pa[0], pa[1]-1, pa[2]);
      var db = new Date(pb[0], pb[1]-1, pb[2]);
      if (da.getTime() !== db.getTime()) return da - db;
      return (a.time || '').localeCompare(b.time || '');
    });
    return result;
  }

  // Статистика планировщика
  function calcPlannerStats() {
    var all = getAllPlannedWorkouts();
    var planned = all.length;
    var done = 0;
    var burnedCal = 0;
    all.forEach(function(wk) {
      if (wk.done) {
        done++;
        burnedCal += wk.totalCal || 0;
      }
    });
    return { planned: planned, done: done, burnedCal: Math.round(burnedCal) };
  }

  // ===== Генерация дат на 14 дней вперёд =====
  function generateDateChips() {
    var chips = [];
    var today = new Date();
    for (var i = 0; i < 14; i++) {
      var d = new Date(today);
      d.setDate(d.getDate() + i);
      var dateStr = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
      chips.push({
        dateStr: dateStr,
        dayName: DAY_NAMES_SHORT[d.getDay()],
        dayNum: d.getDate(),
        isToday: i === 0,
        monthName: MONTH_NAMES[d.getMonth()],
      });
    }
    return chips;
  }

  // ===== Рендер вкладки Тренировки =====
  function renderWorkoutView(profile) {
    // Статистика
    var stats = calcPlannerStats();
    document.getElementById('workoutPlanned').textContent = stats.planned;
    document.getElementById('workoutDone').textContent = stats.done;
    document.getElementById('workoutBurned').textContent = stats.burnedCal;

    // Список запланированных тренировок, сгруппированных по дате
    var all = getAllPlannedWorkouts();
    var container = document.getElementById('workoutsList');

    if (all.length === 0) {
      container.innerHTML = '<div class="placeholder-card">' +
        '<svg class="placeholder-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
        '<p>Запланируйте тренировку на удобную дату, выберите место и упражнения.</p>' +
      '</div>';
      return;
    }

    // Группируем по дате
    var groups = {};
    var groupOrder = [];
    all.forEach(function(wk) {
      if (!groups[wk.dateStr]) {
        groups[wk.dateStr] = [];
        groupOrder.push(wk.dateStr);
      }
      groups[wk.dateStr].push(wk);
    });

    var html = '';
    groupOrder.forEach(function(dateStr) {
      var parts = dateStr.split('-');
      var dateObj = new Date(parts[0], parts[1]-1, parts[2]);
      var isToday = dateStr === todayDateStr();
      var label = isToday ? 'Сегодня' : (DAY_NAMES_SHORT[dateObj.getDay()] + ', ' + dateObj.getDate() + ' ' + MONTH_NAMES[dateObj.getMonth()]);

      html += '<div class="wk-date-group' + (isToday ? ' wk-date-group-today' : '') + '">' + escHtml(label) + '</div>';

      groups[dateStr].forEach(function(wk) {
        var locLabel = LOCATION_LABELS[wk.location] || '';
        var typeLabel = (TYPE_LABELS[wk.location] && TYPE_LABELS[wk.location][wk.type]) || '';
        var doneClass = wk.done ? ' done' : '';

        html += '<div class="wk-item' + doneClass + '">' +
          '<div class="wk-item-head">' +
            '<button class="wk-item-done-btn" onclick="toggleWkDone(\'' + escHtml(wk.dateStr) + '\',\'' + escHtml(wk.id) + '\')">' +
              (wk.done
                ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
                : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'
              ) +
            '</button>' +
            '<div class="wk-item-info">' +
              '<div class="wk-item-title">' + escHtml(locLabel + ' · ' + typeLabel) + '</div>' +
              '<div class="wk-item-meta">' + wk.totalDuration + ' мин</div>' +
            '</div>' +
            '<span class="wk-item-cal">' + wk.totalCal + ' ккал</span>' +
            '<button class="wk-item-delete" onclick="removeWorkout(\'' + escHtml(wk.dateStr) + '\',\'' + escHtml(wk.id) + '\')">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="wk-item-exercises">';

        wk.exercises.forEach(function(ex) {
          var detail = '';
          if (ex.kind === 'strength') detail = ex.sets + ' x ' + ex.reps;
          else detail = ex.minutes + ' мин';
          html += '<div class="wk-ex-row">' +
            '<span class="wk-ex-name">' + escHtml(ex.name) + '</span>' +
            '<span class="wk-ex-detail">' + detail + '</span>' +
            '<span class="wk-ex-cal">' + ex.cal + ' ккал</span>' +
          '</div>';
        });

        html += '</div></div>';
      });
    });
    container.innerHTML = html;
  }

  // Отметить тренировку как выполненную / не выполненную
  window.toggleWkDone = function(dateStr, wkId) {
    var workouts = getDateWorkouts(dateStr);
    workouts.forEach(function(wk) {
      var id = wk.id || (dateStr + '_' + wk.time);
      if (id === wkId) {
        wk.done = !wk.done;
      }
    });
    saveDateWorkouts(dateStr, workouts);
    var profile = loadProfile();
    renderWorkoutView(profile);
    updateDashboardStats(profile);
  };

  // Удалить тренировку
  window.removeWorkout = function(dateStr, wkId) {
    var workouts = getDateWorkouts(dateStr);
    var filtered = workouts.filter(function(wk) {
      var id = wk.id || (dateStr + '_' + wk.time);
      return id !== wkId;
    });
    if (filtered.length > 0) {
      saveDateWorkouts(dateStr, filtered);
    } else {
      localStorage.removeItem(workoutsKey(dateStr));
    }
    var profile = loadProfile();
    renderWorkoutView(profile);
    updateDashboardStats(profile);
  };

  // ===== Обновление дашборда (с учётом выполненных тренировок) =====
  // Override updateDashboardStats
  var _origUpdateDashboardStats = updateDashboardStats;
  updateDashboardStats = function(profile) {
    var dayData = getDayMeals();
    var totals = calcDayTotals(dayData);
    // Считаем сожжённые ккал только из выполненных тренировок за сегодня
    var todayWorkouts = getDateWorkouts(todayDateStr());
    var burnedCal = 0;
    todayWorkouts.forEach(function(wk) {
      if (wk.done) burnedCal += wk.totalCal || 0;
    });
    document.getElementById('dashCal').textContent = totals.cal;
    document.getElementById('dashBurned').textContent = Math.round(burnedCal);
    document.getElementById('dashWeight').textContent = profile.weight;
    var hint = document.getElementById('dashEmptyHint');
    if (hint) hint.style.display = (totals.cal === 0 && burnedCal === 0) ? 'block' : 'none';
  };

  // ===== Модалка — запланировать тренировку =====
  window.openWorkoutModal = function() {
    wkLocation = '';
    wkType = '';
    wkExercises = [];
    wkSelectedExercise = null;
    wkSelectedDate = todayDateStr(); // по умолчанию сегодня

    document.getElementById('workoutModal').classList.add('open');
    document.getElementById('wkStep1').style.display = 'block';
    document.getElementById('wkStep2').style.display = 'none';
    document.getElementById('wkStep3').style.display = 'none';

    // Рендерим даты
    renderDateChips();
  };

  function renderDateChips() {
    var chips = generateDateChips();
    var html = '';
    chips.forEach(function(chip) {
      var sel = chip.dateStr === wkSelectedDate ? ' selected' : '';
      html += '<button class="wk-date-chip' + sel + '" onclick="selectWkDate(\'' + chip.dateStr + '\')">' +
        '<span class="wk-date-day">' + chip.dayName + '</span>' +
        '<span class="wk-date-num">' + chip.dayNum + '</span>' +
      '</button>';
    });
    document.getElementById('wkDateRow').innerHTML = html;

    // Прокрутить к выбранному
    var sel = document.querySelector('.wk-date-chip.selected');
    if (sel) sel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  window.selectWkDate = function(dateStr) {
    wkSelectedDate = dateStr;
    renderDateChips();
  };

  window.closeWorkoutModal = function() {
    document.getElementById('workoutModal').classList.remove('open');
  };

  // Закрытие по клику на оверлей
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      document.getElementById('workoutModal').addEventListener('click', function(e) {
        if (e.target === this) closeWorkoutModal();
      });
    }, 100);
  });

  // Шаг 1 → выбор места
  window.selectWkLocation = function(loc) {
    wkLocation = loc;
    // Показать шаг 2
    document.getElementById('wkStep1').style.display = 'none';
    document.getElementById('wkStep2').style.display = 'block';
    document.getElementById('wkTypeLabel').textContent = LOCATION_LABELS[loc] + ' — выберите тип';

    var types = TYPE_LABELS[loc];
    var html = '';
    Object.keys(types).forEach(function(key) {
      html += '<button class="wk-card" onclick="selectWkType(\'' + key + '\')">' +
        '<span>' + types[key] + '</span>' +
      '</button>';
    });
    document.getElementById('wkTypeCards').innerHTML = html;
  };

  // Шаг 2 → выбор типа
  window.selectWkType = function(type) {
    wkType = type;
    // Показать шаг 3
    document.getElementById('wkStep2').style.display = 'none';
    document.getElementById('wkStep3').style.display = 'block';
    wkExercises = [];
    wkSelectedExercise = null;
    document.getElementById('wkAddedList').innerHTML = '';
    document.getElementById('wkTotalCal').textContent = '0 ккал';
    document.getElementById('wkFinishBtn').disabled = true;
    document.getElementById('wkParamPanel').style.display = 'none';
    document.getElementById('wkExerciseSearch').value = '';

    renderExerciseList('');
    setupWorkoutSearch();
  };

  window.wkGoBack = function(step) {
    if (step === 1) {
      document.getElementById('wkStep2').style.display = 'none';
      document.getElementById('wkStep1').style.display = 'block';
    } else if (step === 2) {
      document.getElementById('wkStep3').style.display = 'none';
      document.getElementById('wkStep2').style.display = 'block';
    }
  };

  var wkSearchSetup = false;
  function setupWorkoutSearch() {
    if (wkSearchSetup) return;
    wkSearchSetup = true;
    document.getElementById('wkExerciseSearch').addEventListener('input', function() {
      renderExerciseList(this.value.trim());
    });
  }

  function renderExerciseList(query) {
    var allExercises = [];
    var db = EXERCISE_DB[wkLocation];
    if (!db) return;

    // Собираем все упражнения для этого места, но показываем тип тегом
    Object.keys(db).forEach(function(type) {
      db[type].forEach(function(ex) {
        allExercises.push({ id: ex.id, name: ex.name, met: ex.met, kind: type });
      });
    });

    if (query) {
      var q = query.toLowerCase();
      allExercises = allExercises.filter(function(ex) { return ex.name.toLowerCase().indexOf(q) !== -1; });
    }

    var typeLabels = TYPE_LABELS[wkLocation] || {};
    var container = document.getElementById('wkExerciseResults');
    if (allExercises.length === 0) {
      container.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      return;
    }

    var html = '';
    allExercises.forEach(function(ex) {
      html += '<div class="wk-ex-option" onclick="selectWkExercise(\'' + ex.id + '\')">' +
        '<span class="wk-ex-option-name">' + escHtml(ex.name) + '</span>' +
        '<span class="wk-ex-option-tag">' + (typeLabels[ex.kind] || '') + '</span>' +
        '<div class="wk-ex-option-add">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;
  }

  window.selectWkExercise = function(exId) {
    var db = EXERCISE_DB[wkLocation];
    if (!db) return;
    var found = null;
    Object.keys(db).forEach(function(type) {
      db[type].forEach(function(ex) {
        if (ex.id === exId) found = { id: ex.id, name: ex.name, met: ex.met, kind: type };
      });
    });
    if (!found) return;

    wkSelectedExercise = found;
    document.getElementById('wkParamPanel').style.display = 'block';
    document.getElementById('wkParamName').textContent = found.name;

    // Показать нужные поля
    var isStrength = (found.kind === 'strength' || found.kind === 'workout');
    document.getElementById('wkParamStrength').style.display = isStrength ? 'flex' : 'none';
    document.getElementById('wkParamCardio').style.display = isStrength ? 'none' : 'flex';

    if (isStrength) {
      document.getElementById('wkSets').value = 3;
      document.getElementById('wkReps').value = 10;
    } else {
      document.getElementById('wkMinutes').value = 30;
    }
    updateWkParamPreview();
  };

  function updateWkParamPreview() {
    if (!wkSelectedExercise) return;
    var profile = loadProfile();
    var weight = profile ? profile.weight : 70;
    var isStrength = (wkSelectedExercise.kind === 'strength' || wkSelectedExercise.kind === 'workout');
    var minutes, cal;

    if (isStrength) {
      var sets = parseInt(document.getElementById('wkSets').value) || 3;
      var reps = parseInt(document.getElementById('wkReps').value) || 10;
      minutes = sets * 1.5;
      cal = wkSelectedExercise.met * weight * (minutes / 60);
    } else {
      minutes = parseInt(document.getElementById('wkMinutes').value) || 30;
      cal = wkSelectedExercise.met * weight * (minutes / 60);
    }

    document.getElementById('wkParamPreview').textContent = Math.round(cal) + ' ккал  ·  ~' + Math.round(minutes) + ' мин';
  }

  window.adjustWkParam = function(inputId, delta) {
    var inp = document.getElementById(inputId);
    var val = parseFloat(inp.value) || 0;
    val = Math.max(parseFloat(inp.min) || 1, val + delta);
    val = Math.min(parseFloat(inp.max) || 999, val);
    inp.value = val;
    updateWkParamPreview();
  };

  window.addExercise = function() {
    if (!wkSelectedExercise) return;
    var profile = loadProfile();
    var weight = profile ? profile.weight : 70;
    var isStrength = (wkSelectedExercise.kind === 'strength' || wkSelectedExercise.kind === 'workout');
    var minutes, cal;

    if (isStrength) {
      var sets = parseInt(document.getElementById('wkSets').value) || 3;
      var reps = parseInt(document.getElementById('wkReps').value) || 10;
      minutes = sets * 1.5;
      cal = wkSelectedExercise.met * weight * (minutes / 60);
    } else {
      minutes = parseInt(document.getElementById('wkMinutes').value) || 30;
      cal = wkSelectedExercise.met * weight * (minutes / 60);
    }

    wkExercises.push({
      name: wkSelectedExercise.name,
      kind: isStrength ? 'strength' : 'cardio',
      sets: isStrength ? (parseInt(document.getElementById('wkSets').value) || 3) : 0,
      reps: isStrength ? (parseInt(document.getElementById('wkReps').value) || 10) : 0,
      minutes: Math.round(minutes),
      met: wkSelectedExercise.met,
      cal: Math.round(cal),
    });

    // Скрыть панель параметров
    document.getElementById('wkParamPanel').style.display = 'none';
    wkSelectedExercise = null;
    document.getElementById('wkExerciseSearch').value = '';
    renderExerciseList('');

    updateWkAddedList();
  };

  function updateWkAddedList() {
    var totalCal = 0;
    var html = '';
    wkExercises.forEach(function(ex, idx) {
      totalCal += ex.cal;
      var detail = ex.kind === 'strength' ? (ex.sets + ' x ' + ex.reps) : (ex.minutes + ' мин');
      html += '<div class="wk-added-item">' +
        '<span class="wk-added-name">' + escHtml(ex.name) + '</span>' +
        '<span class="wk-added-detail">' + detail + '</span>' +
        '<span class="wk-added-cal">' + ex.cal + ' ккал</span>' +
        '<button class="wk-added-del" onclick="removeWkExercise(' + idx + ')">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>';
    });
    document.getElementById('wkAddedList').innerHTML = html;
    document.getElementById('wkTotalCal').textContent = totalCal + ' ккал';
    document.getElementById('wkFinishBtn').disabled = wkExercises.length === 0;
  }

  window.removeWkExercise = function(idx) {
    wkExercises.splice(idx, 1);
    updateWkAddedList();
  };

  window.finishWorkout = function() {
    if (wkExercises.length === 0) return;

    var totalCal = 0, totalDur = 0;
    wkExercises.forEach(function(ex) { totalCal += ex.cal; totalDur += ex.minutes; });

    var workout = {
      id: 'wk_' + Date.now(),
      location: wkLocation,
      type: wkType,
      exercises: wkExercises,
      totalCal: totalCal,
      totalDuration: totalDur,
      time: new Date().toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' }),
      done: false,
    };

    var dateStr = wkSelectedDate || todayDateStr();
    var workouts = getDateWorkouts(dateStr);
    workouts.push(workout);
    saveDateWorkouts(dateStr, workouts);

    closeWorkoutModal();

    var profile = loadProfile();
    renderWorkoutView(profile);
    updateDashboardStats(profile);
  };

})();
