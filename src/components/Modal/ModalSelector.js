import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import LoginScreen from 'screens/account/LoginScreen'
import PasswordEmailScreen from 'screens/account/PasswordEmailScreen'
import Modal from './Modal'
import Styles from './Modal.css'


const componentByName = {
  login: LoginScreen,
  forgotPassword: PasswordEmailScreen,
}

const ModalSelector = (props) => {
  const { modalName, ...rest } = props
  const Component = componentByName[modalName]
  if (!Component) return null

  return <Modal><Component {...rest} /></Modal>
}

ModalSelector.propTypes = {
  modalName: PropTypes.string,
}

const mapStateToProps = (state) => {
  const { modalName, ...rest } = state.modal
  return { modalName, ...rest }
}

export default connect(mapStateToProps, null)(ModalSelector)
