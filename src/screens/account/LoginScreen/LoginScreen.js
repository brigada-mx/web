import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import LoginForm from './LoginForm'


const LoginScreen = ({ onLogin, onResponse }) => {
  const handleSubmit = async ({ email, password }) => {
    const { data } = await service.token(email, password)
    if (data) onLogin({ ...data, email })
  }

  return <LoginForm onSubmit={handleSubmit} />
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth }),
    onResponse: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(null, mapDispatchToProps)(LoginScreen)
