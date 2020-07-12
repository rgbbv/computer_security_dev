import {UserInfoMap, PasswordsMap, NotificationsMap, SecurityMap} from "../stores/Keys/Constants";
import {encryptAndAuthenticate} from "../helpers/CryptoHelper";

export const reAuthUserData = (user) => {
    delete user.aj;
    delete user.manipulated;
    let temp = user.ab.bb;
    delete user.ab.bb;
    user.aj = encryptAndAuthenticate(JSON.stringify(user), localStorage.getItem("encryptionSecret"),
        localStorage.getItem("authenticationSecret"));

    // 2-steps auth secret is hidden from the user, this operation prevent deleting it from DB on the PUT request
    if (user.ab.ba && temp === undefined)
        delete user.ab;
    else {
        user.ab.bb = temp;
    }

    return user;
}

// Using the UserInfoMap we decrypt the names of the user's fields to their appropriate names
export const decryptUserKeys = (res) => {
    res.user = Object.fromEntries(
        // Convert to array, map, and then fromEntries gives back the object
        Object.entries(res.user).map(([key, value]) =>{
            if (key !== 'id')
               return [[...UserInfoMap.entries()]
            .filter(({ 1: v }) => v === key)
            .map(([k]) => k), value];
            return [key, value];
        })
      );
      if (res.user.passwords !== undefined)
        res.user.passwords = decryptCredentialsKeys(res.user.passwords);
      if (res.user.notifications !== undefined)
        res.user.notifications = decryptNotificationsKeys(res.user.notifications);
      if (res.user.security !== undefined)
        res.user.security = decryptSecurityKeys(res.user.security);
    if (res.user.notifications !== undefined && res.user.manipulated) {
        res.user.notifications.push({
            date: new Date(), read: false, content: "An attacker manipulated your private data!",
            severity: 'High', sender: 'Client'
        })
    }

    return res
}

// Using the UserInfoMap we encrypt the names of the user's fields before saving them in the DB
export const encryptUserKeys = (user) => {
    if (user.passwords !== undefined)
        user.passwords = encryptCredentialsKeys(user.passwords);
    if (user.notifications !== undefined)
        user.notifications = encryptNotificationsKeys(user.notifications);
    if (user.security !== undefined)
        user.security = encryptSecurityKeys(user.security);

    return Object.fromEntries(
        // Convert to array, map, and then fromEntries gives back the object
        Object.entries(user).map(([key, value]) =>{
            if (key !== 'password')
                return [UserInfoMap.get(key), value];
            return [key, value];
        })
      );
}

// Using the UserInfoMap we encrypt the names of the user's fields before saving them in the DB
// (only in the register flow)
export const encryptRegisterKeys = (user) => {
    return Object.fromEntries(
        // Convert to array, map, and then fromEntries gives back the object
        Object.entries(user).map(([key, value]) =>{
            if (key !== 'password')
                return [UserInfoMap.get(key), value];
            return [key, value];
        })
      );
}

// Using the SecurityMap we decrypt the names of the security's fields to their appropriate names
export const decryptSecurityKeys = (security) => {
    return Object.fromEntries(
        // Convert to array, map, and then fromEntries gives back the object
        Object.entries(security).map(([key, value]) =>{
            if (key !== 'id')
               return [[...SecurityMap.entries()]
            .filter(({ 1: v }) => v === key)
            .map(([k]) => k), value];
            return [key, value];
        })
      );
}

// Using the NotificationsMap we decrypt the names of the notifications's fields to their appropriate names
export const decryptNotificationsKeys = (notifications) => {
    return notifications.map((entry) => {
        return Object.fromEntries(
            // Convert to array, map, and then fromEntries gives back the object
            Object.entries(entry).map(([key, value]) =>{
                if (key !== 'id')
                return [[...NotificationsMap.entries()]
                .filter(({ 1: v }) => v === key)
                .map(([k]) => k), value];
                return [key, value];
            })
        );
    })
}

// Using the PasswordsMap we decrypt the names of the credentials's fields to their appropriate names
export const decryptCredentialsKeys = (credentials) => {
    return credentials.map((entry) => {
        return Object.fromEntries(
            // Convert to array, map, and then fromEntries gives back the object
            Object.entries(entry).map(([key, value]) =>{
                if (key !== 'id')
                return [[...PasswordsMap.entries()]
                .filter(({ 1: v }) => v === key)
                .map(([k]) => k), value];
                return [key, value];
            })
        );
    })
}

// Using the PasswordsMap we encrypt the names of the credentials's fields before saving them in the DB
export const encryptCredentialsKeys = (credentials) => {
    return credentials.map((e) => Object.fromEntries(
        // Convert to array, map, and then fromEntries gives back the object
        Object.entries(e).map(([key, value]) =>{
            return [PasswordsMap.get(key), value];
        })
      ));
}

// Using the SecurityMap we encrypt the names of the security's fields before saving them in the DB
export const encryptSecurityKeys = (security) => {
    return Object.fromEntries(
        // Convert to array, map, and then fromEntries gives back the object
        Object.entries(security).map(([key, value]) =>{
            return [SecurityMap.get(key), value];
        })
      );
}

// Using the NotificationsMap we encrypt the names of the notifications's fields before saving them in the DB
export const encryptNotificationsKeys = (notifications) => {
    return notifications.map((e) => Object.fromEntries(
        // Convert to array, map, and then fromEntries gives back the object
        Object.entries(e).map(([key, value]) => {
            return [NotificationsMap.get(key), value];
        })
      ));
}
