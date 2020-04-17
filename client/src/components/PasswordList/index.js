/*global chrome*/
import React from "react";
import {render} from "react-dom";
import PasswordList from "./PasswordList";
import {PersistenceActionsConstants} from "../../stores/Persistence/Constants";
import {ManagePasswordsActionsConstants} from "../../stores/ManagePasswords/Constants";

const port = chrome.runtime.connect({ name: "client_port" });

port.postMessage({type: PersistenceActionsConstants.GET_STATE, payload: {key: "user",
    onSuccessType: ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_USER_STATE_SUCCESS,
    onFailureType: ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_STATE_FAILURE,
        getAndDelete: false}});

port.onMessage.addListener(function (msg) {
    if (msg.type === ManagePasswordsActionsConstants.GET_MANAGE_PASSWORDS_USER_STATE_SUCCESS) {
        const anchor = document.createElement('div');
        anchor.id = 'manage-passwords';
        document.body.insertBefore(anchor, document.body.childNodes[0]);
        render(
            <PasswordList port={port} location={{state: {user: msg.payload.state}}}  />, document.getElementById('manage-passwords'));
    }
});
