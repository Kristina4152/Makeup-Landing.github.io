// common.js - общие функции для всех страниц

// Проверка авторизации пользователя
function checkUserAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // Обновляем навигацию для авторизованного пользователя
        updateNavigationForUser(username);
    }
    return isLoggedIn === 'true';
}

// Обновление навигации для авторизованного пользователя
function updateNavigationForUser(username) {
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    loginLinks.forEach(link => {
        link.textContent = username;
        link.href = 'account.html';
        link.title = 'Личный кабинет';
    });

    // Добавляем кнопку выхода
    const navElements = document.querySelectorAll('.center-nav, .footer-nav');
    navElements.forEach(nav => {
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Выйти';
        logoutLink.classList.add('logout-link');
        logoutLink.onclick = logoutUser;
        nav.appendChild(logoutLink);
    });
}

// Выход пользователя
function logoutUser() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        window.location.reload();
    }
    return false;
}

// Добавление товара в корзину
function addToCart(serviceId, serviceName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = cart.find(item => item.id === serviceId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: serviceId,
            name: serviceName,
            price: price,
            quantity: 1,
            image: getServiceImage(serviceId)
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification('Товар добавлен в корзину!');
}

// Обновление счетчика корзины
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Обновляем счетчик в навигации
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach(link => {
        if (totalItems > 0) {
            link.innerHTML = `Корзина <span class="cart-counter">(${totalItems})</span>`;
        } else {
            link.innerHTML = 'Корзина';
        }
    });

    return totalItems;
}

// Получение изображения услуги по ID
function getServiceImage(serviceId) {
    const serviceImages = {
        1: 'img/brows1.jpg',
        2: 'img/губы основа.jpg',
        3: 'img/брови1.jpg',
        4: 'img/отзыв1.jpg',
        5: 'img/отзыв2.jpg',
        6: 'img/отзыв.jpg'
    };
    return serviceImages[serviceId] || 'img/логотип.jpg';
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    .cart-counter {
        background: #d87f7f;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
        margin-left: 5px;
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    checkUserAuth();
    updateCartCounter();

    // Обработка кнопок "Купить" на главной странице
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function () {
            const serviceCard = this.closest('.service-card, .service-item');
            if (serviceCard) {
                const serviceName = serviceCard.querySelector('h3').textContent;
                const priceText = serviceCard.querySelector('.price, p').textContent;
                const price = parseInt(priceText.replace(/\D/g, ''));

                // Генерируем ID на основе названия услуги
                const serviceId = generateServiceId(serviceName);

                addToCart(serviceId, serviceName, price);
            }
        });
    });

    // Обработка формы обратной связи
    const feedbackForm = document.querySelector('.feedback-form form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value,
                date: new Date().toISOString()
            };

            // Сохраняем в localStorage
            let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
            feedbacks.push(formData);
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

            showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
});

// Генерация ID услуги
function generateServiceId(serviceName) {
    const serviceIds = {
        'Перманентный макияж бровей': 1,
        'Перманентный макияж губ': 2,
        'Межресничный татуаж': 3,
        'Коррекция перманента': 4,
        'Удаление татуажа': 5,
        'Консультация мастера': 6
    };
    return serviceIds[serviceName] || Date.now();
}

// Маска для телефона
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    });
}

// Инициализация масок телефона
document.addEventListener('DOMContentLoaded', initPhoneMask);