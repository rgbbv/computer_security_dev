/*global chrome*/
import React, { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Button from '@material-ui/core/Button'
import PasswordList from './components/PasswordList'
import './App.css'

function App(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistered, setIsRegistered] = useState(true)
  const [passwordsList, setPasswordsList] = useState()
  const [userInfo, setUserInfo] = useState({})
  var port = chrome.runtime.connect({name: "client_port"})
  port.onMessage.addListener(function(msg) {
    if (msg.name === "logged in") {
      console.log('accepted logged in message')
      setIsLoggedIn(true)
      setUserInfo({email: msg.email, password: msg.password})
    }
    else if (msg.name === "registered") {
      console.log('accepted registered message')
      setIsRegistered(true)
      setIsLoggedIn(true)
    }
    else if (msg.name === "passwords list") {
      setPasswordsList(msg.passwords)
  }
    else {
      console.log(
        `got something else
        ${msg}`)
    }
  })
  
  if (!isLoggedIn && isRegistered) {
    return (
      <div id='app'>
        <Login port={port}/>
        <Button onClick={() => setIsRegistered(false)} variant="outlined"
         id='change'>not registered?</Button>
      </div>
    )
  }
  else if (!isRegistered) {
    return (
      <div id='app'>
      <Register port={port}/>
      <Button onClick={() => setIsRegistered(true)} variant="outlined"
       id='change'>already registered?</Button>
    </div>
    )
  }
  else {
    return (
      <div id='app'>
        <PasswordList passwords={passwordsList} />
      </div>
    )
  }
}

export default App
