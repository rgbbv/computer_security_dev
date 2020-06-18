import {PasswordListActionsConstants} from "../stores/PasswordList/Constants";
import {findCorrupted, decryptMessages} from "../helpers/CryptoHelper";
import {encryptCredentialsKeys, decryptUserKeys} from "./KeysService";


export const updateCredentials = (baseApi, credentials, port) => {
    fetch(baseApi + "/user/" + JSON.parse(localStorage.getItem("user")).id + "/password/" + credentials.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(encryptCredentialsKeys(credentials)),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    var text2 = {user: JSON.parse(text)};
                    var user = findCorrupted(decryptUserKeys(text2).user, 
                        localStorage.getItem("encryptionSecret"),
                        localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));
                    user.passwords = decryptMessages(user.passwords,
                        localStorage.getItem("encryptionSecret"));
                    user.corrupted = decryptMessages(user.corrupted,
                        localStorage.getItem("encryptionSecret"));
                    port.postMessage({
                        type: PasswordListActionsConstants.UPDATE_PASSWORD_SUCCESS,
                        payload: user,
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: PasswordListActionsConstants.UPDATE_PASSWORD_FAILURE,
                        payload: decryptUserKeys(JSON.parse(text)),
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
        body: JSON.stringify(encryptCredentialsKeys(credentials)),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    var text2 = {user: JSON.parse(text)};
                    var user = findCorrupted(decryptUserKeys(text2).user, 
                        localStorage.getItem("encryptionSecret"),
                        localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));
                    user.passwords = decryptMessages(user.passwords,
                        localStorage.getItem("encryptionSecret"));
                    user.corrupted = decryptMessages(user.corrupted,
                        localStorage.getItem("encryptionSecret"));
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_SUCCESS,
                        payload: user,
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_FAILURE,
                        payload: decryptUserKeys(JSON.parse(text)),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: PasswordListActionsConstants.SAVE_PASSWORD_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
};