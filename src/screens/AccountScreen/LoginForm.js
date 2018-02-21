import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import Styles from './LoginForm.css'


class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmitLogin = () => {
    const { email, password } = this.state
    this.props.onSubmitLogin(email, password)
  }

  handleForgotPassword = () => {
    const { email } = this.state
    this.props.history.push({ pathname: '/password_email', state: { email } })
  }

  render() {
    const { email, password } = this.state
    const { disabled } = this.props
    return (
      <div className={Styles.formContainer}>
        <div>
          <TextField value={email} name="email" hintText="Email" onChange={this.handleChange} />
        </div>
        <div>
          <TextField value={password} name="password" hintText="Contraseña" onChange={this.handleChange} />
        </div>
        <RaisedButton className={Styles.button} disabled={disabled} label="INGRESAR" onClick={this.handleSubmitLogin} />
        <RaisedButton className={Styles.button} label="NO SÉ MI CONTRASEÑA" onClick={this.handleForgotPassword} />
      </div>
    )
  }
}

LoginForm.propTypes = {
  onSubmitLogin: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(LoginForm)
