import {LoginActionsConstants} from "../stores/Login/Constants";
import {authenticateRes} from "../helpers/CryptoHelper";
import {NotificationActionsConstants} from "../stores/Notification/Constants";

export const authenticateUserPasswords = (user) => {
    return {
        user: authenticateRes(user,
            localStorage.getItem("encryptionSecret"),
            localStorage.getItem("authenticationSecret"))
    }
};
/**
 * Returns true iff the user is logged in by validating a present, non-expired accessToken.
 */
export const isUserLoggedIn = () => {
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

export const updateUser = (baseApi, userData, port, onSuccessType, onFailureType) => {
    fetch(baseApi + "/user/" + JSON.parse(localStorage.getItem("user")).id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(userData),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    localStorage.setItem("user", text);
                    port.postMessage({
                        type: onSuccessType,
                        payload: JSON.parse(text),
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: onFailureType,
                        payload: JSON.parse(text),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: onFailureType, payload: { errorMessage: "Internal server error" }})
        );
};
