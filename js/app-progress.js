// ============================================
// FitPulse — app-progress.js
// Вкладка «Прогресс» — графики веса, питания, тренировки, активности
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  var weightChart = null;
  var nutritionChart = null;
  var activityChart = null;
  var currentWeightPeriod = 'week';
  var currentNutritionPeriod = 'week';
  var currentActivityPeriod = 'week';
  var currentProgressType = 'nutrition';

  // Календарь тренировок
  var calMonth = new Date().getMonth();
  var calYear = new Date().getFullYear();

  var MONTH_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  var CAL_MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var CAL_DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  // ===== Переключение типа прогресса =====
  window.switchProgressType = function(type) {
    currentProgressType = type;

    // Обновить плашки
    document.querySelectorAll('.progress-type-card').forEach(function(card) {
      card.classList.toggle('active', card.dataset.type === type);
    });

    // Скрыть все панели, показать нужную
    ['nutrition','workouts','weight','activity'].forEach(function(t) {
      var panel = document.getElementById('progressPanel_' + t);
      if (panel) panel.style.display = (t === type) ? 'block' : 'none';
    });

    // Рендер содержимого
    if (type === 'nutrition') {
      renderNutritionChart(currentNutritionPeriod);
    } else if (type === 'workouts') {
      renderProgressCalendar();
    } else if (type === 'weight') {
      renderWeightChart(currentWeightPeriod);
    } else if (type === 'activity') {
      renderActivityChart(currentActivityPeriod);
    }
  };

  // ===== Рендер прогресса =====
  FP.renderProgressView = function(profile) {
    // Рендерим текущую активную панель
    switchProgressType(currentProgressType);
  };

  // ===== Переключение периода веса =====
  window.switchWeightPeriod = function(period) {
    currentWeightPeriod = period;
    updateTabs('weightTabs', period);
    renderWeightChart(period);
  };

  // ===== Переключение периода питания =====
  window.switchNutritionPeriod = function(period) {
    currentNutritionPeriod = period;
    updateTabs('nutritionTabs', period);
    renderNutritionChart(period);
  };

  // ===== Переключение периода активности =====
  window.switchActivityPeriod = function(period) {
    currentActivityPeriod = period;
    updateTabs('activityTabs', period);
    renderActivityChart(period);
  };

  // ===== Обновление вкладок =====
  function updateTabs(containerId, activePeriod) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.progress-tab').forEach(function(tab) {
      tab.classList.toggle('active', tab.dataset.period === activePeriod);
    });
  }

  // ===== Генерация списка дат от firstDate до сегодня =====
  function getDateRangeFrom(firstDateStr) {
    var dates = [];
    var first = parseDate(firstDateStr);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var d = new Date(first);
    while (d <= today) {
      dates.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }

  // ===== Парсинг даты из строки =====
  function parseDate(str) {
    var parts = str.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // ===== Форматирование метки =====
  function formatLabel(dateStr, period, prevDateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var day = d.getDate();
    var month = d.getMonth();
    var monthName = MONTH_SHORT[month];

    var newMonth = false;
    if (prevDateStr) {
      var prevParts = prevDateStr.split('-');
      if (parseInt(prevParts[1]) !== month + 1) {
        newMonth = true;
      }
    }

    if (period === 'week') {
      var label = FP.DAY_NAMES_SHORT[d.getDay()] + ' ' + day;
      if (newMonth) label += ' ' + monthName;
      return label;
    } else if (period === 'month') {
      if (day === 1 || newMonth) {
        return day + ' ' + monthName;
      }
      return '' + day;
    } else {
      if (day === 1 || newMonth) {
        return monthName;
      }
      return day + '.' + (month + 1);
    }
  }

  // ============================================
  //  ГРАФИК ВЕСА
  // ============================================
  function renderWeightChart(period) {
    var history = FP.getWeightHistory ? FP.getWeightHistory() : [];
    var canvas = document.getElementById('weightChart');
    var noDataEl = document.getElementById('weightNoData');
    if (!canvas) return;

    if (history.length === 0) {
      canvas.style.display = 'none';
      if (noDataEl) noDataEl.style.display = 'block';
      if (weightChart) { weightChart.destroy(); weightChart = null; }
      return;
    }

    var maxDays = period === 'week' ? 7 : (period === 'month' ? 30 : 90);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var filtered = history.filter(function(item) {
      var d = parseDate(item.date);
      var diff = Math.round((today - d) / 86400000);
      return diff < maxDays;
    });

    if (filtered.length === 0) {
      canvas.style.display = 'none';
      if (noDataEl) noDataEl.style.display = 'block';
      if (weightChart) { weightChart.destroy(); weightChart = null; }
      return;
    }

    var firstDate = filtered[0].date;
    var dates = getDateRangeFrom(firstDate);

    var weightMap = {};
    filtered.forEach(function(item) {
      weightMap[item.date] = item.weight;
    });

    var labels = [];
    var data = [];

    dates.forEach(function(dateStr, i) {
      var prev = i > 0 ? dates[i - 1] : null;
      labels.push(formatLabel(dateStr, period, prev));
      if (weightMap[dateStr] !== undefined) {
        data.push(weightMap[dateStr]);
      } else {
        data.push(null);
      }
    });

    canvas.style.display = 'block';
    if (noDataEl) noDataEl.style.display = 'none';

    if (weightChart) weightChart.destroy();

    var ctx = canvas.getContext('2d');
    weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Вес (кг)',
          data: data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: period === 'quarter' ? 2 : 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          spanGaps: true,
        }]
      },
      options: getWeightChartOptions(period)
    });
  }

  // ============================================
  //  ГРАФИК ПИТАНИЯ (БЖУ + Калории)
  // ============================================
  function renderNutritionChart(period) {
    var canvas = document.getElementById('nutritionChart');
    var noDataEl = document.getElementById('nutritionNoData');
    if (!canvas) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var maxScan = period === 'week' ? 7 : 30;
    var foodData = {};

    for (var i = maxScan - 1; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      foodData[dateStr] = getDayNutrition(dateStr);
    }

    var dates = [];
    for (var i = maxScan - 1; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      dates.push(dateStr);
    }

    var firstIdx = -1;
    for (var i = 0; i < dates.length; i++) {
      var nutr = foodData[dates[i]];
      if (nutr && nutr.cal > 0) {
        if (firstIdx === -1) firstIdx = i;
      }
    }

    if (firstIdx === -1) {
      canvas.style.display = 'none';
      if (noDataEl) noDataEl.style.display = 'block';
      if (nutritionChart) { nutritionChart.destroy(); nutritionChart = null; }
      return;
    }

    var tDates = dates.slice(firstIdx);

    var labels = [];
    var calData = [];
    var pData = [];
    var fData = [];
    var cData = [];

    tDates.forEach(function(dateStr, i) {
      var prev = i > 0 ? tDates[i - 1] : null;
      labels.push(formatLabel(dateStr, period, prev));

      var nutr = foodData[dateStr];
      if (nutr) {
        calData.push(nutr.cal);
        pData.push(nutr.protein);
        fData.push(nutr.fat);
        cData.push(nutr.carbs);
      } else {
        calData.push(0);
        pData.push(0);
        fData.push(0);
        cData.push(0);
      }
    });

    canvas.style.display = 'block';
    if (noDataEl) noDataEl.style.display = 'none';

    if (nutritionChart) nutritionChart.destroy();

    var ctx = canvas.getContext('2d');
    nutritionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Калории (ккал)',
            data: calData,
            borderColor: '#4b5563',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: period === 'month' ? 2 : 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#4b5563',
            borderWidth: 2.5,
            yAxisID: 'yCal',
            order: 0,
          },
          {
            label: 'Белки (г)',
            data: pData,
            borderColor: '#3b82f6',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: period === 'month' ? 2 : 3,
            pointHoverRadius: 5,
            borderWidth: 2,
            yAxisID: 'yMacro',
            order: 1,
          },
          {
            label: 'Жиры (г)',
            data: fData,
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: period === 'month' ? 2 : 3,
            pointHoverRadius: 5,
            borderWidth: 2,
            yAxisID: 'yMacro',
            order: 2,
          },
          {
            label: 'Углеводы (г)',
            data: cData,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: period === 'month' ? 2 : 3,
            pointHoverRadius: 5,
            borderWidth: 2,
            yAxisID: 'yMacro',
            order: 3,
          }
        ]
      },
      options: getNutritionChartOptions(period)
    });
  }

  // ============================================
  //  ГРАФИК АКТИВНОСТИ (сожжённые калории)
  // ============================================
  function renderActivityChart(period) {
    var canvas = document.getElementById('activityChart');
    var noDataEl = document.getElementById('activityNoData');
    if (!canvas) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var maxScan = period === 'week' ? 7 : 30;

    // Сначала сканируем maxScan дней чтобы собрать данные
    var allDates = [];
    var allCalData = [];
    var allDurData = [];
    var firstDataIdx = -1;

    for (var i = maxScan - 1; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      allDates.push(dateStr);

      var dayCal = 0;
      var dayDur = 0;
      try {
        var wks = JSON.parse(localStorage.getItem(FP.workoutsKey(dateStr))) || [];
        wks.forEach(function(wk) {
          if (wk.done) {
            dayCal += wk.totalCal || 0;
            dayDur += wk.totalDuration || 0;
          }
        });
      } catch(e) {}

      allCalData.push(dayCal);
      allDurData.push(dayDur);
      if (dayCal > 0 && firstDataIdx === -1) {
        firstDataIdx = allDates.length - 1;
      }
    }

    if (firstDataIdx === -1) {
      canvas.style.display = 'none';
      if (noDataEl) noDataEl.style.display = 'block';
      if (activityChart) { activityChart.destroy(); activityChart = null; }
      return;
    }

    // Начинаем с первого дня с данными (как другие графики)
    var dates = allDates.slice(firstDataIdx);
    var calData = allCalData.slice(firstDataIdx);
    var durData = allDurData.slice(firstDataIdx);

    var labels = dates.map(function(dateStr, i) {
      var prev = i > 0 ? dates[i - 1] : null;
      return formatLabel(dateStr, period, prev);
    });

    canvas.style.display = 'block';
    if (noDataEl) noDataEl.style.display = 'none';

    if (activityChart) activityChart.destroy();

    var ctx = canvas.getContext('2d');
    activityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Сожжено (ккал)',
          data: calData,
          backgroundColor: 'rgba(37, 99, 235, 0.7)',
          borderColor: '#2563eb',
          borderWidth: 1,
          borderRadius: 6,
          yAxisID: 'yCal',
          order: 0,
        }, {
          label: 'Длительность (мин)',
          data: durData,
          type: 'line',
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: period === 'month' ? 2 : 4,
          pointHoverRadius: 5,
          borderWidth: 2,
          yAxisID: 'yDur',
          order: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 12,
              font: { size: 11, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            titleFont: { size: 12 },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 8,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: period === 'month' ? 10 : 7,
              font: { size: 10 }
            }
          },
          yCal: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'ккал', font: { size: 10 } },
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 10 } },
            beginAtZero: true,
          },
          yDur: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'мин', font: { size: 10 } },
            grid: { display: false },
            ticks: { font: { size: 10 } },
            beginAtZero: true,
          }
        }
      }
    });
  }

  // ============================================
  //  КАЛЕНДАРЬ ТРЕНИРОВОК
  // ============================================
  function renderProgressCalendar() {
    var monthLabel = document.getElementById('progressCalMonth');
    if (monthLabel) monthLabel.textContent = CAL_MONTH_NAMES[calMonth] + ' ' + calYear;

    var firstDay = new Date(calYear, calMonth, 1);
    var lastDay = new Date(calYear, calMonth + 1, 0);
    var startWeekday = (firstDay.getDay() + 6) % 7;
    var daysInMonth = lastDay.getDate();

    var today = new Date();
    var todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    // Собрать данные о тренировках за месяц
    var workoutData = {};
    var totalWorkouts = 0;
    var doneWorkouts = 0;
    var totalCal = 0;

    for (var d = 1; d <= daysInMonth; d++) {
      var dateObj = new Date(calYear, calMonth, d);
      var ds = calYear + '-' + (calMonth + 1) + '-' + d;
      try {
        var wks = JSON.parse(localStorage.getItem(FP.workoutsKey(ds))) || [];
        if (wks.length > 0) {
          var hasDone = false;
          var hasPlanned = false;
          wks.forEach(function(wk) {
            totalWorkouts++;
            if (wk.done) {
              doneWorkouts++;
              totalCal += wk.totalCal || 0;
              hasDone = true;
            } else {
              hasPlanned = true;
            }
          });
          workoutData[ds] = { hasDone: hasDone, hasPlanned: hasPlanned };
        }
      } catch(e) {}
    }

    var html = '';
    CAL_DAY_NAMES.forEach(function(dn) {
      html += '<div class="progress-cal-dayname">' + dn + '</div>';
    });

    for (var e = 0; e < startWeekday; e++) {
      html += '<div class="progress-cal-day other-month"></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var ds = calYear + '-' + (calMonth + 1) + '-' + d;
      var isToday = ds === todayStr;
      var wd = workoutData[ds];

      var cls = 'progress-cal-day';
      if (isToday) cls += ' today';
      if (wd) {
        if (wd.hasDone) cls += ' has-workout-done';
        else if (wd.hasPlanned) cls += ' has-workout';
      }

      html += '<div class="' + cls + '">' + d;
      if (wd) html += '<span class="progress-cal-dot"></span>';
      html += '</div>';
    }

    var calEl = document.getElementById('progressCalendar');
    if (calEl) calEl.innerHTML = html;

    // Расширенная статистика: месяц, неделя, год, время
    var now = new Date();
    var weekStart = new Date(now);
    var dayOfWeek = (now.getDay() + 6) % 7; // Пн=0
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    var yearStart = new Date(now.getFullYear(), 0, 1);

    var monthDone = 0, monthTotalMin = 0;
    var weekDone = 0, weekTotalMin = 0;
    var yearDone = 0, yearTotalMin = 0;

    // Сканируем все ключи localStorage с тренировками
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (!key || key.indexOf('fitpulse_workouts_') !== 0) continue;
      var datePart = key.replace('fitpulse_workouts_', '');
      var dp = datePart.split('-');
      if (dp.length !== 3) continue;
      var wDate = new Date(parseInt(dp[0]), parseInt(dp[1]) - 1, parseInt(dp[2]));
      wDate.setHours(0, 0, 0, 0);
      try {
        var wks = JSON.parse(localStorage.getItem(key)) || [];
        wks.forEach(function(wk) {
          if (wk.done) {
            var dur = wk.totalDuration || 0;
            // В этом месяце
            if (wDate.getMonth() === now.getMonth() && wDate.getFullYear() === now.getFullYear()) {
              monthDone++;
              monthTotalMin += dur;
            }
            // На этой неделе
            if (wDate >= weekStart) {
              weekDone++;
              weekTotalMin += dur;
            }
            // В этом году
            if (wDate >= yearStart) {
              yearDone++;
              yearTotalMin += dur;
            }
          }
        });
      } catch(e) {}
    }

    function formatMinutes(m) {
      if (m < 60) return m + ' мин';
      var h = Math.floor(m / 60);
      var rm = m % 60;
      return h + ' ч ' + (rm > 0 ? rm + ' мин' : '');
    }

    var statsEl = document.getElementById('progressCalStats');
    if (statsEl) {
      statsEl.innerHTML =
        '<div class="progress-wk-stat">' +
          '<div class="progress-wk-stat-icon">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
          '</div>' +
          '<div class="progress-wk-stat-info">' +
            '<div class="progress-wk-stat-val">' + monthDone + '</div>' +
            '<div class="progress-wk-stat-label">Тренировок в месяце</div>' +
          '</div>' +
        '</div>' +
        '<div class="progress-wk-stat">' +
          '<div class="progress-wk-stat-icon" style="background:#ecfdf5;color:#10b981;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' +
          '</div>' +
          '<div class="progress-wk-stat-info">' +
            '<div class="progress-wk-stat-val">' + weekDone + '</div>' +
            '<div class="progress-wk-stat-label">На этой неделе</div>' +
          '</div>' +
        '</div>' +
        '<div class="progress-wk-stat">' +
          '<div class="progress-wk-stat-icon" style="background:#fef3c7;color:#f59e0b;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
          '</div>' +
          '<div class="progress-wk-stat-info">' +
            '<div class="progress-wk-stat-val">' + yearDone + '</div>' +
            '<div class="progress-wk-stat-label">В этом году</div>' +
          '</div>' +
        '</div>' +
        '<div class="progress-wk-stat">' +
          '<div class="progress-wk-stat-icon" style="background:#fce7f3;color:#ec4899;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
          '</div>' +
          '<div class="progress-wk-stat-info">' +
            '<div class="progress-wk-stat-val">' + formatMinutes(monthTotalMin) + '</div>' +
            '<div class="progress-wk-stat-label">Время в месяце</div>' +
          '</div>' +
        '</div>';
    }
  }

  window.progressCalPrev = function() {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderProgressCalendar();
  };

  window.progressCalNext = function() {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderProgressCalendar();
  };

  // ===== Получить питание за день =====
  function getDayNutrition(dateStr) {
    var mealKey = 'fitpulse_meals_' + dateStr;
    var dayCal = 0, dayP = 0, dayF = 0, dayC = 0;
    try {
      var m = JSON.parse(localStorage.getItem(mealKey));
      if (m) {
        ['breakfast','lunch','dinner','snacks'].forEach(function(ml) {
          (m[ml] || []).forEach(function(item) {
            dayCal += item.cal || 0;
            dayP += item.protein || 0;
            dayF += item.fat || 0;
            dayC += item.carbs || 0;
          });
        });
      }
    } catch(e) {}
    return { cal: Math.round(dayCal), protein: Math.round(dayP), fat: Math.round(dayF), carbs: Math.round(dayC) };
  }

  // ===== Настройки графика веса =====
  function getWeightChartOptions(period) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.9)',
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + (ctx.parsed.y !== null ? ctx.parsed.y + ' кг' : '—');
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: period === 'quarter' ? 12 : (period === 'month' ? 10 : 7),
            font: function(context) {
              if (context.tick && context.tick.label && isMonthLabel(context.tick.label)) {
                return { size: 10, weight: '700' };
              }
              return { size: 10 };
            }
          }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 10 } },
          beginAtZero: false,
        }
      }
    };
  }

  // ===== Настройки графика питания =====
  function getNutritionChartOptions(period) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 12,
            font: { size: 11, family: "'Inter', sans-serif" }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.9)',
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          padding: 10,
          cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: period === 'month' ? 10 : 7,
            font: function(context) {
              if (context.tick && context.tick.label && isMonthLabel(context.tick.label)) {
                return { size: 10, weight: '700' };
              }
              return { size: 10 };
            }
          }
        },
        yCal: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'ккал', font: { size: 10 } },
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 10 } },
          beginAtZero: true,
        },
        yMacro: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'граммы', font: { size: 10 } },
          grid: { display: false },
          ticks: { font: { size: 10 } },
          beginAtZero: true,
        }
      }
    };
  }

  // ===== Проверка, является ли метка пометкой месяца =====
  function isMonthLabel(label) {
    if (!label) return false;
    for (var i = 0; i < MONTH_SHORT.length; i++) {
      if (label === MONTH_SHORT[i]) return true;
      if (label.indexOf(MONTH_SHORT[i]) !== -1 && label.indexOf('.') === -1) return true;
    }
    return false;
  }

})();
