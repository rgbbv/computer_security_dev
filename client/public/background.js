/*global chrome*/
import { create_and_set_AuthenticationKey, create_and_set_EncryptionPassword, create_ServerPassword,
authenticateMessages, encrypt, makeHMAC } from "../src/crypto.js"
import {LoginActionsConstants} from "../src/stores/Login/Constants";
import {RegisterActionsConstants} from "../src/stores/Register/Constants";
import {NotificationActionsConstants} from "../src/stores/Notification/Constants";

// var encryptionPassword = ''
// var serverPassword = ''
// var authenticationKey = ''

const baseApi = "http://localhost:3000/api";

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "client_port");
  port.onMessage.addListener(function (msg) {
    if (msg.type === RegisterActionsConstants.REGISTER) {
        // TODO: change body in request (login & register) to use the server password.
        //  save response accessToken as cookie,
        //  save response user data and encryptions to local storage
      // setEncryptionPassword(msg.password+1)
      // setAuthenticationKey(msg.password+2)
      // setServerPassword(msg.password+3) //sent to server
      fetch(baseApi + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) =>
          res.status === 200
            ? res.text().then((text) =>
                port.postMessage({
                  type: RegisterActionsConstants.REGISTER_SUCCESS,
                  payload: JSON.parse(text),
                })
              )
            : res.text().then((text) =>
                port.postMessage({
                  type: RegisterActionsConstants.REGISTER_FAILURE,
                  payload: JSON.parse(text),
                })
              )
        )
        .catch((err) =>
          port.postMessage({ type: RegisterActionsConstants.REGISTER_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
    } else if (msg.type === LoginActionsConstants.LOGIN) {
      // create_and_set_EncryptionPassword(msg.password+1)
      // create_and_set_AuthenticationKey(msg.password+2)
      // serverPassword = create_ServerPassword(msg.password+3) //sent to server
      //TODO: get passwords from server
      // authenticateMessages(passwords)

      fetch(baseApi + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) =>
          res.status === 200
            ? res.text().then((text) =>
                port.postMessage({
                  type: LoginActionsConstants.LOGIN_SUCCESS,
                  payload: JSON.parse(text),
                })
              )
            : res.text().then((text) =>
                port.postMessage({
                  type: LoginActionsConstants.LOGIN_FAILURE,
                  payload: JSON.parse(text),
                })
              )
        )
        .catch((err) => port.postMessage({ type: LoginActionsConstants.LOGIN_FAILURE, payload: { errorMessage: "Internal server error" }}));
    } else if (msg.name === "new password") {
      // console.log(`add new password name:${msg.name} password:${msg.password}`)
      // encryptedPassword = encrypt(msg.password)
      // hmacResult = makeHMAC(encryptedPassword) //result to verify no change in the message
      // TODO: send to server {name, encryptedPassword, hmacResult}
    } else if (msg.name === "update password") {
      // console.log(
      //     `update existing password name: ${msg.name}
      //   old password: ${passwords.find(elemnent => elemnent.name === msg.name)} new password: ${msg.password}`)
      // encryptedPassword = encrypt(msg.password) //encrypt before sending to server
      // hmacResult = makeHMAC(encryptedPassword) //result to verify no change in the message
      // TODO: send to server {name, encryptedPassword, hmacResult}
    } else if (msg.type === NotificationActionsConstants.UPDATE_NOTIFICATION) {
        fetch(baseApi + "/user/" + msg.payload.userId + "/notification/" + msg.payload.notification.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msg.payload.notification),
        })
            .then((res) =>
                res.status === 200
                    ? res.text().then((text) =>
                        port.postMessage({
                            type: NotificationActionsConstants.UPDATE_NOTIFICATION_SUCCESS,
                            payload: JSON.parse(text),
                        })
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
    }
  });
});
