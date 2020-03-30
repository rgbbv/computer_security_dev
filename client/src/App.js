/*global chrome*/
import React, { useState } from 'react';
import Login from './components/Login'
import PasswordList from './components/PasswordList'
import './App.css';


function App(props) {
  const [logStatus, setStatus] = useState(false);
  var alreadyRegistered = true
  const [passwordsList, setPasswords] = useState();
  var port = chrome.runtime.connect({name: "knockknock"});
  port.onMessage.addListener(function(msg) {
    if (msg.question == "logged in") {
      console.log('accepted logged in message')
      setStatus(true)
    }
    else if (msg.name == "passwords list") {
      setPasswords(msg.passwords)
  }
    else {
      console.log(
        `got something else
        ${msg}`)
    }
  });

  toRegister = () => {
    alreadyRegistered = false 
  }

  toLogin = () => {
    alreadyRegistered = true 
  }
  
  
  if (!logStatus && !alreadyRegistered) {
    return (
      <div id='app'>
        <Login port={port}/>
        <Button onClick={this.toRegister.bind(this)} variant="contained" color="primary"
         id='change'>need to register?</Button>
      </div>
    )
  }
  else if (!registerStatus) {
    return (
      <div id='app'>
      <Register port={port}/>
      <Button onClick={this.toLogin.bind(this)} variant="contained" color="primary"
       id='change'>already registered?</Button>
    </div>
    )
  }
  else {
    return (
      <div id='app'>
        <PasswordList passwords={passwordsList}/>
      </div>
    )
  }
}

export default App;
