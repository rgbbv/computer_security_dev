/*global chrome*/
import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './Login.css'

class Login extends React.Component {
    state = { email: '', password: '' }

    onChangeEmail(event) {
        this.setState({email: event.target.value})
    }
    
    onChangePassword(event) {
        this.setState({password: event.target.value})
    }

    login = () => {
      var port = this.props.port
      port.postMessage({name: "login", email: this.state.email, password: this.state.password  })
    }

    render () {
              return (
                
            <div id="welcomer">
                <h1>Welcome to the password vault</h1>
                <form className="form">
                  <TextField id="outlined-email" label="Email" value={this.state.email}
                    onChange={this.onChangeEmail.bind(this)} margin="dense" variant="outlined" />
                  <TextField id="outlined-password" label="Password" value={this.state.password}
                    onChange={this.onChangePassword.bind(this)} margin="dense" variant="outlined" />
                <Button onClick={this.login.bind(this)} variant="contained" color="primary"
                id='button'>Login</Button>
                </form>
            </div>
        )
    }
}

export default Login