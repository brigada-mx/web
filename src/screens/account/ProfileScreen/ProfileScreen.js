import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import Styles from 'screens/account/Form.css'
import UserForm from './UserForm'
import ResetPasswordForm from './ResetPasswordForm'


class Profile extends React.Component {
  componentDidMount() {
    this.load()
  }

  load = () => {
    getBackoff(service.getMe, { key: 'me' })
  }

  handleSubmitName = async (values) => {
    const { data } = await service.updateMe(values)
    if (data) this.load()
  }

  handleSubmitPassword = async ({ oldPassword, password }) => {
    const { data } = await service.setPassword(oldPassword, password)
    if (data) {
      this.props.reset()
      this.props.onResponse('Cambiaste tu contraseña', 'success')
    } else this.props.onResponse('Contraseña actual incorrecta', 'error')
  }

  render() {
    return (
      <div className={Styles.formContainer}>
        <UserForm onSubmit={this.handleSubmitName} enableReinitialize />
        <ResetPasswordForm onSubmit={this.handleSubmitPassword} />
      </div>
    )
  }
}

Profile.propTypes = {
  onResponse: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onResponse: (message, status) => Actions.snackbar(dispatch, { message, status }),
    reset: () => dispatch(reset('resetPassword')),
  }
}

export default connect(null, mapDispatchToProps)(Profile)
