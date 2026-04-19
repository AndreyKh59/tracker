// ============================================
// FitPulse — app-profile.js
// Вкладка «Профиль» с редактированием по кнопке
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

  var goalLabels = { lose: 'Похудеть', maintain: 'Поддерживать форму', gain: 'Набрать массу' };
  var genderLabels = { male: 'Мужской', female: 'Женский' };

  var isEditing = false;

  // ===== Рендер профиля =====
  FP.renderProfileView = function(profile) {
    var container = document.getElementById('profileSummary');
    if (!container) return;

    if (isEditing) {
      renderEditMode(profile, container);
    } else {
      renderViewMode(profile, container);
    }
  };

  // ===== Режим просмотра =====
  function renderViewMode(profile, container) {
    var html = '';

    html += profileRow('Имя', FP.escHtml(profile.name));
    html += profileRow('Пол', genderLabels[profile.gender] || '—');
    html += profileRow('Вес', profile.weight + ' кг');
    html += profileRow('Рост', profile.height + ' см');
    html += profileRow('Цель', '<span class="profile-badge">' + (goalLabels[profile.goal] || '—') + '</span>');
    html += profileRow('Целевой вес', profile.targetWeight + ' кг');
    html += profileRow('Норма калорий', '<span style="color:var(--accent);">' + profile.dailyCalorieTarget + ' ккал/день</span>');

    // Кнопка редактировать
    html += '<button class="btn-next profile-save-btn" onclick="startProfileEdit()">Редактировать</button>';

    // Кнопка сброса (серая)
    html += '<button class="reset-btn reset-btn-gray" onclick="resetApp()">Сбросить все данные</button>';

    container.innerHTML = html;
  }

  function profileRow(key, val) {
    return '<div class="profile-row">' +
      '<span class="profile-key">' + key + '</span>' +
      '<span class="profile-val">' + val + '</span>' +
    '</div>';
  }

  // ===== Режим редактирования =====
  function renderEditMode(profile, container) {
    var html = '';

    // Имя
    html += editField('Имя', profile.name, 'text', 'profileEditName', null, null, null, null);
    // Пол
    html += '<div class="profile-row">' +
      '<span class="profile-key">Пол</span>' +
      '<span class="profile-val profile-val-edit">' +
        '<select class="profile-select" id="profileEditGender">' +
          '<option value="male"' + (profile.gender === 'male' ? ' selected' : '') + '>Мужской</option>' +
          '<option value="female"' + (profile.gender === 'female' ? ' selected' : '') + '>Женский</option>' +
        '</select>' +
      '</span>' +
    '</div>';
    // Вес
    html += editField('Вес', profile.weight, 'number', 'profileEditWeight', 'кг', 30, 300, 0.1);
    // Рост
    html += editField('Рост', profile.height, 'number', 'profileEditHeight', 'см', 100, 250, 1);
    // Цель
    html += '<div class="profile-row">' +
      '<span class="profile-key">Цель</span>' +
      '<span class="profile-val profile-val-edit">' +
        '<select class="profile-select" id="profileEditGoal">' +
          '<option value="lose"' + (profile.goal === 'lose' ? ' selected' : '') + '>Похудеть</option>' +
          '<option value="maintain"' + (profile.goal === 'maintain' ? ' selected' : '') + '>Поддерживать форму</option>' +
          '<option value="gain"' + (profile.goal === 'gain' ? ' selected' : '') + '>Набрать массу</option>' +
        '</select>' +
      '</span>' +
    '</div>';
    // Целевой вес
    html += editField('Целевой вес', profile.targetWeight, 'number', 'profileEditTarget', 'кг', 30, 300, 0.1);
    // Норма калорий (readonly)
    html += '<div class="profile-row">' +
      '<span class="profile-key">Норма калорий</span>' +
      '<span class="profile-val" style="color:var(--accent);">' + profile.dailyCalorieTarget + ' ккал/день</span>' +
    '</div>';

    // Кнопки
    html += '<div class="profile-edit-btns">';
    html += '<button class="btn-next profile-save-btn" onclick="saveProfileEdit()">Сохранить</button>';
    html += '<button class="profile-cancel-btn" onclick="cancelProfileEdit()">Отмена</button>';
    html += '</div>';

    container.innerHTML = html;
  }

  function editField(label, value, type, id, unit, min, max, step) {
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

  // ===== Начать редактирование =====
  window.startProfileEdit = function() {
    isEditing = true;
    var profile = FP.loadProfile();
    if (profile) FP.renderProfileView(profile);
  };

  // ===== Отменить редактирование =====
  window.cancelProfileEdit = function() {
    isEditing = false;
    var profile = FP.loadProfile();
    if (profile) FP.renderProfileView(profile);
  };

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
    if (goal === 'lose' && targetWeight >= weight) { alert('При похудении целевой вес должен быть ниже текущего'); return; }
    if (goal === 'gain' && targetWeight <= weight) { alert('При наборе массы целевой вес должен быть выше текущего'); return; }
    if (goal === 'maintain') { targetWeight = weight; }

    // Сохраняем старый вес для истории
    var oldWeight = profile.weight;

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

    // Сохранить запись веса в историю
    if (weight !== oldWeight) {
      saveWeightRecord(weight);
    }

    isEditing = false;

    // Обновляем UI
    document.getElementById('headerUser').textContent = profile.name;
    if (FP.renderDashboard) FP.renderDashboard(profile);
    if (FP.renderNutritionView) FP.renderNutritionView(profile);
    if (FP.renderWorkoutView) FP.renderWorkoutView(profile);
    FP.renderProfileView(profile);

    showProfileSaved();
  };

  // ===== История веса =====
  function getWeightHistory() {
    try { return JSON.parse(localStorage.getItem('fitpulse_weight_history')) || []; }
    catch(e) { return []; }
  }

  function saveWeightRecord(weight) {
    var history = getWeightHistory();
    var today = FP.todayDateStr();
    // Обновить или добавить запись за сегодня
    var found = false;
    for (var i = 0; i < history.length; i++) {
      if (history[i].date === today) {
        history[i].weight = weight;
        found = true;
        break;
      }
    }
    if (!found) {
      history.push({ date: today, weight: weight });
    }
    // Сортировка по дате
    history.sort(function(a, b) { return a.date > b.date ? 1 : -1; });
    try { localStorage.setItem('fitpulse_weight_history', JSON.stringify(history)); } catch(e) {}
  }

  // Экспорт для прогресса
  FP.getWeightHistory = getWeightHistory;
  FP.saveWeightRecord = saveWeightRecord;

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
