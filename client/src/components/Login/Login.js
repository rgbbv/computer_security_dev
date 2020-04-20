/*global chrome*/
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton,
  Avatar,
  OutlinedInput,
  InputLabel,
  Box,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { history } from "../../index";
import { LoginActionsConstants } from "../../stores/Login/Constants";
import {HistoryConstants} from "../../stores/History/Constants";

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
      history.push(HistoryConstants.HOME, msg.payload);
      props.port.postMessage({
        type: HistoryConstants.CHANGE_HISTORY,
        payload: {history: HistoryConstants.HOME}
      });
    } else if (msg.type === LoginActionsConstants.LOGIN_FAILURE) {
      setLoginLoading(false);
      setErrorMessage(msg.payload.errorMessage);
    }
  });

  const switchToRegister = () => {
    history.push(HistoryConstants.REGISTER);
    props.port.postMessage({
      type: HistoryConstants.CHANGE_HISTORY,
      payload: {history: HistoryConstants.REGISTER}
    });
  };

  function login() {
    setLoginLoading(true);
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
      <h3>Pass Vault</h3>

      <TextField
        id="outlined-email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="dense"
        variant="outlined"
      />
      <FormControl variant="outlined" margin="dense" error={!!errorMessage}>
        <InputLabel htmlFor="outlined-adornment-password">
          Master Password
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
        <Button size="small" onClick={switchToRegister.bind(this)}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
