import {NotificationActionsConstants} from "../stores/Notification/Constants";

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
                    localStorage.setItem("user", text);
                    port.postMessage({
                        type: NotificationActionsConstants.UPDATE_NOTIFICATION_SUCCESS,
                        payload: JSON.parse(text),
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
