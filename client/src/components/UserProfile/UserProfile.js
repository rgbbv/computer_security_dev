/*global chrome*/
import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { LoginActionsConstants } from "../../stores/Login/Constants";
import { history } from "../../index";

export default function UserProfile(props) {
  props.port.onMessage.addListener(function (msg) {
    if (msg.type === LoginActionsConstants.LOGOUT_SUCCESS) {
      history.push("/login");
    } else if (msg.type === LoginActionsConstants.LOGOUT_SUCCESS) {
      // Handle failure
    }
  });

  return (
    <List component="nav" aria-label="main mailbox folders">
      <ListItem
        button
        onClick={() =>
          props.port.postMessage({
            type: LoginActionsConstants.LOGOUT,
            payload: {},
          })
        }
      >
        <ListItemIcon>
          <PowerSettingsNewIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
      <Divider />
    </List>
  );
}
