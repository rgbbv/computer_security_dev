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
  Popover,
  Typography,
} from "@material-ui/core";
import {Visibility, VisibilityOff}  from "@material-ui/icons";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import { PasswordListActionsConstants } from "../../stores/PasswordList/Constants";
import {findIndex} from "lodash";

function PasswordList(props) {
  const [user, setUser] = useState(props.location.state.user);
  const [showPassword, setShowPassword] = useState(
    props.location.state.user.passwords.map((i) => false)
  );
  const [corruptedMsg, setCorruptedMsg] = React.useState(null);

  const handleClickCorrupted = (event) => {
    setCorruptedMsg(event.currentTarget);
  };

  const handleCloseCorrupted = (event) => {
    setCorruptedMsg(null);
  };

  const open = Boolean(corruptedMsg);
  const id = open ? 'simple-popover' : undefined;

  const isCorrupted = (url) =>{
    console.log(`url: ${url}`);
    const corrupted = user.corrupted;
    return findIndex(corrupted, ['url', url]) === -1;
  }

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
                <div style={{display: "flex"}}>
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
                {isCorrupted(row.name) ?
                <div title="The password has been corrupted!">
                <ReportProblemIcon
                 color="secondary" position="end" 
                 onClick={handleClickCorrupted} aria-label="corrupted">
                 </ReportProblemIcon>
                  {/* <Popover
                  id={id}
                  open={open}
                  corruptedMsg={corruptedMsg}
                  onClose={handleCloseCorrupted}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography >The password was corrupted!</Typography>
                </Popover> */}
                </div>:
                <div/>}
                </div>
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
