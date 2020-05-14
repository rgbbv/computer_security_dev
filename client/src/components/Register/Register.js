/*global chrome*/
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  FormControl,
  InputAdornment,
  IconButton,
  Avatar,
  OutlinedInput,
  InputLabel,
  CircularProgress,
  Box,
  FormHelperText,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CloseIcon from '@material-ui/icons/Close';
import { RegisterActionsConstants } from "../../stores/Register/Constants";
import {HistoryConstants} from "../../stores/History/Constants";
import { history } from "../../index";

function Register(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidForm, setIsValidForm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [strength, setStrength] = useState("");

  props.port.onMessage.addListener(function (msg) {
    if (msg.type === RegisterActionsConstants.REGISTER_SUCCESS) {
      setErrorMessage("");
      setRegisterLoading(false);
      history.push(HistoryConstants.HOME, msg.payload);
      props.port.postMessage({
        type: HistoryConstants.CHANGE_HISTORY,
        payload: {history: HistoryConstants.HOME}
      });
    } else if (msg.type === RegisterActionsConstants.REGISTER_FAILURE) {
      setRegisterLoading(false);
      setErrorMessage(msg.payload.errorMessage);
    }
  });

  function onChangeEmail(event) {
    setEmail(event.target.value);
  }

  function checkValidEmail() {
    setIsValidEmail((RegExp("^([\\w.%+-]+)@([\\w-]+\\.)+([\\w]{2,})$").test(email)));
  }

  function checkValidForm() {
    return email !== "" && firstName !== "" && password !== "";
  }

  function preRegister() {
    checkValidEmail();
    if (!isValidEmail) {
      register();
    }
  }

  function register() {
    setRegisterLoading(true);
    props.port.postMessage({
      type: RegisterActionsConstants.REGISTER,
      payload: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      },
    });
  }

  return (
      <div style={{ width: 200, height: 300}}>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <Box alignSelf="flex-start">
        <IconButton aria-label="close" size="small" onClick={() => {
            history.push(HistoryConstants.LOGIN);
            props.port.postMessage({
              type: HistoryConstants.CHANGE_HISTORY,
              payload: {history: HistoryConstants.LOGIN}
            });
          
        }} >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <div style={{ "margin-top": 10 }}>
        <Avatar>
          <LockIcon />
        </Avatar>
      </div>
      <h3>Sign Up</h3>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <TextField
          id="outlined-firstName"
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          margin="dense"
          variant="outlined"
        />
        <TextField
          id="outlined-lastName"
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          margin="dense"
          variant="outlined"
        />
      </Box>
      <TextField
        fullWidth
        id="outlined-email"
        label="Email"
        value={email}
        onChange={onChangeEmail}
        margin="dense"
        variant="outlined"
        error={!isValidEmail}
        helperText={!isValidEmail ? "Invalid Email Address" : ""}
      />
      <FormControl variant="outlined" fullWidth error={!!errorMessage}>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
      {registerLoading ? (
        <CircularProgress />
      ) : (
        <Button
          disabled={!checkValidForm()}
          onClick={() => preRegister()}
          variant="contained"
          color="primary"
          id="button"
        >
          Register
        </Button>
      )}
    </Box>
      </div>
  );
}

export default Register;
