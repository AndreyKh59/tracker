// ============================================
// FitPulse — app-profile.js
// Вкладка «Профиль» с редактированием
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  var goalLabels = { lose: 'Похудеть', maintain: 'Поддерживать форму', gain: 'Набрать массу' };
  var genderLabels = { male: 'Мужской', female: 'Женский' };

  // ===== Рендер профиля =====
  FP.renderProfileView = function(profile) {
    var container = document.getElementById('profileSummary');
    if (!container) return;

    var html = '';

    // Имя
    html += profileField('Имя', profile.name, 'text', 'profileEditName', 'Ваше имя');

    // Пол
    html += '<div class="profile-row">' +
      '<span class="profile-key">Пол</span>' +
      '<span class="profile-val">' +
        '<select class="profile-select" id="profileEditGender">' +
          '<option value="male"' + (profile.gender === 'male' ? ' selected' : '') + '>Мужской</option>' +
          '<option value="female"' + (profile.gender === 'female' ? ' selected' : '') + '>Женский</option>' +
        '</select>' +
      '</span>' +
    '</div>';

    // Вес
    html += profileField('Вес', profile.weight, 'number', 'profileEditWeight', 'кг', 30, 300, 0.1);

    // Рост
    html += profileField('Рост', profile.height, 'number', 'profileEditHeight', 'см', 100, 250, 1);

    // Цель
    html += '<div class="profile-row">' +
      '<span class="profile-key">Цель</span>' +
      '<span class="profile-val">' +
        '<select class="profile-select" id="profileEditGoal">' +
          '<option value="lose"' + (profile.goal === 'lose' ? ' selected' : '') + '>Похудеть</option>' +
          '<option value="maintain"' + (profile.goal === 'maintain' ? ' selected' : '') + '>Поддерживать форму</option>' +
          '<option value="gain"' + (profile.goal === 'gain' ? ' selected' : '') + '>Набрать массу</option>' +
        '</select>' +
      '</span>' +
    '</div>';

    // Целевой вес
    html += profileField('Целевой вес', profile.targetWeight, 'number', 'profileEditTarget', 'кг', 30, 300, 0.1);

    // Норма калорий (readonly)
    html += '<div class="profile-row">' +
      '<span class="profile-key">Норма калорий</span>' +
      '<span class="profile-val" style="color:var(--accent);">' + profile.dailyCalorieTarget + ' ккал/день</span>' +
    '</div>';

    // Кнопка сохранить
    html += '<button class="btn-next profile-save-btn" onclick="saveProfileEdit()">Сохранить изменения</button>';

    // Кнопка сброса (серая)
    html += '<button class="reset-btn reset-btn-gray" onclick="resetApp()">Сбросить все данные</button>';

    container.innerHTML = html;
  };

  // ===== Поле ввода профиля =====
  function profileField(label, value, type, id, unit, min, max, step) {
    var inputAttrs = 'class="profile-input" id="' + id + '" value="' + (value || '') + '"';
    if (type === 'number') {
      inputAttrs += ' type="number"';
      if (min !== undefined) inputAttrs += ' min="' + min + '"';
      if (max !== undefined) inputAttrs += ' max="' + max + '"';
      if (step !== undefined) inputAttrs += ' step="' + step + '"';
    } else {
      inputAttrs += ' type="text"';
    }

    var rightPart = '<input ' + inputAttrs + '>';
    if (unit) rightPart += '<span class="profile-input-unit">' + unit + '</span>';

    return '<div class="profile-row">' +
      '<span class="profile-key">' + label + '</span>' +
      '<span class="profile-val profile-val-edit">' + rightPart + '</span>' +
    '</div>';
  }

  // ===== Сохранение профиля =====
  window.saveProfileEdit = function() {
    var profile = FP.loadProfile();
    if (!profile) return;

    var name = document.getElementById('profileEditName').value.trim();
    var gender = document.getElementById('profileEditGender').value;
    var weight = parseFloat(document.getElementById('profileEditWeight').value) || 0;
    var height = parseFloat(document.getElementById('profileEditHeight').value) || 0;
    var goal = document.getElementById('profileEditGoal').value;
    var targetWeight = parseFloat(document.getElementById('profileEditTarget').value) || 0;

    // Валидация
    if (!name) { alert('Введите имя'); return; }
    if (weight < 30 || weight > 300) { alert('Вес: от 30 до 300 кг'); return; }
    if (height < 100 || height > 250) { alert('Рост: от 100 до 250 см'); return; }

    // Проверка целевого веса
    if (goal === 'lose' && targetWeight >= weight) {
      alert('При похудении целевой вес должен быть ниже текущего');
      return;
    }
    if (goal === 'gain' && targetWeight <= weight) {
      alert('При наборе массы целевой вес должен быть выше текущего');
      return;
    }
    if (goal === 'maintain') {
      targetWeight = weight;
    }

    profile.name = name;
    profile.gender = gender;
    profile.weight = weight;
    profile.height = height;
    profile.goal = goal;
    profile.targetWeight = targetWeight;

    // Пересчёт нормы калорий
    var age = profile.age || 25;
    var bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') bmr += 5; else bmr -= 161;
    var activityMultiplier = { low: 1.2, medium: 1.55, high: 1.725 };
    var mult = activityMultiplier[profile.activityLevel] || 1.55;
    if (goal === 'lose') mult -= 0.2;
    else if (goal === 'gain') mult += 0.15;
    profile.dailyCalorieTarget = Math.round(bmr * mult);
    profile.bmr = Math.round(bmr);

    FP.saveProfile(profile);

    // Обновляем UI
    document.getElementById('headerUser').textContent = profile.name;
    if (FP.renderDashboard) FP.renderDashboard(profile);
    if (FP.renderNutritionView) FP.renderNutritionView(profile);
    if (FP.renderWorkoutView) FP.renderWorkoutView(profile);
    FP.renderProfileView(profile);

    // Показать уведомление
    showProfileSaved();
  };

  // ===== Уведомление о сохранении =====
  function showProfileSaved() {
    var existing = document.getElementById('profileSavedNotice');
    if (existing) existing.remove();

    var notice = document.createElement('div');
    notice.id = 'profileSavedNotice';
    notice.className = 'profile-saved-notice';
    notice.textContent = 'Профиль обновлён';
    document.getElementById('profileSummary').prepend(notice);

    setTimeout(function() {
      notice.style.opacity = '0';
      setTimeout(function() { notice.remove(); }, 300);
    }, 2000);
  }

})();
