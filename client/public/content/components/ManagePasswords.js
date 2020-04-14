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
      type: PersistenceActionsConstants.GET_STATE,
      payload: {key: "managePasswords", onSuccessType: ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE_SUCCESS,
                onFailureType: ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE_FAILURE},
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
      setCredentials(msg.payload.state.credentials || {});
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

    // The user has changed the saved password / username ask him whether to update
    if (Object.keys(credentials).length !== 0 && (credentials.password !== enteredPassword ||
        credentials.username !== enteredUsername)) {
      props.port.postMessage({
        type: PersistenceActionsConstants.SET_STATE,
        payload: {value: {credentials: {username: enteredUsername, password: enteredPassword, url: credentials.url, id: credentials.id},
          showPasswordAction: true, passwordAction: "Update"}, key: "managePasswords"},
      });
    }

    // We dont have this website credentials, ask the user whether to store them
    else if (Object.keys(credentials).length === 0) {
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
