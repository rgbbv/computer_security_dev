import {LoginActionsConstants} from "../stores/Login/Constants";
import {authenticateRes} from "../helpers/CryptoHelper";

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
    if(isUserLoggedIn()) {
        // If the user is logged in then validate his passwords
        const user = authenticateRes(JSON.parse(localStorage.getItem("user")),
            localStorage.getItem("encryptionSecret"),
            localStorage.getItem("authenticationSecret"));

        port.postMessage({
            type: LoginActionsConstants.IS_USER_LOGGED_IN_SUCCESS,
            payload: {user: user, history: localStorage.getItem("history")},
        })
    } else {
        port.postMessage({
            type: LoginActionsConstants.IS_USER_LOGGED_IN_FAILURE,
            payload: {history: localStorage.getItem("history")},
        })
    }
};

export const logout = (port) => {
    localStorage.clear();
    port.postMessage({
        type: LoginActionsConstants.LOGOUT_SUCCESS,
        payload: {},
    })
};
