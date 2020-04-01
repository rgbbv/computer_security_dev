/*global chrome*/
import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "./Register.css";
import {
  FormControl,
  InputAdornment,
  IconButton,
  Avatar,
  OutlinedInput,
  InputLabel,
  CircularProgress,
  Box,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { RegisterActionsConstants } from "../stores/Register/Constants";

const port = chrome.runtime.connect({ name: "client_port" });
port.onMessage.addListener(function (msg) {
  if (msg.type === RegisterActionsConstants.REGISTER_SUCCESS) {
    console.log(msg.payload);
  } else if (msg.type === RegisterActionsConstants.REGISTER_FAILURE) {
    console.log(msg.payload);
  }
});

class Register extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    showPassword: false,
    isValidEmail: true,
    isRegisterLoading: false,
  };

  onChangeFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  onChangeLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  onChangeEmail(event) {
    this.setState({
      email: event.target.value,
      isValidEmail: RegExp("^([\\w.%+-]+)@([\\w-]+\\.)+([\\w]{2,})$").test(
        event.target.value
      ),
    });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  isValidForm = () => this.state.isValidEmail && this.state.firstName !== "";

  register = () => {
    this.setState({ isRegisterLoading: true });
    this.props.port.postMessage({
      type: RegisterActionsConstants.REGISTER,
      name: "register",
      payload: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      },
    });
  };

  render() {
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
            value={this.state.firstName}
            onChange={this.onChangeFirstName.bind(this)}
            margin="dense"
            variant="outlined"
          />
          <TextField
            id="outlined-lastName"
            label="Last name"
            value={this.state.lastName}
            onChange={this.onChangeLastName.bind(this)}
            margin="dense"
            variant="outlined"
          />
        </Box>
        <TextField
          fullWidth
          id="outlined-email"
          label="Email"
          value={this.state.email}
          onChange={this.onChangeEmail.bind(this)}
          margin="dense"
          variant="outlined"
          error={!this.state.isValidEmail}
          helperText={!this.state.isValidEmail ? "Invalid Email Address" : ""}
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={this.state.showPassword ? "text" : "password"}
            value={this.state.password}
            onChange={this.onChangePassword.bind(this)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={(event) => event.preventDefault()}
                  edge="end"
                >
                  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        {this.state.isRegisterLoading ? (
          <CircularProgress />
        ) : (
          <Button
            disabled={!this.isValidForm()}
            onClick={this.register.bind(this)}
            variant="contained"
            color="primary"
            id="button"
          >
            Register
          </Button>

        )}
      </Box>
    );
  }
}

export default Register;
