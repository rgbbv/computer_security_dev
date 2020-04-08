/*global chrome*/
import React, {useState} from "react";
import {
    Button
} from "@material-ui/core";
import jq from 'jquery';
import { PasswordListActionsConstants } from '../../../src/stores/PasswordList/Constants'

export default function Test(props) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [getCredentials, setGetCredentials] = useState(false);
    const [credentials, setCredentials] = useState({});

    if (!getCredentials)
        props.port.postMessage({type: PasswordListActionsConstants.GET_CREDENTIALS, payload: {url: window.location.toString()}});

    props.port.onMessage.addListener(function (msg) {
        if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS_SUCCESS) {
            console.log(msg.payload.credentials);
            setCredentials(msg.payload.credentials);
            setGetCredentials(true);
        } else if (msg.type === PasswordListActionsConstants.GET_CREDENTIALS_FAILURE) {
            console.log('b');
            setGetCredentials(true);
        }
    });

    jq("input:password").on('input', function(event) {
        // console.log(event.target.value);
        setPassword(event.target.value)
    });

    jq("input[type=email]").change(function(event) {
        // console.log("email: " + event.target.value);
        setEmail(event.target.value);
    });

    jq("input:text").change(function(event) {
        // console.log("username: " + event.target.value);
        setUsername(event.target.value);
    });


    return (
        <div>
            <p>Username: {username}</p>
            <p>Password: {password}</p>
            <p>Email: {email}</p>
        </div>
    );
}
