import { SHA256, HmacSHA256, AES }  from "crypto-js"

var encryptionPassword = ''
var authenticationKey = ''

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