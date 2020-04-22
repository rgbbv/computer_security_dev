/*global chrome*/
import React, { useState } from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import PasswordList from "./components/PasswordList/PasswordList";
import Notifications from "./components/Notifications/Notifications";
import Home from './components/Home/Home';
import AddPassword from './components/AddPassword/AddPassword';
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import { Switch, Route } from "react-router-dom";
import { history } from "./index";
import {LoginActionsConstants} from "./stores/Login/Constants";
import {HistoryConstants} from "./stores/History/Constants";
import TwoStepsVerification from "./components/Security/TwoStepsVerification";

const port = chrome.runtime.connect({ name: "client_port" });

port.onMessage.addListener(function (msg) {
    if (msg.type === LoginActionsConstants.IS_USER_LOGGED_IN_SUCCESS) {
        if (msg.payload.history) {
          history.push(msg.payload.history, msg.payload);
        }
        else {
          history.push(HistoryConstants.HOME, msg.payload);
          port.postMessage({
            type: HistoryConstants.CHANGE_HISTORY,
            payload: {history: HistoryConstants.HOME},
          });
        }
    } else if (msg.type === LoginActionsConstants.IS_USER_LOGGED_IN_FAILURE) {
        if (msg.payload.history) {
            history.push(msg.payload.history, msg.payload);
        } else {
            history.push(HistoryConstants.LOGIN, msg.payload);
            port.postMessage({
                type: HistoryConstants.CHANGE_HISTORY,
                payload: {history: HistoryConstants.LOGIN},
            });
        }
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
      <div style={{minWidth: "250px"}}>
        <Switch>
          <Route exact path="/" component={App} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} port={port} />}
          />
          <Route
            exact
            path="/home"
            render={(props) => <Home {...props} port={port} />}
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
          <Route
            exact
            path="/addPassword"
            render={(props) => <AddPassword {...props} port={port} />}
          />
          <Route
            exact
            path="/updatePassword"
            render={(props) => <UpdatePassword {...props} port={port} />}
          />
          <Route
            exact
            path="/twoStepsVerification"
            render={(props) => <TwoStepsVerification {...props} port={port} />}
          />
        </Switch>
      </div>
    );
  }
}
