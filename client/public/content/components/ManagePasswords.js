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

export default function ManagePasswords(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [getCredentials, setGetCredentials] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [showPasswordAction, setShowPasswordAction] = useState(false);
  const [passwordAction, setPasswordAction] = useState("");

  if (!getCredentials) {
    props.port.postMessage({
      type: PasswordListActionsConstants.GET_CREDENTIALS,
      payload: {url: window.location.toString()},
    });

    props.port.postMessage({
      type: ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE,
      payload: {key: "managePasswords"},
    });
  }

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS_SUCCESS) {
      setCredentials(msg.payload.credentials);
      setGetCredentials(true);
      injectSavedCredentials();
    } else if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS_FAILURE) {
      setGetCredentials(true);
    } else if (msg.type === ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE_SUCCESS) {
      setCredentials(msg.payload.state.credentials);
      setShowPasswordAction(msg.payload.state.showPasswordAction);
      setPasswordAction(msg.payload.state.passwordAction);
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

  /**
   * When user submit login form, check if we have the user credentials, then verify if he updated his password,
   * if so interact and ask him to update our saved password.
   * Otherwise (we dont have the current website credentials) interact and ask the user to save his password for the current website.
   */
  jq("form").submit(function (event) {
    const enteredPassword = jq("input:password").val();
    const enteredUsername = jq("input:text").val();

    // The user has changed the saved password ask him whether to update the password
    if (Object.keys(credentials).length !== 0 && credentials.password !== enteredPassword) {
      props.port.postMessage({
        type: ManagePasswordsActionsConstants.SET_MANAGE_PASSWORDS_STATE,
        payload: {value: {credentials: {username: enteredUsername, password: enteredPassword, url: credentials.url, id: credentials.id},
          showPasswordAction: true, passwordAction: "Update"}, key: "managePasswords"},
      });
    }

    // We dont have this website credentials, ask the user whether to store them
    else if (Object.keys(credentials).length === 0) {
      props.port.postMessage({
        type: ManagePasswordsActionsConstants.SET_MANAGE_PASSWORDS_STATE,
        payload: {value: {credentials: {username: enteredUsername, password: enteredPassword, url: window.location.toString(), id: credentials.id},
            showPasswordAction: true, passwordAction: "Save"}, key: "managePasswords"},
      });
    }
  });

  const injectSavedCredentials = () => {
    jq("input:text").val(credentials.username);
    jq("input:password").val(credentials.password);
  };

  return (
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
                  <ListItem button onClick={() => {
                    injectSavedCredentials();
                    setShowOptions(false)
                  }}>
                    <ListItemIcon>
                      <VpnKeyIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={credentials.username}
                        secondary={Array(credentials.password.length).fill("*")}
                    />
                  </ListItem>
                  <Divider/>
                  <ListItem button onClick={() => setShowOptions(false)}>
                    <ListItemText primary="Manage passwords"/>
                  </ListItem>
                </List>
              </Paper>
            </Fade>
        )}
      </Popper> : <PasswordAction port={props.port} credentials={credentials} action={passwordAction} />
  );
}
