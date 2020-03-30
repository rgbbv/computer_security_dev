/*global chrome*/
import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './Register.css'

class Register extends React.Component {
    state = { firstName: '', lastName: '', email: '', password: ''}

    onChangeFirstName(event) {
      this.setState({firstName: event.target.value})
    }

    onChangeLastName(event) {
      this.setState({lastName: event.target.value})
    }

    onChangeEmail(event) {
        this.setState({email: event.target.value})
    }
    
    onChangePassword(event) {
        this.setState({password: event.target.value})
    }

    register = () => {
      var port = this.props.port;
      port.postMessage({name: "register"})
    }

    render () {
              return (
            <div id="welcomer">
                <h1>Welcome to the password vault</h1>
                <form className="form">
                  <TextField id="outlined-firstName" label="First name" value={this.state.firstName}
                    onChange={this.onChangeFirstName.bind(this)} margin="dense" variant="outlined" />
                  <TextField id="outlined-lastName" label="Last name" value={this.state.lastName}
                    onChange={this.onChangeLastName.bind(this)} margin="dense" variant="outlined" />
                  <TextField id="outlined-email" label="Email" value={this.state.email}
                    onChange={this.onChangeEmail.bind(this)} margin="dense" variant="outlined" />
                  <TextField id="outlined-password" label="Password" value={this.state.password}
                    onChange={this.onChangePassword.bind(this)} margin="dense" variant="outlined" />
                <Button onClick={this.register.bind(this)} variant="contained" color="primary"
                id='button'>Register</Button>
                </form>
            </div>
        )
    }
}

export default Register;