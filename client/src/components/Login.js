/*global chrome*/
import React from "react";
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
} from "@material-ui/core";
import "./Login.css";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {history} from '../index';

class Login extends React.Component {
  state = { email: "", password: "", showPassword: false };

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  login = () => {
    // TODO: server password should derive from Hash (MasterPassword || 3)
    this.props.port.postMessage({
      type: "LOGIN",
      payload: {
        email: this.state.email,
        password: this.state.password,
      }
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
          <h3>Password Vault</h3>

          <TextField
            id="outlined-email"
            label="Email"
            value={this.state.email}
            onChange={this.onChangeEmail.bind(this)}
            margin="dense"
            variant="outlined"
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">
              MasterPassword
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
          <Button
            onClick={this.login.bind(this)}
            variant="contained"
            color="primary"
            id="button"
          >
            Login
          </Button>
          <Box
              display="flex"
              flexDirection="row"
              alignSelf="flex-start"
          >
            <Button size="small" onClick={() => history.push('register')}>
                Sign Up
            </Button>
          </Box>
        </Box>
    );
  }
}

export default Login;
