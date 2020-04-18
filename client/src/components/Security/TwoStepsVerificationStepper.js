/*global chrome*/
import React, {useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import ReactDOMServer from 'react-dom/server';
import {
    Avatar,
    Stepper,
    StepLabel,
    Step,
    Typography,
    Button,
    Box,
    Link,
    FormControlLabel,
    TextField,
    CircularProgress,
    Checkbox
} from "@material-ui/core";
import {Alert, AlertTitle} from '@material-ui/lab';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import {PersistenceActionsConstants} from "../../stores/Persistence/Constants";
import {SecurityActionsConstants} from "../../stores/Security/Constants";
import {LoginActionsConstants} from "../../stores/Login/Constants";
import {history} from "../../index";
import {HistoryConstants} from "../../stores/History/Constants";
import {UserActionsConstants} from "../../stores/User/Constants";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 600,
        height: 520
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export default function TwoStepsVerificationStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [isVerifyingPin, setIsVerifyingPin] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    // const [checked, setChecked] = React.useState(false);
    const steps = ['Download the Google authenticator app', 'Scan the QR code with the app', 'Enter the 6-digit code from the app'];

    props.port.onMessage.addListener(function (msg) {
        if (msg.type === SecurityActionsConstants.VALIDATE_PIN_SUCCESS) {
            if (msg.payload === "True") {
                setErrorMessage("");
                props.port.postMessage({
                    type: UserActionsConstants.UPDATE_USER,
                    payload: {
                        userData: {security: {twoStepsVerification: true, secret: props.secret}},
                        onSuccessType: SecurityActionsConstants.UPDATE_USER_SECURITY_SUCCESS,
                        onFailureType: SecurityActionsConstants.UPDATE_USER_SECURITY_FAILURE
                    }
                });
            } else {
                setIsVerifyingPin(false);
                setErrorMessage("PIN Rejected");
            }
        } else if (msg.type === SecurityActionsConstants.VALIDATE_PIN_FAILURE) {
            // Handle failure
        }
    });

    function validatePin(e) {
        const pin = e.target.value;
        if (pin.length === 6) {
            setIsVerifyingPin(true);
            props.port.postMessage({
                type: SecurityActionsConstants.VALIDATE_PIN,
                payload: {pin: pin, secret: props.secret}
            })
        }
    }

    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <Typography className={classes.instructions}>You'll be using a separate app to generate security codes</Typography>
                    <Avatar>
                        <SystemUpdateIcon />
                    </Avatar>
                    <Typography className={classes.instructions}>
                        Download the <Link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en"
                                        onClick={() => props.port.postMessage({
                                            type: PersistenceActionsConstants.OPEN_TAB,
                                            payload: {url: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en"}
                                        })}>
                            Google authenticator
                        </Link> app</Typography>
                </Box>);
            case 1:
                return (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                        alignItems="center"
                    >
                        <Alert severity="warning">
                            <AlertTitle>Important!</AlertTitle>
                            This key is used to connect the security app to PassVault.
                            print it or write it down and store it offline</Alert>
                        <Typography className={classes.instructions}>Use your new security app to scan the QR code</Typography>
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <div dangerouslySetInnerHTML={{ __html: props.QR }} />
                            <Typography className={classes.instructions}>Authentication Key:
                                {props.secret}
                            </Typography>
                        </Box>
                    </Box>
                    );
            case 2:
                return (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                        alignItems="center"
                    >
                        <Typography className={classes.instructions}>Enter the 6-digit code from your app:</Typography>
                        { !isVerifyingPin ?
                        <TextField error={errorMessage !== ""} helperText={errorMessage} required id="standard-required" label="Required" onChange={validatePin}/> :
                            <CircularProgress /> }
                        <Typography className={classes.instructions}>A new code is generated every 30 seconds</Typography>
                    </Box>
                );
            default:
                return 'Unknown stepIndex';
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {getStepContent(activeStep)}
                <div>
                    <Button
                        onClick={() => activeStep === 0 ? history.goBack() : setActiveStep((prevActiveStep) => prevActiveStep - 1)}
                        className={classes.backButton}
                    >
                        Back
                    </Button>
                    {activeStep !== steps.length - 1 ?
                    <Button variant="contained" color="primary" onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}>
                         Next
                    </Button> : undefined }
                </div>
            </div>
        </div>
    );
}
