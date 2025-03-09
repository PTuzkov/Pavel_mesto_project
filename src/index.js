import './pages/index.css'; // Импорт стилей
import { api } from './components/api.js'; // Импорт API
import {
    createCard,
    deleteCard,
    changeLike,
    checkStatusLike,
    handleLike,
    handleDelete
} from './components/card.js'; // Импорт функций работы с карточками
import { openModal, closeModal } from './components/modal.js'; // Импорт функций модальных окон
import { enableValidation, clearValidation } from './components/validation.js'; // Импорт валидации

// Конфигурация валидации, специфичная для этого проекта
const validationConfig = {
    popupForm: '.popup__form',
    popupInput: '.popup__input',
    popupButton: '.popup__button',
    popupButtonDisabled: 'popup__button_disabled',
    popupInputError: 'popup__input_type_error',
    popupErrorVisible: 'popup__error_visible'
};

// DOM элементы
const cardList = document.querySelector('.places__list'); // Список карточек
const popupEditProfile = document.querySelector('.popup_type_edit'); // Попап редактирования профиля
const popupAddNewCard = document.querySelector('.popup_type_new-card'); // Попап добавления карточки
const popupTypeImage = document.querySelector('.popup_type_image'); // Попап просмотра изображения
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar'); // Попап редактирования аватара
const buttonEditAvatar = document.querySelector('.profile__image-button'); // Кнопка редактирования аватара
const buttonProfileEdit = document.querySelector('.profile__edit-button'); // Кнопка редактирования профиля
const buttonAddNewCard = document.querySelector('.profile__add-button'); // Кнопка добавления карточки
const allPopups = document.querySelectorAll('.popup'); // Все попапы
const profileForm = document.forms['edit-profile']; // Форма редактирования профиля
const formAddCard = document.forms['new-place']; // Форма добавления карточки
const formEditAvatar = document.forms['new-avatar']; // Форма редактирования аватара
const profileTitle = document.querySelector('.profile__title'); // Заголовок профиля
const profileDescription = document.querySelector('.profile__description'); // Описание профиля
const profileAvatar = document.querySelector('.profile__image'); // Аватар профиля

const state = { currentUserId: null }; // Состояние приложения с ID текущего пользователя

// Утилита для кнопок с загрузкой: показывает состояние загрузки и возвращает исходный текст
const withLoadingButton = (button, action, initialText = 'Сохранить') => {
    if (!button) return Promise.reject('Кнопка не найдена'); // Проверка на существование кнопки
    const originalText = button.textContent; // Сохраняем текущий текст кнопки
    button.textContent = 'Сохранение...'; // Устанавливаем текст загрузки
    button.disabled = true; // Отключаем кнопку во время загрузки
    return action().finally(() => {
        button.textContent = initialText || originalText; // Восстанавливаем текст
        button.disabled = false; // Включаем кнопку обратно
    });
};

// Обработчики событий для кнопок открытия модальных окон
buttonProfileEdit.addEventListener('click', () => {
    profileForm.elements.name.value = profileTitle.textContent; // Заполняем поле имени
    profileForm.elements.description.value = profileDescription.textContent; // Заполняем поле описания
    openModal(popupEditProfile); // Открываем попап
    clearValidation(profileForm, validationConfig); // Очищаем валидацию, передаем validationConfig
});

buttonAddNewCard.addEventListener('click', () => {
    openModal(popupAddNewCard); // Открываем попап
    clearValidation(formAddCard, validationConfig); // Очищаем валидацию, передаем validationConfig
});

buttonEditAvatar.addEventListener('click', () => {
    openModal(popupEditAvatar); // Открываем попап
    clearValidation(formEditAvatar, validationConfig); // Очищаем валидацию, передаем validationConfig
});

// Закрытие попапов по клику на оверлей или крестик
allPopups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target === popup) closeModal(popup); // Закрываем при клике на оверлей
    });
    const closeButton = popup.querySelector('.popup__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => closeModal(popup)); // Закрываем при клике на крестик
    }
});

// Обновление профиля через форму
function updateProfile(evt) {
    evt.preventDefault(); // Предотвращаем стандартную отправку формы
    const name = profileForm.elements.name.value; // Получаем имя
    const about = profileForm.elements.description.value; // Получаем описание
    const buttonSubmit = evt.submitter; // Кнопка отправки формы

    withLoadingButton(buttonSubmit, () => {
        return api.patchProfileInfo(name, about) // Отправляем запрос на сервер
            .then((userData) => {
                renderInfo(userData); // Обновляем данные на странице
                closeModal(popupEditProfile); // Закрываем попап
            });
    }).catch((err) => console.error('Ошибка обновления профиля:', err));
}

