import {UserInfoMap, PasswordsMap, NotificationsMap, SecurityMap} from "../stores/Keys/Constants";

export const decryptUserKeys = (res) => {
    console.log(`user before: ${JSON.stringify(res)}`);
    res.user = Object.fromEntries(
        // convert to array, map, and then fromEntries gives back the object
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
        console.log(`user after: ${JSON.stringify(res)}`);
    return res
}

export const encryptUserKeys = (user) => {
    if (user.passwords !== undefined)
        user.passwords = encryptCredentialsKeys(user.passwords);
    if (user.notifications !== undefined)
        user.notifications = encryptNotificationsKeys(user.notifications);
    if (user.security !== undefined)
        user.security = encryptSecurityKeys(user.security);

    return Object.fromEntries(
        // convert to array, map, and then fromEntries gives back the object
        Object.entries(user).map(([key, value]) =>{
            if (key !== 'password')
                return [UserInfoMap.get(key), value];
            return [key, value];
        })
      );
}

export const encryptRegisterKeys = (user) => {
    return Object.fromEntries(
        // convert to array, map, and then fromEntries gives back the object
        Object.entries(user).map(([key, value]) =>{
            if (key !== 'password')
                return [UserInfoMap.get(key), value];
            return [key, value];
        })
      );
}

export const decryptSecurityKeys = (security) => {
    return Object.fromEntries(
        // convert to array, map, and then fromEntries gives back the object
        Object.entries(security).map(([key, value]) =>{
            if (key !== 'id')
               return [[...SecurityMap.entries()]
            .filter(({ 1: v }) => v === key)
            .map(([k]) => k), value];
            return [key, value];
        })
      );
}
export const decryptNotificationsKeys = (notifications) => {
    return notifications.map((entry) => {
        return Object.fromEntries(
            // convert to array, map, and then fromEntries gives back the object
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

export const decryptCredentialsKeys = (credentials) => {
    console.log(`credentials: ${JSON.stringify(credentials)}`);
    return credentials.map((entry) => {
        console.log(`entry: ${JSON.stringify(entry)}`);
        return Object.fromEntries(
            // convert to array, map, and then fromEntries gives back the object
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


export const encryptCredentialsKeys = (credentials) => {
    return Object.fromEntries(
        // convert to array, map, and then fromEntries gives back the object
        Object.entries(credentials).map(([key, value]) =>{
            return [PasswordsMap.get(key), value];
        })
      );
}

export const encryptSecurityKeys = (security) => {
    return Object.fromEntries(
        // convert to array, map, and then fromEntries gives back the object
        Object.entries(security).map(([key, value]) =>{
            return [SecurityMap.get(key), value];
        })
      );
}

export const encryptNotificationsKeys = (notifications) => {
    return Object.fromEntries(
        // convert to array, map, and then fromEntries gives back the object
        Object.entries(notifications).map(([key, value]) =>{
            return [NotificationsMap.get(key), value];
        })
      );
}