import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import LoginScreen from 'screens/account/LoginScreen'
import PasswordEmailScreen from 'screens/account/PasswordEmailScreen'
import CreateAccountScreen from 'screens/account/CreateAccountScreen'
import DonorCreateAccountScreen from 'screens/account/CreateAccountScreen/DonorCreateAccountScreen'
import AccountCreated from 'screens/account/AccountCreated'
import AccountVerified from 'screens/account/AccountCreated/AccountVerified'
import Modal from './Modal'
import Styles from './Modal.css'


const componentByName = {
  login: LoginScreen,
  forgotPassword: PasswordEmailScreen,
  createAccount: CreateAccountScreen,
  donorCreateAccount: DonorCreateAccountScreen,
  accountCreated: AccountCreated,
  accountVerified: AccountVerified,
}

const ModalSelector = (props) => {
  const { modalName, ...rest } = props
  const Component = componentByName[modalName]
  if (!Component) return null

  return <Modal contentClassName={Styles.selectorContent}><Component {...rest} /></Modal>
}

ModalSelector.propTypes = {
  modalName: PropTypes.string,
}

const mapStateToProps = (state) => {
  const { modalName, ...rest } = state.modal
  return { modalName, ...rest }
}

export default connect(mapStateToProps, null)(ModalSelector)
