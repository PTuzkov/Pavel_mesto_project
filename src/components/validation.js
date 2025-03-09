// Показ ошибки ввода
const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (errorElement) {
        inputElement.classList.add(validationConfig.popupInputError);
        errorElement.textContent = errorMessage;
        errorElement.classList.add(validationConfig.popupErrorVisible);
    } else {
        console.warn(`Элемент ошибки для ${inputElement.id} не найден`);
    }
};

// Скрытие ошибки ввода
const hideInputError = (formElement, inputElement, validationConfig) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (errorElement) {
        inputElement.classList.remove(validationConfig.popupInputError);
        errorElement.classList.remove(validationConfig.popupErrorVisible);
        errorElement.textContent = '';
    }
};

// Проверка валидности поля
const checkInputValidity = (formElement, inputElement, validationConfig) => {
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage || '');
    } else {
        inputElement.setCustomValidity('');
    }

    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
    } else {
        hideInputError(formElement, inputElement, validationConfig);
    }
};

// Установка слушателей событий
const setEventListeners = (formElement, validationConfig) => {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.popupInput));
    const buttonElement = formElement.querySelector(validationConfig.popupButton);

    if (!inputList.length || !buttonElement) {
        console.warn('Не найдены поля ввода или кнопка в форме:', formElement);
        return;
    }

    toggleButtonState(inputList, buttonElement, validationConfig);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, validationConfig);
            toggleButtonState(inputList, buttonElement, validationConfig);
        });
    });
};

// Включение валидации
export const enableValidation = (validationConfig) => {
    const formList = Array.from(document.querySelectorAll(validationConfig.popupForm));

    if (!formList.length) {
        console.warn('Формы с классом', validationConfig.popupForm, 'не найдены');
        return;
    }

    formList.forEach((formElement) => {
        setEventListeners(formElement, validationConfig);
    });
};

// Проверка наличия невалидных полей
const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Переключение состояния кнопки
const toggleButtonState = (inputList, buttonElement, validationConfig) => {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
        buttonElement.classList.add(validationConfig.popupButtonDisabled);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(validationConfig.popupButtonDisabled);
    }
};

// Очистка валидации
export const clearValidation = (formElement, validationConfig) => {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.popupInput));
    const buttonElement = formElement.querySelector(validationConfig.popupButton);

    if (!inputList.length || !buttonElement) {
        console.warn('Не найдены поля ввода или кнопка для очистки валидации:', formElement);
        return;
    }

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, validationConfig);
    });

    toggleButtonState(inputList, buttonElement, validationConfig);
};