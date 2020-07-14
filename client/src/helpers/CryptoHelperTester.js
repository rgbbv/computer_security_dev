const sha256 = require('crypto-js/sha256');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const aes = require('crypto-js/aes');
const encHex = require('crypto-js/enc-hex');
const encUtf8 = require('crypto-js/enc-utf8');
const CryptoJS = require('crypto-js');

// import sha256 from 'crypto-js/sha256';
// import hmacSHA256 from 'crypto-js/hmac-sha256';
// import aes from "crypto-js/aes";
// import encHex from 'crypto-js/enc-hex';

/**
 * The client login with a master password, then it derives from the master password three secretes: K1, K2, K3.
 * We define Ki = H(K || i) where H is a cryptographic hash function (such as - SHA-256).
 * In our application K1 used for encryption, K2 for authentication, K3 for server password.
 * With those keys (secrets) we want to encrypt (by stream / block cipher, e.g. AES with b=128, a fixed K, the transformation Ek(p)
 * is a permutation on the space of 2^b inputs, we should use CBC (cipher block chaining mode)
 * and then authenticate (by MACs - message authentication codes, e.g. HMAC):
 *  - To encrypt a user password p we will perform - c = Ek1(p); t = MacK2(c). The server will store the encrypted and authenticated
 *    users passwords (c || t).
 *  - To decrypt a user password we will perform:
 *      - verify t' = MacK2(c') then compute p = Ek1^-1(c') , otherwise, discard and notify on contaminated password.
 */
const deriveSecrets = (masterPassword) => {
    const encryptionSecret = sha256(masterPassword + '1').toString(encHex);
    const authenticationSecret = sha256(masterPassword + '2').toString(encHex);
    const serverSecret = sha256(masterPassword + '3').toString(encHex);

    return [encryptionSecret, authenticationSecret, serverSecret];
};

/**
 * Encrypt password with encryptionSecret, uses CBC as the default mode
 * @param password A plain text user password to encrypt
 * @param encryptionSecret The encryption secret treated as a passphrase and used to derive an actual key and IV
 * @returns {string} A hexadecimal string representing the encryption over password with secret encryptionSecret
 */
const encrypt = (password, encryptionSecret) => aes.encrypt(password, encryptionSecret).toString();

const authenticate = (encryptedPassword, authenticationSecret) => hmacSHA256(encryptedPassword, authenticationSecret).toString(encHex);

const encryptAndAuthenticate = (password, encryptionSecret, authenticationSecret) => {
    const c = encrypt(password, encryptionSecret);
    const t = authenticate(c, authenticationSecret);

    return c + t;
};

const authenticateMessages = (messages, encryptionSecret, authenticationSecret) => {
    const [passHMAC, failHMAC] =
        messages.reduce(([pass, fail], e) =>
            (checkHMAC(e, authenticationSecret) ? [[...pass, e], fail] : [pass, [...fail, e]]), [[], []]);


    const new_passwords = passHMAC.forEach(
        (cell) => {
            cell.password = aes.decrypt(cell.password, encryptionSecret)
        });

    return new_passwords
};

const checkHMAC = (message, authenticationSecret) => {
    // We are using hmac-sha256 (256 bit) represented as hexadecimal so t' length is 256 / 4 = 64
    const tTagLength = 64;
    const cTag = message.substr(0, message.length - tTagLength);
    const tTag = message.substr(message.length - tTagLength);

    return tTag === authenticate(cTag, authenticationSecret);
};

const [encryptionSecret, authenticationSecret, serverSecret]  = deriveSecrets("sdfsdf");
const pass = 'myPass';
const ct = encryptAndAuthenticate(pass, encryptionSecret, authenticationSecret);
const auth = checkHMAC(ct, authenticationSecret);
// console.log(auth);

const ciphertext = "20233b9ee234e6e83b70bcac882e0c6dc38d78da467b88065686b04c0e279fd0eb0ae5a3a576796e26ca7225cba7562b";
const authSec = "4814d92093ac8a0f4a2163ab87dee509ba306a58f5888be0edcb2fcd0712028b";
const encSec = "7dc96f776c8423e57a2785489a3f9c43fb6e756876d6ad9a9cac4aa4e72ec193";
const encc = CryptoJS.AES.encrypt("hello", encSec).toString();
const authc = CryptoJS.HmacSHA256(encc, authSec).toString(CryptoJS.enc.Hex);
const candt = encc + authc;
console.log(checkHMAC(candt, authSec));
const decrypted = CryptoJS.AES.decrypt(candt.substr(0, candt.length - 64), encSec);
console.log(CryptoJS.enc.Utf8.stringify(decrypted));

console.log(CryptoJS.enc.Utf8.stringify([]) || false);
