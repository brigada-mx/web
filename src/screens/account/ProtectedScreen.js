import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Styles from 'src/Global.css'
import LoginScreen from './LoginScreen'


const ProtectedScreen = ({ children, orgToken, donorToken, history, location, type }) => {
  if (type === 'org' && !orgToken) {
    if (location.pathname !== '/cuenta') history.push('/cuenta')
    return <LoginScreen className={Styles.modalScreenWrapper} />
  }
  if (type === 'donor' && !donorToken) {
    if (location.pathname !== '/donador') history.push('/donador')
    return <LoginScreen className={Styles.modalScreenWrapper} />
  }
  return <React.Fragment>{children}</React.Fragment>
}

ProtectedScreen.propTypes = {
  children: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  orgToken: PropTypes.string,
  donorToken: PropTypes.string,
  type: PropTypes.oneOf(['org', 'donor']).isRequired,
}

const mapStateToProps = (state) => {
  const { token: orgToken } = state.auth.org || {}
  const { token: donorToken } = state.auth.donor || {}
  return { orgToken, donorToken }
}

const ReduxScreen = withRouter(connect(mapStateToProps, null)(ProtectedScreen))

const protectedScreen = (WrappedComponent, type = 'org') => {
  const wrapped = (props) => {
    return <ReduxScreen type={type}><WrappedComponent {...props} /></ReduxScreen>
  }
  return wrapped
}

export default protectedScreen
