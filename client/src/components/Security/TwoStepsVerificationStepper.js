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
    Checkbox
} from "@material-ui/core";
import {Alert, AlertTitle} from '@material-ui/lab';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import {PersistenceActionsConstants} from "../../stores/Persistence/Constants";

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
    const [checked, setChecked] = React.useState(false);
    const steps = ['Download the Google authenticator app', 'Scan the QR code with the app', 'Enter the 6-digit code from the app'];

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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) => setChecked(!checked)}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="I have read the important note"
                        />
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
                        <TextField required id="standard-required" label="Required" />
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
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <Button onClick={() => setActiveStep(0)}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        {getStepContent(activeStep)}
                        <div>
                            <Button
                                disabled={activeStep === 0}
                                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
                                className={classes.backButton}
                            >
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
