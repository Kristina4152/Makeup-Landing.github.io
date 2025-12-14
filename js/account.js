// account.js - функции для личного кабинета

document.addEventListener('DOMContentLoaded', function () {
    // Загружаем данные пользователя
    loadUserData();

    // Загружаем заказы пользователя
    loadUserOrders();

    // Обработка формы сохранения данных
    const userDataForm = document.getElementById('userDataFormElement');
    if (userDataForm) {
        userDataForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const userData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthDate: document.getElementById('birthDate').value,
                city: document.getElementById('city').value,
                address: document.getElementById('address').value
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('username', userData.firstName);

            showNotification('Данные успешно сохранены!');
        });
    }

    // Переключение между разделами
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function () {
            const action = this.dataset.action;
            showSection(action);
        });
    });
});

// Загрузка данных пользователя
function loadUserData() {
    const savedData = localStorage.getItem('userData');
    const username = localStorage.getItem('username');

    if (savedData) {
        const data = JSON.parse(savedData);

        if (document.getElementById('firstName')) {
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('birthDate').value = data.birthDate || '';
            document.getElementById('city').value = data.city || '';
            document.getElementById('address').value = data.address || '';
        }

        // Обновляем приветствие
        const welcomeTitle = document.querySelector('.welcome-title');
        if (welcomeTitle && username) {
            welcomeTitle.textContent = `Добрый день, ${username}!`;
        }
    }
}

// Загрузка заказов пользователя
function loadUserOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.getElementById('recentOrders');

    if (!ordersContainer) return;

    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <p>У вас еще нет заказов</p>
                <a href="index.html#all-services" class="buy-button">Перейти в каталог</a>
            </div>
        `;
        return;
    }

    // Показываем последние 3 заказа
    const recentOrders = orders.slice(-3).reverse();

    let html = '';
    recentOrders.forEach(order => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const date = new Date(order.date).toLocaleDateString();

        html += `
            <div class="order-item">
                <div class="order-service">${order.items[0].name}${order.items.length > 1 ? ` и еще ${order.items.length - 1}` : ''}</div>
                <div class="order-date">${date}</div>
                <div class="order-status status-${getStatusClass(order.status)}">${order.status}</div>
                <div class="order-price">${total} руб.</div>
            </div>
        `;
    });

    ordersContainer.innerHTML = html;
}

// Получение класса для статуса
function getStatusClass(status) {
    const classes = {
        'Новый': 'pending',
        'Подтвержден': 'pending',
        'Выполнен': 'completed',
        'Отменен': 'cancelled'
    };
    return classes[status] || 'pending';
}

// Показать раздел
function showSection(sectionId) {
    // Скрыть все разделы
    document.querySelectorAll('.account-section').forEach(section => {
        section.style.display = 'none';
    });

    // Показать выбранный раздел
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';

        // Прокрутить к разделу
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}