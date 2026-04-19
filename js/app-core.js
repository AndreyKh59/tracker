// ============================================
// FitPulse — app-core.js
// Глобальный namespace, утилиты, навигация, localStorage, инициализация
// ============================================

window.FitPulse = {};

(function() {
  'use strict';

  var FP = window.FitPulse;

  // ===== Константы =====
  FP.KEYS = {
    PROFILE: 'fitpulse_profile',
  };

  FP.MONTH_NAMES = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  FP.WEEKDAYS = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
  FP.DAY_NAMES_SHORT = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  FP.CAL_MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  FP.CAL_DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  // ===== localStorage =====
  FP.loadProfile = function() {
    try { return JSON.parse(localStorage.getItem(FP.KEYS.PROFILE)); }
    catch(e) { return null; }
  };

  FP.saveProfile = function(p) {
    try { localStorage.setItem(FP.KEYS.PROFILE, JSON.stringify(p)); }
    catch(e) { console.error('Save error:', e); }
  };

  // ===== Утилиты =====
  FP.escHtml = function(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  FP.adjustNum = function(inputId, delta) {
    var inp = document.getElementById(inputId);
    var val = parseFloat(inp.value) || 0;
    val = Math.max(parseFloat(inp.min) || 0, val + delta);
    val = Math.min(parseFloat(inp.max) || 999, val);
    inp.value = Math.round(val * 10) / 10;
    inp.dispatchEvent(new Event('input'));
  };

  // Глобальный обработчик для кнопок +/-
  window.adjustNum = function(inputId, delta) {
    FP.adjustNum(inputId, delta);
  };

  // ===== Ключи хранилища =====
  FP.todayDateStr = function() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  };

  FP.workoutsKey = function(dateStr) {
    return 'fitpulse_workouts_' + dateStr;
  };

  FP.mealsKey = function() {
    var d = new Date();
    return 'fitpulse_meals_' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  };

  // ===== Навигация =====
  window.navigate = function(view) {
    // Если идёт сессия тренировки — сначала завершить её
    if (FP.isSessionActive && FP.isSessionActive()) {
      if (confirm('Завершить тренировку и перейти в другой раздел?')) {
        // Закрываем сессию без сохранения (просто выходим)
        if (typeof finishWorkoutSession === 'function') {
          finishWorkoutSession();
        }
      } else {
        return; // Остаемся в сессии
      }
    }

    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    var el = document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1));
    if (el) el.classList.add('active');
    document.querySelectorAll('.sidebar-btn, .bottomnav-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.view === view);
    });

    // Обновляем данные при переходе
    if (view === 'dashboard' || view === 'nutrition' || view === 'workouts') {
      var profile = FP.loadProfile();
      if (profile) {
        if (FP.renderNutritionView) FP.renderNutritionView(profile);
        if (FP.renderWorkoutView) FP.renderWorkoutView(profile);
        if (FP.updateDashboardStats) FP.updateDashboardStats(profile);
      }
    }
    if (view === 'progress') {
      var profile = FP.loadProfile();
      if (profile && FP.renderProgressView) FP.renderProgressView(profile);
    }

    // Восстановить заголовок
    var headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = 'FitPulse';
  };

  // ===== Сброс =====
  window.resetApp = function() {
    if (!confirm('Вы уверены? Все данные будут удалены.')) return;
    localStorage.removeItem(FP.KEYS.PROFILE);
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf('fitpulse_meals_') === 0 || key.indexOf('fitpulse_workouts_') === 0 || key.indexOf('fitpulse_weight_history') === 0) {
        keys.push(key);
      }
    }
    keys.forEach(function(k) { localStorage.removeItem(k); });
    location.reload();
  };

  // ===== Показать основное приложение =====
  FP.showApp = function(profile) {
    document.getElementById('profileWizard').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('headerUser').textContent = profile.name;
    if (FP.renderDashboard) FP.renderDashboard(profile);
    if (FP.renderProfileView) FP.renderProfileView(profile);
    if (FP.renderNutritionView) FP.renderNutritionView(profile);
    if (FP.renderWorkoutView) FP.renderWorkoutView(profile);
    if (FP.setupNutritionListeners) FP.setupNutritionListeners();
  };

  // ===== Инициализация =====
  document.addEventListener('DOMContentLoaded', function() {
    var saved = FP.loadProfile();
    if (saved) {
      FP.showApp(saved);
    } else {
      if (FP.initWizard) FP.initWizard();
    }
  });

})();
