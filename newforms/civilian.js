/* LSSD Civilian Employment: генератор ББ-кода для XenForo.
   Список полей описан в SEC, шаблон вывода в bb(). Сервер не нужен: пользователь копирует заголовок и ББ-код. */
(function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var E = function (t, p) { var e = document.createElement(t); Object.assign(e, p || {}); for (var i = 2; i < arguments.length; i++) e.append(arguments[i]); return e; };
var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var YN = ['Да','Нет','Не знаю','Не хочу отвечать','Другое'];
var TYPES = { TOW: ['Contract Tow Truck Operator','CONTRACT TOW TRUCK OPERATOR'], ABP: ['Relief Pilot (Aero Bureau)','RELIEF PILOT (AERO BUREAU)'], CSO: ['Community Service Officer','COMMUNITY SERVICE OFFICER'] };
var RACE = ['Европеоидная','Темнокожий или афроамериканец','Латиноамериканец','Американский индеец или коренной житель Аляски','Азиат','Филиппинец','Коренной гаваец или представитель других островов Тихого океана','Ничего из перечисленного','Две или более расы'];
var MARITAL = ['Холост / Не замужем','Женат / Замужем','В разводе','Вдовец / Вдова','Проживаю раздельно','Неизвестно / Не применимо'];
var EDU = ['Незаконченное среднее','Среднее образование','Неполное высшее','Технический колледж','Диплом ассоциата','Диплом бакалавра','Диплом магистра','Докторская степень'];
var SRC = ['Веб-сайт LSSD','Сайт станции шерифа','Социальные сети','Кампус университета','Ярмарку вакансий или семинар','Сотрудника LSSD','Сотрудника округа Лос-Сантос','Члена семьи','Друзей или соседей','Радио','Рекламный щит','Другое'];
var MIL = ['Нет','Да, я прохожу службу в настоящее время','Да, я проходил(а) службу ранее','Не знаю','Не хочу отвечать','Другое'];
var YES = 'Да';

/* Поле: [ключ, подпись, тип, параметр, опции]
   типы: t текст (параметр: подсказка), d дата, s список (параметр: варианты), y Да/Нет/…, a абзац, c составное (параметр: [подключ, подсказка, тип]).
   опции: req, for ['TOW',...], full (полный текст в ББ-коде), cond [[ключ, при значении, подсказка]], bio */
function job(n, w) { return ['job' + n, w + ' место работы', 'c', [['co','Название компании/организации'],['pos','Должность'],['desc','Краткое описание обязанностей','a'],['period','Период работы: MM/DD/YYYY — MM/DD/YYYY'],['reason','Причина увольнения']]]; }
var SEC = [
['1. ЛИЧНАЯ ИНФОРМАЦИЯ','bb-box-white',[
 ['first','Имя *','t','Firstname',{req:1}],['middle','Второе имя','t','Middle name или N/A'],['last','Фамилия *','t','Lastname',{req:1}],
 ['dob','Дата рождения','d'],['birthplace','Место рождения','t'],['gender','Пол','s',['Мужской','Женский','Другой']],
 ['race','Раса','s',RACE],['height','Рост (футы)','t'],['weight','Вес (фунты)','t'],['marital','Семейное положение','s',MARITAL],
 ['addr','Адрес основного проживания','c',[['street','Номер дома и название улицы'],['city','Город'],['state','Штат']]],
 ['phone','Основной номер телефона','t'],['email','Адрес электронной почты','t']]],
['2. ОБРАЗОВАНИЕ','bb-box-light',[
 ['edu_level','Уровень образования','s',EDU],
 ['edu','Учебное заведение','c',[['name','Название учебного заведения'],['period','Период обучения: MM/DD/YYYY — MM/DD/YYYY'],['major','Специальность']]]]],
['3. ОПЫТ РАБОТЫ','bb-box-white',[job(1,'Первое'),job(2,'Второе'),job(3,'Третье')]],
['4. ВОПРОСЫ ПРОВЕРКИ БИОГРАФИИ','bb-box-light',[
 ['bg_license','Я имею действительное водительское удостоверение штата Сан-Андреас','y'],
 ['bg_tow_equip','Я имею опыт управления спецтехникой / крупногабаритным транспортом','y',0,{for:['TOW']}],
 ['bg_abp_heli','Я имею действительную лицензию пилота вертолёта (SAAA / FAA)','y',0,{for:['ABP']}],
 ['bg_work','Я имею законное право на работу в США','y',0,{full:'Я имею законное право на работу в Соединенных Штатах Америки'}],
 ['bg_source','Я узнал(а) о данной вакансии через','s',SRC],
 ['bg_languages','Помимо английского, я владею следующими языками','t','N/A'],
 ['bg_disability','Я являюсь лицом с ограниченными возможностями','y'],
 ['bg_military','Я являюсь действующим или бывшим военнослужащим ВС США','s',MIL,{full:'Я являюсь действующим или бывшим военнослужащим Вооруженных сил США',cond:[['bg_mil_active',MIL[1],'Род войск (настоящее время)'],['bg_mil_prev',MIL[2],'Род войск (ранее)']]}],
 ['bg_probation','В настоящее время я нахожусь под уголовной пробацией или на УДО','y',0,{full:'В настоящее время я нахожусь под уголовной пробацией или на условно-досрочном освобождении'}],
 ['bg_dui','Я имею судимости за DUI','y',0,{full:'Я имею судимости за вождение в состоянии алкогольного или наркотического опьянения в Сан-Андреас и/или других штатах',cond:[['bg_dui_detail',YES,'Штат(ы) и год(ы) судимости']]}],
 ['bg_marijuana','Я употреблял(а) марихуану в течение последнего года','y',0,{cond:[['bg_marijuana_detail',YES,'Месяц(ы) и год(ы): MM/YYYY']]}],
 ['bg_drugs','Я употреблял(а) другие запрещённые вещества за последний год','y',0,{full:'Я употреблял(а) другие запрещенные вещества в течение последнего года'}],
 ['bg_theft','Я совершал(а) кражу или хищение на сумму $950 и более','y',0,{full:'Я совершал(а) кражу или хищение на сумму 950 долларов США или более'}]]],
['5. ДЕКЛАРАЦИЯ И ПОДТВЕРЖДЕНИЕ','bb-box-white',[
 ['decl_sign','Подпись *','t','Имя Фамилия',{req:1}],['decl_date','Дата','d']]],
['6. OUT OF CHARACTER ВОПРОСЫ','bb-box-light',[
 ['tz','Мой часовой пояс и страна проживания','t'],['ucp','Имя пользователя в панели управления (UCP)','t'],
 ['forum','Имя аккаунта на форуме','t',0,{for:['TOW','ABP']}],
 ['discord','Моё имя в Discord','t',0,{for:['CSO']}],
 ['punish','Неотредактированный скриншот истории наказаний из UCP','t','Ссылка на изображение'],
 ['gambit','Ссылка на профиль на форуме Gambit','t',0,{for:['CSO']}],
 ['double','Разрешения на дабл-фракцию','t','N/A'],
 ['banned','Исключали ли вас или банили в других официальных фракциях?','s',['Нет','Да'],{cond:[['banned_detail','Да','Пояснение']]}],
 ['fp','Согласие на отпечатки и фото для анкеты (IC)','s',['Да','Нет']],
 ['mic_TOW','Имеете ли вы рабочий микрофон и готовы ли использовать TS / Discord?','s',['Да','Нет'],{for:['TOW']}],
 ['mic_ABP','Имеете ли вы рабочий микрофон и готовы ли использовать TS / Discord во время погонь?','s',['Да','Нет'],{for:['ABP']}],
 ['read','Прочитал(а) темы из раздела «Обязательно к ознакомлению»','s',['Да','Нет'],{for:['TOW','ABP']}],
 ['read_CSO','Прочитал(а) обязательные темы перед подачей заявки','s',['Да','Нет'],{for:['CSO']}],
 ['bio_TOW','Представьте персонажа (мин. 150, макс. 650 слов) *','a','Биография, развитие и причины работы в службе эвакуации...',{for:['TOW'],bio:1,req:1}],
 ['bio_ABP','Представьте персонажа (мин. 150, макс. 650 слов) *','a','Биография, лётный опыт и причины вступления в программу...',{for:['ABP'],bio:1,req:1}],
 ['bio_CSO','Представьте персонажа (мин. 150, макс. 650 слов) *','a','Биография, развитие и причины вступления в департамент...',{for:['CSO'],bio:1,req:1}]]]
];

/* ===== Сборка ББ-кода (XenForo) ===== */
function words(s) { s = (s || '').trim(); return s ? s.split(/\s+/).length : 0; }
function usDate(v) { if (!v) return 'N/A'; var p = v.split('-'); return p[1] + '/' + p[2] + '/' + p[0]; }
function bb(S, type) {
  var P = TYPES[type][1];
  var V = function (k) { return (S[k] || '').trim() || 'N/A'; };
  var cb = function (c) { return c ? '[CBF][/CBF]' : '[CB][/CB]'; };
  var ln = function (l, v) { return '[B]' + l + ':[/B] ' + v; };
  var ind = function (s) { return '[INDENT]' + s + '[/INDENT]'; };
  var tb = function (a, b) { return '[TABLE2][TR2][TD2]' + a.join('\n') + '[/TD2][TD2]' + b.join('\n') + '[/TD2][/TR2][/TABLE2]'; };
  var sec = function (bg, t, b) { return '[BLOCK=' + bg + '][B]' + t + '[/B]' + (/^\[(TABLE2|INDENT)/.test(b) ? '' : '\n') + b + '[/BLOCK]'; };
  var opts = function (sv, list, det) {
    var o = ''; det = det || {};
    list.forEach(function (x) { o += cb(sv === x) + ' ' + x + (sv === x && det[x] ? '[INDENT=2]' + det[x] + '[/INDENT]' : '\n'); });
    return o.replace(/\n$/, '');
  };
  var inl = function (v, list) { return list.map(function (x) { return cb(v === x) + ' ' + x; }).join(' '); };
  var d = new Date(), today = d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
  var name = V('first') + ' ' + V('last');
  var o = '[SIZE=3][COLOR=#1a202c]';
  o += '[BLOCK=#f6f9f7][TABLE2][TR2][TD2][FONT=Arial][SIZE=4][B]LOS SANTOS COUNTY SHERIFF\'S DEPARTMENT[/B][/SIZE]\n[SIZE=2][COLOR=#5f7d6d]CIVILIAN MANAGEMENT BUREAU[/COLOR]\n[COLOR=#93a89c]CIVILIAN EMPLOYMENT APPLICATION[/COLOR][/SIZE][/FONT][/TD2][TD2][RIGHT][IMG width="100px"]https://i.imgur.com/1IZekQj.png[/IMG][/RIGHT][/TD2][/TR2][/TABLE2][/BLOCK]';
  o += '[BLOCK=#ffffff][CENTER][SIZE=4][B]CIVILIAN EMPLOYMENT APPLICATION[/B][/SIZE]\n[SIZE=2][COLOR=#7a9384]' + P + '[/COLOR][/SIZE][/CENTER]' + tb([ln('ЗАЯВИТЕЛЬ', name), ln('ДАТА ПОДАЧИ', today)], [ln('ТИП ДОЛЖНОСТИ', P), '[B]СТАТУС:[/B] [COLOR=#7a9384][B]НА РАССМОТРЕНИИ[/B][/COLOR]']) + '[/BLOCK]';
  o += sec('#f6f9f7', 'I. ЛИЧНАЯ ИНФОРМАЦИЯ',
    tb([ln('Имя', V('first')), ln('Второе имя', V('middle')), ln('Дата рождения', usDate(S.dob))], [ln('Фамилия', V('last')), ln('Место рождения', V('birthplace')), ln('Пол', V('gender'))]) +
    tb([ln('Раса', V('race')), ln('Семейное положение', V('marital'))], [ln('Рост', V('height') + ' футов'), ln('Вес', V('weight') + ' фунтов')]) +
    tb([ln('Телефон', V('phone'))], [ln('Email', V('email'))]) + ln('Адрес', V('addr_street') + ', ' + V('addr_city') + ', ' + V('addr_state')));
  o += sec('#ffffff', 'II. ОБРАЗОВАНИЕ', tb([ln('Уровень образования', V('edu_level')), ln('Учебное заведение', V('edu_name'))], [ln('Период обучения', V('edu_period')), ln('Специальность', V('edu_major'))]));
  var jb = '';
  ['ПЕРВОЕ','ВТОРОЕ','ТРЕТЬЕ'].forEach(function (w, i) {
    var j = 'job' + (i + 1) + '_';
    jb += (i ? '' : '') + '[B]' + w + ' МЕСТО РАБОТЫ[/B]' + tb([ln('Компания', V(j + 'co')), ln('Должность', V(j + 'pos'))], [ln('Период работы', V(j + 'period')), ln('Причина увольнения', V(j + 'reason'))]) + '[B]Обязанности:[/B]' + ind(V(j + 'desc'));
  });
  o += sec('#f6f9f7', 'III. ОПЫТ РАБОТЫ', jb);
  var n = 19, bg = '';
  var q = function (full, body) { return '[B]' + (n++) + '. ' + full + '[/B]' + ind(body); };
  SEC[3][2].forEach(function (f) {
    var opt = f[4] || {};
    if (opt.for && opt.for.indexOf(type) < 0) return;
    var full = opt.full || f[1], v = S[f[0]] || '', det = {};
    (opt.cond || []).forEach(function (c) { var x = (S[c[0]] || '').trim(); det[c[1]] = (f[0] === 'bg_military' ? 'Род войск: ' : f[0] === 'bg_dui' ? 'Укажите штат(ы) и год(ы) судимости: ' : 'Укажите месяц(ы) и год(ы) употребления: ') + (x || 'N/A'); });
    if (f[0] === 'bg_languages') bg += q(full, V('bg_languages'));
    else bg += q(full, opts(v, f[0] === 'bg_source' ? SRC : f[0] === 'bg_military' ? MIL : YN, det));
  });
  o += sec('#ffffff', 'IV. ВОПРОСЫ ПРОВЕРКИ БИОГРАФИИ', bg);
  o += sec('#f6f9f7', 'V. ДЕКЛАРАЦИЯ И ПОДТВЕРЖДЕНИЕ', 'Я, нижеподписавшийся(-аяся), настоящим подтверждаю под страхом наказания за лжесвидетельство, что вся вышеуказанная информация является точной и полной, насколько мне известно.\n' + ln('Подпись', V('decl_sign')) + '\n' + ln('Дата', usDate(S.decl_date)));
  var ban = '[B]Исключали ли вас или банили в других официальных фракциях?[/B]' + ind(opts(S.banned || '', ['Да', 'Нет'], { 'Да': 'Пояснение: ' + V('banned_detail') }));
  var yn = ['Да', 'Нет'], oc;
  if (type === 'CSO') {
    oc = tb([ln('Часовой пояс', V('tz')), ln('UCP', V('ucp'))], [ln('Discord', V('discord')), ln('Дабл-фракция', V('double'))]) + ln('Скриншот истории наказаний из UCP', V('punish')) + '\n' + ln('Профиль на форуме Gambit', V('gambit')) + '\n' + ban +
      tb([ln('Согласие на отпечатки', inl(S.fp, yn))], [ln('Прочитаны обязательные темы', inl(S.read_CSO, yn))]);
  } else {
    oc = tb([ln('Часовой пояс', V('tz')), ln('UCP', V('ucp'))], [ln('Форум', V('forum')), ln('Дабл-фракция', V('double'))]) + ln('Скриншот истории наказаний из UCP', V('punish')) + '\n' + ban +
      tb([ln('Согласие на отпечатки и фото (IC)', inl(S.fp, yn)), ln('Рабочий микрофон / TS / Discord', inl(S['mic_' + type], yn))], [ln('Прочитаны обязательные темы', inl(S.read, yn))]);
  }
  oc += '[B]Представление персонажа:[/B]' + ind(V('bio_' + type));
  o += sec('#ffffff', 'VI. OUT OF CHARACTER ВОПРОСЫ', oc);
  o += '[BLOCK=#2c4a3b][CENTER][SIZE=1][COLOR=#ffffff]LOS SANTOS COUNTY SHERIFF\'S DEPARTMENT / CIVILIAN MANAGEMENT BUREAU[/COLOR][/SIZE][/CENTER][/BLOCK]';
  return o + '[/COLOR][/SIZE]';
}
function subject(S, type) { return '[' + type + '] ' + (S.first || '').trim() + ' ' + (S.last || '').trim(); }
window.CIV = { bb: bb, subject: subject, SEC: SEC, words: words };
if (typeof document === 'undefined' || !$('doc')) return;

/* ===== Интерфейс ===== */
var KEY = 'lscsd-civ-v1', S = {}, type = 'TOW', tried = false, bioEls = [];
try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) { S = saved.S || {}; type = saved.type || 'TOW'; } } catch (e) {}
var q0 = new URLSearchParams(location.search).get('type'); if (q0 && TYPES[q0.toUpperCase()]) type = q0.toUpperCase();
var save = function () { try { localStorage.setItem(KEY, JSON.stringify({ S: S, type: type })); } catch (e) {} };
var today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
if (!S.decl_date) S.decl_date = today;

