// cart.js - функции для страницы корзины

document.addEventListener('DOMContentLoaded', function () {
    // Загружаем корзину из localStorage
    loadCart();

    // Обработка изменения количества
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.parentElement.querySelector('.quantity-input');
            const change = this.textContent === '+' ? 1 : -1;
            let quantity = parseInt(input.value) + change;

            if (quantity < 1) quantity = 1;
            if (quantity > 10) quantity = 10;

            input.value = quantity;
            updateCartTotal();
            saveCart();
        });
    });

    // Обработка удаления товаров
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const itemId = this.dataset.itemId;
            removeFromCart(itemId);
        });
    });

    // Обработка оформления заказа
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            if (!email || !phone) {
                alert('Пожалуйста, заполните email и телефон');
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Корзина пуста');
                return;
            }

            // Создаем заказ
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                items: cart,
                total: calculateCartTotal(),
                email: email,
                phone: phone,
                status: 'Новый'
            };

            // Сохраняем заказ
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Очищаем корзину
            localStorage.removeItem('cart');

            alert('Заказ успешно оформлен! Номер заказа: ' + order.id);
            window.location.href = 'account.html';
        });
    }
});

// Загрузка корзины
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-table tbody');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <p>Корзина пуста</p>
                    <a href="index.html#all-services" class="buy-button">Перейти в каталог</a>
                </td>
            </tr>
        `;
        updateCartTotal();
        return;
    }

    let html = '';
    cart.forEach(item => {
        html += `
            <tr>
                <td class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                    </div>
                </td>
                <td class="cart-item-price">${item.price} руб.</td>
                <td class="cart-item-quantity">
                    <button class="quantity-btn">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn">+</button>
                </td>
                <td class="cart-item-total">${item.price * item.quantity} руб.</td>
                <td>
                    <button class="remove-btn" data-item-id="${item.id}">Удалить</button>
                </td>
            </tr>
        `;
    });

    cartContainer.innerHTML = html;
    updateCartTotal();
}

// Обновление общей суммы
function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    document.querySelectorAll('.cart-item-total').forEach((el, index) => {
        if (cart[index]) {
            el.textContent = cart[index].price * cart[index].quantity + ' руб.';
        }
    });

    const totalElement = document.querySelector('.summary-row:last-child .summary-value');
    if (totalElement) {
        totalElement.textContent = total + ' руб.';
    }
}

// Сохранение корзины
function saveCart() {
    const cart = [];
    document.querySelectorAll('.cart-table-row').forEach(row => {
        const name = row.querySelector('.cart-item-title').textContent;
        const price = parseInt(row.querySelector('.cart-item-price').textContent);
        const quantity = parseInt(row.querySelector('.quantity-input').value);
        const image = row.querySelector('.cart-item-image').src.split('/').pop();

        cart.push({
            id: generateServiceId(name),
            name: name,
            price: price,
            quantity: quantity,
            image: 'img/' + image
        });
    });

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Удаление из корзины
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}