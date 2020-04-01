/*global chrome*/
var SHA256 = require("crypto-js/sha256");
var HMAC = require("crypto-js/hmac-sha256");
var AES = require("crypto-js/aes");
var encryptionPassword = ''
var serverPassword = ''
var authenticationKey = ''
var passwords = [
    {id: 1, name: "gmail", password: "gmail_password", authenticator: "gmail_password"},
    {id: 2, name: "facebook", password: "facebook_password", authenticator: "facebook_password"},
    {id: 3, name: "bank", password: "bank_password", authenticator: "gmail_password"}]
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "client_port")
    port.onMessage.addListener(function(msg) {
      if (msg.name == "login") {
        console.log(`logged in email: ${msg.email} password: ${msg.password}`)
        encryptionPassword = SHA256(msg.password+1).toString();
        authenticationKey = SHA256(msg.password+2).toString();
        serverPassword = SHA256(msg.password+3).toString(); //sent to server
        CryptoJS.HmacSHA256.
        port.postMessage({name: "logged in"})
        //TODO: get passwords from server
        const [passHMAC, failHMAC] = 
        passwords.reduce(([pass, fail], e) => 
          (checkHMAC(e) ? [[...pass, e], fail] : [pass, [...fail, e]]), [[], []])

        failHMAC.forEach((fail) => console.log(`password for name: ${fail.name} was contaminated`))
        // the authentication for these messages is failed

        const new_passwords = passHMAC.forEach(
          (cell) => {cell.password = AES.decrypt(cell.password, encryptionPassword)})

        port.postMessage({name: "passwords list", passwords: new_passwords})
      }
      else if (msg.name == "register") {
          console.log(
          `registered first name: ${msg.firstName} last name: ${msg.lastName}
          email: ${msg.email} password: ${msg.password}`)
          encryptionPassword = CryptoJS.SHA256(msg.password+1).toString();
          authenticationKey = CryptoJS.SHA256(msg.password+2).toString();
          serverPassword = CryptoJS.SHA256(msg.password+3).toString(); //sent to server
          port.postMessage({name: "registered"})
            port.postMessage({name: "passwords list", passwords: []})
      }
      else if (msg.name == "new password") {
        console.log(`add new password name:${msg.name} password:${msg.password}`)
        encrypedPassword = AES.encrypt(msg.password, encryptionPassword)
        hmacResult = HMAC(encrypedPassword, authenticationKey) //result to verify no change in the message
        // TODO: send to server {name, encryptedPassword, hmacResult}
      }
      else if (msg.name == "update password") {
        console.log(
          `update existing password name: ${msg.name}
          old password: ${passwords.find(elemnent => elemnent.name === msg.name)} new password: ${msg.password}`)
        encrypedPassword = AES.encrypt(msg.password, encryptionPassword) //encrypt before sending to server
        hmacResult = HMAC(encryptionPassword, authenticationKey) //result to verify no change in the message
        // TODO: send to server {name, encryptedPassword, hmacResult}
      }
    })
  })

  const checkHMAC = (message) => {
    true // for now!!!
    // HMAC(message.password, authenticationKey) === message.authenticator
  }