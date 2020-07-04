/*global chrome*/
import { deriveSecrets, encryptAndAuthenticate, authenticateAndDecrypt, deriveUserEmail } from "../src/helpers/CryptoHelper.js"
import {updateCredentials, saveCredentials} from "../src/services/CredentialsService";
import {setState, getState} from "../src/services/PersistenceService";
import { verifyUserLoggedIn, logout, isUserLoggedIn, authenticateUserPasswords, updateUser,
    handlePreSignIn, handlePostSignIn} from "../src/services/UserService";
import {updateNotification}  from "../src/services/NotificationService";
import {pair, validate, validateWithServer} from "../src/services/SecurityService";
import {LoginActionsConstants} from "../src/stores/Login/Constants";
import {RegisterActionsConstants} from "../src/stores/Register/Constants";
import {NotificationActionsConstants} from "../src/stores/Notification/Constants";
import {PasswordListActionsConstants} from "../src/stores/PasswordList/Constants";
import {PersistenceActionsConstants} from "../src/stores/Persistence/Constants";
import {HistoryConstants} from "../src/stores/History/Constants";
import {ManagePasswordsActionsConstants} from "../src/stores/ManagePasswords/Constants";
import {UserActionsConstants} from "../src/stores/User/Constants";
import {SecurityActionsConstants} from "../src/stores/Security/Constants";
import {decryptUserKeys, encryptUserKeys, encryptRegisterKeys, reAuthUserData} from "../src/services/KeysService";
import {checkHMAC} from "../src/helpers/CryptoHelper";

const baseApi = "http://localhost:3000/api";


const encryptUserWebsitePassword = (password) => {
    const encryptionSecret = localStorage.getItem("encryptionSecret");
    const authenticationSecret = localStorage.getItem("authenticationSecret");

    return encryptAndAuthenticate(password, encryptionSecret, authenticationSecret);
};

const decryptUserWebsitePassword = (encryptedPassword) => {
    const encryptionSecret = localStorage.getItem("encryptionSecret");
    const authenticationSecret = localStorage.getItem("authenticationSecret");

    return authenticateAndDecrypt(encryptedPassword, encryptionSecret, authenticationSecret);
};

