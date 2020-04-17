/*global chrome*/
import React from "react";
import {
    Avatar,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar
} from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { makeStyles } from '@material-ui/core/styles';
import SecurityIcon from '@material-ui/icons/Security';
import { LoginActionsConstants } from "../../stores/Login/Constants";
import {HistoryConstants} from "../../stores/History/Constants";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { history } from "../../index";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function UserProfile(props) {
  const classes = useStyles();
  const [openSecurityMenu, setOpenSecurityMenu] = React.useState(false);

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === LoginActionsConstants.LOGOUT_SUCCESS) {
      history.push(HistoryConstants.LOGIN);
      props.port.postMessage({
        type: HistoryConstants.CHANGE_HISTORY,
        payload: {history: HistoryConstants.LOGIN}
      });
    } else if (msg.type === LoginActionsConstants.LOGOUT_FAILURE) {
      // Handle failure
    }
  });

  return (
    <List component="nav" aria-label="main mailbox folders">
        <ListItem button onClick={() => setOpenSecurityMenu(!openSecurityMenu)}>
            <ListItemIcon>
                <SecurityIcon />
            </ListItemIcon>
            <ListItemText primary="Security" />
            {openSecurityMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSecurityMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                    <ListItemAvatar >
                        <Avatar
                            alt="s"
                            src={`/assets/2-steps-verification.jpg`}
                        />
                    </ListItemAvatar >
                    <ListItemText primary="2-Steps Verification" />
                </ListItem>
            </List>
        </Collapse>
        <Divider />
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
