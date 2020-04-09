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
    const [username, setUsername] = useState(props.credentials.username);
    const [password, setPassword] = useState(props.credentials.password);
    const [url, setUrl] = useState(props.credentials.url);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

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
                                Update password?
                            </Typography>
                            <TextField
                                id="outlined-username"
                                label="Username"
                                defaultValue={username}
                                onChange={(e) => setUsername(e.target.value)}
                                margin="dense"
                                variant="outlined"
                            />
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">
                                    Password
                                </InputLabel>
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
                                    onClick={() => console.log("update")}
                                    variant="contained"
                                    color="primary"
                                    id="button"
                                >
                                    Update password?
                                </Button>
                                <Button
                                    onClick={() => console.log("no")}
                                    variant="contained"
                                    color="primary"
                                    id="button"
                                >
                                    No thanks
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            )}
        </Popper>
    )
}