export const verifyUserDataIntegrity = (user) => {

    if (checkHMAC(user.user.aj, localStorage.getItem("authenticationSecret"))) {
        let aj_temp = user.user.aj;
        delete user.user.aj;
        if (JSON.stringify(user.user) !== decryptUserWebsitePassword(aj_temp)) {
            return false;
        }
    } else {
        return false;
    }

    return true;
}

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "client_port");
  port.onMessage.addListener(function (msg) {
      if (msg.type === RegisterActionsConstants.REGISTER) {
        msg.payload.password = handlePreSignIn(msg.payload.password);
        msg.payload.email = deriveUserEmail(msg.payload.email);
        msg.payload.firstName = encryptUserWebsitePassword(msg.payload.firstName);
        msg.payload.lastName = encryptUserWebsitePassword(msg.payload.lastName);

        const payload = encryptRegisterKeys(msg.payload);
      fetch(baseApi + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.status === 200) {
             res.text().then((text) => {
                 let res = JSON.parse(text);
                 updateUser(baseApi, reAuthUserData(res.user), port,
                     undefined, undefined, res.user.id, res.accessToken);
                 res = decryptUserKeys(JSON.parse(text));
                port.postMessage({
                  type: RegisterActionsConstants.REGISTER_SUCCESS,
                  payload: handlePostSignIn(res),
                })}
              )}
          else {
              res.text().then((text) =>
                  port.postMessage({
                      type: RegisterActionsConstants.REGISTER_FAILURE,
                      payload: decryptUserKeys(JSON.parse(text)),
                  })
              )}
          }
        )
        .catch((err) =>
          port.postMessage({ type: RegisterActionsConstants.REGISTER_FAILURE, payload: { errorMessage: "Internal server error" }})
        );
    } else if (msg.type === LoginActionsConstants.LOGIN) {
      msg.payload.password = handlePreSignIn(msg.payload.password);
      msg.payload.email = deriveUserEmail(msg.payload.email);
      const payload = encryptRegisterKeys(msg.payload);
      fetch(baseApi + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          res.status === 200
            ? res.text().then((text) => {
                  const res = decryptUserKeys(JSON.parse(text));

                  if (!res.user.security.twoStepsVerification) {
                      res.user.manipulated = !verifyUserDataIntegrity(JSON.parse(text));
                      if (res.user.manipulated) {
                          res.user.notifications.push({
                              date: new Date(), read: false, content: "An attacker manipulated your private data!",
                              severity: 'High', sender: 'Client'
                          })
                      }
                      port.postMessage({
                          type: LoginActionsConstants.LOGIN_SUCCESS,
                          payload: handlePostSignIn(res),
                      })
                  } else {
                      port.postMessage({
                          type: LoginActionsConstants.TWO_STEPS_VERIFICATION,
                          payload: res,
                      })
                  }
              })
            : res.text().then((text) => 
                port.postMessage({
                  type: LoginActionsConstants.LOGIN_FAILURE,
                  payload: JSON.parse(text),
                })
              )
            })
        .catch((err) => port.postMessage({ type: LoginActionsConstants.LOGIN_FAILURE, payload: { errorMessage: "Incorrect password" }}));
    } else if (msg.type === UserActionsConstants.UPDATE_USER) {
        updateUser(baseApi, msg.payload.userData, port, msg.payload.onSuccessType, msg.payload.onFailureType);
    } else if (msg.type === NotificationActionsConstants.UPDATE_NOTIFICATION) {
          const user = JSON.parse(localStorage.getItem("user"));
          user.notifications = msg.payload.notifications;
          updateUser(baseApi, user, port, NotificationActionsConstants.UPDATE_NOTIFICATION_SUCCESS,
              NotificationActionsConstants.UPDATE_NOTIFICATION_FAILURE);
    } else if (msg.type === LoginActionsConstants.IS_USER_LOGGED_IN) {
        verifyUserLoggedIn(port);
    } else if (msg.type === LoginActionsConstants.LOGOUT) {
       logout(port);
    } else if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS) {
        if (isUserLoggedIn()) {
            const user = authenticateUserPasswords(JSON.parse(localStorage.getItem("user"))).user;
            let credentials = user.passwords.filter((item) => item.url.replace("http://","https://") === msg.payload.url.replace("http://","https://"));

            if (credentials.length >= 1) {
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
          const user = JSON.parse(localStorage.getItem("user"));
          user.passwords.push({
              url: encryptUserWebsitePassword(msg.payload.url),
              username: encryptUserWebsitePassword(msg.payload.username),
              password: encryptUserWebsitePassword(msg.payload.password)});
          updateUser(baseApi, user, port, PasswordListActionsConstants.SAVE_PASSWORD_SUCCESS,
              PasswordListActionsConstants.SAVE_PASSWORD_FAILURE);
    } else if (msg.type === PasswordListActionsConstants.UPDATE_PASSWORD) {
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(`index: ${msg.payload.index}`);
          user.passwords = user.passwords.map((e, index) => msg.payload.index !== undefined ?
          msg.payload.index === index ?
          {
            url: encryptUserWebsitePassword(msg.payload.url),
            username:encryptUserWebsitePassword(msg.payload.username),
            password: encryptUserWebsitePassword(msg.payload.password)
          } : e
          :
          decryptUserWebsitePassword(e.url) === msg.payload.url &&
          decryptUserWebsitePassword(e.username) === msg.payload.username ?
              {
                  url: e.url,
                  username: e.username,
                  password: encryptUserWebsitePassword(msg.payload.password)
              } : e);
          updateUser(baseApi, user, port, PasswordListActionsConstants.UPDATE_PASSWORD_SUCCESS,
              PasswordListActionsConstants.UPDATE_PASSWORD_FAILURE);
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
    } else if (msg.type === SecurityActionsConstants.VALIDATE_PIN_SERVER) {
        validateWithServer(baseApi, msg.payload.pin, port, msg.payload.accessToken);
    } else if (msg.type === SecurityActionsConstants.UPDATE_USER_SECURITY) {
          const user = JSON.parse(localStorage.getItem("user"));
          user.security = msg.payload.userData.security;
          updateUser(baseApi, user, port, msg.payload.onSuccessType,
              msg.payload.onFailureType);
    }
  });
});
