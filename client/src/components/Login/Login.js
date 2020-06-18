/*global chrome*/
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
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
  TextField, Typography,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { history } from "../../index";
import { LoginActionsConstants } from "../../stores/Login/Constants";
import {HistoryConstants} from "../../stores/History/Constants";
import {SecurityActionsConstants} from "../../stores/Security/Constants";

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

function Login(props) {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [res, setRes] = useState({});
  const [showTwoStep, setShowTwoStep] = useState(false);
  const [isVerifyingPin, setIsVerifyingPin] = React.useState(false);

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === LoginActionsConstants.LOGIN_SUCCESS || msg.type === SecurityActionsConstants.VALIDATE_PIN_SERVER_SUCCESS) {
      setErrorMessage("");
      setLoginLoading(false);
      setIsVerifyingPin(false);
      history.push(HistoryConstants.HOME, msg.payload);
      props.port.postMessage({
        type: HistoryConstants.CHANGE_HISTORY,
        payload: {history: HistoryConstants.HOME}
      });
    } else if (msg.type === LoginActionsConstants.LOGIN_FAILURE) {
      setLoginLoading(false);
      setErrorMessage(msg.payload.errorMessage);
    } else if (msg.type === LoginActionsConstants.TWO_STEPS_VERIFICATION) {
      setRes(msg.payload);
      setLoginLoading(false);
      setShowTwoStep(true);
    } else if (msg.type === SecurityActionsConstants.VALIDATE_PIN_SERVER_FAILURE) {
      setErrorMessage(msg.payload.errorMessage);
      setIsVerifyingPin(false);
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

  function validatePin(e) {
    const pin = e.target.value;
    if (pin.length === 6) {
      setIsVerifyingPin(true);
      props.port.postMessage({
        type: SecurityActionsConstants.VALIDATE_PIN_SERVER,
        payload: {pin: pin, accessToken: res.accessToken}
      })
    }
  }

  return (
      <div style={{ width: 200, height: 300, margin: "auto"}}>
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
      { !showTwoStep ?
          <div>
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
          </div>
          :
          <div>
            <Typography className={classes.instructions}>Enter the 6-digit code from your app:</Typography>
            <TextField disabled={isVerifyingPin} error={errorMessage !== ""} helperText={errorMessage} required id="standard-required" label="Required" onChange={validatePin}/>
            {isVerifyingPin ? <CircularProgress /> : undefined}
          </div>
          }
    </Box>
      </div>
  );
}

export default Login;
