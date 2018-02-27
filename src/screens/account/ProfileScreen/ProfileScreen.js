import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import Styles from 'screens/account/Form.css'
import UserForm from './UserForm'
import ResetPasswordForm from './ResetPasswordForm'
import ResetSecretKeyForm from './ResetSecretKeyForm'


class Profile extends React.Component {
  componentDidMount() {
    this.loadMe()
    this.loadOrganization()
  }

  loadMe = () => {
    getBackoff(service.getMe, { key: 'me' })
  }

  loadOrganization = () => {
    getBackoff(service.getAccountOrganization, { key: 'accountOrganization' })
  }

  handleSubmitName = async (values) => {
    const { data } = await service.updateMe(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadMe()
    this.props.snackbar('Cambiaste tu nombre', 'success')
  }

  handleSubmitPassword = async ({ old_password, password }) => {
    const { data } = await service.setPassword(old_password, password)
    if (!data) {
      this.props.snackbar('Contraseña actual incorrecta', 'error')
      return
    }
    this.props.reset()
    this.props.snackbar('Cambiaste tu contraseña', 'success')
  }

  handleResetKey = async (values) => {
    if (window.confirm('¡Cuidado! Si cambias tu llave secreta, tendrás que mandar la nueva llave a todas las personas que suben fotos a tu organización.')) {
      const { data } = await service.resetAccountKey(values)
      if (!data) {
        this.props.snackbar('Hubo un error', 'error')
        return
      }
      this.loadOrganization()
      this.props.snackbar('Cambiaste la llave secreta de tu organización', 'success')
    }
  }

  render() {
    return (
      <div className={Styles.formContainer}>
        <UserForm onSubmit={this.handleSubmitName} enableReinitialize />
        <ResetPasswordForm onSubmit={this.handleSubmitPassword} />
        <ResetSecretKeyForm onSubmit={this.handleResetKey} enableReinitialize />
      </div>
    )
  }
}

Profile.propTypes = {
  snackbar: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    reset: () => dispatch(reset('resetPassword')),
  }
}

export default connect(null, mapDispatchToProps)(Profile)
