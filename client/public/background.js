/*global chrome*/

const baseApi = "http://localhost:3000/api";
var passwords = [
  { id: 1, name: "gmail", password: "gmail_password" },
  { id: 2, name: "facebook", password: "facebook_password" },
  { id: 3, name: "bank", password: "bank_password" },
];
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "client_port");
  port.onMessage.addListener(function (msg) {
    if (msg.name === "login") {
      console.log(`logged in email: ${msg.email} password: ${msg.password}`);
      port.postMessage({ text: "logged in" });
      port.postMessage({ name: "passwords list", passwords: passwords });
    } else if (msg.type === "REGISTER") {
      fetch(baseApi + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) => res.text())
        .then(
          (text) =>
            port.postMessage({
              type: "REGISTER_SUCCESS",
              payload: JSON.parse(text),
            })
          // port.postMessage({ type: "REGISTER_FAILURE", err: "error" })}
        )
        .catch((err) =>
          port.postMessage({ type: "REGISTER_FAILURE", err: "error" })
        );
    } else if (msg.type === "LOGIN") {
      fetch(baseApi + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) => res.text())
        .then((text) =>
          port.postMessage({ type: "LOGIN_SUCCESS", payload: JSON.parse(text) })
        )
        .catch((err) => port.postMessage({ type: "LOGIN_FAILURE", err: err }));
    } else if (msg.name === "register") {
      console.log(
        `registered first name: ${msg.firstName} last name: ${msg.lastName}
          email: ${msg.email} password: ${msg.password}`
      );
      port.postMessage({ text: "registered" });
      port.postMessage({ name: "passwords list", passwords: passwords });
    }
  });
});
