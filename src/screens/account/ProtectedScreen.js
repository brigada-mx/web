import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Styles from 'src/Global.css'
import LoginScreen from './LoginScreen'


const ProtectedScreen = ({ children, token, history, location }) => {
  if (!token) {
    if (location.pathname !== '/cuenta') history.push('/cuenta')
    return <LoginScreen className={Styles.modalScreenWrapper} />
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

const ReduxScreen = withRouter(connect(mapStateToProps, null)(ProtectedScreen))

const protectedScreen = (WrappedComponent) => {
  const wrapped = (props) => {
    return <ReduxScreen><WrappedComponent {...props} /></ReduxScreen>
  }
  return wrapped
}

export default protectedScreen
export { ReduxScreen as ProtectedScreen }
