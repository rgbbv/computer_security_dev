import {authenticateUserPasswords} from "./UserService";

export const getState = (key, port, onSuccessType, onFailureType, getAndDelete) => {
    let state = JSON.parse(localStorage.getItem(key));
    if (state) {
        if (getAndDelete) localStorage.removeItem(key);
        if (key === "user") state = authenticateUserPasswords(state).user;
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
