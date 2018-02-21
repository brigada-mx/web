import React from 'react'
import PropTypes from 'prop-types'

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

  render() {
    const { disabled } = this.props
    return (
      <div className={Styles.formContainer}>
        <div><TextField name="email" hintText="Email" onChange={this.handleChange} /></div>
        <div><TextField name="password" hintText="Contraseña" onChange={this.handleChange} /></div>
        <RaisedButton disabled={disabled} label="INGRESAR" onClick={this.handleSubmitLogin} />
      </div>
    )
  }
}

LoginForm.propTypes = {
  onSubmitLogin: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default LoginForm
