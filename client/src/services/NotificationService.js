import {NotificationActionsConstants} from "../stores/Notification/Constants";
import {findCorrupted, decrypt} from "../helpers/CryptoHelper";
import {decryptNotificationsKeys, decryptUserKeys} from "./KeysService";

export const updateNotification = (baseApi, notification, port) => {
    fetch(baseApi + "/user/" + JSON.parse(localStorage.getItem("user")).id + "/notification/" + notification.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: JSON.stringify(decryptNotificationsKeys(notification)),
    })
        .then((res) =>
            res.status === 200
                ? res.text().then((text) => {
                    var user = findCorrupted(decryptUserKeys(JSON.parse(text)), 
                    localStorage.getItem("encryptionSecret"),
                    localStorage.getItem("authenticationSecret"));
                    localStorage.setItem("user", JSON.stringify(user));

                    user.passwords = decrypt(user.passwords,
                        localStorage.getItem("encryptionSecret"));

                    port.postMessage({
                        type: NotificationActionsConstants.UPDATE_NOTIFICATION_SUCCESS,
                        payload: user,
                    })}
                )
                : res.text().then((text) =>
                    port.postMessage({
                        type: NotificationActionsConstants.UPDATE_NOTIFICATION_FAILURE,
                        payload: decryptUserKeys(JSON.parse(text)),
                    })
                )
        )
        .catch((err) =>
            port.postMessage({ type: NotificationActionsConstants.UPDATE_NOTIFICATION_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
};
