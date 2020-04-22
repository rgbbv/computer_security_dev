import {LoginActionsConstants} from "../stores/Login/Constants";
import {findCorrupted, deriveSecrets} from "../helpers/CryptoHelper";

/**
 * Gets the user masterPassword, derives encryptionSecret, authenticationSecret, serverSecret.
 * serverSecret is used as server's password.
 * @param masterPassword
 */
export const handlePreSignIn = (masterPassword) => {
    const [encryptionSecret, authenticationSecret, serverSecret] = deriveSecrets(masterPassword);
    localStorage.setItem("encryptionSecret", encryptionSecret);
    localStorage.setItem("authenticationSecret", authenticationSecret);

    return serverSecret;
};

/**
 * Upon login / signUp we get a server response containing the user data and accessToken, then we should store
 * the user data and accessToken in local storage. Right after we verify the integrity of the user passwords.
 *
 * @param res The server login / signUp response
 */
export const handlePostSignIn = (res) => {
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("user", JSON.stringify(res.user));

    // Verify passwords integrity
    console.log("before authenticateUserPasswords")
    return authenticateUserPasswords(res.user);
};

export const authenticateUserPasswords = (user) => {
    return {
        user: findCorrupted(user,
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
        const user = findCorrupted(JSON.parse(localStorage.getItem("user")),
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
