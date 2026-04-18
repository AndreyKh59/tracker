// ============================================
// FitPulse — app-dashboard.js
// Вкладка «Главная» (переработанный дашборд)
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  // ===== Советы дня =====
  var TIPS = [
    'Пейте не менее 1.5–2 литров воды в день — это ускоряет метаболизм и снижает аппетит.',
    'Ешьте медленно: мозгу нужно 20 минут, чтобы почувствовать сытость.',
    'Белок на завтрак помогает дольше чувствовать сытость в течение дня.',
    'Не пропускайте приёмы пищи — это ведёт к перееданию вечером.',
    'Добавьте овощи в каждый приём пищи — клетчатка даёт сытость без лишних калорий.',
    'Отдых между подходами: 60–90 сек для силы, 30–60 сек для выносливости.',
    'Сон менее 7 часов повышает уровень кортизола и мешает похудению.',
    'Заменяйте белый хлеб на цельнозерновой — больше клетчатки и питательных веществ.',
    'Кардио после силовой тренировки сжигает больше жира, чем до неё.',
    'Планируйте приёмы пищи заранее — так меньше шансов на вредные перекусы.',
    'Растяжка после тренировки снижает боль в мышцах на следующий день.',
    'Даже 10 минут активности лучше, чем ничего — двигайтесь каждый день.',
  ];

  // ===== Названия приёмов пищи =====
  var MEAL_LABELS = {
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snacks: 'Перекусы',
  };

  var MEAL_ICONS = {
    breakfast: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    lunch: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
    dinner: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="M2 16l20 6-6-20L8 8z"/></svg>',
    snacks: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  };

  // ===== Подсчёт серии дней (streak) =====
  function calcStreak() {
    var streak = 0;
    var d = new Date();
    // Проверяем сегодня и предыдущие дни
    for (var i = 0; i < 365; i++) {
      var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      var mealsKey = 'fitpulse_meals_' + dateStr;
      var wkKey = 'fitpulse_workouts_' + dateStr;
      var hasMeals = false;
      var hasWorkout = false;
      try {
        var m = JSON.parse(localStorage.getItem(mealsKey));
        if (m) {
          var total = 0;
          ['breakfast','lunch','dinner','snacks'].forEach(function(ml) { total += (m[ml] || []).length; });
          hasMeals = total > 0;
        }
      } catch(e) {}
      try {
        var w = JSON.parse(localStorage.getItem(wkKey));
        hasWorkout = w && w.length > 0;
      } catch(e) {}

      if (hasMeals || hasWorkout) {
        streak++;
      } else if (i > 0) {
        // Сегодня может быть ещё пусто — не прерываем серию
        break;
      } else {
        // Сегодня пусто — серия 0 если вчера тоже пусто
        break;
      }
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  // ===== Приветствие по времени суток =====
  function getGreeting(name) {
    var h = new Date().getHours();
    var part;
    if (h >= 5 && h < 12) part = 'Доброе утро';
    else if (h >= 12 && h < 18) part = 'Добрый день';
    else if (h >= 18 && h < 23) part = 'Добрый вечер';
    else part = 'Доброй ночи';
    return part + ', ' + name;
  }

  // ===== Суточный совет =====
  function getDailyTip() {
    var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return TIPS[dayOfYear % TIPS.length];
  }

  // ===== Расчёт макросов по цели =====
  function getMacroTargets(profile) {
    var calTarget = profile.dailyCalorieTarget || 2000;
    var proteinPct, fatPct, carbsPct;
    if (profile.goal === 'lose') { proteinPct = 0.35; fatPct = 0.25; carbsPct = 0.40; }
    else if (profile.goal === 'gain') { proteinPct = 0.30; fatPct = 0.25; carbsPct = 0.45; }
    else { proteinPct = 0.25; fatPct = 0.30; carbsPct = 0.45; }
    return {
      protein: Math.round(calTarget * proteinPct / 4),
      fat: Math.round(calTarget * fatPct / 9),
      carbs: Math.round(calTarget * carbsPct / 4),
    };
  }

  // ===== Рендер дашборда =====
  FP.renderDashboard = function(profile) {
    document.getElementById('greeting').textContent = getGreeting(profile.name);

    var now = new Date();
    document.getElementById('todayDate').textContent =
      FP.WEEKDAYS[now.getDay()] + ', ' + now.getDate() + ' ' + FP.MONTH_NAMES[now.getMonth()];

    // Серия дней
    var streak = calcStreak();
    var streakEl = document.getElementById('dashStreak');
    if (streak > 0) {
      document.getElementById('dashStreakVal').textContent = streak;
      streakEl.style.display = 'flex';
    } else {
      streakEl.style.display = 'none';
    }

    FP.updateDashboardStats(profile);
    renderDashWorkout(profile);
    renderDashMeals(profile);
  };

  // ===== Обновление статистики дашборда =====
  FP.updateDashboardStats = function(profile) {
    var dayData = FP.getDayMeals();
    var totals = FP.calcDayTotals(dayData);
    var calTarget = profile.dailyCalorieTarget || 2000;

    // Считаем сожжённые ккал из выполненных тренировок за сегодня
    var todayWorkouts = FP.getDateWorkouts(FP.todayDateStr());
    var burnedCal = 0;
    todayWorkouts.forEach(function(wk) {
      if (wk.done) burnedCal += wk.totalCal || 0;
    });

    // Кольцо
    var left = Math.max(0, calTarget - totals.cal);
    var pct = Math.min(totals.cal / calTarget, 1);
    var circumference = 2 * Math.PI * 52;
    var offset = circumference * (1 - pct);
    var ring = document.getElementById('dashRingFill');
    if (ring) {
      ring.style.strokeDashoffset = offset;
      ring.classList.toggle('over', totals.cal > calTarget);
    }
    var ringVal = document.getElementById('dashRingVal');
    if (ringVal) {
      ringVal.textContent = totals.cal > calTarget ? '+' + (totals.cal - calTarget) : left;
      ringVal.style.color = totals.cal > calTarget ? 'var(--danger)' : 'var(--accent)';
    }

    // Цифры
    var eatenEl = document.getElementById('dashCalEaten');
    if (eatenEl) eatenEl.textContent = totals.cal + ' ккал';
    var burnedEl = document.getElementById('dashCalBurned');
    if (burnedEl) burnedEl.textContent = Math.round(burnedCal) + ' ккал';
    var targetEl = document.getElementById('dashCalTarget');
    if (targetEl) targetEl.textContent = calTarget + ' ккал';

    // Макросы
    var macros = getMacroTargets(profile);
    var mpEl = document.getElementById('dashMacroP');
    if (mpEl) mpEl.textContent = totals.protein + '/' + macros.protein;
    var mfEl = document.getElementById('dashMacroF');
    if (mfEl) mfEl.textContent = totals.fat + '/' + macros.fat;
    var mcEl = document.getElementById('dashMacroC');
    if (mcEl) mcEl.textContent = totals.carbs + '/' + macros.carbs;
  };

  // ===== Рендер секции тренировок =====
  function renderDashWorkout(profile) {
    var container = document.getElementById('dashWorkoutContent');
    if (!container) return;

    var todayWorkouts = FP.getDateWorkouts(FP.todayDateStr());

    if (todayWorkouts.length === 0) {
      container.innerHTML =
        '<div class="dash-workout-empty">' +
          '<p>На сегодня нет запланированных тренировок</p>' +
          '<button class="btn-next dash-workout-start-btn" onclick="openWorkoutModal()">Запланировать тренировку</button>' +
        '</div>';
      return;
    }

    var html = '';
    todayWorkouts.forEach(function(wk, idx) {
      var locLabel = { gym:'Зал', home:'Дома', street:'Улица' }[wk.location] || '';
      var typeLabels = {
        gym: { strength:'Силовая', cardio:'Кардио' },
        home: { strength:'Силовая', cardio:'Кардио' },
        street: { workout:'Воркаут', running:'Бег' },
      };
      var typeLabel = (typeLabels[wk.location] && typeLabels[wk.location][wk.type]) || '';
      var doneClass = wk.done ? ' done' : '';
      var exCount = (wk.exercises && wk.exercises.length) || 0;
      var hasEx = wk.exercises && wk.exercises.length > 0;

      html += '<div class="dash-wk-accordion' + doneClass + '">';

      // Хедер: название слева, кнопка/бейдж справа
      html += '<div class="dash-wk-acc-head" onclick="toggleDashWorkout(' + idx + ')">' +
        '<div class="dash-wk-acc-info">' +
          '<div class="dash-wk-acc-title">' + FP.escHtml(locLabel + ' · ' + typeLabel) + '</div>' +
          '<div class="dash-wk-acc-meta">' + exCount + ' упр. · ' + wk.totalDuration + ' мин · ' + wk.totalCal + ' ккал</div>' +
        '</div>' +
        '<div class="dash-wk-acc-right">';

      if (wk.done) {
        html += '<span class="dash-workout-done-badge">Выполнено</span>';
      } else {
        html += '<button class="btn-next dash-wk-start-btn" onclick="event.stopPropagation(); startDashWorkout()">Начать</button>';
      }

      if (hasEx) {
        html += '<svg class="dash-wk-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
      }

      html += '</div></div>';

      // Тело гармошки — упражнения
      if (hasEx) {
        html += '<div class="dash-wk-acc-body" id="dashWkBody_' + idx + '" style="max-height:0;">';
        html += '<div class="dash-wk-exercises">';
        wk.exercises.forEach(function(ex) {
          var detail = '';
          if (ex.kind === 'strength') {
            if (ex.setsDetail && ex.setsDetail.length > 0) {
              detail = ex.setsDetail.map(function(s) { return s.reps + 'х' + s.weight + 'кг'; }).join('/');
            } else {
              detail = ex.sets + ' п. x ' + ex.reps + ' пт';
              if (ex.weight > 0) detail += ' / ' + Math.round(ex.weight) + ' кг';
            }
          } else {
            detail = ex.minutes + ' мин';
          }
          html += '<div class="dash-wk-ex-row">' +
            '<span class="dash-wk-ex-name">' + FP.escHtml(ex.name) + '</span>' +
            '<span class="dash-wk-ex-detail">' + detail + '</span>' +
          '</div>';
        });
        html += '</div></div>';
      }

      html += '</div>';
    });

    container.innerHTML = html;
  }

  // ===== Раскрытие/скрытие тренировки на дашборде =====
  window.toggleDashWorkout = function(idx) {
    var body = document.getElementById('dashWkBody_' + idx);
    if (!body) return;
    var accordion = body.parentElement;
    var isOpen = accordion.classList.contains('open');

    if (isOpen) {
      body.style.maxHeight = '0';
      accordion.classList.remove('open');
    } else {
      body.style.maxHeight = body.scrollHeight + 'px';
      accordion.classList.add('open');
    }
  };

  // ===== Начать тренировку (перейти на вкладку тренировок) =====
  window.startDashWorkout = function() {
    navigate('workouts');
  };

  // ===== Рендер секции питания (гармошка по приёмам пищи) =====
  function renderDashMeals(profile) {
    var container = document.getElementById('dashMealsContent');
    if (!container) return;

    var dayData = FP.getDayMeals();
    var html = '';
    var hasAny = false;

    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(function(meal) {
      var items = dayData[meal] || [];
      var mealCal = 0;
      var mealP = 0, mealF = 0, mealC = 0;
      items.forEach(function(item) {
        mealCal += item.cal || 0;
        mealP += item.protein || 0;
        mealF += item.fat || 0;
        mealC += item.carbs || 0;
      });
      mealCal = Math.round(mealCal);

      if (items.length > 0) hasAny = true;

      // Заголовок гармошки
      html += '<div class="dash-meal-accordion' + (items.length > 0 ? ' has-items' : '') + '">' +
        '<div class="dash-meal-acc-head" onclick="toggleDashMeal(\'' + meal + '\')">' +
          '<div class="dash-meal-icon">' + (MEAL_ICONS[meal] || '') + '</div>' +
          '<div class="dash-meal-info">' +
            '<span class="dash-meal-name">' + MEAL_LABELS[meal] + '</span>' +
            '<span class="dash-meal-macros">Б ' + Math.round(mealP) + ' · Ж ' + Math.round(mealF) + ' · У ' + Math.round(mealC) + '</span>' +
          '</div>' +
          '<span class="dash-meal-cal">' + mealCal + ' ккал</span>' +
          '<svg class="dash-meal-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</div>';

      // Тело гармошки — список продуктов
      html += '<div class="dash-meal-acc-body" id="dashMealBody_' + meal + '" style="max-height:0;">';

      if (items.length > 0) {
        html += '<div class="dash-meal-items">';
        items.forEach(function(item) {
          html += '<div class="dash-meal-item">' +
            '<span class="dash-meal-item-name">' + FP.escHtml(item.name) + '</span>' +
            '<span class="dash-meal-item-detail">' + (item.grams || 0) + ' г · ' + Math.round(item.cal || 0) + ' ккал</span>' +
          '</div>';
        });
        html += '</div>';
      }

      html += '<button class="dash-meal-acc-add" onclick="event.stopPropagation(); openFoodModal(\'' + meal + '\')">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        'Добавить' +
      '</button>';

      html += '</div></div>';
    });

    if (!hasAny) {
      html = '<div class="dash-meals-empty">' +
        '<p>Пока ничего не добавлено</p>' +
        '<button class="btn-next dash-meal-add-btn" onclick="openFoodModal(\'breakfast\')">Добавить приём пищи</button>' +
      '</div>';
    }

    container.innerHTML = html;
  }

  // ===== Раскрытие/скрытие приёма пищи на дашборде =====
  window.toggleDashMeal = function(meal) {
    var body = document.getElementById('dashMealBody_' + meal);
    if (!body) return;
    var accordion = body.parentElement;
    var isOpen = accordion.classList.contains('open');

    if (isOpen) {
      body.style.maxHeight = '0';
      accordion.classList.remove('open');
    } else {
      body.style.maxHeight = body.scrollHeight + 'px';
      accordion.classList.add('open');
    }
  };

  // ===== Рендер прогресса к цели =====
  function renderDashGoal(profile) {
    var container = document.getElementById('dashGoalContent');
    if (!container) return;

    var goalLabels = { lose: 'Похудеть', maintain: 'Поддерживать форму', gain: 'Набрать массу' };
    var goalLabel = goalLabels[profile.goal] || '—';

    if (profile.goal === 'maintain') {
      // Для «Поддерживать форму» — показываем недельную активность вместо веса
      var stats = calcWeekStats();
      var html = '<div class="dash-goal-card">' +
        '<div class="dash-goal-header">' +
          '<div class="dash-goal-badge">' + FP.escHtml(goalLabel) + '</div>' +
          '<span class="dash-goal-diff">' + stats.activeDays + ' из 7 дней активны</span>' +
        '</div>' +
        '<div class="dash-goal-week-dots">';

      for (var i = 0; i < 7; i++) {
        html += '<div class="dash-goal-dot' + (stats.days[i] ? ' active' : '') + '">' +
          '<span class="dash-goal-dot-label">' + FP.DAY_NAMES_SHORT[(i + 1) % 7] + '</span>' +
        '</div>';
      }

      html += '</div>' +
        '<div class="dash-goal-maintain-stats">' +
          '<div class="dash-goal-stat-item">' +
            '<span class="dash-goal-stat-val">' + stats.mealDays + '</span>' +
            '<span class="dash-goal-stat-label">дней с питанием</span>' +
          '</div>' +
          '<div class="dash-goal-stat-item">' +
            '<span class="dash-goal-stat-val">' + stats.workoutDays + '</span>' +
            '<span class="dash-goal-stat-label">дней с тренировкой</span>' +
          '</div>' +
          '<div class="dash-goal-stat-item">' +
            '<span class="dash-goal-stat-val">' + (profile.weight || '—') + '</span>' +
            '<span class="dash-goal-stat-label">кг текущий вес</span>' +
          '</div>' +
        '</div>' +
      '</div>';

      container.innerHTML = html;
    } else {
      // Для «Похудеть» / «Набрать массу» — прогресс по весу
      var currentW = profile.weight || 0;
      var targetW = profile.targetWeight || currentW;
      var diff = Math.abs(currentW - targetW);
      var progressPct = 0;
      if (targetW !== currentW && diff > 0) {
        var initialDiff = diff * 2;
        progressPct = Math.min(Math.round(((initialDiff - diff) / initialDiff) * 100), 100);
      } else {
        progressPct = 100;
      }

      var html = '<div class="dash-goal-card">' +
        '<div class="dash-goal-header">' +
          '<div class="dash-goal-badge">' + FP.escHtml(goalLabel) + '</div>' +
          '<span class="dash-goal-diff">' + (diff > 0 ? 'Осталось ' + diff + ' кг' : 'Цель достигнута!') + '</span>' +
        '</div>' +
        '<div class="dash-goal-progress">' +
          '<div class="dash-goal-bar"><div class="dash-goal-fill" style="width:' + progressPct + '%"></div></div>' +
          '<span class="dash-goal-pct">' + progressPct + '%</span>' +
        '</div>' +
        '<div class="dash-goal-weights">' +
          '<span class="dash-goal-weight">' + currentW + ' кг</span>' +
          '<span class="dash-goal-weight dash-goal-target">' + targetW + ' кг</span>' +
        '</div>' +
      '</div>';

      container.innerHTML = html;
    }
  }

  // ===== Статистика активности за неделю =====
  function calcWeekStats() {
    var days = [];
    var mealDays = 0;
    var workoutDays = 0;
    var activeDays = 0;

    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

      var hasMeals = false;
      var hasWorkout = false;

      try {
        var m = JSON.parse(localStorage.getItem('fitpulse_meals_' + dateStr));
        if (m) {
          var total = 0;
          ['breakfast','lunch','dinner','snacks'].forEach(function(ml) { total += (m[ml] || []).length; });
          hasMeals = total > 0;
        }
      } catch(e) {}

      try {
        var w = JSON.parse(localStorage.getItem('fitpulse_workouts_' + dateStr));
        hasWorkout = w && w.length > 0;
      } catch(e) {}

      if (hasMeals) mealDays++;
      if (hasWorkout) workoutDays++;
      var isActive = hasMeals || hasWorkout;
      if (isActive) activeDays++;
      days.push(isActive);
    }

    return { days: days, mealDays: mealDays, workoutDays: workoutDays, activeDays: activeDays };
  }

})();
