import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import LoginScreen from './LoginScreen'


const ProtectedScreen = ({ children, token, history, location }) => {
  if (!token) {
    if (location.pathname !== '/cuenta') history.push('/cuenta')
    return <LoginScreen />
  }
  return <React.Fragment>{children}</React.Fragment>
}

ProtectedScreen.propTypes = {
  children: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  token: PropTypes.string,
}

const mapStateToProps = (state) => {
  const { token } = state.auth || {}
  return { token }
}

const Screen = withRouter(connect(mapStateToProps, null)(ProtectedScreen))

const protectedScreen = (WrappedComponent) => {
  const wrapped = () => {
    return <Screen><WrappedComponent /></Screen>
  }
  return wrapped
}

export default protectedScreen
export { Screen as ProtectedScreen }
