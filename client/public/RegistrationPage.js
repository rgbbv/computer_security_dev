import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchClasses, fetchParticipants } from '../actions/registrationActions';
import { fetchInstructors } from '../actions/instructorsActions';
import RegistrationTable from './RegistrationTable'
import './RegistrationPage.css'

class RegistrationPage extends React.Component {

  // componentWillMount() {
  //   this.props.fetchParticipants()
  //   this.props.fetchClasses()
  //   this.props.fetchInstructors()
  // }

  render() {
      return (
        <div>
          <header>
            <h1>Registration system</h1>
          </header>
          <RegistrationTable />
        </div>
      )
  }
}


// RegistrationPage.propTypes = {
//   fetchParticipants: PropTypes.func.isRequired,
//   fetchClasses: PropTypes.func.isRequired,
//   fetchInstructors: PropTypes.func.isRequired,
// };

// const mapStateToProps = state => ({
//   classes: state.registration.classes,
//   amountRegistered: state.registration.amountRegistered,
//   instructors: state.instructors,
//   login: state.login,
//   userRegistered: state.registration.userRegistered,
//   userWaiting: state.registration.userWaiting
// });

// export default connect(mapStateToProps, { fetchClasses, fetchParticipants, fetchInstructors })(RegistrationPage);
export default RegistrationPage;