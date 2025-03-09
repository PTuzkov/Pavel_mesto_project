const serverConfig = {
    baseUrl: 'https://nomoreparties.co/v1/wff-cohort-33',
    headers: {
        authorization: '0751e13a-65ed-4fcb-9f2e-fc2a96554027',
        "Content-Type": "application/json"
    }
};

const handleResponse = async (response) => {
    if (response.ok) {
        try {
            return await response.json();
        } catch (error) {
            return Promise.reject(`Ошибка разбора JSON: ${error.message}`);
        }
    }
    return response.text().then((text) => {
        return Promise.reject(`Ошибка: ${response.status} - ${text || 'Нет дополнительной информации'}`);
    });
};

const makeRequest = (endpoint, options = {}) => {
    return fetch(`${serverConfig.baseUrl}${endpoint}`, {
        headers: serverConfig.headers,
        ...options
    }).then(handleResponse);
};

// Получаем данные пользователя с сервера
const getUserInformation = () => {
    return makeRequest('/users/me');
};

// Загружаем карточки с сервера
export const getCardsList = () => {
    return makeRequest('/cards');
};

// Редактирование профиля
const patchProfileInfo = (name, about) => {
    return makeRequest('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
            name: name,
            about: about
        })
    });
};

// Добавление новой карточки на сервер
const postCards = (name, link) => {
    return makeRequest('/cards', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            link: link
        })
    });
};

// Лайк карточки
const putLikeToCard = (cardId) => {
    return makeRequest(`/cards/likes/${cardId}`, {
        method: 'PUT'
    });
};

// Убрать лайк с карточки
const deleteLikeFromCard = (cardId) => {
    return makeRequest(`/cards/likes/${cardId}`, {
        method: 'DELETE'
    });
};

// Удаление карточки с сервера
const deleteCardsFromServer = (cardId) => {
    return makeRequest(`/cards/${cardId}`, {
        method: 'DELETE'
    });
};

// Обновление аватара профиля
const updateAvatar = (link) => {
    return makeRequest('/users/me/avatar', {
        method: 'PATCH',
        body: JSON.stringify({
            avatar: link
        })
    });
};

export const api = {
    getUserInformation: getUserInformation,
    getCardsList: getCardsList,
    patchProfileInfo: patchProfileInfo,
    postCards: postCards,
    putLikeToCard: putLikeToCard,
    deleteLikeFromCard: deleteLikeFromCard,
    deleteCardsFromServer: deleteCardsFromServer,
    updateAvatar: updateAvatar
};