function handleEscape(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) closeModal(openedPopup);
    }
}

// Ф-ия открытия модального окна
function openModal(modalElement) {
    if (!modalElement) return; // Защита от ошибок
    modalElement.classList.add('popup_is-animated');

    setTimeout(() => {
        modalElement.classList.add('popup_is-opened');
    }, 1);

    document.addEventListener('keydown', handleEscape);
}

// Ф-ия закрытия модального окна
function closeModal(modalElement) {
    if (!modalElement) return; // Защита от ошибок
    modalElement.classList.remove('popup_is-opened');

    modalElement.addEventListener('transitionend', function handler() {
        modalElement.classList.remove('popup_is-animated');
        modalElement.removeEventListener('transitionend', handler);
    });

    document.removeEventListener('keydown', handleEscape);
}

export { openModal, closeModal, handleEscape };