import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Badge,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { NotificationActionsConstants } from "../../stores/Notification/Constants";
import { formatDistance, parseISO } from "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "40px",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

function Notifications(props) {
  const classes = useStyles();

  const [user] = useState(props.location.state.user);
  const [notifications, setNotifications] = useState(
    props.location.state.user.notifications
  );
  const [selectedIndex, setSelectedIndex] = useState();

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === NotificationActionsConstants.UPDATE_NOTIFICATION_SUCCESS) {
      setNotifications(msg.payload.notifications);
    } else if (
      msg.type === NotificationActionsConstants.UPDATE_NOTIFICATION_FAILURE
    ) {
      // Handle failure
    }
  });

  function handleListItemClick(index) {
    if (index === selectedIndex) {
      setSelectedIndex(-1);
    } else if (!notifications[index]["read"]) {
      setSelectedIndex(index);
      notifications[index]["read"] = true;
      props.port.postMessage({
        type: NotificationActionsConstants.UPDATE_NOTIFICATION,
        payload: {
          userId: user.id,
          notification: notifications[index],
        },
      });
    } else {
      setSelectedIndex(index);
    }
  }

  return notifications.length !== 0 ? (
    <List className={classes.root}>
      {notifications.reduceRight(
        (acc, item, index) =>
          acc.concat(
            <ListItem
              button
              selected={index === selectedIndex}
              alignItems="flex-start"
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>
                {!item.read ? (
                  <Badge color="primary" variant="dot">
                    <InfoIcon />
                  </Badge>
                ) : (
                  <InfoIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary="Notification"
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {item.sender}
                    </Typography>
                    {index === selectedIndex
                      ? " — " + item.content + "\n"
                      : " — " + item.content.substring(0, 50) + "...\n"}
                    <Typography component="span">
                      {formatDistance(parseISO(item.date), new Date()) + " ago"}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Divider variant="inset" component="li" />
            </ListItem>
          ),
        []
      )}
    </List>
  ) : (
    <p> You dont have any notifications </p>
  );
}

export default Notifications;
