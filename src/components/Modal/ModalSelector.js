import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import LoginScreen from 'screens/account/LoginScreen'
import PasswordEmailScreen from 'screens/account/PasswordEmailScreen'
import CreateAccountScreen from 'screens/account/CreateAccountScreen'
import DonorCreateAccountScreen from 'screens/account/CreateAccountScreen/DonorCreateAccountScreen'
import ChooseAccountTypeScreen from 'screens/account/CreateAccountScreen/ChooseAccountTypeScreen'
import AccountCreated from 'screens/account/AccountCreated'
import AccountVerified from 'screens/account/AccountCreated/AccountVerified'
import YouTubeVideo from 'components/YouTubeVideo'
import ChooseVolunteerOpportunity from 'components/ChooseVolunteerOpportunity'
import VolunteerApplicationScreen from 'screens/VolunteerApplicationScreen'
import VolunteerApplicationCreated from 'screens/VolunteerApplicationScreen/VolunteerApplicationCreated'
import Modal from './Modal'
import Styles from './Modal.css'


const componentByName = {
  login: LoginScreen,
  forgotPassword: PasswordEmailScreen,
  chooseAccountType: ChooseAccountTypeScreen,
  createAccount: CreateAccountScreen,
  donorCreateAccount: DonorCreateAccountScreen,
  accountCreated: AccountCreated,
  accountVerified: AccountVerified,
  youTubeVideo: YouTubeVideo,
  ctaVolunteer: ChooseVolunteerOpportunity,
  volunteerApplication: VolunteerApplicationScreen,
  volunteerApplicationCreated: VolunteerApplicationCreated,
}

const ModalSelector = (props) => {
  const { modalName, modalTransparent = false, modalWide = false, ...rest } = props
  const Component = componentByName[modalName]
  if (!Component) return null

  return (
    <Modal
      contentClassName={modalWide ? Styles.selectorContentWide : Styles.selectorContent}
      transparent={modalTransparent}
    >
      <Component {...rest} />
    </Modal>
  )
}

ModalSelector.propTypes = {
  modalName: PropTypes.string,
  modalClassName: PropTypes.string,
  modalTransparent: PropTypes.bool,
  modalWide: PropTypes.bool,
}

const mapStateToProps = (state) => {
  const { modalName, ...rest } = state.modal
  return { modalName, ...rest }
}

export default connect(mapStateToProps, null)(ModalSelector)
