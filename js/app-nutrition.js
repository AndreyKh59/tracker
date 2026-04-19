// ============================================
// FitPulse — app-nutrition.js
// Вкладка «Питание» + модалка добавления продуктов
// ============================================

(function() {
  'use strict';

  var FP = window.FitPulse;

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
  var currentMealType = 'breakfast';
  var selectedFood = null;
  var activeCategory = 'Все';

  // ===== Данные питания (доступны для других модулей) =====
  FP.getDayMeals = function() {
    try { return JSON.parse(localStorage.getItem(FP.mealsKey())) || { breakfast:[], lunch:[], dinner:[], snacks:[] }; }
    catch(e) { return { breakfast:[], lunch:[], dinner:[], snacks:[] }; }
  };

  FP.saveDayMeals = function(data) {
    try { localStorage.setItem(FP.mealsKey(), JSON.stringify(data)); }
    catch(e) { console.error('Save meals error:', e); }
  };

  FP.calcDayTotals = function(dayData) {
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
  };

  function calcMealKcal(items) {
    var cal = 0;
    (items || []).forEach(function(item) { cal += item.cal || 0; });
    return Math.round(cal);
  }

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

  // ===== Рендер вкладки Питание =====
  FP.renderNutritionView = function(profile) {
    var now = new Date();
    document.getElementById('nutritionDate').textContent =
      now.getDate() + ' ' + FP.MONTH_NAMES[now.getMonth()] + ' ' + now.getFullYear();

    var dayData = FP.getDayMeals();
    var totals = FP.calcDayTotals(dayData);
    var calTarget = profile.dailyCalorieTarget || 2000;
    var macros = getMacroTargets(profile);

    // Кольцо
    var left = Math.max(0, calTarget - totals.cal);
    var pct = Math.min(totals.cal / calTarget, 1);
    var circumference = 2 * Math.PI * 52;
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
    ['breakfast','lunch','dinner','snacks'].forEach(function(meal) {
      var items = dayData[meal] || [];
      document.getElementById('mealKcal_' + meal).textContent = calcMealKcal(items) + ' ккал';
      renderMealItems(meal, items);
    });
  };

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
          '<div class="food-name">' + FP.escHtml(item.name) + '</div>' +
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

  // ===== Раскрыть/свернуть приём пищи =====
  window.toggleMeal = function(meal) {
    var card = document.querySelector('.meal-card[data-meal="' + meal + '"]');
    if (card) card.classList.toggle('open');
  };

  // ===== Удалить продукт =====
  window.removeFood = function(meal, idx) {
    var dayData = FP.getDayMeals();
    if (dayData[meal] && dayData[meal].length > idx) {
      dayData[meal].splice(idx, 1);
      FP.saveDayMeals(dayData);
      var profile = FP.loadProfile();
      FP.renderNutritionView(profile);
      if (FP.renderDashboard) FP.renderDashboard(profile);
    }
  };

  // ===== Модалка — добавить продукт =====
  window.openFoodModal = function(mealType) {
    currentMealType = mealType;
    selectedFood = null;
    activeCategory = 'Все';

    var modal = document.getElementById('foodModal');
    modal.classList.add('open');

    document.getElementById('foodSearch').value = '';
    document.getElementById('portionPanel').style.display = 'none';
    document.getElementById('foodResults').style.display = 'block';

    renderCategories();
    renderFoodResults('');
  };

  window.closeFoodModal = function() {
    var modal = document.getElementById('foodModal');
    modal.classList.remove('open');
    selectedFood = null;
  };

  FP.setupNutritionListeners = function() {
    var searchInput = document.getElementById('foodSearch');
    searchInput.addEventListener('input', function() {
      renderFoodResults(this.value.trim());
    });

    document.getElementById('foodModal').addEventListener('click', function(e) {
      if (e.target === this) closeFoodModal();
    });

    document.getElementById('portionInput').addEventListener('input', function() {
      updatePortionPreview();
    });
  };

  function renderCategories() {
    var container = document.getElementById('foodCategories');
    var html = '';
    FOOD_CATEGORIES.forEach(function(cat) {
      html += '<button class="cat-chip' + (cat === activeCategory ? ' active' : '') + '" onclick="filterCategory(\'' + cat + '\')">' + cat + '</button>';
    });
    container.innerHTML = html;
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

    if (activeCategory !== 'Все') {
      results = results.filter(function(f) { return f.cat === activeCategory; });
    }

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
          '<div class="food-result-name">' + FP.escHtml(food.name) + '</div>' +
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

    var dayData = FP.getDayMeals();
    if (!dayData[currentMealType]) dayData[currentMealType] = [];
    dayData[currentMealType].push(item);
    FP.saveDayMeals(dayData);

    closeFoodModal();

    var profile = FP.loadProfile();
    FP.renderNutritionView(profile);
    if (FP.renderDashboard) FP.renderDashboard(profile);

    var card = document.querySelector('.meal-card[data-meal="' + currentMealType + '"]');
    if (card && !card.classList.contains('open')) card.classList.add('open');
  };

})();
