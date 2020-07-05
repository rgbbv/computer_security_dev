/*global chrome*/
import React, { useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popper,
  Fade,
  Paper,
} from "@material-ui/core";
import jq from "jquery";
import { PasswordListActionsConstants } from "../../../src/stores/PasswordList/Constants";
import { ManagePasswordsActionsConstants } from "../../../src/stores/ManagePasswords/Constants";
import PasswordAction from "./PasswordAction";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import {PersistenceActionsConstants} from "../../../src/stores/Persistence/Constants";

export default function ManagePasswords(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [getCredentials, setGetCredentials] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showPasswordAction, setShowPasswordAction] = useState(false);
  const [passwordAction, setPasswordAction] = useState("");
  const [error, setError] = useState(false);

  if (!getCredentials) {
    props.port.postMessage({
      type: PasswordListActionsConstants.GET_CREDENTIALS,
      payload: {url: window.location.toString()},
    });

    props.port.postMessage({
      type: PersistenceActionsConstants.GET_STATE,
      payload: {key: "managePasswords", onSuccessType: ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE_SUCCESS,
                onFailureType: ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE_FAILURE,
        getAndDelete: true},
    });
  }

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS_SUCCESS) {
      setCredentials(msg.payload.credentials);
      setGetCredentials(true);
      if (credentials.length > 0) {
        injectSavedCredentials(0);
      }
    } else if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS_FAILURE) {
      setGetCredentials(true);
      if('errorMessage' in msg.payload) setError(true);
    } else if (msg.type === ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE_SUCCESS) {
      setCredentials(msg.payload.state.credentials || []);
      setShowPasswordAction(msg.payload.state.showPasswordAction || "");
      setPasswordAction(msg.payload.state.passwordAction || "");
    }
  });

  // Add listeners to open the options on focusin
  ["input:password", "input:text", "input[type=email]"].map((item) =>
      jq(item).first().on("focusin", () => {
        // Checking if we have the credentials for this site
        if (Object.keys(credentials).length !== 0) {
          setShowOptions(true);
        }
      }));

  // Add listeners to close the options on user change values
  ["input:password", "input:text", "input[type=email]"].map((item) =>
      jq(item).first().on("change", () => {
        setShowOptions(false);
      }));

  /**
   * When user submit login form, check if we have the user credentials, then verify if he updated his password,
   * if so interact and ask him to update our saved password.
   * Otherwise (we dont have the current website credentials) interact and ask the user to save his password for the current website.
   */
  jq("form").submit(function (event) {
    const enteredPassword = jq("input:password").val();
    const enteredUsername = jq("input:text").val();
    const creds = credentials.filter((item) => item.username === enteredUsername);

    // The user has changed the saved password ask him whether to update
    if (creds.length > 0 && creds[0].password !== enteredPassword) {
      props.port.postMessage({
        type: PersistenceActionsConstants.SET_STATE,
        payload: {value: {credentials: {username: enteredUsername, password: enteredPassword, url: creds[0].url, id: creds[0].id},
          showPasswordAction: true, passwordAction: "Update"}, key: "managePasswords"},
      });
    }

    // We dont have this website credentials (or got new credentials - new username), ask the user whether to store them
    else if (creds.length === 0) {
      props.port.postMessage({
        type: PersistenceActionsConstants.SET_STATE,
        payload: {value: {credentials: {username: enteredUsername, password: enteredPassword, url: window.location.toString(), id: credentials.id},
            showPasswordAction: true, passwordAction: "Save"}, key: "managePasswords"},
      });
    }

    // We want to avoid showing the save password popup
    else {
      props.port.postMessage({
        type: PersistenceActionsConstants.SET_STATE,
        payload: {value: {showPasswordAction: false}, key: "managePasswords"},
      });
    }
  });

  const injectSavedCredentials = (index) => {
    jq("input:text").val(credentials[index].username);
    jq("input:password").val(credentials[index].password);
  };

  return (
      error ?
          <div /> :
      !showPasswordAction ?
      <Popper
          open={showOptions}
          anchorEl={anchorEl}
          placement="bottom"
          transition
      >
        {({TransitionProps}) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <List component="nav" aria-label="main mailbox folders">
                  {credentials.map((item, index) =>
                  <ListItem button onClick={() => {
                    injectSavedCredentials(index);
                    setShowOptions(false)
                  }}>
                    <ListItemIcon>
                      <VpnKeyIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={item.username}
                        secondary={Array(item.password.length).fill("*")}
                    />
                  </ListItem>
                  )}
                  <Divider/>
                  <ListItem button onClick={() => {setShowOptions(false); props.port.postMessage({
                    type: ManagePasswordsActionsConstants.OPEN_PASSWORDS_LIST_TAB,
                    payload: {url: "PasswordList.html"}
                  }) }}>
                    <ListItemText primary="Manage passwords"/>
                  </ListItem>
                </List>
              </Paper>
            </Fade>
        )}
      </Popper> : <PasswordAction port={props.port} credentials={credentials} action={passwordAction} />
  );
};
