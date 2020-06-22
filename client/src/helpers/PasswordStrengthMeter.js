import React, { Component } from 'react';
import './PasswordStrengthMeter.css';

class PasswordStrengthMeter extends Component {

  createPasswordLabel = (result) => {
    switch (result) {
      case 0:
        return 'Weak';
      case 1:
        return 'Fair';
      case 2:
        return 'Good';
      case 3:
        return 'Strong';
      default:
        return 'Weak';
    }
  }

  calculateStrength = (password) => {
    if (RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^#&(){}[:;<>,.?/~_+=|]).{8,}$").test(password))
      return 3;
    if (RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$").test(password))
      return 2; 
    if (RegExp("(?=.*[a-z])(?=.*[A-Z]).{4,}$").test(password))
      return 1;
    return 0;
  }

  render() {
    const { password } = this.props;
    const strength = this.calculateStrength(password);
    return (
      <div className="password-strength-meter">
        <progress
          className={`password-strength-meter-progress strength-${this.createPasswordLabel(strength)}`}
          value={strength}
          max="3"
        />
        <br />
        <label
          className="password-strength-meter-label"
        >
          {password && (
            <>
              <strong>Password strength:</strong> {this.createPasswordLabel(strength)}
            </>
          )}
        </label>
      </div>
    );
  }
}

export default PasswordStrengthMeter;