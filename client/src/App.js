/*global chrome*/
import React, { useState } from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Button from "@material-ui/core/Button";
import PasswordList from "./components/PasswordList/PasswordList";
import "./App.css";
import { Switch, Route } from "react-router-dom";

const port = chrome.runtime.connect({ name: "client_port" });

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Login port={port} />
        <Switch>
          <Route exact path="/" component={App} />
          <Route
            exact
            path="/register"
            render={(props) => <Register {...props} port={port} />}
          />
          <Route
            exact
            path="/passwordsList"
            render={(props) => <PasswordList {...props} port={port} />}
          />
        </Switch>
      </div>
    );
  }
}
//
// function App(props) {

//
//   if (!isLoggedIn && isRegistered) {
//     return (
//       <div id="app">
//         <Login port={port} />
//         <Button
//           onClick={() => setIsRegistered(false)}
//           variant="outlined"
//           id="change"
//         >
//           not registered?
//         </Button>
//       </div>
//     );
//   } else if (!isRegistered) {
//     return (
//       <div id="app">
//         <Register port={port} />
//         <Button
//           onClick={() => setIsRegistered(true)}
//           variant="outlined"
//           id="change"
//         >
//           already registered?
//         </Button>
//       </div>
//     );
//   } else {
//     return (
//       <div id="app">
//         <PasswordList passwords={passwordsList} />
//       </div>
//     );
//   }
// }
//
// export default App;
