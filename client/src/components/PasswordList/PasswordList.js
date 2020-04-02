import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

class PasswordList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.location.state.user,
      showPassword: props.location.state.user.passwords.map((i) => false),
    };
  }

  render() {
    return this.state.user.passwords.length !== 0 ? (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>UserName</TableCell>
              <TableCell>Password</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.user.passwords.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.url}
                </TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>
                  <TextField
                    disabled
                    type={this.state.showPassword[index] ? "text" : "password"}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          onClick={() =>
                            this.setState({
                              showPassword: this.state.showPassword.map(
                                (e, i) => (i === index ? !e : e)
                              ),
                            })
                          }
                        >
                          {this.state.showPassword[index] ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    defaultValue={row.password}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <p> You dont have any saved passwords yet </p>
    );
  }
}

export default PasswordList;
