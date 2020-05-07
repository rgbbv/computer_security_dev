import {PasswordListActionsConstants} from "../stores/PasswordList/Constants";
import {findCorrupted, decryptMessages} from "../helpers/CryptoHelper";

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
                    var user = findCorrupted(JSON.parse(text), 
                        localStorage.getItem("encryptionSecret"),
                        localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));
                    user.passwords = decryptMessages(user.passwords,
                        localStorage.getItem("encryptionSecret"));
                        console.log(`user.passwords: ${JSON.stringify(user.passwords)}`);
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
                    var user = findCorrupted(JSON.parse(text), 
                        localStorage.getItem("encryptionSecret"),
                        localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));

                    user.passwords = decryptMessages(user.passwords,
                        localStorage.getItem("encryptionSecret"));
                        console.log(`user.passwords: ${JSON.stringify(user.passwords)}`);
                    port.postMessage({
                        type: PasswordListActionsConstants.SAVE_PASSWORD_SUCCESS,
                        payload: user,
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