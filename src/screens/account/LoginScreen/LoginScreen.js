import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import LoginForm from './LoginForm'


const LoginScreen = ({ onLogin, snackbar }) => {
  const handleSubmit = async ({ email, password }) => {
    const { data } = await service.token(email, password)
    if (data) onLogin({ ...data, email })
    else snackbar('No reconocemos este email/contraseña', 'error')
  }

  return <LoginForm onSubmit={handleSubmit} />
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth }),
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(null, mapDispatchToProps)(LoginScreen)
