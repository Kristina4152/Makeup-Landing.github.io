// main.js - специфичные функции для главной страницы

// Функция для прокрутки к якорю с учетом фиксированной шапки
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Учитываем высоту фиксированной шапки
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация при прокрутке
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');

    // Добавляем тень к шапке при прокрутке
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }

    // Анимация для секций
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Инициализация анимаций
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Запускаем анимацию при загрузке
    setTimeout(() => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }, 100);
});

// Обработка кнопок "Подробнее" в разделе "Все услуги"
document.querySelectorAll('.service-card .buy-button').forEach(button => {
    button.addEventListener('click', function (e) {
        if (this.textContent === 'Подробнее') {
            e.preventDefault();
            const serviceCard = this.closest('.service-card');
            const serviceName = serviceCard.querySelector('h3').textContent;
            const servicePrice = serviceCard.querySelector('p').textContent;
            const serviceImage = serviceCard.querySelector('img').src;

            // Показываем модальное окно с подробной информацией
            showServiceModal(serviceName, servicePrice, serviceImage);
        }
    });
});

// Функция показа модального окна с услугой
function showServiceModal(name, price, image) {
    const modalHTML = `
        <div class="service-modal-overlay">
            <div class="service-modal">
                <button class="close-modal">&times;</button>
                <div class="modal-content">
                    <img src="${image}" alt="${name}">
                    <div class="modal-info">
                        <h3>${name}</h3>
                        <p class="modal-price">${price}</p>
                        <div class="modal-description">
                            ${getServiceDescription(name)}
                        </div>
                        <button class="modal-buy-button">Добавить в корзину</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
        .service-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .service-modal {
            background: #4a332d;
            border-radius: 15px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        .service-modal .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            z-index: 1001;
        }
        .modal-content {
            display: flex;
            flex-direction: column;
            padding: 30px;
        }
        .modal-content img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .modal-info h3 {
            color: white;
            margin-bottom: 10px;
            font-size: 24px;
        }
        .modal-price {
            color: #ffd700;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .modal-description {
            color: rgba(255,255,255,0.8);
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .modal-buy-button {
            background: #d87f7f;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
        }
        @media (min-width: 768px) {
            .modal-content {
                flex-direction: row;
                gap: 30px;
            }
            .modal-content img {
                width: 40%;
                height: auto;
            }
        }
    `;
    document.head.appendChild(style);

    // Обработчики событий
    document.querySelector('.service-modal-overlay').addEventListener('click', function (e) {
        if (e.target === this || e.target.classList.contains('close-modal')) {
            this.remove();
            style.remove();
        }
    });

    document.querySelector('.modal-buy-button').addEventListener('click', function () {
        const serviceId = generateServiceId(name);
        const priceNum = parseInt(price.replace(/\D/g, ''));
        addToCart(serviceId, name, priceNum);
        document.querySelector('.service-modal-overlay').remove();
        style.remove();
    });
}

// Получение описания услуги
function getServiceDescription(serviceName) {
    const descriptions = {
        'Перманентный макияж бровей': `
            <p>Идеальное решение для тех, кто устал ежедневно подводить брови. 
            Наша техника позволяет создать естественную форму, подчеркивающую вашу природную красоту.</p>
            <ul>
                <li>Длительность процедуры: 2-3 часа</li>
                <li>Эффект сохраняется: 1-2 года</li>
                <li>Безопасные пигменты</li>
                <li>Индивидуальный подбор цвета</li>
            </ul>
        `,
        'Перманентный макияж губ': `
            <p>Забудьте о помаде и блесках! С нашим перманентным макияжем губ вы всегда будете выглядеть безупречно.</p>
            <ul>
                <li>Коррекция контура губ</li>
                <li>Насыщенный цвет на 1-3 года</li>
                <li>Восстановление после процедуры: 7-10 дней</li>
                <li>Подбор цвета под ваш цветотип</li>
            </ul>
        `,
        'Межресничный татуаж': `
            <p>Создайте эффект густых ресниц без туши! Межресничный татуаж — идеальное решение для ежедневного макияжа.</p>
            <ul>
                <li>Естественное усиление взгляда</li>
                <li>Процедура занимает 1.5-2 часа</li>
                <li>Эффект сохраняется 1-2 года</li>
                <li>Не требует особого ухода</li>
            </ul>
        `
    };

    return descriptions[serviceName] || `
        <p>Подробное описание услуги. Наши мастера используют только качественные материалы 
        и современное оборудование. Каждая процедура выполняется с учетом индивидуальных особенностей клиента.</p>
        <p>Длительность эффекта: 1-3 года в зависимости от типа кожи и ухода.</p>
    `;
}