profileForm.addEventListener('submit', updateProfile); // Привязываем обработчик к форме

// Создание новой карточки через форму
function createCardHandler(evt) {
    evt.preventDefault(); // Предотвращаем стандартную отправку формы
    const name = formAddCard.elements['place-name'].value; // Получаем название места
    const link = formAddCard.elements.link.value; // Получаем ссылку
    const buttonSubmit = evt.submitter; // Кнопка отправки формы

    withLoadingButton(buttonSubmit, () => {
        return api.postCards(name, link) // Отправляем запрос на сервер
            .then((newCard) => {
                cardList.prepend(
                    createCard(
                        newCard,
                        state.currentUserId,
                        (cardItem, cardId) => handleDelete(api, cardItem, cardId),
                        (cardItem, cardId) => handleLike(api, cardItem, cardId, state.currentUserId),
                        viewImage
                    )
                ); // Добавляем новую карточку в начало списка
                formAddCard.reset(); // Сбрасываем форму
                closeModal(popupAddNewCard); // Закрываем попап
            });
    }).catch((err) => console.error('Ошибка создания карточки:', err));
}

formAddCard.addEventListener('submit', createCardHandler); // Привязываем обработчик к форме

// Инициализация: загрузка данных пользователя и карточек
Promise.all([api.getUserInformation(), api.getCardsList()])
    .then(([userData, cardsData]) => {
        state.currentUserId = userData._id; // Сохраняем ID пользователя
        renderInfo(userData); // Отображаем информацию о пользователе
        renderCards(cardsData, state.currentUserId); // Отображаем карточки
    })
    .catch((err) => console.error('Ошибка инициализации:', err));

// Отображение информации о пользователе
function renderInfo(data) {
    profileTitle.textContent = data.name || ''; // Устанавливаем имя, с fallback на пустую строку
    profileDescription.textContent = data.about || ''; // Устанавливаем описание
    profileAvatar.src = data.avatar || ''; // Устанавливаем аватар
}

// Отображение списка карточек
function renderCards(cardsData, userId) {
    if (!Array.isArray(cardsData)) {
        console.error('cardsData не является массивом:', cardsData);
        return;
    }
    cardsData.forEach((card) => {
        cardList.append(
            createCard(
                card,
                userId,
                (cardItem, cardId) => handleDelete(api, cardItem, cardId), // Передаем handleDelete
                (cardItem, cardId) => handleLike(api, cardItem, cardId, userId), // Передаем handleLike
                viewImage
            )
        ); // Добавляем карточку в список
    });
}

// Просмотр изображения в попапе
function viewImage(imageDescription, imageLink) {
    const image = popupTypeImage.querySelector('.popup__image'); // Элемент изображения
    const caption = popupTypeImage.querySelector('.popup__caption'); // Подпись
    image.src = imageLink || ''; // Устанавливаем ссылку
    image.alt = imageDescription || ''; // Устанавливаем alt
    caption.textContent = imageDescription || ''; // Устанавливаем подпись
    openModal(popupTypeImage); // Открываем попап
}

// Обновление аватара на странице
function updateAvatarOnPage(url) {
    profileAvatar.src = url || ''; // Устанавливаем новый аватар, с fallback
}

// Обработка формы обновления аватара
function addNewAvatar(evt) {
    evt.preventDefault(); // Предотвращаем стандартную отправку формы
    const link = formEditAvatar.elements.link.value; // Получаем ссылку на аватар
    const buttonSubmit = evt.submitter; // Кнопка отправки формы
    const initialButtonText = buttonSubmit.textContent; // Сохраняем исходный текст кнопки

    withLoadingButton(buttonSubmit, () => {
        return api.updateAvatar(link) // Отправляем запрос на сервер
            .then((userAvatar) => {
                updateAvatarOnPage(userAvatar.avatar); // Обновляем аватар на странице
                closeModal(popupEditAvatar); // Закрываем попап
                formEditAvatar.reset(); // Сбрасываем форму
            });
    }, initialButtonText).catch((err) => console.error('Ошибка обновления аватара:', err));
}

formEditAvatar.addEventListener('submit', addNewAvatar); // Привязываем обработчик к форме

// Активация валидации форм
enableValidation(validationConfig); // Запускаем валидацию для всех форм, передаем validationConfig