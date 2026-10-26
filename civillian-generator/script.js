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

    var val = function(id) {
        var el = document.getElementById(id);
        var value = (el && el.value.trim() !== '') ? el.value.trim() : 'Ответ писать здесь';
        return value;
    };

    // Для XenForo стандартно используются кастомные BB-коды [cbf]/[cb] или юникод чеклисты
    var cb = function(isChecked) {
        return isChecked ? '[cbf][/cbf]' : '[cb][/cb]';
    };

    var radio = function(selVal, options) {
        return options.map(function(opt) {
            return cb(opt === selVal) + ' ' + opt;
        }).join('\n');
    };
    var defaultYesNo = ['Да', 'Нет', 'Не знаю', 'Не хочу отвечать', 'Другое'];

    // Генерация BBCode
    safeAddListener('civilianSubmitBtn', 'click', function() {
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

        var COL_LIGHT = '#f2f6f4';
        var COL_WHITE = '#ffffff';
        var COL_DARK = '#2A4334';

        var ACCENT = '#1f3326';
        var ACCENT2 = '#2d5a40';
        var ACCENT3 = '#3d5e4b';
        var TEXT_MAIN = '#111827';

        // ШАПКА
        b += '[box=' + COL_LIGHT + '][list][float=right][img]https://i.imgur.com/1IZekQj.png[/img][/float][left][font=Arial][size=130][color=' + ACCENT + '][b]LOS SANTOS COUNTY SHERIFF\'S DEPARTMENT[/b][/color][/size]\n';
        b += '[size=85][color=' + ACCENT2 + '][b]CIVILIAN MANAGEMENT BUREAU[/b][/color][/size]\n';
        b += '[size=85][color=' + ACCENT3 + '][b]CIVILIAN EMPLOYMENT APPLICATION[/b][/color][/size][/font][/left][/list][/box]';

        // ТИТУЛЬНЫЙ БЛОК
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[center][size=120][color=' + ACCENT + '][b]CIVILIAN EMPLOYMENT APPLICATION[/b][/color][/size]\n';
        b += '[size=90][color=' + ACCENT2 + '][b]' + posTitle + '[/b][/color][/size][/center]\n';
        b += '[hr][/hr]\n';
        b += '[coll][b]ЗАЯВИТЕЛЬ:[/b] [color=' + TEXT_MAIN + ']' + val('f_first') + ' ' + val('f_last') + '[/color]\n';
        b += '[b]ДАТА ПОДАЧИ:[/b] [color=' + TEXT_MAIN + ']' + todayStr + '[/color]|[b]ТИП ДОЛЖНОСТИ:[/b] [color=' + TEXT_MAIN + ']' + posTitle + '[/color]\n';
        b += '[b]СТАТУС:[/b] [color=' + ACCENT + '][b]НА РАССМОТРЕНИИ[/b][/color][/coll]\n';
        b += '[/list][/box]';

        // I. ЛИЧНАЯ ИНФОРМАЦИЯ
        b += '[box=' + COL_LIGHT + '][list]\n';
        b += '[size=100][b]I. ЛИЧНАЯ ИНФОРМАЦИЯ[/b][/size]\n';
        b += '[coll][b]Имя:[/b] ' + val('f_first') + '\n[b]Второе имя:[/b] ' + val('f_middle') + '|[b]Фамилия:[/b] ' + val('f_last') + '\n[b]Дата рождения:[/b] ' + val('f_dob_m') + '/' + val('f_dob_d') + '/' + val('f_dob_y') + '[/coll]\n';
        b += '[coll][b]Место рождения:[/b] ' + val('f_birthplace') + '\n[b]Пол:[/b] ' + val('f_gender') + '|[b]Раса:[/b] ' + val('f_race') + '\n[b]Семейное положение:[/b] ' + val('f_marital') + '[/coll]\n';
        b += '[coll][b]Рост:[/b] ' + val('f_height') + ' футов\n[b]Вес:[/b] ' + val('f_weight') + ' фунтов|[b]Телефон:[/b] ' + val('f_phone') + '\n[b]Email:[/b] ' + val('f_email') + '[/coll]\n';
        b += '[b]Адрес:[/b] ' + val('f_addr_street') + ', ' + val('f_addr_city') + ', ' + val('f_addr_state') + '\n';
        b += '[/list][/box]';

        // II. ОБРАЗОВАНИЕ
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[size=100][b]II. ОБРАЗОВАНИЕ[/b][/size]\n';
        b += '[coll][b]Уровень образования:[/b] ' + val('f_edu_level') + '\n[b]Учебное заведение:[/b] ' + val('f_edu_name') + '|[b]Период обучения:[/b] ' + val('f_edu_period') + '\n[b]Специальность:[/b] ' + val('f_edu_major') + '[/coll]\n';
        b += '[/list][/box]';

        // III. ОПЫТ РАБОТЫ
        b += '[box=' + COL_LIGHT + '][list]\n';
        b += '[size=100][b]III. ОПЫТ РАБОТЫ[/b][/size]\n';
        for (var i = 1; i <= 3; i++) {
            var jt = i === 1 ? 'ПЕРВОЕ МЕСТО РАБОТЫ' : i === 2 ? 'ВТОРОЕ МЕСТО РАБОТЫ' : 'ТРЕТЬЕ МЕСТО РАБОТЫ';
            b += '[b]' + jt + '[/b]\n';
            b += '[coll][b]Компания:[/b] ' + val('f_job' + i + '_co') + '\n[b]Должность:[/b] ' + val('f_job' + i + '_pos') + '|[b]Период работы:[/b] ' + val('f_job' + i + '_period') + '\n[b]Причина увольнения:[/b] ' + val('f_job' + i + '_reason') + '[/coll]\n';
            b += '[justify][b]Обязанности:[/b] ' + val('f_job' + i + '_desc') + '[/justify]\n';
            if (i < 3) b += '[hr][/hr]\n';
        }
        b += '[/list][/box]';

        // IV. ВОПРОСЫ ПРОВЕРКИ БИОГРАФИИ
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[size=100][b]IV. ВОПРОСЫ ПРОВЕРКИ БИОГРАФИИ[/b][/size]\n';
        var qNum = 19;

        b += '[b]' + (qNum++) + '. Я имею действительное водительское удостоверение штата Сан-Андреас[/b]\n[list]\n' + radio(val('bg_license'), defaultYesNo) + '\n[/list]\n';
        if (type === 'TOW') b += '[b]' + (qNum++) + '. Я имею опыт управления спецтехникой / крупногабаритным транспортом[/b]\n[list]\n' + radio(val('bg_tow_equip'), defaultYesNo) + '\n[/list]\n';
        if (type === 'ABP') b += '[b]' + (qNum++) + '. Я имею действительную лицензию пилота вертолёта (SAAA / FAA)[/b]\n[list]\n' + radio(val('bg_abp_heli'), defaultYesNo) + '\n[/list]\n';

        b += '[b]' + (qNum++) + '. Я имею законное право на работу в Соединенных Штатах Америки[/b]\n[list]\n' + radio(val('bg_work'), defaultYesNo) + '\n[/list]\n';
        b += '[b]' + (qNum++) + '. Я узнал(а) о данной вакансии через[/b]\n[list]\n' + radio(val('bg_source'), ['Веб-сайт LSSD', 'Сайт станции шерифа', 'Социальные сети', 'Кампус университета', 'Ярмарку вакансий или семинар', 'Сотрудника LSSD', 'Сотрудника округа Лос-Сантос', 'Члена семьи', 'Друзей или соседей', 'Радио', 'Рекламный щит', 'Другое']) + '\n[/list]\n';
        b += '[b]' + (qNum++) + '. Помимо английского, я владею следующими языками[/b]\n[list]' + val('bg_languages') + '[/list]\n';
        b += '[b]' + (qNum++) + '. Я являюсь лицом с ограниченными возможностями[/b]\n[list]\n' + radio(val('bg_disability'), defaultYesNo) + '\n[/list]\n';

        var mVal = val('bg_military');
        b += '[b]' + (qNum++) + '. Я являюсь действующим или бывшим военнослужащим Вооруженных сил США[/b]\n[list]\n';
        b += cb(mVal === 'Да, я прохожу службу в настоящее время') + ' Да, я прохожу службу в настоящее время\n[list]Род войск: ' + val('bg_mil_active') + '[/list]\n';
        b += cb(mVal === 'Да, я проходил(а) службу ранее') + ' Да, я проходил(а) службу ранее\n[list]Род войск: ' + val('bg_mil_prev') + '[/list]\n';
        b += cb(mVal === 'Нет') + ' Нет\n' + cb(mVal === 'Не знаю') + ' Не знаю\n' + cb(mVal === 'Не хочу отвечать') + ' Не хочу отвечать\n' + cb(mVal === 'Другое') + ' Другое\n[/list]\n';

        b += '[b]' + (qNum++) + '. В настоящее время я нахожусь под уголовной пробацией или на условно-досрочном освобождении[/b]\n[list]\n' + radio(val('bg_probation'), defaultYesNo) + '\n[/list]\n';

        var duiVal = val('bg_dui');
        b += '[b]' + (qNum++) + '. Я имею судимости за вождение в состоянии алкогольного или наркотического опьянения в Сан-Андреас и/или других штатах[/b]\n[list]\n';
        b += cb(duiVal === 'Да') + ' Да\n[list]Укажите штат(ы) и год(ы) судимости: ' + val('bg_dui_detail') + '[/list]\n' + cb(duiVal === 'Нет') + ' Нет\n' + cb(duiVal === 'Не знаю') + ' Не знаю\n' + cb(duiVal === 'Не хочу отвечать') + ' Не хочу отвечать\n' + cb(duiVal === 'Другое') + ' Другое\n[/list]\n';

        var mjVal = val('bg_marijuana');
        b += '[b]' + (qNum++) + '. Я употреблял(а) марихуану в течение последнего года[/b]\n[list]\n';
        b += cb(mjVal === 'Да') + ' Да\n[list]Укажите месяц(ы) и год(ы) употребления: ' + val('bg_marijuana_detail') + '[/list]\n' + cb(mjVal === 'Нет') + ' Нет\n' + cb(mjVal === 'Не знаю') + ' Не знаю\n' + cb(mjVal === 'Не хочу отвечать') + ' Не хочу отвечать\n' + cb(mjVal === 'Другое') + ' Другое\n[/list]\n';

        b += '[b]' + (qNum++) + '. Я употреблял(а) другие запрещенные вещества в течение последнего года[/b]\n[list]\n' + radio(val('bg_drugs'), defaultYesNo) + '\n[/list]\n';
        b += '[b]' + (qNum++) + '. Я совершал(а) кражу или хищение на сумму 950 долларов США или более[/b]\n[list]\n' + radio(val('bg_theft'), defaultYesNo) + '\n[/list]\n';
        b += '[/list][/box]';

        // V. ДЕКЛАРАЦИЯ И ПОДТВЕРЖДЕНИЕ
        b += '[box=' + COL_LIGHT + '][list]\n';
        b += '[size=100][b]V. ДЕКЛАРАЦИЯ И ПОДТВЕРЖДЕНИЕ[/b][/size]\n';
        b += '[justify]Я, нижеподписавшийся(-аяся), настоящим подтверждаю под страхом наказания за лжесвидетельство, что вся вышеуказанная информация является точной и полной, насколько мне известно.[/justify]\n';
        b += '[b]Подпись:[/b] ' + val('decl_sign') + '\n';
        b += '[b]Дата:[/b] ' + val('decl_dm') + '/' + val('decl_dd') + '/' + val('decl_dy') + '\n';
        b += '[/list][/box]';

        // VI. OUT OF CHARACTER ВОПРОСЫ
        b += '[box=' + COL_WHITE + '][list]\n';
        b += '[size=100][b]VI. OUT OF CHARACTER ВОПРОСЫ[/b][/size]\n';

        var oPrefix = (type && typeof type === 'string') ? type.toLowerCase() : 'cso';
        var tVal = val('ooc_' + oPrefix + '_banned');
        var bStr = cb(tVal === 'Да') + ' Да\n[list]Пояснение: ' + val('ooc_' + oPrefix + '_banned_detail') + '[/list]\n' + cb(tVal === 'Нет') + ' Нет';

        if (type === 'TOW' || type === 'ABP') {
            b += '[coll][b]Часовой пояс:[/b] ' + val('ooc_' + oPrefix + '_tz') + '\n[b]UCP:[/b] ' + val('ooc_' + oPrefix + '_ucp') + '|[b]Форум:[/b] ' + val('ooc_' + oPrefix + '_forum') + '\n[b]Дабл-фракция:[/b] ' + val('ooc_' + oPrefix + '_double') + '[/coll]\n';
            b += '[b]Скриншот истории наказаний из UCP:[/b] ' + val('ooc_' + oPrefix + '_punish') + '\n';
            b += '[b]Исключали ли вас или банили в других официальных фракциях?[/b]\n[list]\n' + bStr + '\n[/list]\n';
            b += '[coll][b]Согласие на отпечатки и фото (IC):[/b] ' + radio(val('ooc_' + oPrefix + '_fp'), ['Да', 'Нет']).split('\n').join(' ') + '\n[b]Рабочий микрофон / TS / Discord:[/b] ' + radio(val('ooc_' + oPrefix + '_mic'), ['Да', 'Нет']).split('\n').join(' ') + '|[b]Прочитаны обязательные темы:[/b] ' + radio(val('ooc_' + oPrefix + '_read'), ['Да', 'Нет']).split('\n').join(' ') + '\n[/coll]\n';
            b += '[b]Представление персонажа:[/b]\n[justify]' + val('ooc_' + oPrefix + '_bio') + '[/justify]\n';
        } else {
            b += '[coll][b]Часовой пояс:[/b] ' + val('ooc_cso_tz') + '\n[b]UCP:[/b] ' + val('ooc_cso_ucp') + '|[b]Discord:[/b] ' + val('ooc_cso_discord') + '\n[b]Дабл-фракция:[/b] ' + val('ooc_cso_double') + '[/coll]\n';
            b += '[b]Скриншот истории наказаний из UCP:[/b] ' + val('ooc_cso_punish') + '\n';
            b += '[b]Профиль на форуме Gambit:[/b] ' + val('ooc_cso_gambit') + '\n';
            b += '[b]Исключали ли вас или банили в других официальных фракциях?[/b]\n[list]\n' + bStr + '\n[/list]\n';
            b += '[coll][b]Согласие на отпечатки:[/b] ' + radio(val('ooc_cso_fp'), ['Да', 'Нет']).split('\n').join(' ') + '\n[b]Прочитаны обязательные темы:[/b] ' + radio(val('ooc_cso_read'), ['Да', 'Нет']).split('\n').join(' ') + '[/coll]\n';
            b += '[b]Представление персонажа:[/b]\n[justify]' + val('ooc_cso_bio') + '[/justify]\n';
        }
        b += '[/list][/box]';

        // ПОДВАЛ
        b += '[box=' + COL_DARK + '][center][size=80][color=#ffffff]LOS SANTOS COUNTY SHERIFF\'S DEPARTMENT / CIVILIAN MANAGEMENT BUREAU[/color][/size][/center][/box]';

        // Вывод результатов в модальное окно
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
