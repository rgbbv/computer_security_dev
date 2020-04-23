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
import { concat } from "lodash";

function AddPassword(props) {
    const [user, setUser] = useState(props.location.state.user);
    const [gotResponse, setGotResponse] = useState(false);
    const [addedToList, setAddedToList] = useState(false);
    const [url, setUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const addPassword = () => {
        props.port.postMessage({
        type: PasswordListActionsConstants.SAVE_PASSWORD,
            payload: {
                username: username, 
                password: password, 
                url: url}
          });
    }

    props.port.onMessage.addListener(function (msg) {
        if (msg.type === PasswordListActionsConstants.SAVE_PASSWORD_SUCCESS) {
            setUser(msg.payload);
            setUrl("");
            setUsername("");
            setPassword("");
            setGotResponse(true);
            setAddedToList(true);
        } else if (msg.type === PasswordListActionsConstants.SAVE_PASSWORD_FAILURE) {
            setGotResponse(true);
            setAddedToList(false);
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
                (addedToList ?
                    <Alert severity="success" onClose={() => {setGotResponse(false)}}>
                        <AlertTitle>Success</AlertTitle>
                        This password has been added to your Pass Vault
                    </Alert> :
                    <Alert severity="error" onClose={() => {setGotResponse(false)}}>
                        <AlertTitle>Error</AlertTitle>
                        Your password couldn't be added to your Pass Vault
                    </Alert>)
                    :<div />
                }
                <Paper>
                    <h1>Add password</h1>
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
                </Paper>
            <Button
                onClick={addPassword.bind(this)}
                variant="contained"
                color="primary"
                id="button"
                style={{marginLeft: "20%"}}
            >
            Add Password
            </Button>
        </div>
    )
}

export default AddPassword;