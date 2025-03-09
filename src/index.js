import './pages/index.css';
import { api } from './components/api.js';
import { createCard, deleteCard, changeLike, checkStatusLike } from './components/card';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, validationConfig, clearValidation } from './components/validation.js';

// DOM элементы
const cardList = document.querySelector('.places__list');
const popupEditProfile = document.querySelector('.popup_type_edit');
const popupAddNewCard = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const buttonEditAvatar = document.querySelector('.profile__image-button');
const buttonProfileEdit = document.querySelector('.profile__edit-button');
const buttonAddNewCard = document.querySelector('.profile__add-button');
const allPopups = document.querySelectorAll('.popup');
const profileForm = document.forms['edit-profile'];
const formAddCard = document.forms['new-place'];
const formEditAvatar = document.forms['new-avatar'];
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const state = { currentUserId: null };

// Утилита для кнопок с загрузкой: показывает состояние загрузки и возвращает исходный текст
const withLoadingButton = (button, action, initialText = 'Сохранить') => {
    if (!button) return Promise.reject('Кнопка не найдена'); // Проверка на существование кнопки
    const originalText = button.textContent; // Сохраняем текущий текст кнопки
    button.textContent = 'Сохранение...';
    button.disabled = true; // Отключаем кнопку во время загрузки
    return action().finally(() => {
        button.textContent = initialText || originalText; // Восстанавливаем текст
        button.disabled = false; // Включаем кнопку обратно
    });
};

// Обработчики событий для кнопок открытия модальных окон
buttonProfileEdit.addEventListener('click', () => {
    profileForm.elements.name.value = profileTitle.textContent;
    profileForm.elements.description.value = profileDescription.textContent;
    openModal(popupEditProfile);
    clearValidation(profileForm, validationConfig);
});

buttonAddNewCard.addEventListener('click', () => {
    openModal(popupAddNewCard);
    clearValidation(formAddCard, validationConfig);
});

buttonEditAvatar.addEventListener('click', () => {
    openModal(popupEditAvatar);
    clearValidation(formEditAvatar, validationConfig);
});

// Закрытие попапов по клику на оверлей или крестик
allPopups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target === popup) closeModal(popup);
    });
    const closeButton = popup.querySelector('.popup__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => closeModal(popup));
    }
});

// Обновление профиля через форму
function updateProfile(evt) {
    evt.preventDefault();
    const name = profileForm.elements.name.value;
    const about = profileForm.elements.description.value;
    const buttonSubmit = evt.submitter;

    withLoadingButton(buttonSubmit, () => {
        return api.patchProfileInfo(name, about)
            .then((userData) => {
                renderInfo(userData);
                closeModal(popupEditProfile);
            });
    }).catch((err) => console.error('Ошибка обновления профиля:', err));
}

profileForm.addEventListener('submit', updateProfile);

// Создание новой карточки через форму
function createCardHandler(evt) {
    evt.preventDefault();
    const name = formAddCard.elements['place-name'].value;
    const link = formAddCard.elements.link.value;
    const buttonSubmit = evt.submitter;

    withLoadingButton(buttonSubmit, () => {
        return api.postCards(name, link)
            .then((newCard) => {
                cardList.prepend(createCard(newCard, state.currentUserId, handleDelete, handleLike, viewImage));
                formAddCard.reset();
                closeModal(popupAddNewCard);
            });
    }).catch((err) => console.error('Ошибка создания карточки:', err));
}

formAddCard.addEventListener('submit', createCardHandler);

// Инициализация: загрузка данных пользователя и карточек
Promise.all([api.getUserInformation(), api.getCardsList()])
    .then(([userData, cardsData]) => {
        state.currentUserId = userData._id;
        renderInfo(userData);
        renderCards(cardsData, state.currentUserId);
    })
    .catch((err) => console.error('Ошибка инициализации:', err));

// Отображение информации о пользователе
function renderInfo(data) {
    profileTitle.textContent = data.name || ''; // Fallback для отсутствующих данных
    profileDescription.textContent = data.about || '';
    profileAvatar.src = data.avatar || ''; // Пустая строка, если аватар не задан
}

// Вид списка карточек
function renderCards(cardsData, userId) {
    if (!Array.isArray(cardsData)) {
        console.error('cardsData не является массивом:', cardsData);
        return;
    }
    cardsData.forEach((card) => {
        cardList.append(createCard(card, userId, handleDelete, handleLike, viewImage));
    });
}

// Обработка лайка карточки
function handleLike(cardItem, cardId) {
    const likes = JSON.parse(cardItem.dataset.likes || '[]'); // Fallback на пустой массив
    const isLiked = checkStatusLike(likes, state.currentUserId);

    (isLiked ? api.deleteLikeFromCard(cardId) : api.putLikeToCard(cardId))
        .then((res) => {
            changeLike(res.likes, cardItem, state.currentUserId);
            cardItem.dataset.likes = JSON.stringify(res.likes);
        })
        .catch((err) => console.error('Ошибка обработки лайка:', err));
}

// Удаление карточки
function handleDelete(cardItem, cardId) {
    api.deleteCardsFromServer(cardId)
        .then(() => deleteCard(cardItem))
        .catch((err) => console.error('Ошибка удаления карточки:', err));
}

// Просмотр изображения в попапе
function viewImage(imageDescription, imageLink) {
    const image = popupTypeImage.querySelector('.popup__image');
    const caption = popupTypeImage.querySelector('.popup__caption');
    image.src = imageLink || ''; // Fallback на пустую строку
    image.alt = imageDescription || '';
    caption.textContent = imageDescription || '';
    openModal(popupTypeImage);
}

// Обновление аватара на странице
function updateAvatarOnPage(url) {
    profileAvatar.src = url || ''; // Fallback на пустую строку
}

// Обработка формы обновления аватара
function addNewAvatar(evt) {
    evt.preventDefault();
    const link = formEditAvatar.elements.link.value;
    const buttonSubmit = evt.submitter;
    const initialButtonText = buttonSubmit.textContent;

    withLoadingButton(buttonSubmit, () => {
        return api.updateAvatar(link)
            .then((userAvatar) => {
                updateAvatarOnPage(userAvatar.avatar);
                closeModal(popupEditAvatar);
                formEditAvatar.reset();
            });
    }, initialButtonText).catch((err) => console.error('Ошибка обновления аватара:', err));
}

formEditAvatar.addEventListener('submit', addNewAvatar);

// Активация валидации форм
enableValidation(validationConfig);