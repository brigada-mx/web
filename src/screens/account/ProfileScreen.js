import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import service from 'api/service'
import Styles from 'screens/account/LoginForm.css'


class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      password: '',
      _password: '',
      error: false,
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmitName = async () => {
    const { name } = this.state
    if (!name) {
      this.setState({ error: true })
      return
    }

    this.setState({ disabled: true })
    const { data } = await service.updateMe(name)
    if (data) {
      this.setState({ disabled: false, error: false })
    } else {
      this.setState({ disabled: false, error: true })
    }
  }

  handleSubmitPassword = async () => {
    const { password, _password } = this.state
    if (password.length < 8 || password !== _password) {
      this.setState({ error: true })
      return
    }

    this.setState({ disabled: true })
    const { data } = await service.setPassword(password)
    if (data) {
      this.setState({ disabled: false, error: false })
    } else {
      this.setState({ disabled: false, error: true })
    }
  }

  render() {
    const { disabled, name, password, _password } = this.state
    return (
      <div className={Styles.formContainer}>
        <div><TextField name="name" value={name} hintText="Nombre completo" onChange={this.handleChange} /></div>
        <RaisedButton className={Styles.button} disabled={disabled} label="ACTUALIZAR" onClick={this.handleSubmitName} />

        <div>
          <TextField
            type="password"
            name="password"
            value={password}
            hintText="Contraseña"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <TextField
            type="password"
            name="_password"
            value={_password}
            hintText="Confirmar
            contraseña"
            onChange={this.handleChange}
          />
        </div>
        <RaisedButton className={Styles.button} disabled={disabled} label="CAMBIAR CONTRASEÑA" onClick={this.handleSubmitPassword} />
      </div>
    )
  }
}

Profile.propTypes = {
}

export default withRouter(Profile)
