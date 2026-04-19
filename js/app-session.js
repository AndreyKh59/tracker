// ============================================
// FitPulse — app-session.js
// Вкладка сессии тренировки (live режим)
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  // ===== Маппинг названий упражнений на картинки =====
  var EX_IMG_MAP = {
    'Жим лёжа': 'bench_press.png',
    'Жим штанги лёжа': 'bench_press.png',
    'Жим гантелей лёжа': 'bench_press.png',
    'Разводка гантелей': 'bench_press.png',
    'Кроссовер': 'bench_press.png',
    'Жим под углом': 'bench_press.png',
    'Присед со штангой': 'squat.png',
    'Приседания': 'squat.png',
    'Приседания с прыжком': 'squat.png',
    'Жим ногами': 'squat.png',
    'Разгибание ног': 'squat.png',
    'Сгибание ног': 'squat.png',
    'Подъём на носки': 'squat.png',
    'Становая тяга': 'deadlift.png',
    'Гиперэкстензия': 'deadlift.png',
    'Тяга верхнего блока': 'pullup.png',
    'Подтягивания': 'pullup.png',
    'Тяга в наклоне': 'pullup.png',
    'Тяга нижнего блока': 'pullup.png',
    'Тяга гантели в наклоне': 'pullup.png',
    'Выход силой': 'pullup.png',
    'Подъём ног к перекладине': 'pullup.png',
    'Лазание по канату': 'pullup.png',
    'Отжимания': 'pushup.png',
    'Отжимания на брусьях': 'dips.png',
    'Отжимания (разные хваты)': 'pushup.png',
    'Отжимания узким хватом': 'pushup.png',
    'Отжимания на трицепс': 'pushup.png',
    'Сгибание рук (бицепс)': 'bicep_curl.png',
    'Подъём штанги на бицепс стоя': 'bicep_curl.png',
    'Молотки': 'bicep_curl.png',
    'Разгибание на блоке': 'bicep_curl.png',
    'Французский жим': 'bench_press.png',
    'Жим гантелей сидя': 'shoulder_press.png',
    'Махи гантелями': 'shoulder_press.png',
    'Тяга штанги к подбородку': 'shoulder_press.png',
    'Фейс пулл': 'shoulder_press.png',
    'Подъём перед собой': 'shoulder_press.png',
    'Планка': 'plank.png',
    'Скручивания': 'plank.png',
    'Подъём ног': 'plank.png',
    'Русские скручивания': 'plank.png',
    'Велосипед (лёжа)': 'plank.png',
    'Ягодичный мостик': 'plank.png',
    'Выпады': 'lunges.png',
    'Заход на скамью': 'lunges.png',
    'Бёрпи': 'burpees.png',
    'Скакалка': 'jump_rope.png',
    'Джампинг джек': 'jump_rope.png',
    'Беговая дорожка': 'treadmill.png',
    'Велотренажёр': 'treadmill.png',
    'Гребной тренажёр': 'treadmill.png',
    'Эллипс': 'elliptical.png',
    'Бег трусцой': 'running.png',
    'Бег интервальный': 'running.png',
    'Спринт': 'running.png',
    'Ходьба быстрая': 'running.png',
    'Велосипед': 'running.png',
    'Бег на месте': 'running.png',
  };

  // Получить картинку упражнения по названию
  function getExerciseImg(ex) {
    if (ex.img) return ex.img;
    return EX_IMG_MAP[ex.name] || '';
  }

  // ===== Состояние сессии =====
  var sessionActive = false;
  var sessionWorkout = null; // объект тренировки из localStorage
  var sessionDateStr = '';
  var sessionWkId = '';
  var sessionStartTime = 0;
  var sessionTimerInterval = null;
  var sessionElapsed = 0; // секунды

  // Таймер отдыха
  var restTimerInterval = null;
  var restTimeLeft = 0; // секунды
  var REST_DURATION = 120; // 2 минуты

  // Сохраняем текущий вид до входа в сессию
  var previousView = 'dashboard';

  // ===== Начать сессию тренировки =====
  window.startWorkoutSession = function(dateStr, wkId) {
    if (!dateStr || !wkId) {
      // Если не переданы — берём первую невыполненную тренировку за сегодня
      var todayWorkouts = FP.getDateWorkouts(FP.todayDateStr());
      var wk = null;
      for (var i = 0; i < todayWorkouts.length; i++) {
        if (!todayWorkouts[i].done) {
          wk = todayWorkouts[i];
          dateStr = FP.todayDateStr();
          wkId = wk.id || (dateStr + '_' + wk.time);
          break;
        }
      }
      if (!wk) return;
    }

    var workouts = FP.getDateWorkouts(dateStr);
    var wk = null;
    for (var i = 0; i < workouts.length; i++) {
      if ((workouts[i].id || (dateStr + '_' + workouts[i].time)) === wkId) {
        wk = workouts[i];
        break;
      }
    }
    if (!wk) return;

    sessionWorkout = JSON.parse(JSON.stringify(wk)); // глубокая копия
    sessionDateStr = dateStr;
    sessionWkId = wkId;
    sessionActive = true;
    sessionStartTime = Date.now();
    sessionElapsed = 0;

    // Инициализация статусов подходов
    sessionWorkout.exercises.forEach(function(ex) {
      if (ex.kind === 'strength' || ex.kind === 'workout') {
        if (!ex.setsDetail) {
          ex.setsDetail = [];
          for (var s = 0; s < (ex.sets || 1); s++) {
            ex.setsDetail.push({ weight: ex.weight || 0, reps: ex.reps || 10, done: false });
          }
        } else {
          ex.setsDetail.forEach(function(set) { set.done = false; });
        }
      }
      ex._expanded = false;
    });

    // Запомнить текущий вид
    var currentActive = document.querySelector('.view.active');
    if (currentActive && currentActive.id !== 'viewSession') {
      previousView = currentActive.id.replace('view', '').toLowerCase();
      // Приводим к формату navigate: viewDashboard -> dashboard
      previousView = previousView.charAt(0).toLowerCase() + previousView.slice(1);
    }

    // Переключиться на вкладку сессии
    navigateToSession();

    // Запустить таймер
    startSessionTimer();

    // Рендер упражнений
    renderSessionExercises();
    updateSessionProgress();
  };

  // ===== Навигация на вкладку сессии =====
  function navigateToSession() {
    // Скрыть все view
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });

    // Показать viewSession
    var sessionView = document.getElementById('viewSession');
    if (sessionView) {
      sessionView.classList.add('active');
    }

    // Убрать активные классы у навигации (сессия — не обычная вкладка)
    document.querySelectorAll('.sidebar-btn, .bottomnav-btn').forEach(function(b) {
      b.classList.remove('active');
    });

    // Обновить заголовок
    var headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = 'Тренировка';
  }

  // ===== Вернуться на предыдущий вид =====
  function navigateFromSession() {
    var headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = 'FitPulse';

    // Вернуться на предыдущий вид через navigate()
    if (typeof navigate === 'function') {
      navigate(previousView || 'dashboard');
    }
  }

  // ===== Таймер тренировки =====
  function startSessionTimer() {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = setInterval(function() {
      sessionElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      var min = Math.floor(sessionElapsed / 60);
      var sec = sessionElapsed % 60;
      var timerEl = document.getElementById('wsTimer');
      if (timerEl) {
        timerEl.textContent = (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
      }
    }, 1000);
  }

  // ===== Таймер отдыха =====
  function startRestTimer() {
    clearInterval(restTimerInterval);
    restTimeLeft = REST_DURATION;

    var restEl = document.getElementById('wsRestTimer');
    if (restEl) restEl.style.display = 'flex';

    updateRestTimerDisplay();

    restTimerInterval = setInterval(function() {
      restTimeLeft--;
      if (restTimeLeft <= 0) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        if (restEl) restEl.style.display = 'none';
        // Вибрация если доступна
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      } else {
        updateRestTimerDisplay();
      }
    }, 1000);
  }

  function updateRestTimerDisplay() {
    var el = document.getElementById('wsRestTimerVal');
    if (!el) return;
    var min = Math.floor(restTimeLeft / 60);
    var sec = restTimeLeft % 60;
    el.textContent = min + ':' + (sec < 10 ? '0' : '') + sec;
  }

  window.skipRest = function() {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
    var restEl = document.getElementById('wsRestTimer');
    if (restEl) restEl.style.display = 'none';
  };

  // ===== Рендер списка упражнений =====
  function renderSessionExercises() {
    var container = document.getElementById('wsExercises');
    if (!container || !sessionWorkout) return;

    var html = '';
    sessionWorkout.exercises.forEach(function(ex, exIdx) {
      var isStr = (ex.kind === 'strength' || ex.kind === 'workout');
      var expanded = ex._expanded;
      var allDone = true;
      var doneCount = 0;
      var totalCount = 0;

      if (isStr && ex.setsDetail) {
        totalCount = ex.setsDetail.length;
        ex.setsDetail.forEach(function(s) {
          if (s.done) doneCount++;
          else allDone = false;
        });
      } else if (!isStr) {
        // Кардио — не имеет подходов, просто отмечаем
        allDone = false;
      }

      var completedClass = allDone && totalCount > 0 ? ' ws-ex-completed' : '';

      html += '<div class="ws-exercise' + completedClass + '">';

      // Заголовок упражнения
      html += '<div class="ws-ex-head" onclick="toggleSessionEx(' + exIdx + ')">';
      // Картинка упражнения
      var exImg = getExerciseImg(ex);
      html += '<div class="ws-ex-img">';
      if (exImg) {
        html += '<img src="img/' + FP.escHtml(exImg) + '" alt="' + FP.escHtml(ex.name) + '">';
      } else {
        html += '<svg class="ws-ex-img-placeholder" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
      }
      html += '</div>';
      html += '<div class="ws-ex-info">';
      html += '<div class="ws-ex-name">' + FP.escHtml(ex.name) + '</div>';
      if (isStr && ex.setsDetail) {
        html += '<div class="ws-ex-meta">' + doneCount + ' из ' + totalCount + ' подходов</div>';
      } else if (!isStr) {
        html += '<div class="ws-ex-meta">' + (ex.minutes || 0) + ' мин кардио</div>';
      }
      html += '</div>';
      html += '<div class="ws-ex-right">';
      if (allDone && totalCount > 0) {
        html += '<svg class="ws-ex-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
      } else {
        html += '<svg class="ws-ex-chevron' + (expanded ? ' open' : '') + '" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
      }
      html += '</div>';
      html += '</div>';

      // Тело — подходы (гармошка)
      if (isStr && ex.setsDetail) {
        html += '<div class="ws-ex-body' + (expanded ? ' open' : '') + '" id="wsExBody_' + exIdx + '">';
        html += '<div class="ws-sets">';

        ex.setsDetail.forEach(function(set, setIdx) {
          var setDoneClass = set.done ? ' done' : '';
          html += '<div class="ws-set' + setDoneClass + '">';
          html += '<div class="ws-set-num">' + (setIdx + 1) + '</div>';

          // Вес
          html += '<div class="ws-set-field">';
          html += '<span class="ws-set-label">кг</span>';
          html += '<div class="ws-set-input-wrap">';
          html += '<button class="ws-set-btn" onclick="event.stopPropagation(); adjustSessionSet(' + exIdx + ',' + setIdx + ',\'weight\',-2.5)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
          html += '<input type="number" value="' + set.weight + '" min="0" max="500" step="0.5" onchange="updateSessionSet(' + exIdx + ',' + setIdx + ',\'weight\',this.value)">';
          html += '<button class="ws-set-btn" onclick="event.stopPropagation(); adjustSessionSet(' + exIdx + ',' + setIdx + ',\'weight\',2.5)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
          html += '</div>';
          html += '</div>';

          // Повторы
          html += '<div class="ws-set-field">';
          html += '<span class="ws-set-label">повт</span>';
          html += '<div class="ws-set-input-wrap">';
          html += '<button class="ws-set-btn" onclick="event.stopPropagation(); adjustSessionSet(' + exIdx + ',' + setIdx + ',\'reps\',-1)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
          html += '<input type="number" value="' + set.reps + '" min="1" max="100" step="1" onchange="updateSessionSet(' + exIdx + ',' + setIdx + ',\'reps\',this.value)">';
          html += '<button class="ws-set-btn" onclick="event.stopPropagation(); adjustSessionSet(' + exIdx + ',' + setIdx + ',\'reps\',1)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
          html += '</div>';
          html += '</div>';

          // Кнопка выполнения подхода
          html += '<button class="ws-set-done-btn' + (set.done ? ' done' : '') + '" onclick="event.stopPropagation(); toggleSessionSetDone(' + exIdx + ',' + setIdx + ')">';
          if (set.done) {
            html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
          } else {
            html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
          }
          html += '</button>';

          html += '</div>';
        });

        html += '</div>';
        // Кнопка «Добавить подход»
        html += '<button class="ws-add-set-btn" onclick="event.stopPropagation(); addSessionSet(' + exIdx + ')">';
        html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        html += 'Добавить подход';
        html += '</button>';
        html += '</div>';
      } else if (!isStr) {
        // Кардио — блок с временем
        html += '<div class="ws-ex-body' + (expanded ? ' open' : '') + '" id="wsExBody_' + exIdx + '">';
        html += '<div class="ws-cardio-row">';
        html += '<div class="ws-set-field">';
        html += '<span class="ws-set-label">мин</span>';
        html += '<div class="ws-set-input-wrap">';
        html += '<button class="ws-set-btn" onclick="event.stopPropagation(); adjustSessionCardio(' + exIdx + ',-5)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
        html += '<input type="number" value="' + (ex.minutes || 0) + '" min="1" max="300" step="5" onchange="updateSessionCardio(' + exIdx + ',this.value)">';
        html += '<button class="ws-set-btn" onclick="event.stopPropagation(); adjustSessionCardio(' + exIdx + ',5)"><svg width="12" height="12" viewBox="0 0 18 18" fill="none"><line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
        html += '</div>';
        html += '</div>';
        html += '<button class="ws-cardio-done-btn" onclick="event.stopPropagation(); markCardioDone(' + exIdx + ')">Выполнил</button>';
        html += '</div>';
        html += '</div>';
      }

      html += '</div>';
    });

    container.innerHTML = html;
  }

  // ===== Раскрыть/скрыть упражнение =====
  window.toggleSessionEx = function(exIdx) {
    if (!sessionWorkout || !sessionWorkout.exercises[exIdx]) return;
    sessionWorkout.exercises[exIdx]._expanded = !sessionWorkout.exercises[exIdx]._expanded;
    renderSessionExercises();
  };

  // ===== Изменить вес/повторы подхода =====
  window.adjustSessionSet = function(exIdx, setIdx, field, delta) {
    if (!sessionWorkout) return;
    var set = sessionWorkout.exercises[exIdx].setsDetail[setIdx];
    if (!set) return;
    var val = parseFloat(set[field]) || 0;
    val = Math.max(field === 'reps' ? 1 : 0, val + delta);
    if (field === 'weight') val = Math.min(500, val);
    if (field === 'reps') val = Math.min(100, val);
    set[field] = val;
    renderSessionExercises();
  };

  window.updateSessionSet = function(exIdx, setIdx, field, value) {
    if (!sessionWorkout) return;
    var set = sessionWorkout.exercises[exIdx].setsDetail[setIdx];
    if (!set) return;
    var val = parseFloat(value) || 0;
    if (field === 'reps') val = Math.max(1, Math.min(100, val));
    if (field === 'weight') val = Math.max(0, Math.min(500, val));
    set[field] = val;
  };

  // ===== Отметить подход выполненным =====
  window.toggleSessionSetDone = function(exIdx, setIdx) {
    if (!sessionWorkout) return;
    var set = sessionWorkout.exercises[exIdx].setsDetail[setIdx];
    if (!set) return;

    var wasDone = set.done;
    set.done = !set.done;

    // Вибрация при выполнении
    if (set.done && navigator.vibrate) navigator.vibrate(50);

    renderSessionExercises();
    updateSessionProgress();

    // Если подход выполнен (не снята отметка) — запустить таймер отдыха
    if (set.done && !wasDone) {
      startRestTimer();
    }
  };

  // ===== Добавить подход =====
  window.addSessionSet = function(exIdx) {
    if (!sessionWorkout) return;
    var ex = sessionWorkout.exercises[exIdx];
    if (!ex || !ex.setsDetail) return;
    // Новый подход наследует вес/повторы последнего подхода
    var lastSet = ex.setsDetail.length > 0 ? ex.setsDetail[ex.setsDetail.length - 1] : null;
    var newWeight = lastSet ? lastSet.weight : 0;
    var newReps = lastSet ? lastSet.reps : 10;
    ex.setsDetail.push({ weight: newWeight, reps: newReps, done: false });
    renderSessionExercises();
    updateSessionProgress();
  };

  // ===== Кардио: изменить время =====
  window.adjustSessionCardio = function(exIdx, delta) {
    if (!sessionWorkout) return;
    var ex = sessionWorkout.exercises[exIdx];
    var val = (ex.minutes || 0) + delta;
    val = Math.max(1, Math.min(300, val));
    ex.minutes = val;
    renderSessionExercises();
  };

  window.updateSessionCardio = function(exIdx, value) {
    if (!sessionWorkout) return;
    var val = parseInt(value) || 1;
    val = Math.max(1, Math.min(300, val));
    sessionWorkout.exercises[exIdx].minutes = val;
  };

  window.markCardioDone = function(exIdx) {
    if (!sessionWorkout) return;
    if (navigator.vibrate) navigator.vibrate(50);
    startRestTimer();
    renderSessionExercises();
    updateSessionProgress();
  };

  // ===== Прогресс тренировки =====
  function updateSessionProgress() {
    if (!sessionWorkout) return;
    var totalSets = 0;
    var doneSets = 0;

    sessionWorkout.exercises.forEach(function(ex) {
      if ((ex.kind === 'strength' || ex.kind === 'workout') && ex.setsDetail) {
        totalSets += ex.setsDetail.length;
        ex.setsDetail.forEach(function(s) {
          if (s.done) doneSets++;
        });
      }
    });

    var pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
    var bar = document.getElementById('wsProgressBar');
    if (bar) bar.style.width = pct + '%';
  }

  // ===== Завершить тренировку =====
  window.finishWorkoutSession = function() {
    if (!sessionWorkout) return;

    // Подсчитать результаты
    var totalCal = 0;
    var profile = FP.loadProfile();
    var weightKg = profile ? (profile.weight || 70) : 70;

    sessionWorkout.exercises.forEach(function(ex) {
      if ((ex.kind === 'strength' || ex.kind === 'workout') && ex.setsDetail) {
        var exCal = 0;
        ex.setsDetail.forEach(function(s) {
          if (s.done) {
            // Примерный расчёт: MET * вес * время за подход (~1 мин)
            var met = ex.met || 5;
            exCal += Math.round(met * weightKg / 60 * 1.5);
          }
        });
        ex.cal = exCal;
        totalCal += exCal;
        ex.sets = ex.setsDetail.length;
      } else {
        // Кардио
        var met = ex.met || 7;
        var minutes = ex.minutes || 0;
        ex.cal = Math.round(met * weightKg / 60 * minutes);
        totalCal += ex.cal;
      }
    });

    sessionWorkout.totalCal = totalCal;
    sessionWorkout.totalDuration = Math.max(1, Math.round(sessionElapsed / 60));
    sessionWorkout.done = true;

    // Сохранить в localStorage
    var workouts = FP.getDateWorkouts(sessionDateStr);
    for (var i = 0; i < workouts.length; i++) {
      if ((workouts[i].id || (sessionDateStr + '_' + workouts[i].time)) === sessionWkId) {
        workouts[i] = sessionWorkout;
        break;
      }
    }
    FP.saveDateWorkouts(sessionDateStr, workouts);

    // Закрыть сессию
    closeSession();

    // Обновить UI
    if (profile) {
      if (FP.renderWorkoutView) FP.renderWorkoutView(profile);
      if (FP.renderDashboard) FP.renderDashboard(profile);
    }
  };

  // ===== Закрыть экран сессии =====
  function closeSession() {
    clearInterval(sessionTimerInterval);
    clearInterval(restTimerInterval);
    sessionTimerInterval = null;
    restTimerInterval = null;
    sessionActive = false;
    sessionWorkout = null;

    // Скрыть таймер отдыха
    var restEl = document.getElementById('wsRestTimer');
    if (restEl) restEl.style.display = 'none';

    // Сбросить таймер
    var timerEl = document.getElementById('wsTimer');
    if (timerEl) timerEl.textContent = '00:00';

    // Вернуться на предыдущий вид
    navigateFromSession();
  }

  // ===== Проверка — идёт ли сессия =====
  FP.isSessionActive = function() {
    return sessionActive;
  };

})();
