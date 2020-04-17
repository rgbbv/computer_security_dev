/*global chrome*/
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    FormControlLabel,
    Switch,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Divider, IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Typography,
} from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import SecurityIcon from '@material-ui/icons/Security';
import { LoginActionsConstants } from "../../stores/Login/Constants";
import {HistoryConstants} from "../../stores/History/Constants";
import { history } from "../../index";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles({
    root: {
        maxWidth: 500,
    },
    media: {
        height: 140,
    },
});


export default function TwoStepsVerification(props) {
    const classes = useStyles();
    // TODO: Should saved in DB
    const [enabled, setEnabled] = React.useState(false);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            alignItems="center"
        >
        <Box alignSelf="flex-start">
            <IconButton aria-label="arrow-back" size="small" onClick={() => history.goBack() }>
                <ArrowBackIcon fontSize="inherit" />
            </IconButton>
        </Box>
            <Card className={classes.root} elevation={0} >
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={`/assets/2-steps-verification.jpg`}
                        title="2-Steps Verification"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            2-Steps Verification
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            The Two-factor authentication feature represents an extra layer of security for PassVault
                            accounts and is designed to ensure that the account owner is the only person who may access
                            their account, even if someone knows their password.
                            Upon logging in to your account, you will be asked to provide two pieces of information: your
                            password and a 6-digit authentication code.
                            We support Google Authenticator and suggest that you install the app on a separate device (e.g.
                            mobile phone).
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enabled}
                                onChange={() => setEnabled(!enabled)}
                                name="checked"
                                color="primary"
                            />
                        }
                        label={enabled ? "Disable" : "Enable"}
                        labelPlacement="start"
                    />
                </CardActions>
            </Card>
        </Box>
    );
}
