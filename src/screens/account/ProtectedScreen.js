import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import GlobalStyles from 'src/Global.css'
import LoginScreen from './LoginScreen'


const loginUrl = (type, pathname) => {
  const base = { org: '/cuenta', donor: '/donador' }[type]
  if (!pathname.startsWith(base) || pathname === base || pathname === `${base}/`) return base
  return `${base}?next=${pathname}`
}

const ProtectedScreen = ({ children, orgToken, donorToken, history, location, type }) => {
  const { pathname } = location
  if (type === 'org' && !orgToken) {
    if (pathname !== '/cuenta') history.push(loginUrl('org', pathname))
    return <LoginScreen type="org" className={GlobalStyles.modalScreenWrapper} />
  }
  if (type === 'donor' && !donorToken) {
    if (pathname !== '/donador') history.push(loginUrl('donor', pathname))
    return <LoginScreen type="donor" className={GlobalStyles.modalScreenWrapper} />
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
