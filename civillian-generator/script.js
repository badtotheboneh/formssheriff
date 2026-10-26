document.addEventListener("DOMContentLoaded", function() {
    console.log("[DEBUG] Скрипт генератора инициализирован.");

    // Подсчет слов
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id && e.target.id.includes('_bio')) {
            var text = e.target.value.trim();
            var words = text ? text.split(/\s+/).filter(function(w) { return w.length > 0; }).length : 0;
            var countEl = document.getElementById(e.target.id + '_count');
            if (countEl) {
                countEl.innerText = 'Слов: ' + words;
            }
        }
    });

    function safeAddListener(id, event, callback) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, callback);
        } else {
            console.warn("[DEBUG] Элемент с ID '" + id + "' не найден.");
        }
    }

    // Заполнение селектов Да/Нет
    var yesNoOptions = ''
        + '<option value="Да">Да</option>'
        + '<option value="Нет">Нет</option>'
        + '<option value="Не знаю">Не знаю</option>'
        + '<option value="Не хочу отвечать">Не хочу отвечать</option>'
        + '<option value="Другое">Другое</option>';
    document.querySelectorAll('.bg-yesno').forEach(function(sel) { sel.innerHTML = yesNoOptions; });

    // Логика переключения вкладок
    var tabBtns = document.querySelectorAll('.gen-tab-btn');
    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var target = btn.dataset.target;

            var finalTypeEl = document.getElementById('final_app_type');
            if (finalTypeEl) finalTypeEl.value = target;

            document.querySelectorAll('.form-switch-block').forEach(function(b) { b.classList.remove('active'); });

            var posTitle = '';
            if (target === 'TOW') {
                var extTow = document.getElementById('bg_extra_tow');
                if (extTow) extTow.classList.add('active');
                var oocTow = document.getElementById('ooc_tow');
                if (oocTow) oocTow.classList.add('active');
                posTitle = 'Contract Tow Truck Operator';
            } else if (target === 'ABP') {
                var extAbp = document.getElementById('bg_extra_abp');
                if (extAbp) extAbp.classList.add('active');
                var oocAbp = document.getElementById('ooc_abp');
                if (oocAbp) oocAbp.classList.add('active');
                posTitle = 'Relief Pilot (Aero Bureau)';
            } else {
                var oocCso = document.getElementById('ooc_cso');
                if (oocCso) oocCso.classList.add('active');
                posTitle = 'Community Service Officer';
            }

            var titleEl = document.getElementById('tab_position_title');
            if (titleEl) titleEl.innerText = posTitle;

            updateNumbering(target);
        });
    });

    function updateNumbering(type) {
        var qNum = 19;
        document.querySelectorAll('.bg-num').forEach(function(el) {
            el.innerText = el.innerText.replace(/^\d+\./, qNum + '.');
            qNum++;
        });
        var dNum = (type === 'CSO') ? 30 : 31;
        document.querySelectorAll('.decl-num').forEach(function(el) {
            el.innerText = el.innerText.replace(/^\d+\./, dNum + '.');
            dNum++;
        });
    }

    // Условные поля
    safeAddListener('bg_military', 'change', function() {
        var actWrap = document.getElementById('bg_mil_active_wrap');
        var prevWrap = document.getElementById('bg_mil_prev_wrap');
        if (actWrap) actWrap.classList.toggle('visible', this.value === 'Да, я прохожу службу в настоящее время');
        if (prevWrap) prevWrap.classList.toggle('visible', this.value === 'Да, я проходил(а) службу ранее');
    });

    safeAddListener('bg_dui', 'change', function() {
        var w = document.getElementById('bg_dui_wrap');
        if (w) w.classList.toggle('visible', this.value === 'Да');
    });

    safeAddListener('bg_marijuana', 'change', function() {
        var w = document.getElementById('bg_marijuana_wrap');
        if (w) w.classList.toggle('visible', this.value === 'Да');
    });

    safeAddListener('ooc_tow_banned', 'change', function() {
        var w = document.getElementById('ooc_tow_banned_wrap');
        if (w) w.classList.toggle('visible', this.value === 'Да');
    });

    safeAddListener('ooc_abp_banned', 'change', function() {
        var w = document.getElementById('ooc_abp_banned_wrap');
        if (w) w.classList.toggle('visible', this.value === 'Да');
    });

    safeAddListener('ooc_cso_banned', 'change', function() {
        var w = document.getElementById('ooc_cso_banned_wrap');
        if (w) w.classList.toggle('visible', this.value === 'Да');
    });

    // Функция получения чистого значения без тегов
    var val = function(id) {
        var el = document.getElementById(id);
        return (el && el.value.trim() !== '') ? el.value.trim() : 'Ответ писать здесь';
    };

    // Обертка для вывода ответов в темном цвете (#1a2920) на форуме
    var cval = function(id) {
        return '[color=#1a2920]' + val(id) + '[/color]';
    };

    // Чекбоксы форума
    var cb = function(isChecked) {
        return isChecked ? '[cbf][/cbf]' : '[cb][/cb]';
    };

    var radio = function(selVal, options) {
        return options.map(function(opt) {
            var formattedOpt = '[color=#1a2920]' + opt + '[/color]';
            return cb(opt === selVal) + ' ' + formattedOpt;
        }).join('\n');
    };
    var defaultYesNo = ['Да', 'Нет', 'Не знаю', 'Не хочу отвечать', 'Другое'];

    // Генерация BBCode
    safeAddListener('civilianSubmitBtn', 'click', function() {
        // Объявляем палитру цветов в самом начале функции, чтобы избежать ReferenceError
        var COL_LIGHT = '#f2f6f4';
        var COL_WHITE = '#ffffff';
        var COL_DARK = '#2A4334';
        var ACCENT = '#1f3326';
        var ACCENT2 = '#2d5a40';
        var ACCENT3 = '#3d5e4b';
        var TEXT_DARK = '#1a2920';

        var typeEl = document.getElementById('final_app_type');
        if (!typeEl) return;

        var type = typeEl.value;

        var firstInput = document.getElementById('f_first');
        var lastInput = document.getElementById('f_last');

        var first = firstInput ? firstInput.value.trim() : '';
        var last = lastInput ? lastInput.value.trim() : '';

        if (!first || !last) {
            showError('Пожалуйста, заполните Имя и Фамилию.');
            return;
        } else {
            hideError();
        }

        var generatedSubject = '[' + type + '] ' + first + ' ' + last;
        var b = '';

        var posTitleMap = {
            'TOW': 'CONTRACT TOW TRUCK OPERATOR',
            'ABP': 'RELIEF PILOT (AERO BUREAU)',
            'CSO': 'COMMUNITY SERVICE OFFICER'
        };
        var posTitle = posTitleMap[type] || 'CIVILIAN APPLICATION';

        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var nowD = new Date();
        var todayStr = nowD.getDate() + ' ' + months[nowD.getMonth()] + ' ' + nowD.getFullYear();

        // ШАПКА
        b += '[box=' + COL_LIGHT + '][list][float=right][img]https://i.imgur.com/1IZekQj.png[/img][/float][left][font=Arial][size=130][color=' + ACCENT + '][b]LOS SANTOS COUNTY SHERIFF\'S DEPARTMENT[/b][/color][/size]\n';
        b += '[size=85][color=' + ACCENT2 + '][b]CIVILIAN MANAGEMENT BUREAU[/b][/color][/size]\n';
        b += '[size=85][color=' + ACCENT3 + '][b]CIVILIAN EMPLOYMENT APPLICATION[/b][/color][/size][/font][/left][/list][/box]';

        // ТИТУЛЬНЫЙ БЛОК
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[center][size=120][color=' + ACCENT + '][b]CIVILIAN EMPLOYMENT APPLICATION[/b][/color][/size]\n';
        b += '[size=90][color=' + ACCENT2 + '][b]' + posTitle + '[/b][/color][/size][/center]\n';
        b += '[hr][/hr]\n';
        b += '[coll][b]ЗАЯВИТЕЛЬ:[/b] [color=' + TEXT_DARK + ']' + first + ' ' + last + '[/color]\n';
        b += '[b]ДАТА ПОДАЧИ:[/b] [color=' + TEXT_DARK + ']' + todayStr + '[/color]|[b]ТИП ДОЛЖНОСТИ:[/b] [color=' + TEXT_DARK + ']' + posTitle + '[/color]\n';
        b += '[b]СТАТУС:[/b] [color=' + ACCENT + '][b]НА РАССМОТРЕНИИ[/b][/color][/coll]\n';
        b += '[/list][/box]';

        // I. ЛИЧНАЯ ИНФОРМАЦИЯ
        b += '[box=' + COL_LIGHT + '][list]\n';
        b += '[size=100][color=' + ACCENT + '][b]I. ЛИЧНАЯ ИНФОРМАЦИЯ[/b][/color][/size]\n';
        b += '[coll][b]Имя:[/b] ' + cval('f_first') + '\n[b]Второе имя:[/b] ' + cval('f_middle') + '|[b]Фамилия:[/b] ' + cval('f_last') + '\n[b]Дата рождения:[/b] [color=' + TEXT_DARK + ']' + val('f_dob_m') + '/' + val('f_dob_d') + '/' + val('f_dob_y') + '[/color][/coll]\n';
        b += '[coll][b]Место рождения:[/b] ' + cval('f_birthplace') + '\n[b]Пол:[/b] ' + cval('f_gender') + '|[b]Раса:[/b] ' + cval('f_race') + '\n[b]Семейное положение:[/b] ' + cval('f_marital') + '[/coll]\n';
        b += '[coll][b]Рост:[/b] [color=' + TEXT_DARK + ']' + val('f_height') + ' футов[/color]\n[b]Вес:[/b] [color=' + TEXT_DARK + ']' + val('f_weight') + ' фунтов[/color]|[b]Телефон:[/b] ' + cval('f_phone') + '\n[b]Email:[/b] ' + cval('f_email') + '[/coll]\n';
        b += '[b]Адрес:[/b] [color=' + TEXT_DARK + ']' + val('f_addr_street') + ', ' + val('f_addr_city') + ', ' + val('f_addr_state') + '[/color]\n';
        b += '[/list][/box]';

        // II. ОБРАЗОВАНИЕ
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[size=100][color=' + ACCENT + '][b]II. ОБРАЗОВАНИЕ[/b][/color][/size]\n';
        b += '[coll][b]Уровень образования:[/b] ' + cval('f_edu_level') + '\n[b]Учебное заведение:[/b] ' + cval('f_edu_name') + '|[b]Период обучения:[/b] ' + cval('f_edu_period') + '\n[b]Специальность:[/b] ' + cval('f_edu_major') + '[/coll]\n';
        b += '[/list][/box]';

        // III. ОПЫТ РАБОТЫ
        b += '[box=' + COL_LIGHT + '][list]\n';
        b += '[size=100][color=' + ACCENT + '][b]III. ОПЫТ РАБОТЫ[/b][/color][/size]\n';
        for (var i = 1; i <= 3; i++) {
            var jt = i === 1 ? 'ПЕРВОЕ МЕСТО РАБОТЫ' : i === 2 ? 'ВТОРОЕ МЕСТО РАБОТЫ' : 'ТРЕТЬЕ МЕСТО РАБОТЫ';
            b += '[b][color=' + ACCENT2 + ']' + jt + '[/color][/b]\n';
            b += '[coll][b]Компания:[/b] ' + cval('f_job' + i + '_co') + '\n[b]Должность:[/b] ' + cval('f_job' + i + '_pos') + '|[b]Период работы:[/b] ' + cval('f_job' + i + '_period') + '\n[b]Причина увольнения:[/b] ' + cval('f_job' + i + '_reason') + '[/coll]\n';
            b += '[justify][b]Обязанности:[/b] ' + cval('f_job' + i + '_desc') + '[/justify]\n';
            if (i < 3) b += '[hr][/hr]\n';
        }
        b += '[/list][/box]';

        // IV. ВОПРОСЫ ПРОВЕРКИ БИОГРАФИИ
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[size=100][color=' + ACCENT + '][b]IV. ВОПРОСЫ ПРОВЕРКИ БИОГРАФИИ[/b][/color][/size]\n';
        var qNum = 19;

        b += '[b]' + (qNum++) + '. Я имею действительное водительское удостоверение штата Сан-Андреас[/b]\n[list]\n' + radio(val('bg_license'), defaultYesNo) + '\n[/list]\n';
        if (type === 'TOW') b += '[b]' + (qNum++) + '. Я имею опыт управления спецтехникой / крупногабаритным транспортом[/b]\n[list]\n' + radio(val('bg_tow_equip'), defaultYesNo) + '\n[/list]\n';
        if (type === 'ABP') b += '[b]' + (qNum++) + '. Я имею действительную лицензию пилота вертолёта (SAAA / FAA)[/b]\n[list]\n' + radio(val('bg_abp_heli'), defaultYesNo) + '\n[/list]\n';

        b += '[b]' + (qNum++) + '. Я имею законное право на работу в Соединенных Штатах Америки[/b]\n[list]\n' + radio(val('bg_work'), defaultYesNo) + '\n[/list]\n';
        b += '[b]' + (qNum++) + '. Я узнал(а) о данной вакансии через[/b]\n[list]\n' + radio(val('bg_source'), ['Веб-сайт LSSD', 'Сайт станции шерифа', 'Социальные сети', 'Кампус университета', 'Ярмарку вакансий или семинар', 'Сотрудника LSSD', 'Сотрудника округа Лос-Сантос', 'Члена семьи', 'Друзей или соседей', 'Радио', 'Рекламный щит', 'Другое']) + '\n[/list]\n';
        b += '[b]' + (qNum++) + '. Помимо английского, я владею следующими языками[/b]\n[list]' + cval('bg_languages') + '[/list]\n';
        b += '[b]' + (qNum++) + '. Я являюсь лицом с ограниченными возможностями[/b]\n[list]\n' + radio(val('bg_disability'), defaultYesNo) + '\n[/list]\n';

        var mVal = val('bg_military');
        b += '[b]' + (qNum++) + '. Я являюсь действующим или бывшим военнослужащим Вооруженных сил США[/b]\n[list]\n';
        b += cb(mVal === 'Да, я прохожу службу в настоящее время') + ' [color=' + TEXT_DARK + ']Да, я прохожу службу в настоящее время[/color]\n[list]Род войск: ' + cval('bg_mil_active') + '[/list]\n';
        b += cb(mVal === 'Да, я проходил(а) службу ранее') + ' [color=' + TEXT_DARK + ']Да, я проходил(а) службу ранее[/color]\n[list]Род войск: ' + cval('bg_mil_prev') + '[/list]\n';
        b += cb(mVal === 'Нет') + ' [color=' + TEXT_DARK + ']Нет[/color]\n' + cb(mVal === 'Не знаю') + ' [color=' + TEXT_DARK + ']Не знаю[/color]\n' + cb(mVal === 'Не хочу отвечать') + ' [color=' + TEXT_DARK + ']Не хочу отвечать[/color]\n' + cb(mVal === 'Другое') + ' [color=' + TEXT_DARK + ']Другое[/color]\n[/list]\n';

        b += '[b]' + (qNum++) + '. В настоящее время я нахожусь под уголовной пробацией или на условно-досрочном освобождении[/b]\n[list]\n' + radio(val('bg_probation'), defaultYesNo) + '\n[/list]\n';

        var duiVal = val('bg_dui');
        b += '[b]' + (qNum++) + '. Я имею судимости за вождение в состоянии алкогольного или наркотического опьянения в Сан-Андреас и/или других штатах[/b]\n[list]\n';
        b += cb(duiVal === 'Да') + ' [color=' + TEXT_DARK + ']Да[/color]\n[list]Укажите штат(ы) и год(ы) судимости: ' + cval('bg_dui_detail') + '[/list]\n' + cb(duiVal === 'Нет') + ' [color=' + TEXT_DARK + ']Нет[/color]\n' + cb(duiVal === 'Не знаю') + ' [color=' + TEXT_DARK + ']Не знаю[/color]\n' + cb(duiVal === 'Не хочу отвечать') + ' [color=' + TEXT_DARK + ']Не хочу отвечать[/color]\n' + cb(duiVal === 'Другое') + ' [color=' + TEXT_DARK + ']Другое[/color]\n[/list]\n';

        var mjVal = val('bg_marijuana');
        b += '[b]' + (qNum++) + '. Я употреблял(а) марихуану в течение последнего года[/b]\n[list]\n';
        b += cb(mjVal === 'Да') + ' [color=' + TEXT_DARK + ']Да[/color]\n[list]Укажите месяц(ы) и год(ы) употребления: ' + cval('bg_marijuana_detail') + '[/list]\n' + cb(mjVal === 'Нет') + ' [color=' + TEXT_DARK + ']Нет[/color]\n' + cb(mjVal === 'Не знаю') + ' [color=' + TEXT_DARK + ']Не знаю[/color]\n' + cb(mjVal === 'Не хочу отвечать') + ' [color=' + TEXT_DARK + ']Не хочу отвечать[/color]\n' + cb(mjVal === 'Другое') + ' [color=' + TEXT_DARK + ']Другое[/color]\n[/list]\n';

        b += '[b]' + (qNum++) + '. Я употреблял(а) другие запрещенные вещества в течение последнего года[/b]\n[list]\n' + radio(val('bg_drugs'), defaultYesNo) + '\n[/list]\n';
        b += '[b]' + (qNum++) + '. Я совершал(а) кражу или хищение на сумму 950 долларов США или более[/b]\n[list]\n' + radio(val('bg_theft'), defaultYesNo) + '\n[/list]\n';
        b += '[/list][/box]';

        // V. ДЕКЛАРАЦИЯ И ПОДТВЕРЖДЕНИЕ
        b += '[box=' + COL_LIGHT + '][list]\n';
        b += '[size=100][color=' + ACCENT + '][b]V. ДЕКЛАРАЦИЯ И ПОДТВЕРЖДЕНИЕ[/b][/color][/size]\n';
        b += '[justify]Я, нижеподписавшийся(-аяся), настоящим подтверждаю под страхом наказания за лжесвидетельство, что вся вышеуказанная информация является точной и полной, насколько мне известно.[/justify]\n';
        b += '[b]Подпись:[/b] ' + cval('decl_sign') + '\n';
        b += '[b]Дата:[/b] [color=' + TEXT_DARK + ']' + val('decl_dm') + '/' + val('decl_dd') + '/' + val('decl_dy') + '[/color]\n';
        b += '[/list][/box]';

        // VI. OUT OF CHARACTER ВОПРОСЫ
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[size=100][color=' + ACCENT + '][b]VI. OUT OF CHARACTER ВОПРОСЫ[/b][/color][/size]\n';

        var oPrefix = (type && typeof type === 'string') ? type.toLowerCase() : 'cso';
        var tVal = val('ooc_' + oPrefix + '_banned');
        var bStr = cb(tVal === 'Да') + ' [color=' + TEXT_DARK + ']Да[/color]\n[list]Пояснение: ' + cval('ooc_' + oPrefix + '_banned_detail') + '[/list]\n' + cb(tVal === 'Нет') + ' [color=' + TEXT_DARK + ']Нет[/color]';

        if (type === 'TOW' || type === 'ABP') {
            b += '[coll][b]Часовой пояс:[/b] ' + cval('ooc_' + oPrefix + '_tz') + '\n[b]UCP:[/b] ' + cval('ooc_' + oPrefix + '_ucp') + '|[b]Форум:[/b] ' + cval('ooc_' + oPrefix + '_forum') + '\n[b]Дабл-фракция:[/b] ' + cval('ooc_' + oPrefix + '_double') + '[/coll]\n';
            b += '[b]Скриншот истории наказаний из UCP:[/b] ' + cval('ooc_' + oPrefix + '_punish') + '\n';
            b += '[b]Исключали ли вас или банили в других официальных фракциях?[/b]\n[list]\n' + bStr + '\n[/list]\n';
            b += '[coll][b]Согласие на отпечатки и фото (IC):[/b] ' + radio(val('ooc_' + oPrefix + '_fp'), ['Да', 'Нет']).split('\n').join(' ') + '\n[b]Рабочий микрофон / TS / Discord:[/b] ' + radio(val('ooc_' + oPrefix + '_mic'), ['Да', 'Нет']).split('\n').join(' ') + '|[b]Прочитаны обязательные темы:[/b] ' + radio(val('ooc_' + oPrefix + '_read'), ['Да', 'Нет']).split('\n').join(' ') + '\n[/coll]\n';
            b += '[b]Представление персонажа:[/b]\n[justify]' + cval('ooc_' + oPrefix + '_bio') + '[/justify]\n';
        } else {
            b += '[coll][b]Часовой пояс:[/b] ' + cval('ooc_cso_tz') + '\n[b]UCP:[/b] ' + cval('ooc_cso_ucp') + '|[b]Discord:[/b] ' + cval('ooc_cso_discord') + '\n[b]Дабл-фракция:[/b] ' + cval('ooc_cso_double') + '[/coll]\n';
            b += '[b]Скриншот истории наказаний из UCP:[/b] ' + cval('ooc_cso_punish') + '\n';
            b += '[b]Профиль на форуме Gambit:[/b] ' + cval('ooc_cso_gambit') + '\n';
            b += '[b]Исключали ли вас или банили в других официальных фракциях?[/b]\n[list]\n' + bStr + '\n[/list]\n';
            b += '[coll][b]Согласие на отпечатки:[/b] ' + radio(val('ooc_cso_fp'), ['Да', 'Нет']).split('\n').join(' ') + '\n[b]Прочитаны обязательные темы:[/b] ' + radio(val('ooc_cso_read'), ['Да', 'Нет']).split('\n').join(' ') + '[/coll]\n';
            b += '[b]Представление персонажа:[/b]\n[justify]' + cval('ooc_cso_bio') + '[/justify]\n';
        }
        b += '[/list][/box]';

        // ПОДВАЛ
        b += '[box=' + COL_DARK + '][center][size=80][color=#ffffff]LOS SANTOS COUNTY SHERIFF\'S DEPARTMENT / CIVILIAN MANAGEMENT BUREAU[/color][/size][/center][/box]';

        document.getElementById('out_subject').value = generatedSubject;
        document.getElementById('out_bbcode').value = b;
        document.getElementById('resultModal').style.display = 'flex';
    });

    // Обработка кнопки копирования
    safeAddListener('copyBbcodeBtn', 'click', function() {
        var bbcodeArea = document.getElementById('out_bbcode');
        bbcodeArea.select();
        document.execCommand('copy');
        this.innerText = 'Скопировано!';
        setTimeout(() => { this.innerText = 'Скопировать BBCode'; }, 2000);
    });

    // Закрытие модального окна
    safeAddListener('closeModalBtn', 'click', function() {
        document.getElementById('resultModal').style.display = 'none';
    });

    function showError(msg) {
        var err = document.getElementById('gen-error-msg');
        if (err) {
            err.innerText = msg;
            err.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }

    function hideError() {
        var err = document.getElementById('gen-error-msg');
        if (err) err.style.display = 'none';
    }
});
