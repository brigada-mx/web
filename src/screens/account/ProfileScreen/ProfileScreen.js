import React from 'react'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import service, { getBackoff } from 'api/service'
import Styles from 'screens/account/Form.css'
import UserForm from './UserForm'


class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fullName: '',
      oldPassword: '',
      password: '',
      _password: '',
      error: false,
    }
  }

  componentDidMount() {
    getBackoff(service.getMe, { key: 'me' })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmitName = async () => {
    const { fullName } = this.state
    if (!fullName) {
      this.setState({ error: true })
      return
    }

    this.setState({ disabled: true })
    const { data } = await service.updateMe({ fullName })
    if (data) {
      this.setState({ disabled: false, error: false })
    } else {
      this.setState({ disabled: false, error: true })
    }
  }

  handleSubmitPassword = async () => {
    const { oldPassword, password, _password } = this.state
    if (!oldPassword || password.length < 8 || password !== _password) {
      this.setState({ error: true })
      return
    }

    this.setState({ disabled: true })
    const { data } = await service.setPassword(oldPassword, password)
    if (data) {
      this.setState({ disabled: false, error: false })
    } else {
      this.setState({ disabled: false, error: true })
    }
  }

  render() {
    const { disabled, fullName, oldPassword, password, _password } = this.state
    return (
      <div className={Styles.formContainer}>
        <UserForm
          onChange={this.handleChange}
          onSubmitName={this.handleSubmitName}
          fullName={fullName}
          disabled={disabled}
        />

        <div>
          <TextField
            type="password"
            name="oldPassword"
            value={oldPassword}
            hintText="Contraseña actual"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <TextField
            type="password"
            name="password"
            value={password}
            hintText="Contraseña nueva"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <TextField
            type="password"
            name="_password"
            value={_password}
            hintText="Confirmar contraseña nueva"
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

export default Profile
