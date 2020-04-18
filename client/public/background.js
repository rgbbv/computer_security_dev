/*global chrome*/
import { deriveSecrets, checkHMAC, encryptAndAuthenticate, authenticateAndDecrypt, authenticateRes } from "../src/helpers/CryptoHelper.js"
import {updateCredentials, saveCredentials} from "../src/services/CredentialsService";
import {setState, getState} from "../src/services/PersistenceService";
import { verifyUserLoggedIn, logout, isUserLoggedIn, authenticateUserPasswords, updateUser } from "../src/services/UserService";
import {updateNotification}  from "../src/services/NotificationService";
import {pair, validate} from "../src/services/SecurityService";
import {LoginActionsConstants} from "../src/stores/Login/Constants";
import {RegisterActionsConstants} from "../src/stores/Register/Constants";
import {NotificationActionsConstants} from "../src/stores/Notification/Constants";
import {PasswordListActionsConstants} from "../src/stores/PasswordList/Constants";
import {PersistenceActionsConstants} from "../src/stores/Persistence/Constants";
import {HistoryConstants} from "../src/stores/History/Constants";
import {ManagePasswordsActionsConstants} from "../src/stores/ManagePasswords/Constants";
import {UserActionsConstants} from "../src/stores/User/Constants";
import {SecurityActionsConstants} from "../src/stores/Security/Constants";

const baseApi = "http://localhost:3000/api";
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
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("user", JSON.stringify(res.user));

    // Verify passwords integrity
    return authenticateUserPasswords(res.user);
};

const encryptUserWebsitePassword = (password) => {
    encryptionSecret = localStorage.getItem("encryptionSecret");
    authenticationSecret = localStorage.getItem("authenticationSecret");

    return encryptAndAuthenticate(password, encryptionSecret, authenticationSecret);
};

const decryptUserWebsitePassword = (encryptedPassword) => {
    encryptionSecret = localStorage.getItem("encryptionSecret");
    authenticationSecret = localStorage.getItem("authenticationSecret");

    return authenticateAndDecrypt(encryptedPassword, encryptionSecret, authenticationSecret);
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
                port.postMessage({
                  type: RegisterActionsConstants.REGISTER_SUCCESS,
                  payload: handlePostSignIn(res),
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
                  port.postMessage({
                      type: LoginActionsConstants.LOGIN_SUCCESS,
                      payload: handlePostSignIn(res),
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
    } else if (msg.type === UserActionsConstants.UPDATE_USER) {
        updateUser(baseApi, msg.payload.userData, port, msg.payload.onSuccessType, msg.payload.onFailureType);
    } else if (msg.type === NotificationActionsConstants.UPDATE_NOTIFICATION) {
        updateNotification(baseApi, msg.payload.notification, port);
    } else if (msg.type === LoginActionsConstants.IS_USER_LOGGED_IN) {
        verifyUserLoggedIn(port);
    } else if (msg.type === LoginActionsConstants.LOGOUT) {
       logout(port);
    } else if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS) {
        if (isUserLoggedIn()) {
            const user = JSON.parse(localStorage.getItem("user"));
            let credentials = user.passwords.filter((item) => item.url === msg.payload.url);

            if (credentials.length >= 1) {
                credentials = credentials.map((item, index) => {
                    let decrypt = decryptUserWebsitePassword(item.password);
                    decrypt ? item.password = decrypt : item.password = "";
                    return item;
                });
                port.postMessage({
                    type: PasswordListActionsConstants.GET_CREDENTIALS_SUCCESS,
                    payload: {credentials: credentials},
                })
            } else {
                port.postMessage({
                    type: PasswordListActionsConstants.GET_CREDENTIALS_FAILURE,
                    payload: {},
                })
            }
        } else {
            port.postMessage({
                type: PasswordListActionsConstants.GET_CREDENTIALS_FAILURE,
                payload: {errorMessage: "user is not logged in"},
            })
        }
    } else if (msg.type === PersistenceActionsConstants.GET_STATE) {
        getState(msg.payload.key, port, msg.payload.onSuccessType, msg.payload.onFailureType, msg.payload.getAndDelete);
    } else if (msg.type === PersistenceActionsConstants.SET_STATE) {
        setState(msg.payload.key, msg.payload.value);
    } else if (msg.type === PasswordListActionsConstants.SAVE_PASSWORD) {
        msg.payload.password = encryptUserWebsitePassword(msg.payload.password);
        saveCredentials(baseApi, msg.payload, port);
    } else if (msg.type === PasswordListActionsConstants.UPDATE_PASSWORD) {
        msg.payload.password = encryptUserWebsitePassword(msg.payload.password);
        updateCredentials(baseApi, msg.payload, port);
    } else if (msg.type === HistoryConstants.CHANGE_HISTORY) {
        localStorage.setItem("history", msg.payload.history);
    } else if (msg.type === ManagePasswordsActionsConstants.OPEN_PASSWORDS_LIST_TAB) {
        chrome.tabs.create({url: msg.payload.url});
    } else if (msg.type === PersistenceActionsConstants.OPEN_TAB) {
        chrome.tabs.create({url: msg.payload.url});
    } else if (msg.type === SecurityActionsConstants.GET_QR_CODE) {
        pair(msg.payload, port);
    } else if (msg.type === SecurityActionsConstants.VALIDATE_PIN) {
        validate(msg.payload.pin, port, msg.payload.secret);
    }
  });
});
