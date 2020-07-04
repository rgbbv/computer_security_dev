import React, { useState } from "react";
import { 
    Paper,
    TextField,
    Button,
    Box,
    IconButton,
 } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import {PasswordListActionsConstants} from "../../stores/PasswordList/Constants";
import CloseIcon from '@material-ui/icons/Close';
import {HistoryConstants} from "../../stores/History/Constants";
import { history } from "../../index";
import PasswordStrengthMeter from "../../helpers/PasswordStrengthMeter";

function UpdatePassword(props) {
    const [user, setUser] = useState(props.location.state.user);
    const [gotResponse, setGotResponse] = useState(false);
    const [editEntry, setEditEntry] = useState(false);
    const [credentials, setCredentials] = useState(
        props.location.state.credentials === undefined ?
         JSON.parse(localStorage.getItem("credentials")) : props.location.state.credentials
         );
    const [url, setUrl] = useState(credentials.url);
    const [username, setUsername] = useState(credentials.username);
    const [password, setPassword] = useState(credentials.password);

    const updatePassword = () => {
        props.port.postMessage({
        type: PasswordListActionsConstants.UPDATE_PASSWORD,
            payload: {...credentials, url: url, username: username, password: password, index: props.location.state.index},
          });
    }

    props.port.onMessage.addListener(function (msg) {
        if (msg.type === PasswordListActionsConstants.UPDATE_PASSWORD_SUCCESS) {
            history.push(HistoryConstants.HOME, {user: msg.payload.user});
            props.port.postMessage({
                type: HistoryConstants.CHANGE_HISTORY,
                payload: {history: HistoryConstants.HOME}
            });

        } else if (msg.type === PasswordListActionsConstants.UPDATE_PASSWORD_FAILURE) {
            setGotResponse(true);
            setEditEntry(false);
        }
      });

    return (
        <div id="form">
            <Box alignSelf="flex-start">
                <IconButton aria-label="close" size="small" onClick={() => {
                    history.push(HistoryConstants.HOME, {user: user});
                    props.port.postMessage({
                        type: HistoryConstants.CHANGE_HISTORY,
                        payload: {history: HistoryConstants.HOME}
                    });
                    }} >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </Box>
            {gotResponse ? 
                (editEntry ?
                    <Alert severity="success" onClose={() => {setGotResponse(false)}}>
                        <AlertTitle>Success</AlertTitle>
                        This password has been updated in your Pass Vault
                    </Alert> :
                    <Alert severity="error" onClose={() => {setGotResponse(false)}}>
                        <AlertTitle>Error</AlertTitle>
                        Your password couldn't be updated in your Pass Vault
                    </Alert>)
                    :<div />
                }
                <Paper style={{alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <h1>Update password</h1>
                    <TextField
                        label="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        margin="dense"
                    />
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="dense"
                    />
                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="dense"
                    />
                    <PasswordStrengthMeter password={password} />
                </Paper>
            <Button
                onClick={updatePassword.bind(this)}
                variant="contained"
                color="primary"
                id="button"
                style={{marginLeft: "15%"}}
            >
            update Password
            </Button>
        </div>
    )
}

export default UpdatePassword;
