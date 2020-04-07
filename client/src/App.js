/*global chrome*/
import React, { useState } from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import PasswordList from "./components/PasswordList/PasswordList";
import Notifications from "./components/Notifications/Notifications";
import { Switch, Route } from "react-router-dom";
import { history } from "./index";
import {LoginActionsConstants} from "./stores/Login/Constants";

const port = chrome.runtime.connect({ name: "client_port" });

port.onMessage.addListener(function (msg) {
    if (msg.type === LoginActionsConstants.IS_USER_LOGGED_IN_SUCCESS) {
        history.push('/passwordsList', msg.payload);
    } else if (msg.type === LoginActionsConstants.IS_USER_LOGGED_IN_FAILURE) {
        history.push('/login', msg.payload);
    }
});

export default class App extends React.Component {

    componentDidMount() {
        port.postMessage({
            type: LoginActionsConstants.IS_USER_LOGGED_IN,
            payload: {},
        });
    }

    render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={App} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} port={port} />}
          />
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
          <Route
            exact
            path="/notifications"
            render={(props) => <Notifications {...props} port={port} />}
          />
        </Switch>
      </div>
    );
  }
}
