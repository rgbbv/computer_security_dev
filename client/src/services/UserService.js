import {LoginActionsConstants} from "../stores/Login/Constants";
import {RegisterActionsConstants} from "../stores/Register/Constants";

/**
 * Returns true iff the user is logged in by validating a present, non-expired accessToken.
 */
const isUserLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    }

    return false
};

export const verifyUserLoggedIn = (port) => {
    isUserLoggedIn() ? port.postMessage({
        type: LoginActionsConstants.IS_USER_LOGGED_IN_SUCCESS,
        payload: { user: JSON.parse(localStorage.getItem("user")) },
    }) :
    port.postMessage({
        type: LoginActionsConstants.IS_USER_LOGGED_IN_FAILURE,
        payload: {},
    })
};

export const logout = (port) => {
    localStorage.clear();
    port.postMessage({
        type: LoginActionsConstants.LOGOUT_SUCCESS,
        payload: {},
    })
};
