/*global chrome*/
import React, { useState } from "react";
import {
    Typography,
    Popper,
    Fade,
    Paper, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Button, Box,
} from "@material-ui/core";
import { PasswordListActionsConstants } from "../../../src/stores/PasswordList/Constants";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export default function PasswordAction(props) {
    const [isOpen, setIsOpen] = useState(true);
    const [username, setUsername] = useState(props.credentials ? props.credentials.username : "");
    const [password, setPassword] = useState(props.credentials ? props.credentials.password : "");
    const [url, setUrl] = useState(props.credentials ? props.credentials.url : "");
    const [anchorEl, setAnchorEl] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleClick = () => {
        setIsOpen(false);
        props.action === "Update" ?
            props.port.postMessage({
                type: PasswordListActionsConstants.UPDATE_PASSWORD,
                payload: {username: username, password: password, url: url}
            }) :
            props.port.postMessage({
                type: PasswordListActionsConstants.SAVE_PASSWORD,
                payload: {username: username, password: password, url: url}
            })
    };

    return (
        <Popper
            open={isOpen}
            anchorEl={anchorEl}
            placement="top"
            transition
        >
            {({TransitionProps}) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                {props.action} credentials?
                            </Typography>
                            <TextField
                                id="outlined-username"
                                defaultValue={username}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="outlined"
                                size="small"
                                disabled
                                fullWidth
                            />
                            <FormControl variant="outlined" size="small" disabled fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? "text" : "password"}
                                    defaultValue={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={(event) => event.preventDefault()}
                                                edge="end"
                                            >
                                                {!showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <Box
                                display="flex"
                                marginTop={5}
                                flexDirection="row"
                                justifyContent="space-around"
                                alignItems="center"
                            >
                                <Button
                                    onClick={handleClick}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    id="button"
                                >
                                    {props.action} credentials
                                </Button>
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                    id="button"
                                >
                                    No thanks
                                </Button>
                            </Box>
                            <Typography gutterBottom style={{maxWidth: 240}}>
                                <Box fontStyle="oblique" fontSize={12} m={1}>
                                    Passwords are saved in your Pass Vault
                                    account so you can use them on any device
                                </Box>
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            )}
        </Popper>
    )
}
