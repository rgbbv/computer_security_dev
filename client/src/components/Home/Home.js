/*global chrome*/
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import Notifications from "../Notifications/Notifications";
import PasswordList from "../PasswordList/PasswordList";
import NotificationsIcon from "@material-ui/icons/Notifications";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import PersonIcon from "@material-ui/icons/Person";
import UserProfile from "../UserProfile/UserProfile";

const useStyles = makeStyles({
  stickToBottom: {
    width: "100%",
    position: "fixed",
    backgroundColor: "white",
    bottom: 0,
  },
});

export default function Home(props) {
  const classes = useStyles();
  const [user] = useState(props.location.state.user);
  const [value, setValue] = useState(1);

  const menuMap = [
    <Notifications {...props} />,
    <PasswordList {...props} />,
    <UserProfile {...props} />,
  ];

  return (
    <div style={{ width: 550, height: 200 }}>
      {menuMap[value]}
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.stickToBottom}
      >
        <BottomNavigationAction
          label="Notifications"
          icon={
            <Badge
              color="primary"
              badgeContent={
                user.notifications.filter((item) => !item.read).length
              }
            >
              <NotificationsIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="Passwords" icon={<VpnKeyIcon />} />
        <BottomNavigationAction label="Account" icon={<PersonIcon />} />
      </BottomNavigation>
    </div>
  );
}
