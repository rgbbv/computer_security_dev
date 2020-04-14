export const getState = (key, port, onSuccessType, onFailureType) => {
    const state = JSON.parse(localStorage.getItem(key));
    if (state) {
        localStorage.removeItem(key);
        port.postMessage({
            type: onSuccessType,
            payload: {state: state}
        })
    } else {
        port.postMessage({
            type: onFailureType,
            payload: {}
        })
    }
};

export const setState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
