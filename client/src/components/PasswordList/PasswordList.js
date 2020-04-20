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
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {filter} from 'lodash';
import {HistoryConstants} from "../../stores/History/Constants";
import { history } from "../../index";

function PasswordList(props) {
  const [search, setSearch] = useState("");
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
    const replaced_url = url.replace("https://","").replace("www.","");
    const splits = replaced_url.split("/", 2);
    return splits[0];
  }

  const switchToAddPassword = () => {
    history.push(HistoryConstants.ADD_PASSWORD, {user: user});
    props.port.postMessage({
      type: HistoryConstants.CHANGE_HISTORY,
      payload: {history: HistoryConstants.ADD_PASSWORD}
    });
  };

  const switchToUpdatePassword = (credentials) => {
    history.push(HistoryConstants.UPDATE_PASSWORD, {user: user, credentials: credentials});
    props.port.postMessage({
      type: HistoryConstants.CHANGE_HISTORY,
      payload: {
        history:HistoryConstants.UPDATE_PASSWORD,
      }
    })
  }

  return user.passwords.length !== 0 ? (
    <div>
      <div id="search" style={{display: "flex"}}>
        <TextField label="Search field" type="search" size="small" fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Paper elevation={3} style={{minWidth: "60px", height: "115px"}}>
          <h2 style={{textAlign: "center", marginBottom: "auto"}}>Add password</h2>
          <AddBoxIcon color="secondary" style={{ fontSize: 50, display: "inline", width: "100" }}
           onClick={switchToAddPassword.bind(this)}>Add password</AddBoxIcon>
        </Paper>

      </div>
      <TableContainer component={Paper} style={{ maxHeight: "330px", paddingBottom: "50px" }} >
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>URL</TableCell>
              <TableCell style={{fontWeight: "bold"}}>UserName</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Password</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {filter(user.passwords, (entry) => showAddress(entry.url).includes(search)).map((row, index) => (
              <TableRow key={row.name}>
                <TableCell style={{ maxWidth: "100px", overflowX: "scroll", overflowY: "hidden"}} component="th" scope="row">
                  {showAddress(row.url)}
                </TableCell>
                <TableCell style={{ maxWidth: "20px", overflowX: "hidden", overflowY: "hidden"}}
                >{row.username}</TableCell>
                <TableCell style={{ width: "180px" }}>
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
                <EditIcon 
                  position="end" aria-label="edit"
                  onClick={switchToUpdatePassword.bind(this, row)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : (
    <p> You dont have any saved passwords yet </p>
  );
}

export default PasswordList;
