/*global chrome*/
var passwords = [
    {id: 1, name: "gmail", password: "gmail_password"},
    {id: 2, name: "facebook", password: "facebook_password"},
    {id: 3, name: "bank", password: "bank_password"}]
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock")
    port.onMessage.addListener(function(msg) {
      if (msg.joke == "login") {
        console.log("logged in")
        port.postMessage({question: "logged in"})
        port.postMessage({name: "passwords list", passwords: passwords})
      }
      else if (msg.joke == "register") {
          console.log("registered")
          port.postMessage({question: "registered"})
      }
    })
  })