/*global chrome*/
// import { create_and_set_AuthenticationKey, create_and_set_EncryptionPassword, create_ServerPassword,
// authenticateMessages, encrypt, makeHMAC } from "../src/crypto.js"
// var encryptionPassword = ''
var serverPassword = ''
// var authenticationKey = ''
var passwords = [
    {id: 1, name: "gmail", password: "gmail_password", authenticator: "gmail_password"},
    {id: 2, name: "facebook", password: "facebook_password", authenticator: "facebook_password"},
    {id: 3, name: "bank", password: "bank_password", authenticator: "gmail_password"}]
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "client_port")
    port.onMessage.addListener(function(msg) {
      if (msg.name == "login") {
        console.log(`logged in email: ${msg.email} password: ${msg.password}`)
        // create_and_set_EncryptionPassword(msg.password+1)
        // create_and_set_AuthenticationKey(msg.password+2)
        // serverPassword = create_ServerPassword(msg.password+3) //sent to server
        port.postMessage({name: "logged in"})
        //TODO: get passwords from server
        // authenticateMessages(passwords)

        port.postMessage({name: "passwords list", passwords: new_passwords})
      }
      else if (msg.name == "register") {
          console.log(
          `registered first name: ${msg.firstName} last name: ${msg.lastName}
          email: ${msg.email} password: ${msg.password}`)
          // setEncryptionPassword(msg.password+1)
          // setAuthenticationKey(msg.password+2)
          // setServerPassword(msg.password+3) //sent to server
          port.postMessage({name: "registered"})
            port.postMessage({name: "passwords list", passwords: []})
      }
      else if (msg.name == "new password") {
        console.log(`add new password name:${msg.name} password:${msg.password}`)
        // encryptedPassword = encrypt(msg.password)
        // hmacResult = makeHMAC(encryptedPassword) //result to verify no change in the message
        // TODO: send to server {name, encryptedPassword, hmacResult}
      }
      else if (msg.name == "update password") {
        console.log(
          `update existing password name: ${msg.name}
          old password: ${passwords.find(elemnent => elemnent.name === msg.name)} new password: ${msg.password}`)
          // encryptedPassword = encrypt(msg.password) //encrypt before sending to server
          // hmacResult = makeHMAC(encryptedPassword) //result to verify no change in the message
        // TODO: send to server {name, encryptedPassword, hmacResult}
      }
    })
  })

