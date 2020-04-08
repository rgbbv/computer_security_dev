/*global chrome*/
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
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
import VpnKeyIcon from "@material-ui/icons/VpnKey";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 200,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Test(props) {
  const [password, setPassword] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [getCredentials, setGetCredentials] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const classes = useStyles();

  if (!getCredentials)
    props.port.postMessage({
      type: PasswordListActionsConstants.GET_CREDENTIALS,
      payload: { url: window.location.toString() },
    });

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS_SUCCESS) {
      // console.log(msg.payload.credentials);
      setCredentials(msg.payload.credentials);
      setGetCredentials(true);
    } else if (
      msg.type === PasswordListActionsConstants.GET_CREDENTIALS_FAILURE
    ) {
      // console.log('b');
      setGetCredentials(true);
    }
  });

  jq("input:password").on("input", function (event) {
    // console.log(event.target.value);
    setPassword(event.target.value);
  });

  jq("input:password").on("focusin", function (event) {
    // Checking if we have the credentials for this site
    if (Object.keys(credentials).length !== 0) {
      setShowOptions(true);
    }
  });

  // jq("input:password").on('focusout', function (event) {
  //     setShowOptions(false);
  // });

  jq("input[type=email]").change(function (event) {
    // console.log("email: " + event.target.value);
    setEmail(event.target.value);
  });

  jq("input:text").change(function (event) {
    // console.log("username: " + event.target.value);
    setUsername(event.target.value);
  });

  return (
    <Popper
      open={showOptions}
      anchorEl={anchorEl}
      placement="bottom"
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button onClick={() => setShowOptions(false)}>
                <ListItemIcon>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={credentials.username}
                  secondary={Array(credentials.password.length).fill("*")}
                />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => setShowOptions(false)}>
                <ListItemText primary="Manage passwords" />
              </ListItem>
            </List>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
