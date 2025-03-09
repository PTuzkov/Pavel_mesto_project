// Конфигурация валидации: содержит классы и селекторы для работы с формами
export const validationConfig = {
    popupForm: '.popup__form',
    popupInput: '.popup__input',
    popupButton: '.popup__button',
    popupButtonDisabled: 'popup__button_disabled',
    popupInputError: 'popup__input_type_error',
    popupErrorVisible: 'popup__error_visible'
};

// Показ ошибки ввода: добавляет сообщение об ошибке и стили для невалидного поля
const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    // Проверяем, существует ли errorElement, чтобы избежать ошибок
    if (errorElement) {
        inputElement.classList.add(validationConfig.popupInputError);
        errorElement.textContent = errorMessage;
        errorElement.classList.add(validationConfig.popupErrorVisible);
    } else {
        console.warn(`Элемент ошибки для ${inputElement.id} не найден`);
    }
};

// Скрытие ошибки ввода: убирает сообщение об ошибке и стили для поля
const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    // Проверяем, существует ли errorElement
    if (errorElement) {
        inputElement.classList.remove(validationConfig.popupInputError);
        errorElement.classList.remove(validationConfig.popupErrorVisible);
        errorElement.textContent = '';
    }
};

// Проверка валидности поля: определяет, валидно ли поле, и показывает/скрывает ошибку
const checkInputValidity = (formElement, inputElement) => {
    // Устанавливаем кастомное сообщение для ошибки при несовпадении с паттерном
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage || ''); // Fallback на пустую строку
    } else {
        inputElement.setCustomValidity('');
    }

    // Показываем или скрываем ошибку в зависимости от валидности
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
        hideInputError(formElement, inputElement);
    }
};

// Установка слушателей событий: добавляет обработчики на поля ввода и управляет кнопкой
const setEventListeners = (formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.popupInput));
    const buttonElement = formElement.querySelector(validationConfig.popupButton);

    // Проверяем, что элементы найдены
    if (!inputList.length || !buttonElement) {
        console.warn('Не найдены поля ввода или кнопка в форме:', formElement);
        return;
    }

    // Изначально устанавливаем состояние кнопки
    toggleButtonState(inputList, buttonElement);

    // Добавляем слушатели на каждое поле ввода
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement);
            toggleButtonState(inputList, buttonElement);
        });
    });
};

// Включение валидации: активирует валидацию для всех форм на странице
export const enableValidation = () => {
    const formList = Array.from(document.querySelectorAll(validationConfig.popupForm));

    // Проверяем, найдены ли формы
    if (!formList.length) {
        console.warn('Формы с классом', validationConfig.popupForm, 'не найдены');
        return;
    }

    formList.forEach((formElement) => {
        setEventListeners(formElement);
    });
};

// Проверка наличия невалидных полей: возвращает true, если хотя бы одно поле невалидно
const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Переключение состояния кнопки: активирует/деактивирует кнопку в зависимости от валидности
const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
        buttonElement.classList.add(validationConfig.popupButtonDisabled);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(validationConfig.popupButtonDisabled);
    }
};

// Очистка валидации: скрывает ошибки и обновляет состояние кнопки
export const clearValidation = (formElement, validationConfig) => {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.popupInput));
    const buttonElement = formElement.querySelector(validationConfig.popupButton);

    // Проверяем, что элементы найдены
    if (!inputList.length || !buttonElement) {
        console.warn('Не найдены поля ввода или кнопка для очистки валидации:', formElement);
        return;
    }

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement);
    });

    toggleButtonState(inputList, buttonElement);
};