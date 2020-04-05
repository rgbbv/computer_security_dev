import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Badge,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from "@material-ui/core";
import InfoIcon from '@material-ui/icons/Info';
import {history} from "../../index";
import {NotificationActionsConstants} from "../../stores/Notification/Constants";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '50ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

function Notifications(props) {
    const classes = useStyles();

    const [user] = useState(props.location.state.user);
    const [notifications, setNotifications] = useState(props.location.state.user.notifications);
    const [selectedIndex, setSelectedIndex] = useState();

    props.port.onMessage.addListener(function (msg) {
        if (msg.type === NotificationActionsConstants.UPDATE_NOTIFICATION_SUCCESS) {
            setNotifications(msg.payload.notifications);
        } else if (msg.type === NotificationActionsConstants.UPDATE_NOTIFICATION_FAILURE) {
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

    return (
        <List className={classes.root}>
            { notifications.reverse().map((item, index) =>
            <ListItem button selected={index === selectedIndex} alignItems="flex-start" onClick={() => handleListItemClick(index)}>
                <ListItemIcon>
                    {!item.read ?
                    <Badge color="primary" variant="dot">
                        <InfoIcon/>
                    </Badge> :
                        <InfoIcon/> }
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
                            {index === selectedIndex ? " — " + item.content : " — " + item.content.substring(0, 50) + "..."}
                        </React.Fragment>
                    }
                />
                <Divider variant="inset" component="li" />
            </ListItem>
        )}
        </List>
    )
}

export default Notifications;
