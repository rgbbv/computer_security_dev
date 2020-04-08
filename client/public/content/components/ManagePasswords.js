/*global chrome*/
import React, {useState} from "react";
import {
    Button
} from "@material-ui/core";
import jq from 'jquery';

export default function Test(props) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    // props.port.onMessage.addListener(function (msg) {
    // });

    jq("input:password").on('input', function(event) {
        console.log(event.target.value);
        setPassword(event.target.value)
    });

    jq("input[type=email]").change(function(event) {
        console.log("email: " + event.target.value);
        setEmail(event.target.value);
    });

    jq("input:text").change(function(event) {
        console.log("username: " + event.target.value);
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
