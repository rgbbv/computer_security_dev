import React from "react";
import {render} from "react-dom";
import {Button} from "@material-ui/core";
import ManagePasswords from "./components/ManagePasswords";

const anchor = document.createElement('div');
anchor.id = 'rcr-anchor';

document.body.insertBefore(anchor, document.body.childNodes[0]);
render(
    <ManagePasswords />, document.getElementById('rcr-anchor'));
