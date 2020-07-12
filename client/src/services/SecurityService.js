import {SecurityActionsConstants} from "../stores/Security/Constants";
import {handlePostSignIn} from "./UserService";
import crypto from 'crypto';
import {decryptUserKeys} from "./KeysService";
import {authenticateAndDecrypt} from "../helpers/CryptoHelper";
import {verifyUserDataIntegrity} from "../../public/background";

const decryptFirstName = (encryptedPassword) => {
    const encryptionSecret = localStorage.getItem("encryptionSecret");
    const authenticationSecret = localStorage.getItem("authenticationSecret");

    return authenticateAndDecrypt(encryptedPassword, encryptionSecret, authenticationSecret);
};

export const pair = (user, port) => {
    // Generating secret
    crypto.randomBytes(8, (err, buffer) => {
        const secret = buffer.toString('hex').toUpperCase();
        const api = "https://www.authenticatorApi.com/pair.aspx?AppName=PassVault&AppInfo=" + decryptFirstName(user.firstName) + "&SecretCode=" + secret;

        fetch(api,{
            method: "GET",
        })
            .then((res) =>
                res.status === 200
                    ? res.text().then((text) => {
                        port.postMessage({
                            type: SecurityActionsConstants.GET_QR_CODE_SUCCESS,
                            payload: {QR: text, secret: secret}
                        })}
                    )
                    : res.text().then((text) =>
                        port.postMessage({
                            type: SecurityActionsConstants.GET_QR_CODE_FAILURE,
                            payload: text,
                        })
                    )
            )
            .catch((err) =>
                port.postMessage({ type: SecurityActionsConstants.GET_QR_CODE_FAILURE, payload: { errorMessage: "Internal server error" }})
            );
        });
};

export const validate = (pin, port, secret) => {
    const api = "https://www.authenticatorApi.com/Validate.aspx?Pin=" + pin + "&SecretCode=" + secret;

    fetch(api,{
        method: "GET",
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    port.postMessage({
                        type: SecurityActionsConstants.VALIDATE_PIN_SUCCESS,
                        payload: text
                    })}
                )
                : res.text().then((text) => {
                    port.postMessage({
                        type: SecurityActionsConstants.VALIDATE_PIN_FAILURE,
                        payload: text,
                    })
                })
        )
        .catch((err) =>
            port.postMessage({ type: SecurityActionsConstants.VALIDATE_PIN_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
};

export const validateWithServer = (baseApi, pin, port, accessToken) => {
    fetch(baseApi + "/user/validate?pin=" + pin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + accessToken
        },
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    const res = JSON.parse(text);
                    res.user.manipulated = !verifyUserDataIntegrity(JSON.parse(text));
                    port.postMessage({
                        type: SecurityActionsConstants.VALIDATE_PIN_SERVER_SUCCESS,
                        payload: handlePostSignIn(decryptUserKeys(res)),
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: SecurityActionsConstants.VALIDATE_PIN_SERVER_FAILURE,
                        payload: decryptUserKeys(JSON.parse(text)),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: SecurityActionsConstants.VALIDATE_PIN_SERVER_FAILURE,
                payload: { errorMessage: "Internal server error" }})
        );
};
