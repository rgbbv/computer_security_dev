import { SHA256, HmacSHA256, AES }  from "crypto-js"

var encryptionPassword = ''
var authenticationKey = ''

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

export const create_and_set_EncryptionPassword = (encryptionPassword) => {
     this.encryptionPassword = SHA256(encryptionPassword).toString() }
     
export const create_and_set_AuthenticationKey = (authenticationKey) => {
     this.authenticationKey = SHA256(authenticationKey).toString() }

export const create_ServerPassword = (serverPassword) => {
     this.serverPassword = SHA256(serverPassword).toString() }

export const encrypt = (password) => AES.encrypt(password, encryptionPassword).toString()

export const makeHMAC = (encryptedPassword) => HmacSHA256(encryptedPassword, authenticationKey)

export const authenticateMessages = (messages) => {
    const [passHMAC, failHMAC] = 
    messages.reduce(([pass, fail], e) => 
      (checkHMAC(e) ? [[...pass, e], fail] : [pass, [...fail, e]]), [[], []])

    failHMAC.forEach((fail) => console.log(`password for name: ${fail.name} was contaminated`))
    // the authentication for these messages is failed

    const new_passwords = passHMAC.forEach(
      (cell) => {cell.password = AES.decrypt(cell.password, encryptionPassword)})
    
    return new_passwords
}

const checkHMAC = (message) => {
    true // for now!!!
    // HMAC(message.password, authenticationKey) === message.authenticator
  }