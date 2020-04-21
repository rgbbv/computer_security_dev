import {PasswordListActionsConstants} from "../stores/PasswordList/Constants";
import {authenticateRes} from "../helpers/CryptoHelper";

export const updateCredentials = (baseApi, credentials, port) => {
    fetch(baseApi + "/user/" + JSON.parse(localStorage.getItem("user")).id + "/password/" + credentials.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(credentials),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
<<<<<<< HEAD
=======
                    const user = authenticateRes(JSON.parse(text), 
                        localStorage.getItem("encryptionSecret"),
                        localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));
>>>>>>> 06bde7c... fixed problems + persistent updating
                    port.postMessage({
                        type: PasswordListActionsConstants.UPDATE_PASSWORD_SUCCESS,
                        payload: user,
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: PasswordListActionsConstants.UPDATE_PASSWORD_FAILURE,
                        payload: JSON.parse(text),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: PasswordListActionsConstants.UPDATE_PASSWORD_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
};

export const saveCredentials = (baseApi, credentials, port) => {
    fetch(baseApi + "/user/" + JSON.parse(localStorage.getItem("user")).id + "/passwords", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(credentials),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
<<<<<<< HEAD
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_SUCCESS,
                        payload: JSON.parse(text),
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_FAILURE,
                        payload: JSON.parse(text),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: PasswordListActionsConstants.SAVE_PASSWORD_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
};

export const patchCredentials = (baseApi, credentials, port) => {
    fetch(baseApi + "/user/" + JSON.parse(localStorage.getItem("user")).id + "/passwords", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(credentials),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_SUCCESS,
                        payload: JSON.parse(text),
=======
                    const user = authenticateRes(JSON.parse(text), 
                        localStorage.getItem("encryptionSecret"),
                        localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_SUCCESS,
                        payload: user,
>>>>>>> 06bde7c... fixed problems + persistent updating
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_FAILURE,
                        payload: JSON.parse(text),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: PasswordListActionsConstants.SAVE_PASSWORD_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
};