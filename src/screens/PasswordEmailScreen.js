import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import service from 'api/service'
import Styles from 'screens/AccountScreen/LoginForm.css'


class PasswordEmailScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.location.state.email || '',
      disabled: false,
      error: false,
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = async () => {
    this.setState({ disabled: true })
    const { data } = await service.sendSetPasswordEmail(this.state.email)
    if (data) this.props.history.push('/cuenta')
    this.setState({ disabled: false, error: true })
  }

  render() {
    const { email, disabled } = this.state
    return (
      <div className={Styles.formContainer}>
        <div><TextField name="email" value={email} hintText="Email" onChange={this.handleChange} /></div>
        <RaisedButton className={Styles.button} disabled={disabled} label="ENVIAR EMAIL" onClick={this.handleSubmit} />
      </div>
    )
  }
}

PasswordEmailScreen.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(PasswordEmailScreen)
