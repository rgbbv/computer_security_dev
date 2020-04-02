import React, { useState } from "react";
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
import { PasswordListActionsConstants } from "../../stores/PasswordList/Constants";

function PasswordList(props) {
  const [user, setUser] = useState(props.location.state.user);
  const [showPassword, setShowPassword] = useState(
    props.location.state.user.passwords.map((i) => false)
  );

  // It's actually update user because the http request is PUT with updated passwords list in the body.. but for mean time..
  props.port.onMessage.addListener(function (msg) {
    if (msg.type === PasswordListActionsConstants.UPDATE_PASSWORD_SUCCESS) {
      // handle success
    } else if (
      msg.type === PasswordListActionsConstants.UPDATE_PASSWORD_FAILURE
    ) {
      // handle failure
    }
  });

  return user.passwords.length !== 0 ? (
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
          {user.passwords.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.url}
              </TableCell>
              <TableCell>{row.username}</TableCell>
              <TableCell>
                <TextField
                  disabled
                  type={showPassword[index] ? "text" : "password"}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={() =>
                          setShowPassword(
                            showPassword.map((e, i) => (i === index ? !e : e))
                          )
                        }
                      >
                        {showPassword[index] ? (
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

export default PasswordList;
