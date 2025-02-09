import './pages/index.css';
import { createCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import { openModal, closeModal } from './components/modal.js';

const placesList = document.querySelector('.places__list');  // DOM узлы
const openPopupProfile = document.querySelector('.profile__edit-button');
const openPopupCard = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Модальные окна и элементы формы
const popupInputName = document.querySelector('.popup__input_type_name');
const popupInputDescription = document.querySelector('.popup__input_type_description');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupNewCardCreation = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const profileForm = document.forms['edit-profile'];
const newPlaceForm = document.forms['new-place'];
const popups = document.querySelectorAll('.popup');


const placeInput = newPlaceForm.querySelector('.popup__input_type_card-name');
const linkInput = newPlaceForm.querySelector('.popup__input_type_url');

// Модальное окно с изображением
const popupContentImage = document.querySelector('.popup__content_content_image');
const imageContent = popupContentImage.querySelector('.popup__image');
const imageCaption = popupContentImage.querySelector('.popup__caption');
const closeButton = popupContentImage.querySelector('.popup__close');

// Изначальные карточки
initialCards.forEach((item) => addCardToPage(item, 'append'));

// Редактирование профиля
function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = popupInputName.value;
    profileDescription.textContent = popupInputDescription.value;
    evt.target.reset();
    closeModal(popupTypeEdit);
}

// Ф-ия открытия popup редактирования профиля
function openProfilePopup() {
    openModal(popupTypeEdit);
    popupInputName.value = profileTitle.textContent;
    popupInputDescription.value = profileDescription.textContent;
}

// Открытие popup для редактирования профиля и создания карточки
openPopupProfile.addEventListener('click', openProfilePopup);
openPopupCard.addEventListener('click', () => openModal(popupNewCardCreation));

// Закрытие popup при клике на оверлей или крестик
popups.forEach((popup) => {
    const closeBtn = popup.querySelector('.popup__close'); // Находим кнопки закрытия в каждом popup
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(popup)); // обработчик на кнопку закрытия
    }
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target.classList.contains('popup_is-opened') || evt.target === closeBtn) {
            closeModal(popup); // Закрытие popup по клику на оверлей или крестик
        }
    });
});

// Ф-ия добавления карточки на страницу
function addCardToPage(item, method = 'prepend') {
    const cardElement = createCard(item, openModal, closeModal, handleImageClick, popupImage);
    placesList[method](cardElement);
}

// Обработчик добавления новой карточки
function addNewCard(evt) {
    evt.preventDefault();
    const newCard = {
        name: placeInput.value,
        link: linkInput.value
    };
    addCardToPage(newCard);
    closeModal(popupNewCardCreation);
    evt.target.reset();
}

// Отправка формы для создания новой карточки
newPlaceForm.addEventListener('submit', addNewCard);

// Отправка формы для редактирования профиля
profileForm.addEventListener('submit', handleProfileFormSubmit);

// Функция для заполнения модального окна данными картинки
function handleImageClick(image, title) {
    imageContent.src = image.src;
    imageContent.alt = image.alt;
    imageCaption.textContent = title.textContent;
    openModal(popupImage);
}


