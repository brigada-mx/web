import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service from 'api/service'
import LoginForm from './LoginForm'


const LoginScreen = ({ onLogin, snackbar, history, location }) => {
  const handleSubmit = async ({ email, password }) => {
    const { data } = await service.token(email, password)
    if (data) {
      onLogin({ ...data, email })
      if (location.pathname !== '/cuenta') history.push('/cuenta')
    } else {
      snackbar('No reconocemos este email/contraseña', 'error')
    }
  }

  return <LoginForm onSubmit={handleSubmit} />
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth }),
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(LoginScreen))
