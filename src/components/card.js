// Функция создания карточки: создает DOM-элемент карточки на основе данных и добавляет обработчики событий
export function createCard(card, currentUserId, removeCard, likeTheCard, viewingCard) {
    // Проверяем, что данные карточки корректны (имя, ссылка, лайки, владелец)
    if (!card || !card.name || !card.link || !card.owner) {
        console.error('Некорректные данные карточки:', card);
        return null; // Возвращаем null, если данные некорректны, чтобы избежать ошибок
    }

    // Находим шаблон карточки в HTML и клонируем его для создания новой карточки
    const cardTemplate = document.querySelector('#card-template').content; // Шаблон из <template>
    const cardItem = cardTemplate.querySelector('.places__item').cloneNode(true); // Копия элемента карточки

    // Кэшируем элементы DOM, чтобы не искать их повторно
    const cardImage = cardItem.querySelector('.card__image'); // Изображение карточки
    const cardTitle = cardItem.querySelector('.card__title'); // Название карточки
    const numberOfLikes = cardItem.querySelector('.number-of-likes'); // Счетчик лайков
    const deleteButton = cardItem.querySelector('.card__delete-button'); // Кнопка удаления
    const likeButton = cardItem.querySelector('.card__like-button'); // Кнопка лайка

    // Сохраняем лайки в dataset, с проверкой на undefined/null — если лайков нет, используем пустой массив
    cardItem.dataset.likes = JSON.stringify(card.likes || []);

    // Заполняем карточку данными из объекта card
    cardTitle.textContent = card.name; // Устанавливаем название карточки
    cardImage.src = card.link; // Устанавливаем ссылку на изображение
    cardImage.alt = card.name; // Устанавливаем альтернативный текст для изображения
    // Устанавливаем количество лайков, с проверкой на случай отсутствия card.likes
    numberOfLikes.textContent = card.likes ? card.likes.length : 0;

    // Проверяем, является ли текущий пользователь владельцем карточки
    if (card.owner._id === currentUserId) {
        deleteButton.style.display = 'block'; // Показываем кнопку удаления, если карточка принадлежит пользователю
        // Добавляем обработчик клика на кнопку удаления, вызывает функцию removeCard с элементом и ID карточки
        deleteButton.addEventListener('click', () => removeCard(cardItem, card._id));
    }

    // Проверяем, лайкнул ли текущий пользователь карточку, если да — активируем кнопку лайка
    if (checkStatusLike(card.likes || [], currentUserId)) {
        likeButton.classList.add('card__like-button_is-active'); // Добавляем класс активного состояния
    }

    // Добавляем обработчик клика на кнопку лайка, вызывает функцию likeTheCard с элементом и ID карточки
    likeButton.addEventListener('click', () => likeTheCard(cardItem, card._id));
    // Добавляем обработчик клика на изображение, вызывает функцию viewingCard с именем и ссылкой
    cardImage.addEventListener('click', () => viewingCard(card.name, card.link));

    // Возвращаем готовый элемент карточки для добавления на страницу
    return cardItem;
}

// Функция удаления карточки: удаляет элемент карточки из DOM
export function deleteCard(cardItem) {
    // Проверяем, существует ли элемент и его родитель, чтобы избежать ошибок при удалении
    if (cardItem && cardItem.parentNode) {
        cardItem.remove(); // Удаляем элемент из DOM
    }
}

// Функция обновления лайков: обновляет состояние кнопки лайка и счетчик лайков
export function changeLike(likes, cardItem, currentUserId) {
    // Находим элементы кнопки лайка и счетчика внутри cardItem
    const likeButton = cardItem.querySelector('.card__like-button'); // Кнопка лайка
    const numberOfLikes = cardItem.querySelector('.number-of-likes'); // Счетчик лайков

    // Обновляем текст счетчика лайков на основе переданного массива likes
    numberOfLikes.textContent = likes.length;
    // Переключаем класс активности кнопки лайка в зависимости от того, лайкнул ли пользователь карточку
    likeButton.classList.toggle('card__like-button_is-active', checkStatusLike(likes, currentUserId));
    // Обновляем dataset.likes для последующего использования
    cardItem.dataset.likes = JSON.stringify(likes);
}

// Функция проверки статуса лайка: определяет, лайкнул ли текущий пользователь карточку
export function checkStatusLike(likes, currentUserId) {
    // Проверяем, что likes — массив, и currentUserId задан, чтобы избежать ошибок
    if (!Array.isArray(likes) || !currentUserId) return false;
    // Проверяем, есть ли в массиве лайков пользователь с ID текущего пользователя
    return !!likes.find((user) => user._id === currentUserId); // Возвращаем true, если лайк есть
}