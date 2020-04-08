/*global chrome*/
import React from "react";
import {render} from "react-dom";
import ManagePasswords from "./components/ManagePasswords";
import jq from "jquery";

const port = chrome.runtime.connect({ name: "client_port" });

const anchor = document.createElement('div');
anchor.id = 'rcr-anchor';
jq("input:password").after(anchor);
// document.body.insertBefore(anchor, document.body.childNodes[0]);
render(
    <ManagePasswords port={port}/>, document.getElementById('rcr-anchor'));
