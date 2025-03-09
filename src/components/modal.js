// Обработчик нажатия Escape: закрывает открытое модальное окно при нажатии клавиши Escape
function handleEscape(evt) {
    if (evt.key !== 'Escape') return; // Выходим, если нажата не Escape
    const openedPopup = document.querySelector('.popup_is-opened');
    // Проверяем, существует ли открытый попап, перед закрытием
    if (openedPopup) {
        closeModal(openedPopup);
    }
}

// Проверка модального элемента: убеждается, что элемент передан, иначе выбрасывает ошибку
const ensureModalElement = (modalElement) => {
    if (!modalElement) {
        throw new Error('Модальный элемент не передан'); // Ошибка, если элемент не задан
    }
    // Дополнительная проверка, что это DOM-элемент
    if (!(modalElement instanceof HTMLElement)) {
        throw new Error('Передан некорректный модальный элемент');
    }
    return modalElement;
};

// Функция открытия модального окна: добавляет класс открытия и слушатель Escape
function openModal(modalElement) {
    const modal = ensureModalElement(modalElement); // Проверяем элемент
    // Проверяем, не открыт ли уже попап, чтобы избежать дублирования слушателей
    if (!modal.classList.contains('popup_is-opened')) {
        modal.classList.add('popup_is-opened');
        document.addEventListener('keydown', handleEscape);
    }
}

// Функция закрытия модального окна: убирает класс открытия и слушатель Escape
function closeModal(modalElement) {
    const modal = ensureModalElement(modalElement); // Проверяем элемент
    // Проверяем, открыт ли попап, чтобы не удалять несуществующий слушатель
    if (modal.classList.contains('popup_is-opened')) {
        modal.classList.remove('popup_is-opened');
        document.removeEventListener('keydown', handleEscape);
    }
}

export { openModal, closeModal, handleEscape };