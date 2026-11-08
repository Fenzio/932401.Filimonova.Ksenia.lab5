const temperatures = [12, 24, 8, 31, 19, 5, 27];

function findHottestDay(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

function filterWarmDays(arr) {
    return arr.filter(t => t > 20);
}

function calculateAverageTemp(arr) {
    if (arr.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum / arr.length;
}

function countColdDays(arr) {
    let count = 0;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= 10) {
            count++;
            sum += arr[i];
        }
    }
    const average = count > 0 ? sum / count : 0;
    return { count, average };
}

function pluralDays(n) {
    const mod10  = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'день';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
    return 'дней';
}

const userName = prompt('Как вас зовут?', 'Гость');
const name = userName && userName.trim() !== '' ? userName.trim() : 'Гость';

const hottest    = findHottestDay(temperatures);
const warmDays   = filterWarmDays(temperatures);
const warmCount  = warmDays.length;
const averageAll = calculateAverageTemp(temperatures);
const coldStats  = countColdDays(temperatures);

if (hottest >= 30) {
    console.log('Рекомендуется предусмотреть навесы и воду для гостей');
}

alert(
    `Привет, ${name}!\n` +
    `Средняя температура за период — ${averageAll.toFixed(1)} °C, ` +
    `было ${warmCount} тёплых ${pluralDays(warmCount)}.`
);

console.log(`Средняя температура в холодные дни: ${coldStats.average.toFixed(1)} °C`);
console.log(`Количество холодных дней: ${coldStats.count}`);
console.log(`Максимальная температура: ${hottest} °C`);
console.log(`Тёплые дни (>20 °C): ${warmDays.join(', ')} °C`);


document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Безопасный поиск элементов (обработка ошибок)
    function getEl(id) {
        const el = document.getElementById(id);
        if (!el) console.error(`Ошибка: Элемент #${id} не найден.`);
        return el;
    }

    const hobbySection = getEl('hobbies-section');
    const container = getEl('hobby-container');
    
    const btnTheme = document.querySelector('#btn-theme');
    const btnView = document.querySelector('#btn-view');
    const btnAdd = document.querySelector('#btn-add');
    const btnHide = getEl('btn-hide');

    if (!hobbySection || !container || !btnTheme || !btnView || !btnAdd || !btnHide) {
        console.error("Не все элементы найдены. Скрипт ЛР №5 остановлен.");
        return;
    }

    // 2. Функции сохранения в localStorage
    function saveHobbies() {
        const items = document.querySelectorAll('.hobby-item');
        const data = [];
        items.forEach(item => {
            data.push({
                name: item.querySelector('.hobby-name').textContent,
                icon: item.querySelector('.hobby-icon').textContent
            });
        });
        localStorage.setItem('hobbies', JSON.stringify(data));
    }

    function saveTheme(isDark) { localStorage.setItem('theme', isDark ? 'dark' : 'light'); }
    function saveView(isGrid) { localStorage.setItem('view', isGrid ? 'view-grid' : 'view-list'); }
    function saveHiddenState(isHidden) { localStorage.setItem('isHidden', isHidden); }

    // 3. Восстановление состояния при загрузке
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');
    
    const savedView = localStorage.getItem('view');
    if (savedView) container.className = savedView;

    if (localStorage.getItem('isHidden') === 'true') hobbySection.classList.add('hidden');

    const savedHobbies = JSON.parse(localStorage.getItem('hobbies'));
    if (savedHobbies && savedHobbies.length > 0) {
        container.innerHTML = ''; 
        savedHobbies.forEach(hobby => createHobbyElement(hobby.name, hobby.icon));
    }

    // 4. Вспомогательная функция создания элемента
    function createHobbyElement(name, icon = '✨') {
        const div = document.createElement('div');
        div.className = 'hobby-item';
        div.innerHTML = `
            <span class="hobby-icon">${icon}</span>
            <span class="hobby-name">${name}</span>
            <button class="btn-remove" title="Удалить">✖</button>
        `;
        div.querySelector('.btn-remove').addEventListener('click', () => {
            div.remove();
            saveHobbies(); 
        });
        container.appendChild(div);
    }

    // 5. Обработчики событий (кнопки)
    btnAdd.addEventListener('click', () => {
        const name = prompt('Введите название хобби:');
        if (name && name.trim() !== '') {
            createHobbyElement(name.trim());
            saveHobbies();
        }
    });

    btnTheme.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        saveTheme(isDark);
    });

    btnView.addEventListener('click', () => {
        if (container.classList.contains('view-grid')) {
            container.classList.replace('view-grid', 'view-list');
            saveView(false);
        } else {
            container.classList.replace('view-list', 'view-grid');
            saveView(true);
        }
    });

    btnHide.addEventListener('click', () => {
        const isHidden = hobbySection.classList.toggle('hidden');
        saveHiddenState(isHidden);
    });
    
    // Начальная инициализация кнопок удаления для тех элементов, что были в HTML
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.hobby-item').remove();
            saveHobbies();
        });
    });
});