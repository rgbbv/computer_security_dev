/*global chrome*/

const baseApi = "http://localhost:3000/api";

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "client_port");
  port.onMessage.addListener(function (msg) {
    if (msg.type === "REGISTER") {
      fetch(baseApi + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) =>
          res.status === 200
            ? res
                .text()
                .then((text) =>
                  port.postMessage({
                    type: "REGISTER_SUCCESS",
                    payload: JSON.parse(text),
                  })
                )
            : res
                .text()
                .then((text) =>
                  port.postMessage({
                    type: "REGISTER_FAILURE",
                    payload: JSON.parse(text),
                  })
                )
        )
        .catch((err) =>
          port.postMessage({ type: "REGISTER_FAILURE", err: err })
        );
    } else if (msg.type === "LOGIN") {
      fetch(baseApi + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then((res) =>
          res.status === 200
            ? res
                .text()
                .then((text) =>
                  port.postMessage({
                    type: "LOGIN_SUCCESS",
                    payload: JSON.parse(text),
                  })
                )
            : res
                .text()
                .then((text) =>
                  port.postMessage({
                    type: "LOGIN_FAILURE",
                    payload: JSON.parse(text),
                  })
                )
        )
        .catch((err) => port.postMessage({ type: "LOGIN_FAILURE", err: err }));
    }
  });
});
