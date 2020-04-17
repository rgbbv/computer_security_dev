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
import {Visibility, VisibilityOff}  from "@material-ui/icons";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

function PasswordList(props) {
  const [user, setUser] = useState(props.location.state.user);
  const [showPassword, setShowPassword] = useState(
    props.location.state.user.passwords.map(() => false)
  );
  const [corruptedMsg, setCorruptedMsg] = React.useState(null);

  const open = Boolean(corruptedMsg);
  const id = open ? 'simple-popover' : undefined;

  const isCorrupted = (url) => {
    return user.corrupted.some((item) => item.url === url);
  };

  const showAddress = (url) => {
    const splits = url.split("/", 4);
    return splits.length < 4 ? url : url.split(splits[3])[0];
  };

  return user.passwords.length !== 0 ? (
    <TableContainer component={Paper} style={{ maxHeight: "330px", paddingBottom: "50px" }} >
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>UserName</TableCell>
            <TableCell>Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {user.passwords.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell style={{ maxWidth: "100px", overflowX: "scroll", overflowY: "hidden"}} component="th" scope="row">
                {showAddress(row.url)}
              </TableCell>
              <TableCell style={{ maxWidth: "20px", overflowX: "hidden", overflowY: "hidden"}}
              >{row.username}</TableCell>
              <TableCell style={{ minWidth: "50px" }}>
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
                {isCorrupted(row.url) ?
                <div title="The password has been corrupted!" id="corrupted">
                <ReportProblemIcon
                 color="secondary" position="end" 
                 aria-label="corrupted">
                 </ReportProblemIcon>
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
