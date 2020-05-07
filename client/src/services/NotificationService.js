import {NotificationActionsConstants} from "../stores/Notification/Constants";
import {findCorrupted, decrypt} from "../helpers/CryptoHelper";

export const updateNotification = (baseApi, notification, port) => {
    fetch(baseApi + "/user/" + JSON.parse(localStorage.getItem("user")).id + "/notification/" + notification.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(notification),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    var user = findCorrupted(JSON.parse(text), 
                    localStorage.getItem("encryptionSecret"),
                    localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));

                    user.passwords = decrypt(user.passwords,
                        localStorage.getItem("encryptionSecret"));

                        console.log(`user.passwords: ${JSON.stringify(user.passwords)}`);
                    port.postMessage({
                        type: NotificationActionsConstants.UPDATE_NOTIFICATION_SUCCESS,
                        payload: user,
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: NotificationActionsConstants.UPDATE_NOTIFICATION_FAILURE,
                        payload: JSON.parse(text),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: NotificationActionsConstants.UPDATE_NOTIFICATION_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
};
