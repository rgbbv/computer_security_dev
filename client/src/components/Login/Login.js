/*global chrome*/
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton,
  Avatar,
  OutlinedInput,
  InputLabel,
  Box,
  CircularProgress,
} from "@material-ui/core";
import "./Login.css";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { history } from "../../index";
import { LoginActionsConstants } from "../../stores/Login/Constants";

function Login(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === LoginActionsConstants.LOGIN_SUCCESS) {
      setErrorMessage("");
      setLoginLoading(false);
      history.push("/passwordsList", msg.payload);
    } else if (msg.type === LoginActionsConstants.LOGIN_FAILURE) {
      setLoginLoading(false);
      setErrorMessage(msg.payload.errorMessage);
    }
  });

  function login() {
    setLoginLoading(true);
    // TODO: server password should derive from Hash (MasterPassword || 3)
    props.port.postMessage({
      type: LoginActionsConstants.LOGIN,
      payload: {
        email: email,
        password: password,
      },
    });
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <div style={{ "margin-top": 10 }}>
        <Avatar>
          <LockIcon />
        </Avatar>
      </div>
      <h3>Password Vault</h3>

      <TextField
        id="outlined-email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="dense"
        variant="outlined"
      />
      <FormControl variant="outlined" fullWidth error={!!errorMessage}>
        <InputLabel htmlFor="outlined-adornment-password">
          MasterPassword
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {!showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id="component-error-text">
          {errorMessage ? errorMessage : ""}
        </FormHelperText>
      </FormControl>
      {!loginLoading ? (
        <Button
          onClick={() => login()}
          variant="contained"
          color="primary"
          id="button"
        >
          Login
        </Button>
      ) : (
        <CircularProgress />
      )}
      <Box display="flex" flexDirection="row" alignSelf="flex-start">
        <p>Not Registered? </p>
        <Button size="small" onClick={() => history.push("register")}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
