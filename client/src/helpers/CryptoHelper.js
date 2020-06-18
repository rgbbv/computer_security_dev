import CryptoJS from "crypto-js";

/**
 * The client login with a master password, then it derives from the master password three secrets: K1, K2, K3.
 * We define Ki = H(K || i) where H is a cryptographic hash function (such as - SHA-256).
 * In our application K1 used for encryption, K2 for authentication, K3 for server password.
 * With those keys (secrets) we want to encrypt (by block cipher, e.g. AES with b=128, a fixed K, the transformation Ek(p)
 * is a permutation on the space of 2^b inputs, we should use CBC (cipher block chaining mode))
 * and then authenticate (by MACs - message authentication codes, e.g. HMAC):
 *  - To encrypt a user password p we will perform - c = Ek1(p); t = MacK2(c). The server will store the encrypted and authenticated
 *    users passwords (c || t).
 *  - To decrypt a user password we will perform:
 *      - verify t' = MacK2(c') then compute p = Ek1^-1(c') , otherwise, discard and notify on contaminated password.
 */
export const deriveSecrets = (masterPassword) => {
  const encryptionSecret = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(masterPassword + "1"));
  const authenticationSecret = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(masterPassword + "2"));
  const serverSecret = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256((masterPassword + "3")));

  return [encryptionSecret, authenticationSecret, serverSecret];
};

export const deriveUserEmail = (email) => {
  const serverEmail = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256((email + "3")));

  return serverEmail;
}

/**
 * Encrypt message with encryptionSecret, uses CBC as the default mode, then authenticate the message
 * @param message A plain text user message to encrypt
 * @param encryptionSecret The encryption secret treated as a passphrase and used to derive an actual key and IV
 * @param authenticationSecret The authentication secret
 * @returns {string} A hexadecimal string representing the encryption over message with secret encryptionSecret
 * concatenated with the authentication
 */
export const encryptAndAuthenticate = (
  message,
  encryptionSecret,
  authenticationSecret
) => {
  const c = CryptoJS.AES.encrypt(message, encryptionSecret).toString();
  const t = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(c, authenticationSecret));

  return c + t;
};

export const authenticateMessages = (
  messages,
  encryptionSecret,
  authenticationSecret
) => {
  console.log(`messages: ${JSON.stringify(messages)}`);
  const [passHMAC0, passwordFailHMAC] = messages.reduce(
    ([pass, fail], e) =>
      checkHMAC(e.password, authenticationSecret)
        ? [[...pass, e], fail]
        : [pass, [...fail, e]],
    [[], []]
  );

  const [passHMAC1, UrlFailHMAC] = passHMAC0.reduce(
    ([pass, fail], e) =>
      checkHMAC(e.url, authenticationSecret)
        ? [[...pass, e], fail]
        : [pass, [...fail, e]],
    [[], []]
  );

  const [passHMAC2, UsernameFailHMAC] = passHMAC1.reduce(
    ([pass, fail], e) =>
      checkHMAC(e.username, authenticationSecret)
        ? [[...pass, e], fail]
        : [pass, [...fail, e]],
    [[], []]
  );
  const fails = passwordFailHMAC.concat(UrlFailHMAC).concat(UsernameFailHMAC);
  console.log(`fails: ${JSON.stringify(fails)}`);
  return {messages, fails};
};

export const decryptMessages = (
  messages,
  encryptionSecret
) => {
    return messages.map((entry) => {
      let new_entry = Object.fromEntries(

        // convert to array, map, and then fromEntries gives back the object
        Object.entries(entry).map(([key, value]) => {
          if (key == 'url' || key == 'password' || key == 'username')
            return [key, CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(value, encryptionSecret)) || ""];
          else
            return [key, value];
        })
      );
      return new_entry;    
  });
}

export const checkHMAC = (message, authenticationSecret) => {
  // We are using hmac-sha256 (256 bit) represented as hexadecimal so t' length is 256 / 4 = 64
  const tLength = 64;

  const cPassword = message.substr(0, message.length - tLength);
  const tPassword = message.substr(message.length - tLength);

  const hmacVerification = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(cPassword, authenticationSecret)) || false;
  return tPassword === hmacVerification;
};

export const authenticateAndDecrypt = (
    encryptedMessage,
    encryptionSecret,
    authenticationSecret
) => {
  if (checkHMAC(encryptedMessage, authenticationSecret)) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedMessage.substr(0, encryptedMessage.length - 64),
        encryptionSecret)) || false;
  }

  return false;
};

export const findCorrupted = (res, encryptionSecret, authenticationSecret) => {
  const {messages, fails} = authenticateMessages(res.passwords, encryptionSecret, authenticationSecret);
  res.passwords = messages;
  res.corrupted = fails;
  console.log(`res: ${JSON.stringify(res)}`);
  return res;
};

export const findCorruptedAndDecrypt = (res, encryptionSecret, authenticationSecret) => {
  const {messages, fails} = authenticateMessages(res.passwords, encryptionSecret, authenticationSecret);
  res.passwords = decryptMessages(messages, encryptionSecret);
  res.corrupted = decryptMessages(fails, encryptionSecret);
  return res;
};
