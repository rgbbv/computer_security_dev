import sha256 from "crypto-js/sha256";
import hmacSHA256 from "crypto-js/hmac-sha256";
import aes from "crypto-js/aes";
import encHex from "crypto-js/enc-hex";

/**
 * The client login with a master password, then it derives from the master password three secretes: K1, K2, K3.
 * We define Ki = H(K || i) where H is a cryptographic hash function (such as - SHA-256).
 * In our application K1 used for encryption, K2 for authentication, K3 for server password.
 * With those keys (secrets) we want to encrypt (by stream / block cipher, e.g. AES with b=128, a fixed K, the transformation Ek(p)
 * is a permutation on the space of 2^b inputs, we should use CBC (cipher block chaining mode))
 * and then authenticate (by MACs - message authentication codes, e.g. HMAC):
 *  - To encrypt a user password p we will perform - c = Ek1(p); t = MacK2(c). The server will store the encrypted and authenticated
 *    users passwords (c || t).
 *  - To decrypt a user password we will perform:
 *      - verify t' = MacK2(c') then compute p = Ek1^-1(c') , otherwise, discard and notify on contaminated password.
 */
export const deriveSecrets = (masterPassword) => {
  const encryptionSecret = hash(masterPassword + "1");
  const authenticationSecret = hash(masterPassword + "2");
  const serverSecret = hash(masterPassword + "3");

  return [encryptionSecret, authenticationSecret, serverSecret];
};

export const hash = (message) =>
  sha256(message).toString(encHex);

/**
 * Encrypt message with encryptionSecret, uses CBC as the default mode
 * @param message A plain text user message to encrypt
 * @param encryptionSecret The encryption secret treated as a passphrase and used to derive an actual key and IV
 * @returns {string} A hexadecimal string representing the encryption over message with secret encryptionSecret
 */
export const encrypt = (message, encryptionSecret) =>
  aes.encrypt(message, encryptionSecret).toString();

export const authenticate = (encryptedMessage, authenticationSecret) =>
  hmacSHA256(encryptedMessage, authenticationSecret).toString(encHex);

export const encryptAndAuthenticate = (
  message,
  encryptionSecret,
  authenticationSecret
) => {
  const c = encrypt(message, encryptionSecret);
  const t = authenticate(c, authenticationSecret);

  return c + t;
};

export const authenticateMessages = (
  messages,
  encryptionSecret,
  authenticationSecret
) => {
  const [passHMAC, failHMAC] = messages.reduce(
    ([pass, fail], e) =>
      checkHMAC(e, authenticationSecret)
        ? [[...pass, e], fail]
        : [pass, [...fail, e]],
    [[], []]
  );

  failHMAC.forEach((fail) =>
    console.log(`password for name: ${fail.name} was contaminated`)
  );
  // the authentication for these messages is failed

  const new_passwords = passHMAC.forEach((cell) => {
    cell.password = aes.decrypt(cell.password, encryptionSecret);
  });

  return new_passwords;
};

export const checkHMAC = (message, authenticationSecret) => {
  // We are using hmac-sha256 (256 bit) represented as hexadecimal so t' length is 256 / 4 = 64
  const tTagLength = 64;
  const cTag = message.substr(0, message.length - tTagLength);
  const tTag = message.substr(message.length - tTagLength);

  return tTag === authenticate(cTag, authenticationSecret);
};