function bind(el, k, after) {
  el.value = S[k] || '';
  var on = function () { S[k] = el.value; save(); if (after) after(); update(); };
  el.addEventListener('input', on); el.addEventListener('change', on);
  return el;
}
function ctl(f, k, ph, ty, o) {
  var el;
  if (ty === 's' || ty === 'y') { el = E('select', { className: 'gen-input-inline' }, E('option', { value: '' }, '— выберите —')); (ty === 'y' ? YN : o).forEach(function (x) { el.append(E('option', { value: x }, x)); }); }
  else if (ty === 'a') el = E('textarea', { className: 'gen-input-inline', placeholder: ph || '', rows: 5 });
  else if (ty === 'd') el = E('input', { type: 'date', className: 'gen-input-inline' });
  else el = E('input', { type: 'text', className: 'gen-input-inline', placeholder: ph || '' });
  return bind(el, k);
}
function render() {
  var doc = $('doc'); doc.textContent = ''; bioEls = [];
  doc.append(E('div', { className: 'bb-box-dark' }, E('div', { style: 'display:flex;justify-content:space-between;align-items:center;' },
    E('div', {}, E('span', { style: 'font-size:17px;font-weight:bold;color:#a3b8ad;' }, "LOS SANTOS COUNTY SHERIFF'S DEPARTMENT"), E('br'), E('span', { style: 'font-size:11px;color:#dce4df;font-weight:bold;' }, 'CIVILIAN EMPLOYMENT APPLICATION')),
    E('img', { src: 'https://i.imgur.com/1IZekQj.png', width: 55, alt: 'LSSD' }))));
  doc.append(E('div', { className: 'bb-box-grey' }, E('span', { className: 'gen-section-title' }, TYPES[type][0]), E('br'), E('span', { className: 'gen-hint' }, 'Заполните все поля. Тема: [' + type + '] Имя Фамилия')));
  var num = 0;
  SEC.forEach(function (sc, si) {
    var box = E('div', { className: sc[1] }, E('span', { className: 'gen-section-title' }, sc[0]), E('div', { className: 'bb-hr' }));
    var grid = si === 0 ? E('div', { className: 'bb-coll' }) : box;
    if (si === 4) box.append(E('p', { style: 'font-size:13px;line-height:1.5;margin:0 0 12px;color:#4b5563;' }, 'Я, нижеподписавшийся(-аяся), настоящим подтверждаю под страхом наказания за лжесвидетельство, что вся вышеуказанная информация является точной и полной, насколько мне известно.'));
    sc[2].forEach(function (f) {
      var opt = f[4] || {};
      if (opt.for && opt.for.indexOf(type) < 0) return;
      var w = E('div', { className: f[2] === 'c' || f[2] === 'a' ? 'span2' : '' });
      w.append(E('label', { className: 'gen-label' }, (++num) + '. ' + f[1].replace(/\s*\*$/, '') + (opt.req ? ' *' : '')));
      if (f[2] === 'c') f[3].forEach(function (s) { w.append(ctl(f, f[0] + '_' + s[0], s[1], s[2] || 't')); });
      else w.append(ctl(f, f[0], f[3], f[2], f[3]));
      (opt.cond || []).forEach(function (c) {
        var cw = E('div', { className: 'cond-field' }, ctl(f, c[0], c[2], 't'));
        var sync = function () { cw.classList.toggle('visible', (S[f[0]] || '') === c[1]); };
        w.querySelector('select').addEventListener('change', sync); sync(); w.append(cw);
      });
      if (opt.bio) { var hint = E('span', { className: 'gen-hint' }, 'Слов: 0'); w.append(hint); bioEls.push({ k: f[0], hint: hint }); }
      grid.append(w);
    });
    if (grid !== box) box.append(grid);
    doc.append(box);
  });
  doc.append(E('div', { className: 'bb-box-dark', style: 'padding:10px 0;text-align:center;' }, E('span', { style: 'font-size:11px;color:#a3b8ad;' }, "LOS SANTOS COUNTY SHERIFF'S DEPARTMENT"), E('br'), E('span', { style: 'font-size:10px;color:#859e90;' }, 'Civilian Management Bureau')));
  document.querySelectorAll('.gen-tab-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.target === type); });
  update();
}
function missing() {
  var m = [];
  SEC.forEach(function (sc) { sc[2].forEach(function (f) { var o = f[4] || {}; if (o.req && (!o.for || o.for.indexOf(type) >= 0) && !(S[f[0]] || '').trim()) m.push(f[0]); }); });
  return m;
}
function update() {
  $('out').value = bb(S, type);
  bioEls.forEach(function (b) { var n = words(S[b.k]); b.hint.textContent = 'Слов: ' + n + (n && (n < 150 || n > 650) ? ' (требуется от 150 до 650)' : ''); b.hint.className = 'gen-hint' + (n && (n < 150 || n > 650) ? ' warn' : ''); });
  var m = missing();
  $('gen-status').textContent = m.length ? 'Не заполнено обязательных полей: ' + m.length : 'Всё готово, можно копировать';
  var err = $('gen-error-msg');
  if (tried && m.length) { err.textContent = 'Заполните обязательные поля: имя, фамилия, подпись и представление персонажа.'; err.style.display = 'block'; } else err.style.display = 'none';
}
function copy(text, msg) {
  var done = function () { $('gen-status').textContent = msg; };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { $('out').select(); document.execCommand('copy'); done(); });
  else { $('out').value = text; $('out').select(); document.execCommand('copy'); done(); }
}
function guard() { tried = true; update(); if (missing().length) { window.scrollTo(0, 0); return false; } return true; }
document.querySelectorAll('.gen-tab-btn').forEach(function (b) {
  b.addEventListener('click', function () { type = b.dataset.target; save(); try { history.replaceState(null, '', '?type=' + type); } catch (e) {} tried = false; render(); });
});
$('copyBB').addEventListener('click', function () { if (guard()) copy(bb(S, type), 'ББ-код скопирован. Вставьте в редактор в режиме [ ]'); });
$('copyTitle').addEventListener('click', function () { if (!(S.first || '').trim() || !(S.last || '').trim()) { tried = true; update(); window.scrollTo(0, 0); return; } copy(subject(S, type), 'Заголовок скопирован. Вставьте его в поле «Заголовок темы»'); });
$('clearAll').addEventListener('click', function () { if (confirm('Очистить всю анкету?')) { S = { decl_date: today }; save(); tried = false; render(); } });
render();
})();
