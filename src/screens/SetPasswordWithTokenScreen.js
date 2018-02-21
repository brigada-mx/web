import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import service from 'api/service'
import { parseQs } from 'tools/string'
import Styles from 'screens/AccountScreen/LoginForm.css'


class SetPasswordWithTokenScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      _password: '',
      disabled: false,
      error: false,
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = async () => {
    const { password, _password } = this.state
    if (password.length < 8 || password !== _password) {
      this.setState({ error: true })
      return
    }

    const params = parseQs(this.props.location.search)
    const { token = '' } = params

    this.setState({ disabled: true })
    const { data } = await service.setPasswordWithToken(token, password)
    if (data) this.props.history.push('/cuenta')
    this.setState({ disabled: false, error: true })
  }

  render() {
    const { disabled, password, _password } = this.state
    return (
      <div className={Styles.formContainer}>
        <div><TextField name="password" value={password} hintText="Contraseña" onChange={this.handleChange} /></div>
        <div><TextField name="_password" value={_password} hintText="Confirmar contraseña" onChange={this.handleChange} /></div>
        <RaisedButton className={Styles.button} disabled={disabled} label="RESTABLECER" onClick={this.handleSubmit} />
      </div>
    )
  }
}

SetPasswordWithTokenScreen.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(SetPasswordWithTokenScreen)
