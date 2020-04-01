/*global chrome*/

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
      console.log(msg);
      fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) =>
          port.postMessage({ type: "REGISTER_SUCCESS", payload: res })
        )
        .catch((err) => console.log(err));
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
