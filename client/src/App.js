/*global chrome*/
import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Button from "@material-ui/core/Button";
import PasswordList from "./components/PasswordList";
import "./App.css";
import {history} from './index';
import {withRouter, Switch, Route } from 'react-router-dom';
import { RegisterActionsConstants } from "./stores/Register/Constants";
import { LoginActionsConstants } from "./stores/Login/Constants";


const port = chrome.runtime.connect({ name: "client_port" });

port.onMessage.addListener(function (msg) {
    if (msg.type === LoginActionsConstants.LOGIN_SUCCESS) {
        console.log("accepted logged in message");
        history.push('/passwordsList')
    } else if (msg.type === RegisterActionsConstants.REGISTER_SUCCESS) {
        console.log("accepted registered message");
        history.push('/passwordsList');
    } else if (msg.name === "passwords list") {
        // setPasswordsList(msg.passwords);
    } else {
        console.log(
            `got something else
        ${msg}`
        );
    }
});


export default class App extends React.Component {

  render() {
    return (
        <div>
            <Login port={port} />
            <Switch >
                <Route exact path="/" component={App} />
                <Route exact path="/register" render={(props) => <Register {...props} /> } />
                <Route exact path="/passwordsList" render={(props) => <PasswordList {...props} /> }/>
            </Switch>
        </div>

    )
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
