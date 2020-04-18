import {SecurityActionsConstants} from "../stores/Security/Constants";

export const pair = (user, port) => {
    // Generating secret
    const secret = "123ABC";
    const api = "https://www.authenticatorApi.com/pair.aspx?AppName=PassVault&AppInfo=" + user.firstName + "&SecretCode=" + secret
    ;
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
