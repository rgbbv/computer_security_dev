/*global chrome*/
import React, {useState} from "react";
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
    IconButton,
    Typography,
    CircularProgress,
} from "@material-ui/core";
import { history } from "../../index";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {SecurityActionsConstants} from "../../stores/Security/Constants";
import {UserActionsConstants} from "../../stores/User/Constants";
import TwoStepsVerificationStepper from "./TwoStepsVerificationStepper";

const useStyles = makeStyles({
    root: {
        width: 500,
    },
    media: {
        maxWidth: 140,
        height: 140,
    },
});


export default function TwoStepsVerification(props) {
    const classes = useStyles();
    const [user, setUser] = useState(props.location.state.user);
    const [showStepper, setShowStepper] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [QR, setQR] = useState("");
    const [secret, setSecret] = useState("");

    props.port.onMessage.addListener(function (msg) {
        if (msg.type === SecurityActionsConstants.UPDATE_USER_SECURITY_SUCCESS) {
            setIsLoading(false);
            setUser(msg.payload);
            //    navigate to QR scan
        } else if (msg.type === SecurityActionsConstants.UPDATE_USER_SECURITY_FAILURE) {
            setIsLoading(false);
        } else if (msg.type === SecurityActionsConstants.GET_QR_CODE_SUCCESS) {
            setQR(msg.payload.QR);
            setSecret(msg.payload.secret);
            setIsLoading(false);
            setShowStepper(true);
        }
    });

    const handleSecurityChangeClick = () => {
        setIsLoading(true);
        props.port.postMessage({
            type: UserActionsConstants.UPDATE_USER,
            payload: {
                userData: {security: {twoStepsVerification: !user.security.twoStepsVerification}},
                onSuccessType: SecurityActionsConstants.UPDATE_USER_SECURITY_SUCCESS,
                onFailureType: SecurityActionsConstants.UPDATE_USER_SECURITY_FAILURE
            }
        })
    };

    const enableTwoStepsVerification = () => {
        !user.security.twoStepsVerification ? props.port.postMessage({
            type: SecurityActionsConstants.GET_QR_CODE,
            payload: user
        }) : console.log("s")
    };

    return (
        !showStepper ?
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
                    {!isLoading ?
                    <FormControlLabel
                        control={
                            <Switch
                                checked={user.security.twoStepsVerification}
                                onChange={enableTwoStepsVerification}
                                name="checked"
                                color="primary"
                            />
                        }
                        label={user.security.twoStepsVerification ? "Disable" : "Enable"}
                        labelPlacement="start"
                    /> : <CircularProgress />}
                </CardActions>
            </Card>
        </Box> : <TwoStepsVerificationStepper {...props} QR={QR} secret={secret} />
    );
}
