
// @todo: DOM узлы
// Контейнер для карточек
const placesContainer = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(cardData, handleDeleteCard) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // Значения вложенных элементов
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    cardImage.alt = cardData.name;
    cardImage.src = cardData.link;
    cardTitle.textContent = cardData.name;

    // @todo: Функция удаления карточки
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        handleDeleteCard(cardElement);
    });

    return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove(); // Удаляем карточку из DOM
}

// @todo: Функция добавления карточки на страницу
function addCardToPage(cardData) {
    const cardElement = createCard(cardData, deleteCard);
    placesContainer.append(cardElement); // Добавляем карточку в список
}

// @todo: Вывести карточки на страницу
initialCards.forEach(addCardToPage);