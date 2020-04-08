/*global chrome*/
import { deriveSecrets, checkHMAC } from "../src/helpers/CryptoHelper.js"
import Cookies from 'universal-cookie';
import {LoginActionsConstants} from "../src/stores/Login/Constants";
import {RegisterActionsConstants} from "../src/stores/Register/Constants";
import {NotificationActionsConstants} from "../src/stores/Notification/Constants";
import {PasswordListActionsConstants} from "../src/stores/PasswordList/Constants";

const baseApi = "http://localhost:3000/api";
const cookies = new Cookies();
let encryptionSecret = '';
let authenticationSecret = '';
let serverSecret = '';

/**
 * Gets the user masterPassword, derives encryptionSecret, authenticationSecret, serverSecret.
 * serverSecret is used as server's password.
 * @param masterPassword
 */
const handlePreSignIn = (masterPassword) => {
    [encryptionSecret, authenticationSecret, serverSecret] = deriveSecrets(masterPassword);
    localStorage.setItem("encryptionSecret", encryptionSecret);
    localStorage.setItem("authenticationSecret", authenticationSecret);

    return serverSecret;
};

/**
 * Upon login / signUp we get a server response containing the user data and accessToken, then we should store
 * the user data and accessToken in local storage. Right after we verify the integrity of the user passwords.
 *
 * @param res The server login / signUp response
 */
const handlePostSignIn = (res) => {
    // TODO: check cookie (chrome.cookies)
    // cookies.set("accessToken", res.accessToken);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("user", JSON.stringify(res.user));

    const authenticationSecret = localStorage.getItem("authenticationSecret");

    // TODO: verify passwords integrity
    // res.user["passwords"].map((item) => checkHMAC(item.password, authenticationSecret) ? console.log("success auth") :
    //     console.log("failure auth"));
};

/**
 * Returns true is the user is logged in by validating a present, non-expired accessToken.
 */
const isUserLoggedIn = () => {
    // const accessToken = cookies.get("accessToken"); not working
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    }

    return false
};

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "client_port");

  port.onMessage.addListener(function (msg) {
    if (msg.type === RegisterActionsConstants.REGISTER) {
        msg.payload.password = handlePreSignIn(msg.payload.password);
      fetch(baseApi + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) => {
          if (res.status === 200) {
             res.text().then((text) => {
                 const res = JSON.parse(text);
                 handlePostSignIn(res);
                port.postMessage({
                  type: RegisterActionsConstants.REGISTER_SUCCESS,
                  payload: res,
                })}
              )}
          else {
              res.text().then((text) =>
                  port.postMessage({
                      type: RegisterActionsConstants.REGISTER_FAILURE,
                      payload: JSON.parse(text),
                  })
              )}
          }
        )
        .catch((err) =>
          port.postMessage({ type: RegisterActionsConstants.REGISTER_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
    } else if (msg.type === LoginActionsConstants.LOGIN) {
      msg.payload.password = handlePreSignIn(msg.payload.password);
      fetch(baseApi + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) =>
          res.status === 200
            ? res.text().then((text) => {
                  const res = JSON.parse(text);
                  handlePostSignIn(res);
                  port.postMessage({
                      type: LoginActionsConstants.LOGIN_SUCCESS,
                      payload: res,
                  })
              })
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
        //TODO: background should inject the accessToken from the cookie
        fetch(baseApi + "/user/" + msg.payload.userId + "/notification/" + msg.payload.notification.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + localStorage.getItem("accessToken")
            },
            body: JSON.stringify(msg.payload.notification),
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
    } else if (msg.type === LoginActionsConstants.IS_USER_LOGGED_IN) {
        isUserLoggedIn() ? port.postMessage({
                type: LoginActionsConstants.IS_USER_LOGGED_IN_SUCCESS,
                payload: { user: JSON.parse(localStorage.getItem("user")) },
            }) :
            port.postMessage({
                type: LoginActionsConstants.IS_USER_LOGGED_IN_FAILURE,
                payload: {},
            })
    } else if (msg.type === LoginActionsConstants.LOGOUT) {
        localStorage.clear();
        port.postMessage({
            type: LoginActionsConstants.LOGOUT_SUCCESS,
            payload: {},
        })
    } else if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS) {
        const user = JSON.parse(localStorage.getItem("user"));
        const credentials = user.passwords.filter((item) => item.url === msg.payload.url);

        if (credentials.length === 1) {
            port.postMessage({
                type: PasswordListActionsConstants.GET_CREDENTIALS_SUCCESS,
                payload: {credentials: credentials[0]},
            })
        } else {
            port.postMessage({
                type: PasswordListActionsConstants.GET_CREDENTIALS_FAILURE,
                payload: {},
            })
        }
    }
  });
});
