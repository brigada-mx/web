import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import LoginScreen from './LoginScreen'
import HomeScreen from './HomeScreen'


const AccountScreen = ({ token }) => {
  if (!token) return <LoginScreen />
  return <HomeScreen />
}

const mapStateToProps = (state) => {
  const { token } = state.auth || {}
  return { token }
}

AccountScreen.propTypes = {
  token: PropTypes.string,
}

export default connect(mapStateToProps, null)(AccountScreen)
