// ============================================
// FitPulse — app-workouts.js
// Вкладка «Тренировки» + планировщик тренировок
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  // ===== База упражнений =====
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

  // Мышечные группы для силовых тренировок (зал и дома)
  var MUSCLE_GROUPS = {
    'Грудь': [
      { id:'chest1', name:'Жим штанги лёжа', met:6.0, img:'bench_press.png' },
      { id:'chest2', name:'Жим гантелей лёжа', met:5.5 },
      { id:'chest3', name:'Разводка гантелей', met:4.0 },
      { id:'chest4', name:'Кроссовер', met:4.5 },
      { id:'chest5', name:'Отжимания', met:6.0, img:'pushup.png' },
      { id:'chest6', name:'Жим под углом', met:5.5 },
    ],
    'Спина': [
      { id:'back1', name:'Тяга верхнего блока', met:5.5 },
      { id:'back2', name:'Тяга в наклоне', met:6.0 },
      { id:'back3', name:'Подтягивания', met:7.0, img:'pullup.png' },
      { id:'back4', name:'Тяга нижнего блока', met:5.0 },
      { id:'back5', name:'Гиперэкстензия', met:3.5 },
      { id:'back6', name:'Тяга гантели в наклоне', met:5.5 },
    ],
    'Ноги': [
      { id:'leg1', name:'Присед со штангой', met:7.0, img:'squat.png' },
      { id:'leg2', name:'Жим ногами', met:5.0 },
      { id:'leg3', name:'Разгибание ног', met:4.0 },
      { id:'leg4', name:'Сгибание ног', met:4.0 },
      { id:'leg5', name:'Выпады', met:5.5 },
      { id:'leg6', name:'Подъём на носки', met:3.0 },
    ],
    'Плечи': [
      { id:'sh1', name:'Жим гантелей сидя', met:5.0 },
      { id:'sh2', name:'Махи гантелями', met:4.5 },
      { id:'sh3', name:'Тяга штанги к подбородку', met:5.0 },
      { id:'sh4', name:'Фейс пулл', met:3.5 },
      { id:'sh5', name:'Подъём перед собой', met:4.0 },
    ],
    'Руки': [
      { id:'arm1', name:'Сгибание рук (бицепс)', met:4.0, img:'bicep_curl.png' },
      { id:'arm1b', name:'Подъём штанги на бицепс стоя', met:4.0, img:'bicep_curl.png' },
      { id:'arm2', name:'Французский жим', met:4.5 },
      { id:'arm3', name:'Молотки', met:4.0 },
      { id:'arm4', name:'Разгибание на блоке', met:4.0 },
      { id:'arm5', name:'Отжимания на брусьях', met:7.5 },
    ],
    'Пресс': [
      { id:'abs1', name:'Скручивания', met:3.5 },
      { id:'abs2', name:'Планка', met:3.5 },
      { id:'abs3', name:'Подъём ног', met:4.0 },
      { id:'abs4', name:'Русские скручивания', met:4.0 },
      { id:'abs5', name:'Велосипед', met:4.5 },
    ],
  };

  // Категории для кардио-упражнений (зал)
  var CARDIO_GYM_CATEGORIES = {
    'Тренажёры': [
      { id:'gc1', name:'Беговая дорожка', met:9.8, img:'treadmill.png' },
      { id:'gc2', name:'Эллипс', met:7.5 },
      { id:'gc3', name:'Велотренажёр', met:7.0 },
      { id:'gc5', name:'Гребной тренажёр', met:8.0 },
    ],
    'Прыжковые': [
      { id:'gc4', name:'Скакалка', met:10.0 },
    ],
  };

  // Категории для кардио-упражнений (дома)
  var CARDIO_HOME_CATEGORIES = {
    'Прыжковые': [
      { id:'hc1', name:'Скакалка', met:10.0 },
      { id:'hc3', name:'Джампинг джек', met:7.0 },
    ],
    'Комплексные': [
      { id:'hc2', name:'Бёрпи', met:8.0 },
      { id:'hc4', name:'Бег на месте', met:7.5 },
      { id:'hc5', name:'Велосипед (лёжа)', met:5.0 },
      { id:'hc6', name:'Заход на скамью', met:6.0 },
    ],
  };

  // Категории для воркаута (улица)
  var WORKOUT_STREET_CATEGORIES = {
    'Подтягивания': [
      { id:'sw1', name:'Подтягивания', met:7.0 },
      { id:'sw3', name:'Выход силой', met:8.5 },
      { id:'sw4', name:'Подъём ног к перекладине', met:5.5 },
    ],
    'Отжимания': [
      { id:'sw2', name:'Отжимания на брусьях', met:7.5 },
      { id:'sw5', name:'Отжимания (разные хваты)', met:6.0 },
    ],
    'Ноги и взрывные': [
      { id:'sw6', name:'Приседания с прыжком', met:7.0 },
      { id:'sw7', name:'Лазание по канату', met:8.0 },
    ],
  };

  // Категории для бега (улица)
  var RUNNING_STREET_CATEGORIES = {
    'Бег': [
      { id:'sr1', name:'Бег трусцой', met:7.0 },
      { id:'sr2', name:'Бег интервальный', met:10.0 },
      { id:'sr3', name:'Спринт', met:12.0 },
    ],
    'Ходьба и велосипед': [
      { id:'sr4', name:'Ходьба быстрая', met:5.0 },
      { id:'sr5', name:'Велосипед', met:7.5 },
    ],
  };

  // ===== Состояние модалки тренировки =====
  var wkLocation = '';
  var wkType = '';
  var wkExercises = [];
  var wkSelectedExercise = null;
  var wkSelectedDate = '';
  var wkCalMonth = new Date().getMonth();
  var wkCalYear = new Date().getFullYear();
  var wkEditDateStr = '';
  var wkEditId = '';
  var wkDetailSets = [];

  // ===== Данные тренировок (доступны для других модулей) =====
  FP.getDateWorkouts = function(dateStr) {
    try { return JSON.parse(localStorage.getItem(FP.workoutsKey(dateStr))) || []; }
    catch(e) { return []; }
  };

  FP.saveDateWorkouts = function(dateStr, data) {
    try { localStorage.setItem(FP.workoutsKey(dateStr), JSON.stringify(data)); }
    catch(e) { console.error('Save workouts error:', e); }
  };

  // Получить все запланированные тренировки
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
    var now = new Date();
    var thisMonth = now.getFullYear() + '-' + (now.getMonth()+1);
    var monthWorkouts = all.filter(function(wk) {
      return wk.dateStr.indexOf(thisMonth) === 0;
    });
    var planned = monthWorkouts.length;
    var done = 0;
    var burnedCal = 0;
    monthWorkouts.forEach(function(wk) {
      if (wk.done) {
        done++;
        burnedCal += wk.totalCal || 0;
      }
    });
    return { planned: planned, done: done, burnedCal: Math.round(burnedCal) };
  }

  // ===== Рендер вкладки Тренировки =====
  FP.renderWorkoutView = function(profile) {
    var stats = calcPlannerStats();
    document.getElementById('workoutPlanned').textContent = stats.planned;
    document.getElementById('workoutDone').textContent = stats.done;
    var burnedEl = document.getElementById('workoutBurned');
    if (burnedEl) burnedEl.textContent = stats.burnedCal;

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
      var isToday = dateStr === FP.todayDateStr();
      var label = isToday ? 'Сегодня' : (FP.DAY_NAMES_SHORT[dateObj.getDay()] + ', ' + dateObj.getDate() + ' ' + FP.MONTH_NAMES[dateObj.getMonth()]);

      html += '<div class="wk-date-group' + (isToday ? ' wk-date-group-today' : '') + '">' + FP.escHtml(label) + '</div>';

      groups[dateStr].forEach(function(wk) {
        var locLabel = LOCATION_LABELS[wk.location] || '';
        var typeLabel = (TYPE_LABELS[wk.location] && TYPE_LABELS[wk.location][wk.type]) || '';
        var doneClass = wk.done ? ' done' : '';

        html += '<div class="wk-item' + doneClass + '">' +
          '<div class="wk-item-head">' +
            '<button class="wk-item-done-btn" onclick="toggleWkDone(\'' + FP.escHtml(wk.dateStr) + '\',\'' + FP.escHtml(wk.id) + '\')">' +
              (wk.done
                ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
                : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'
              ) +
            '</button>' +
            '<div class="wk-item-info">' +
              '<div class="wk-item-title">' + FP.escHtml(locLabel + ' · ' + typeLabel) + '</div>' +
              '<div class="wk-item-meta">' + wk.totalDuration + ' мин</div>' +
            '</div>' +
            '<span class="wk-item-cal">' + wk.totalCal + ' ккал</span>' +
            '<button class="wk-item-edit" onclick="openWorkoutModal(\'' + FP.escHtml(wk.dateStr) + '\',\'' + FP.escHtml(wk.id) + '\')">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '</button>' +
            '<button class="wk-item-delete" onclick="removeWorkout(\'' + FP.escHtml(wk.dateStr) + '\',\'' + FP.escHtml(wk.id) + '\')">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="wk-item-exercises">';

        wk.exercises.forEach(function(ex) {
          var detail = '';
          if (ex.kind === 'strength') {
            if (ex.setsDetail && ex.setsDetail.length > 0) {
              detail = ex.setsDetail.map(function(s) { return s.reps + 'х' + s.weight + 'кг'; }).join('/');
            } else {
              detail = ex.sets + ' п. x ' + ex.reps + ' пт' + (ex.weight > 0 ? ' / ' + Math.round(ex.weight) + ' кг' : '');
            }
            var totalW = 0;
            if (ex.setsDetail) { ex.setsDetail.forEach(function(s) { totalW += s.weight * s.reps; }); }
            else { totalW = Math.round(ex.weight); }
            if (totalW > 0) detail += ' · ' + Math.round(totalW) + ' кг общ.';
          } else {
            detail = ex.minutes + ' мин';
          }
          html += '<div class="wk-ex-row">' +
            '<span class="wk-ex-name">' + FP.escHtml(ex.name) + '</span>' +
            '<span class="wk-ex-detail">' + detail + '</span>' +
            '<span class="wk-ex-cal">' + ex.cal + ' ккал</span>' +
          '</div>';
        });

        html += '</div></div>';
      });
    });
    container.innerHTML = html;
  };

  // Отметить тренировку как выполненную / не выполненную
  window.toggleWkDone = function(dateStr, wkId) {
    var workouts = FP.getDateWorkouts(dateStr);
    workouts.forEach(function(wk) {
      var id = wk.id || (dateStr + '_' + wk.time);
      if (id === wkId) {
        wk.done = !wk.done;
      }
    });
    FP.saveDateWorkouts(dateStr, workouts);
    var profile = FP.loadProfile();
    FP.renderWorkoutView(profile);
    FP.updateDashboardStats(profile);
  };

  // Удалить тренировку
  window.removeWorkout = function(dateStr, wkId) {
    var workouts = FP.getDateWorkouts(dateStr);
    var filtered = workouts.filter(function(wk) {
      var id = wk.id || (dateStr + '_' + wk.time);
      return id !== wkId;
    });
    if (filtered.length > 0) {
      FP.saveDateWorkouts(dateStr, filtered);
    } else {
      localStorage.removeItem(FP.workoutsKey(dateStr));
    }
    var profile = FP.loadProfile();
    FP.renderWorkoutView(profile);
    FP.updateDashboardStats(profile);
  };

  // ===== Модалка — запланировать тренировку =====
  window.openWorkoutModal = function(editDateStr, editId) {
    wkLocation = '';
    wkType = '';
    wkExercises = [];
    wkSelectedExercise = null;
    wkEditDateStr = '';
    wkEditId = '';
    wkEditExerciseIdx = -1;

    // Сбросить селектор редактирования
    var selectorDiv = document.getElementById('wkEditSelector');
    if (selectorDiv) selectorDiv.style.display = 'none';

    if (editDateStr && editId) {
      wkEditDateStr = editDateStr;
      wkEditId = editId;
      wkSelectedDate = editDateStr;
      var workouts = FP.getDateWorkouts(editDateStr);
      var wk = workouts.find(function(w) { return (w.id || (editDateStr + '_' + w.time)) === editId; });
      if (wk) {
        wkLocation = wk.location;
        wkType = wk.type;
        wkExercises = wk.exercises ? wk.exercises.slice() : [];
      }
    } else {
      wkSelectedDate = '';
    }

    document.getElementById('workoutModal').classList.add('open');
    document.getElementById('workoutModal').classList.add('fullscreen-modal');

    if (wkEditId && wkLocation && wkType) {
      document.getElementById('wkStep0').style.display = 'none';
      document.getElementById('wkStep1').style.display = 'none';
      document.getElementById('wkStep2').style.display = 'none';
      document.getElementById('wkStep3').style.display = 'none';
      document.getElementById('wkStep4').style.display = 'none';
      document.getElementById('wkStep5').style.display = 'flex';
      document.getElementById('wkPlanSaveBtn').textContent = 'Сохранить';
      updateWkPlanList();
      renderExerciseList('');
      setupWorkoutSearch();
    } else {
      document.getElementById('wkStep0').style.display = 'flex';
      document.getElementById('wkStep1').style.display = 'none';
      document.getElementById('wkStep2').style.display = 'none';
      document.getElementById('wkStep3').style.display = 'none';
      document.getElementById('wkStep4').style.display = 'none';
      document.getElementById('wkStep5').style.display = 'none';
      document.getElementById('wkPlanSaveBtn').textContent = 'Сохранить план';
      wkCalYear = new Date().getFullYear();
      wkCalMonth = new Date().getMonth();
      renderWkCalendar();
    }
  };

  // ===== Календарь (шаг 0 модалки) =====
  var calLongPressTimer = null;
  var calLongPressTarget = null;

  function setupCalLongPress() {
    var calEl = document.getElementById('wkCalendar');
    if (!calEl) return;

    calEl.addEventListener('touchstart', function(e) {
      var day = e.target.closest('.wk-cal-day');
      if (!day || day.classList.contains('other-month') || day.classList.contains('past')) return;
      if (!day.querySelector('.wk-cal-tip')) return;
      calLongPressTarget = day;
      calLongPressTimer = setTimeout(function() {
        day.classList.add('show-tip');
      }, 400);
    }, { passive: true });

    calEl.addEventListener('touchend', function() {
      clearTimeout(calLongPressTimer);
      if (calLongPressTarget) {
        setTimeout(function() {
          calLongPressTarget.classList.remove('show-tip');
          calLongPressTarget = null;
        }, 1500);
      }
    }, { passive: true });

    calEl.addEventListener('touchmove', function() {
      clearTimeout(calLongPressTimer);
      if (calLongPressTarget) {
        calLongPressTarget.classList.remove('show-tip');
        calLongPressTarget = null;
      }
    }, { passive: true });
  }

  function renderWkCalendar() {
    document.getElementById('wkCalMonth').textContent = FP.CAL_MONTH_NAMES[wkCalMonth] + ' ' + wkCalYear;

    var firstDay = new Date(wkCalYear, wkCalMonth, 1);
    var lastDay = new Date(wkCalYear, wkCalMonth + 1, 0);
    var startWeekday = (firstDay.getDay() + 6) % 7;
    var daysInMonth = lastDay.getDate();

    var today = new Date();
    var todayStr = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();

    var workoutDates = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf('fitpulse_workouts_') === 0) {
        var ds = key.replace('fitpulse_workouts_', '');
        try {
          var dayWks = JSON.parse(localStorage.getItem(key)) || [];
          var wkSummaries = [];
          dayWks.forEach(function(w) {
            var locLbl = LOCATION_LABELS[w.location] || '';
            var typeLbl = (TYPE_LABELS[w.location] && TYPE_LABELS[w.location][w.type]) || '';
            var statusIcon = w.done ? ' \u2713' : '';
            wkSummaries.push(locLbl + ' · ' + typeLbl + statusIcon);
          });
          if (wkSummaries.length > 0) workoutDates[ds] = wkSummaries;
        } catch(e) { workoutDates[ds] = true; }
      }
    }

    var html = '';
    FP.CAL_DAY_NAMES.forEach(function(dn) {
      html += '<div class="wk-cal-dayname">' + dn + '</div>';
    });

    for (var e = 0; e < startWeekday; e++) {
      html += '<div class="wk-cal-day other-month"></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var dateObj = new Date(wkCalYear, wkCalMonth, d);
      var ds = wkCalYear + '-' + (wkCalMonth + 1) + '-' + d;
      var isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var isToday = ds === todayStr;
      var isSelected = ds === wkSelectedDate;
      var wkInfo = workoutDates[ds];
      var hasWorkout = !!wkInfo;

      var cls = 'wk-cal-day';
      if (isPast) cls += ' past';
      if (isToday) cls += ' today';
      if (isSelected) cls += ' selected';

      var tipHtml = '';
      if (hasWorkout && Array.isArray(wkInfo)) {
        tipHtml = '<span class="wk-cal-tip">' + wkInfo.map(function(s) { return FP.escHtml(s); }).join('<br>') + '</span>';
      }

      html += '<button class="' + cls + '"' +
        (isPast ? ' disabled' : ' onclick="selectWkCalDay(\'' + ds + '\')"') +
        ' data-date="' + ds + '"' +
        '>' + d +
        (hasWorkout ? '<span class="wk-cal-dot"></span>' : '') +
        tipHtml +
      '</button>';
    }

    document.getElementById('wkCalendar').innerHTML = html;
    setupCalLongPress();
    document.getElementById('wkCalendarNext').disabled = !wkSelectedDate;
    updateCalEditButton();
  }

  window.wkCalChangeMonth = function(delta) {
    wkCalMonth += delta;
    if (wkCalMonth > 11) { wkCalMonth = 0; wkCalYear++; }
    if (wkCalMonth < 0) { wkCalMonth = 11; wkCalYear--; }
    renderWkCalendar();
  };

  window.selectWkCalDay = function(dateStr) {
    wkSelectedDate = dateStr;
    renderWkCalendar();
    updateCalEditButton();
  };

  // Показать/скрыть кнопку «Редактировать» на шаге календаря
  function updateCalEditButton() {
    var editBtn = document.getElementById('wkCalendarEdit');
    var selectorDiv = document.getElementById('wkEditSelector');
    if (!editBtn) return;

    if (!wkSelectedDate) {
      editBtn.style.display = 'none';
      if (selectorDiv) selectorDiv.style.display = 'none';
      return;
    }

    var workouts = FP.getDateWorkouts(wkSelectedDate);
    if (workouts.length > 0) {
      editBtn.style.display = 'inline-flex';
    } else {
      editBtn.style.display = 'none';
      if (selectorDiv) selectorDiv.style.display = 'none';
    }
  }

  // Нажатие «Редактировать» — если одна тренировка, сразу редактировать; если несколько — показать селектор
  window.wkEditSelectedWorkout = function() {
    if (!wkSelectedDate) return;
    var workouts = FP.getDateWorkouts(wkSelectedDate);

    if (workouts.length === 0) return;

    if (workouts.length === 1) {
      // Одна тренировка — сразу открываем редактирование
      var wk = workouts[0];
      var wkId = wk.id || (wkSelectedDate + '_' + wk.time);
      openWorkoutModal(wkSelectedDate, wkId);
      return;
    }

    // Несколько тренировок — показать селектор
    var selectorDiv = document.getElementById('wkEditSelector');
    var selectorList = document.getElementById('wkEditSelectorList');
    if (!selectorDiv || !selectorList) return;

    var html = '';
    workouts.forEach(function(wk, idx) {
      var wkId = wk.id || (wkSelectedDate + '_' + wk.time);
      var locLabel = LOCATION_LABELS[wk.location] || '';
      var typeLabel = (TYPE_LABELS[wk.location] && TYPE_LABELS[wk.location][wk.type]) || '';
      var statusText = wk.done ? ' (выполнена)' : '';
      var exCount = (wk.exercises && wk.exercises.length) || 0;
      var calText = wk.totalCal ? wk.totalCal + ' ккал' : '';

      html += '<div class="wk-edit-selector-item" onclick="wkSelectEditWorkout(\'' + FP.escHtml(wkId) + '\')">' +
        '<div class="wk-edit-selector-item-info">' +
          '<div class="wk-edit-selector-item-title">' + FP.escHtml(locLabel + ' · ' + typeLabel + statusText) + '</div>' +
          '<div class="wk-edit-selector-item-meta">' + exCount + ' упр.' + (calText ? ' · ' + calText : '') + '</div>' +
        '</div>' +
        '<div class="wk-edit-selector-item-icon">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
        '</div>' +
      '</div>';
    });
    selectorList.innerHTML = html;
    selectorDiv.style.display = 'block';
  };

  // Выбор конкретной тренировки для редактирования из селектора
  window.wkSelectEditWorkout = function(wkId) {
    // Скрываем селектор
    var selectorDiv = document.getElementById('wkEditSelector');
    if (selectorDiv) selectorDiv.style.display = 'none';
    // Открываем модалку редактирования
    openWorkoutModal(wkSelectedDate, wkId);
  };

  window.wkCalendarConfirm = function() {
    if (!wkSelectedDate) return;
    document.getElementById('wkStep0').style.display = 'none';
    document.getElementById('wkStep1').style.display = 'flex';
    document.getElementById('wkStep2').style.display = 'none';
    document.getElementById('wkStep3').style.display = 'none';
    document.getElementById('wkStep5').style.display = 'none';
  };

  window.closeWorkoutModal = function() {
    document.getElementById('workoutModal').classList.remove('open');
    document.getElementById('workoutModal').classList.remove('fullscreen-modal');
    // Скрываем предупреждение при закрытии
    var warnEl = document.getElementById('wkCloseWarning');
    if (warnEl) warnEl.style.display = 'none';
  };

  // Определяем текущий шаг модалки
  function getCurrentWkStep() {
    for (var i = 0; i <= 5; i++) {
      var step = document.getElementById('wkStep' + i);
      if (step && step.style.display !== 'none') return i;
    }
    return -1;
  }

  // Клик на крестик модалки — контекстно-зависимое поведение
  window.workoutModalCloseClick = function() {
    var currentStep = getCurrentWkStep();

    // Если на шаге деталей упражнения — возвращаемся к списку
    if (currentStep === 4) {
      wkBackToExercises();
      return;
    }

    // Если на шаге плана тренировки (5) и есть упражнения — показать предупреждение
    if (currentStep === 5 && wkExercises.length > 0) {
      showWkCloseWarning();
      return;
    }

    // Если на шаге списка упражнений (3) и уже добавлены упражнения — показать предупреждение
    if (currentStep === 3 && wkExercises.length > 0) {
      showWkCloseWarning();
      return;
    }

    // Иначе просто закрыть
    closeWorkoutModal();
  };

  // Показать предупреждение о несохранённых данных
  function showWkCloseWarning() {
    var warnEl = document.getElementById('wkCloseWarning');
    if (warnEl) warnEl.style.display = 'flex';
  }

  // Скрыть предупреждение
  window.hideWkCloseWarning = function() {
    var warnEl = document.getElementById('wkCloseWarning');
    if (warnEl) warnEl.style.display = 'none';
  };

  // Сохранить план и выйти
  window.saveAndCloseWorkout = function() {
    if (wkExercises.length > 0) {
      finishWorkout();
    }
    closeWorkoutModal();
  };

  // Выйти без сохранения
  window.discardAndCloseWorkout = function() {
    closeWorkoutModal();
  };

  // Закрытие по клику на оверлей — только для НЕ-полноэкранной модалки
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      document.getElementById('workoutModal').addEventListener('click', function(e) {
        if (e.target === this && !this.classList.contains('fullscreen-modal')) {
          closeWorkoutModal();
        }
      });
    }, 100);
  });

  // ===== Шаг 1: выбор места =====
  window.selectWkLocation = function(loc) {
    wkLocation = loc;
    document.getElementById('wkStep1').style.display = 'none';
    document.getElementById('wkStep2').style.display = 'flex';
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

  // ===== Шаг 2: выбор типа =====
  window.selectWkType = function(type) {
    wkType = type;
    document.getElementById('wkStep2').style.display = 'none';
    document.getElementById('wkStep3').style.display = 'flex';
    document.getElementById('wkStep4').style.display = 'none';
    document.getElementById('wkStep5').style.display = 'none';
    wkExercises = [];
    wkSelectedExercise = null;
    document.getElementById('wkExerciseSearch').value = '';

    renderExerciseList('');
    setupWorkoutSearch();
    document.getElementById('wkPlanSaveBtn').textContent = 'Сохранить план';
  };

  window.wkGoBack = function(step) {
    if (step === 0) {
      document.getElementById('wkStep1').style.display = 'none';
      document.getElementById('wkStep0').style.display = 'flex';
    } else if (step === 1) {
      document.getElementById('wkStep2').style.display = 'none';
      document.getElementById('wkStep1').style.display = 'flex';
    } else if (step === 2) {
      document.getElementById('wkStep3').style.display = 'none';
      document.getElementById('wkStep5').style.display = 'none';
      document.getElementById('wkStep2').style.display = 'flex';
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

  // ===== Рендер списка упражнений по группам =====
  function renderExerciseListByGroups(groups, container, query) {
    var html = '';
    Object.keys(groups).forEach(function(groupName) {
      var exercises = groups[groupName];
      if (query) {
        var q = query.toLowerCase();
        exercises = exercises.filter(function(ex) { return ex.name.toLowerCase().indexOf(q) !== -1; });
      }
      if (exercises.length === 0) return;

      html += '<div class="wk-ex-list-group">';
      html += '<div class="wk-ex-list-group-label">' + FP.escHtml(groupName) + '</div>';
      exercises.forEach(function(ex) {
        var imgHtml = ex.img ? '<img src="img/' + ex.img + '" alt="' + FP.escHtml(ex.name) + '">' : '';
        html += '<div class="wk-ex-list-item" onclick="selectWkExerciseById(\'' + ex.id + '\')">' +
          '<div class="wk-ex-list-img">' + imgHtml + '</div>' +
          '<div class="wk-ex-list-info">' +
            '<div class="wk-ex-list-name">' + FP.escHtml(ex.name) + '</div>' +
            '<div class="wk-ex-list-groupname">' + FP.escHtml(groupName) + '</div>' +
          '</div>' +
          '<div class="wk-ex-list-add">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    });

    if (!html) {
      container.innerHTML = '<div class="no-results">Ничего не найдено</div>';
    } else {
      container.innerHTML = html;
    }
  }

  function renderExerciseList(query) {
    var container = document.getElementById('wkExerciseResults');

    if (wkType === 'strength' && (wkLocation === 'gym' || wkLocation === 'home')) {
      renderExerciseListByGroups(MUSCLE_GROUPS, container, query);
      return;
    }
    if (wkType === 'cardio' && wkLocation === 'gym') {
      renderExerciseListByGroups(CARDIO_GYM_CATEGORIES, container, query);
      return;
    }
    if (wkType === 'cardio' && wkLocation === 'home') {
      renderExerciseListByGroups(CARDIO_HOME_CATEGORIES, container, query);
      return;
    }
    if (wkType === 'workout' && wkLocation === 'street') {
      renderExerciseListByGroups(WORKOUT_STREET_CATEGORIES, container, query);
      return;
    }
    if (wkType === 'running' && wkLocation === 'street') {
      renderExerciseListByGroups(RUNNING_STREET_CATEGORIES, container, query);
      return;
    }
  }

  // ===== Шаг 4: Детали упражнения =====
  window.selectWkExerciseById = function(exId) {
    var found = null;
    var allCategories = [MUSCLE_GROUPS, CARDIO_GYM_CATEGORIES, CARDIO_HOME_CATEGORIES, WORKOUT_STREET_CATEGORIES, RUNNING_STREET_CATEGORIES];
    allCategories.forEach(function(cat) {
      if (found) return;
      Object.keys(cat).forEach(function(groupName) {
        if (found) return;
        cat[groupName].forEach(function(ex) {
          if (ex.id === exId) {
            found = { id: ex.id, name: ex.name, met: ex.met, kind: wkType, group: groupName, img: ex.img || '' };
          }
        });
      });
    });

    if (!found) {
      var db = EXERCISE_DB[wkLocation];
      if (db) {
        Object.keys(db).forEach(function(type) {
          db[type].forEach(function(ex) {
            if (ex.id === exId) found = { id: ex.id, name: ex.name, met: ex.met, kind: type, group: '' };
          });
        });
      }
    }
    if (!found) return;

    wkSelectedExercise = found;
    wkEditExerciseIdx = -1; // Новое упражнение, не редактирование

    document.getElementById('wkStep3').style.display = 'none';
    document.getElementById('wkStep4').style.display = 'flex';
    document.getElementById('wkStep5').style.display = 'none';

    // Сбросить текст кнопки на «Добавить к тренировке»
    var addBtn = document.querySelector('.wk-detail-add-btn');
    if (addBtn) addBtn.textContent = 'Добавить к тренировке';

    // Показать картинку упражнения
    var detailImg = document.getElementById('wkDetailImg');
    var imgSrc = found.img || '';
    // Также поискать img в базе по id
    if (!imgSrc) {
      allCategories.forEach(function(cat) {
        if (imgSrc) return;
        Object.keys(cat).forEach(function(gn) {
          if (imgSrc) return;
          cat[gn].forEach(function(ex) {
            if (ex.id === found.id && ex.img) imgSrc = ex.img;
          });
        });
      });
    }
    if (imgSrc) {
      detailImg.innerHTML = '<img src="img/' + imgSrc + '" alt="' + FP.escHtml(found.name) + '">';
      detailImg.style.background = 'transparent';
    } else {
      detailImg.innerHTML = '';
      detailImg.style.background = '#e2e8f0';
    }
    document.getElementById('wkDetailName').textContent = found.name;
    document.getElementById('wkDetailGroup').textContent = found.group || '';

    var isStr = (found.kind === 'strength' || found.kind === 'workout');
    document.getElementById('wkDetailStrength').style.display = isStr ? 'block' : 'none';
    document.getElementById('wkDetailCardio').style.display = isStr ? 'none' : 'block';

    if (isStr) {
      wkDetailSets = [{ weight: 0, reps: 10 }];
      renderWkSetsList();
    } else {
      document.getElementById('wkMinutes').value = 30;
      updateWkCardioPreview();
    }
  };

  window.wkBackToExercises = function() {
    document.getElementById('wkStep4').style.display = 'none';
    document.getElementById('wkStep5').style.display = 'none';
    document.getElementById('wkStep3').style.display = 'flex';
    wkSelectedExercise = null;
    wkEditExerciseIdx = -1;
    // Возвращаем текст кнопки
    var addBtn = document.querySelector('.wk-detail-add-btn');
    if (addBtn) addBtn.textContent = 'Добавить к тренировке';
  };

  function renderWkSetsList() {
    var html = '';
    wkDetailSets.forEach(function(set, idx) {
      html += '<div class="wk-set-row">' +
        '<span class="wk-set-num">' + (idx + 1) + '</span>' +
        '<div class="wk-set-field">' +
          '<span class="wk-set-field-label">Вес (кг)</span>' +
          '<div class="wk-set-num-input">' +
            '<button class="wk-set-btn" onclick="adjustWkSetField(' + idx + ',\'weight\',-2.5)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
            '<input type="number" value="' + set.weight + '" min="0" max="500" step="0.5" data-set-idx="' + idx + '" data-set-field="weight">' +
            '<button class="wk-set-btn" onclick="adjustWkSetField(' + idx + ',\'weight\',2.5)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
          '</div>' +
        '</div>' +
        '<div class="wk-set-field">' +
          '<span class="wk-set-field-label">Повторы</span>' +
          '<div class="wk-set-num-input">' +
            '<button class="wk-set-btn" onclick="adjustWkSetField(' + idx + ',\'reps\',-1)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
            '<input type="number" value="' + set.reps + '" min="1" max="100" step="1" data-set-idx="' + idx + '" data-set-field="reps">' +
            '<button class="wk-set-btn" onclick="adjustWkSetField(' + idx + ',\'reps\',1)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
          '</div>' +
        '</div>' +
        (wkDetailSets.length > 1 ? '<button class="wk-set-del" onclick="wkRemoveSet(' + idx + ')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' : '') +
      '</div>';
    });
    document.getElementById('wkSetsList').innerHTML = html;

    document.querySelectorAll('#wkSetsList input').forEach(function(inp) {
      inp.addEventListener('input', function() {
        var idx = parseInt(this.dataset.setIdx);
        var field = this.dataset.setField;
        if (wkDetailSets[idx]) {
          wkDetailSets[idx][field] = parseFloat(this.value) || 0;
        }
      });
    });
  }

  window.adjustWkSetField = function(idx, field, delta) {
    if (!wkDetailSets[idx]) return;
    var val = wkDetailSets[idx][field] || 0;
    val = val + delta;
    if (field === 'weight') {
      val = Math.max(0, val);
    } else if (field === 'reps') {
      val = Math.max(1, val);
    }
    wkDetailSets[idx][field] = val;
    renderWkSetsList();
  };

  window.adjustWkParam = function(inputId, delta) {
    var inp = document.getElementById(inputId);
    if (!inp) return;
    var val = parseFloat(inp.value) || 0;
    val = Math.max(parseFloat(inp.min) || 0, val + delta);
    val = Math.min(parseFloat(inp.max) || 9999, val);
    inp.value = Math.round(val * 10) / 10;
    inp.dispatchEvent(new Event('input'));
    if (inputId === 'wkMinutes') {
      updateWkCardioPreview();
    }
  };

  window.wkAddSet = function() {
    var lastSet = wkDetailSets[wkDetailSets.length - 1] || { weight: 0, reps: 10 };
    wkDetailSets.push({ weight: lastSet.weight, reps: lastSet.reps });
    renderWkSetsList();
  };

  window.wkRemoveSet = function(idx) {
    wkDetailSets.splice(idx, 1);
    renderWkSetsList();
  };

  function updateWkCardioPreview() {
    if (!wkSelectedExercise) return;
    var profile = FP.loadProfile();
    var weight = profile ? profile.weight : 70;
    var minutes = parseInt(document.getElementById('wkMinutes').value) || 30;
    var cal = wkSelectedExercise.met * weight * (minutes / 60);
    document.getElementById('wkCardioPreview').textContent = Math.round(cal) + ' ккал  ·  ~' + Math.round(minutes) + ' мин';
  }

  // ===== Добавление / сохранение упражнения из детали =====
  window.addExerciseFromDetail = function() {
    if (!wkSelectedExercise) return;
    var profile = FP.loadProfile();
    var weight = profile ? profile.weight : 70;
    var isStr = (wkSelectedExercise.kind === 'strength' || wkSelectedExercise.kind === 'workout');
    var minutes, cal, totalSets = 0, totalReps = 0, totalWeight = 0;

    if (isStr) {
      wkDetailSets.forEach(function(set) {
        totalSets++;
        totalReps += (parseInt(set.reps) || 0);
        totalWeight += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
      });
      minutes = totalSets * 1.5;
      cal = wkSelectedExercise.met * weight * (minutes / 60);

      var exerciseObj = {
        name: wkSelectedExercise.name,
        kind: 'strength',
        sets: totalSets,
        reps: totalReps,
        weight: totalWeight,
        setsDetail: wkDetailSets.map(function(s) { return { weight: parseFloat(s.weight) || 0, reps: parseInt(s.reps) || 0 }; }),
        minutes: Math.round(minutes),
        met: wkSelectedExercise.met,
        cal: Math.round(cal),
      };

      if (wkEditExerciseIdx >= 0) {
        wkExercises[wkEditExerciseIdx] = exerciseObj;
      } else {
        wkExercises.push(exerciseObj);
      }
    } else {
      minutes = parseInt(document.getElementById('wkMinutes').value) || 30;
      cal = wkSelectedExercise.met * weight * (minutes / 60);

      var exerciseObj = {
        name: wkSelectedExercise.name,
        kind: 'cardio',
        sets: 0,
        reps: 0,
        weight: 0,
        minutes: Math.round(minutes),
        met: wkSelectedExercise.met,
        cal: Math.round(cal),
      };

      if (wkEditExerciseIdx >= 0) {
        wkExercises[wkEditExerciseIdx] = exerciseObj;
      } else {
        wkExercises.push(exerciseObj);
      }
    }

    wkEditExerciseIdx = -1;
    // Возвращаем текст кнопки
    var addBtn = document.querySelector('.wk-detail-add-btn');
    if (addBtn) addBtn.textContent = 'Добавить к тренировке';

    showWkStep5();
  };

  function showWkStep5() {
    document.getElementById('wkStep3').style.display = 'none';
    document.getElementById('wkStep4').style.display = 'none';
    document.getElementById('wkStep5').style.display = 'flex';
    updateWkPlanList();
  }

  window.wkPlanAddExercise = function() {
    document.getElementById('wkStep5').style.display = 'none';
    document.getElementById('wkStep3').style.display = 'flex';
    document.getElementById('wkExerciseSearch').value = '';
    renderExerciseList('');
  };

  // Индекс упражнения, которое сейчас редактируется из плана (−1 = не редактирование)
  var wkEditExerciseIdx = -1;

  function formatPlanDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var dateObj = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
    var isToday = dateStr === FP.todayDateStr();
    if (isToday) return 'Сегодня';
    return FP.DAY_NAMES_SHORT[dateObj.getDay()] + ', ' + dateObj.getDate() + ' ' + FP.MONTH_NAMES[dateObj.getMonth()];
  }

  function updateWkPlanList() {
    var totalCal = 0, totalDur = 0;
    var html = '';
    wkExercises.forEach(function(ex, idx) {
      totalCal += ex.cal;
      totalDur += ex.minutes;
      var detail = '';
      if (ex.kind === 'strength') {
        if (ex.setsDetail && ex.setsDetail.length > 0) {
          detail = ex.setsDetail.map(function(s) { return s.reps + 'х' + s.weight + 'кг'; }).join('/');
        } else {
          detail = ex.sets + ' п. x ' + ex.reps + ' пт';
        }
        var totalW = 0;
        if (ex.setsDetail) { ex.setsDetail.forEach(function(s) { totalW += s.weight * s.reps; }); }
        else { totalW = Math.round(ex.weight); }
        if (totalW > 0) detail += ' · ' + Math.round(totalW) + ' кг общ.';
      } else {
        detail = ex.minutes + ' мин';
      }
      html += '<div class="wk-plan-item" onclick="editWkPlanExercise(' + idx + ')" style="cursor:pointer">' +
        '<div class="wk-plan-item-info">' +
          '<span class="wk-plan-item-name">' + FP.escHtml(ex.name) + '</span>' +
          '<span class="wk-plan-item-detail">' + detail + '</span>' +
        '</div>' +
        '<span class="wk-plan-item-cal">' + ex.cal + ' ккал</span>' +
        '<button class="wk-plan-item-edit-btn" onclick="event.stopPropagation();editWkPlanExercise(' + idx + ')" title="Редактировать">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
        '</button>' +
        '<button class="wk-plan-item-del" onclick="event.stopPropagation();removeWkPlanExercise(' + idx + ')" title="Удалить">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
        '</button>' +
      '</div>';
    });
    document.getElementById('wkPlanList').innerHTML = html;

    // Обновляем сводку (дата, время, калории)
    var dateStr = wkSelectedDate || FP.todayDateStr();
    var dateEl = document.getElementById('wkPlanDateValue');
    if (dateEl) dateEl.textContent = formatPlanDate(dateStr);
    var timeEl = document.getElementById('wkPlanTimeValue');
    if (timeEl) timeEl.textContent = '~' + Math.round(totalDur) + ' мин';
    var calEl = document.getElementById('wkPlanCalValue');
    if (calEl) calEl.textContent = totalCal + ' ккал';

    document.getElementById('wkPlanSaveBtn').disabled = wkExercises.length === 0;
    document.getElementById('wkPlanEmpty').style.display = wkExercises.length === 0 ? 'flex' : 'none';
  }

  window.removeWkPlanExercise = function(idx) {
    wkExercises.splice(idx, 1);
    updateWkPlanList();
  };

  // ===== Редактирование упражнения из плана =====
  window.editWkPlanExercise = function(idx) {
    var ex = wkExercises[idx];
    if (!ex) return;

    wkEditExerciseIdx = idx;

    // Найти упражнение в базе по имени, чтобы получить met и id
    var found = null;
    var allCategories = [MUSCLE_GROUPS, CARDIO_GYM_CATEGORIES, CARDIO_HOME_CATEGORIES, WORKOUT_STREET_CATEGORIES, RUNNING_STREET_CATEGORIES];
    allCategories.forEach(function(cat) {
      if (found) return;
      Object.keys(cat).forEach(function(groupName) {
        if (found) return;
        cat[groupName].forEach(function(e) {
          if (e.name === ex.name) {
            found = { id: e.id, name: e.name, met: e.met, kind: ex.kind, group: groupName, img: e.img || '' };
          }
        });
      });
    });
    if (!found) {
      found = { id: 'edit_' + idx, name: ex.name, met: ex.met || 4.0, kind: ex.kind, group: '', img: '' };
    }
    wkSelectedExercise = found;

    document.getElementById('wkStep5').style.display = 'none';
    document.getElementById('wkStep4').style.display = 'flex';

    // Картинка
    var detailImg = document.getElementById('wkDetailImg');
    if (found.img) {
      detailImg.innerHTML = '<img src="img/' + found.img + '" alt="' + FP.escHtml(found.name) + '">';
      detailImg.style.background = 'transparent';
    } else {
      detailImg.innerHTML = '';
      detailImg.style.background = '#e2e8f0';
    }
    document.getElementById('wkDetailName').textContent = found.name;
    document.getElementById('wkDetailGroup').textContent = found.group || '';

    var isStr = (found.kind === 'strength' || found.kind === 'workout');
    document.getElementById('wkDetailStrength').style.display = isStr ? 'block' : 'none';
    document.getElementById('wkDetailCardio').style.display = isStr ? 'none' : 'block';

    if (isStr) {
      // Восстановить подходы из setsDetail
      if (ex.setsDetail && ex.setsDetail.length > 0) {
        wkDetailSets = ex.setsDetail.map(function(s) { return { weight: s.weight, reps: s.reps }; });
      } else {
        wkDetailSets = [{ weight: 0, reps: 10 }];
      }
      renderWkSetsList();
    } else {
      document.getElementById('wkMinutes').value = ex.minutes || 30;
      updateWkCardioPreview();
    }

    // Меняем кнопку на «Сохранить» вместо «Добавить»
    var addBtn = document.querySelector('.wk-detail-add-btn');
    if (addBtn) addBtn.textContent = 'Сохранить';
  };

  // ===== Редактирование даты в плане =====
  window.wkPlanEditDate = function() {
    var picker = document.getElementById('wkPlanDatePicker');
    var input = document.getElementById('wkPlanDateInput');
    var dateStr = wkSelectedDate || FP.todayDateStr();
    // Конвертируем формат "YYYY-M-D" в "YYYY-MM-DD" для <input type="date">
    var parts = dateStr.split('-');
    var isoDate = parts[0] + '-' + (parts[1].length < 2 ? '0' + parts[1] : parts[1]) + '-' + (parts[2].length < 2 ? '0' + parts[2] : parts[2]);
    input.value = isoDate;
    picker.style.display = 'flex';
  };

  window.wkPlanDateChanged = function(val) {
    // Просто сохраняем, подтверждение по кнопке OK
  };

  window.wkPlanDateConfirm = function() {
    var input = document.getElementById('wkPlanDateInput');
    var val = input.value; // YYYY-MM-DD
    if (val) {
      // Конвертируем обратно в формат YYYY-M-D
      var parts = val.split('-');
      wkSelectedDate = parseInt(parts[0]) + '-' + parseInt(parts[1]) + '-' + parseInt(parts[2]);
    }
    document.getElementById('wkPlanDatePicker').style.display = 'none';
    updateWkPlanList();
  };

  // ===== Сохранение тренировки =====
  window.finishWorkout = function() {
    if (wkExercises.length === 0) return;

    var totalCal = 0, totalDur = 0;
    wkExercises.forEach(function(ex) { totalCal += ex.cal; totalDur += ex.minutes; });

    var dateStr = wkSelectedDate || FP.todayDateStr();

    if (wkEditId) {
      var oldWorkouts = FP.getDateWorkouts(wkEditDateStr);
      var filtered = oldWorkouts.filter(function(wk) {
        return (wk.id || (wkEditDateStr + '_' + wk.time)) !== wkEditId;
      });
      if (wkEditDateStr === dateStr) {
        var workout = {
          id: wkEditId,
          location: wkLocation,
          type: wkType,
          exercises: wkExercises,
          totalCal: totalCal,
          totalDuration: totalDur,
          time: new Date().toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' }),
          done: false,
        };
        filtered.push(workout);
        if (filtered.length > 0) {
          FP.saveDateWorkouts(dateStr, filtered);
        } else {
          localStorage.removeItem(FP.workoutsKey(dateStr));
        }
      } else {
        if (filtered.length > 0) {
          FP.saveDateWorkouts(wkEditDateStr, filtered);
        } else {
          localStorage.removeItem(FP.workoutsKey(wkEditDateStr));
        }
        var newWorkouts = FP.getDateWorkouts(dateStr);
        newWorkouts.push({
          id: 'wk_' + Date.now(),
          location: wkLocation,
          type: wkType,
          exercises: wkExercises,
          totalCal: totalCal,
          totalDuration: totalDur,
          time: new Date().toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' }),
          done: false,
        });
        FP.saveDateWorkouts(dateStr, newWorkouts);
      }
    } else {
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
      var workouts = FP.getDateWorkouts(dateStr);
      workouts.push(workout);
      FP.saveDateWorkouts(dateStr, workouts);
    }

    closeWorkoutModal();

    var profile = FP.loadProfile();
    FP.renderWorkoutView(profile);
    FP.updateDashboardStats(profile);
  };

})();
