// Функция создания карточки
function createCard(item, openModal, closeModal, handleImageClick) {
    const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');  // Получаем темплейт карточки
    const card = cardTemplate.cloneNode(true);
    const cardImage = card.querySelector('.card__image');
    const cardDescription = card.querySelector('.card__description');
    const cardTitle = cardDescription.querySelector('.card__title');
    const cardLikeButton = cardDescription.querySelector('.card__like-button');
    const cardDeleteButton = card.querySelector('.card__delete-button');

    // Настройка содержимого карточки
    cardTitle.textContent = item.name;
    cardImage.src = item.link;
    cardImage.alt = item.name;

    // Обработчики событий
    cardImage.addEventListener('click', () => handleImageClick(cardImage, cardTitle, openModal));
    cardDeleteButton.addEventListener('click', () => deleteCard(card));
    cardLikeButton.addEventListener('click', toggleLike);

    return card;
}

// Функция удаления карточки
function deleteCard(card) {
    card.remove();
}

// Функция добавления лайка
function toggleLike(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard };

