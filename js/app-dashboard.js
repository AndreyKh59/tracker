// ============================================
// FitPulse — app-dashboard.js
// Вкладка «Главная» (бывший Дашборд)
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  // ===== Рендер дашборда =====
  FP.renderDashboard = function(profile) {
    document.getElementById('greeting').textContent = 'Привет, ' + profile.name;

    var now = new Date();
    document.getElementById('todayDate').textContent =
      FP.WEEKDAYS[now.getDay()] + ', ' + now.getDate() + ' ' + FP.MONTH_NAMES[now.getMonth()];

    FP.updateDashboardStats(profile);
  };

  // ===== Обновление статистики дашборда =====
  FP.updateDashboardStats = function(profile) {
    var dayData = FP.getDayMeals();
    var totals = FP.calcDayTotals(dayData);

    // Считаем сожжённые ккал из выполненных тренировок за сегодня
    var todayWorkouts = FP.getDateWorkouts(FP.todayDateStr());
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

})();
