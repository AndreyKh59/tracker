// ============================================
// FitPulse — app-profile.js
// Вкладка «Профиль»
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  // ===== Рендер профиля =====
  FP.renderProfileView = function(profile) {
    var goalLabels = { lose: 'Похудеть', maintain: 'Поддерживать форму', gain: 'Набрать массу' };
    var genderLabels = { male: 'Мужской', female: 'Женский' };

    document.getElementById('profileSummary').innerHTML =
      '<div class="profile-row"><span class="profile-key">Имя</span><span class="profile-val">' + FP.escHtml(profile.name) + '</span></div>' +
      '<div class="profile-row"><span class="profile-key">Пол</span><span class="profile-val">' + (genderLabels[profile.gender] || '—') + '</span></div>' +
      '<div class="profile-row"><span class="profile-key">Вес</span><span class="profile-val">' + profile.weight + ' кг</span></div>' +
      '<div class="profile-row"><span class="profile-key">Рост</span><span class="profile-val">' + profile.height + ' см</span></div>' +
      '<div class="profile-row"><span class="profile-key">Цель</span><span class="profile-val"><span class="profile-badge">' + (goalLabels[profile.goal] || '—') + '</span></span></div>' +
      '<div class="profile-row"><span class="profile-key">Целевой вес</span><span class="profile-val">' + profile.targetWeight + ' кг</span></div>' +
      '<div class="profile-row"><span class="profile-key">Норма калорий</span><span class="profile-val" style="color:var(--accent);">' + profile.dailyCalorieTarget + ' ккал/день</span></div>' +
      '<button class="reset-btn" onclick="resetApp()">Сбросить все данные</button>';
  };

})();
