import {SecurityActionsConstants} from "../stores/Security/Constants";
import {handlePostSignIn} from "./UserService";

export const pair = (user, port) => {
    // Generating secret
    const secret = "123ABC";
    const api = "https://www.authenticatorApi.com/pair.aspx?AppName=PassVault&AppInfo=" + user.firstName + "&SecretCode=" + secret;

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
                : res.text().then((text) =>
                    port.postMessage({
                        type: SecurityActionsConstants.VALIDATE_PIN_FAILURE,
                        payload: text,
                    })
                )
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
                    port.postMessage({
                        type: SecurityActionsConstants.VALIDATE_PIN_SERVER_SUCCESS,
                        payload: handlePostSignIn(JSON.parse(text)),
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: SecurityActionsConstants.VALIDATE_PIN_SERVER_FAILURE,
                        payload: JSON.parse(text),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: SecurityActionsConstants.VALIDATE_PIN_SERVER_FAILURE,
                payload: { errorMessage: "Internal server error" }})
        );
};
