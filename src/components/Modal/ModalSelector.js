import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import LoginScreen from 'screens/account/LoginScreen'
import PasswordEmailScreen from 'screens/account/PasswordEmailScreen'
import CreateAccountScreen from 'screens/account/CreateAccountScreen'
import DonorCreateAccountScreen from 'screens/account/CreateAccountScreen/DonorCreateAccountScreen'
import ChooseAccountTypeScreen from 'screens/account/CreateAccountScreen/ChooseAccountTypeScreen'
import CreateSubmissionScreen from 'screens/account/CreateSubmissionScreen'
import CreateTestimonialScreen from 'screens/account/CreateTestimonialScreen'
import AccountCreated from 'screens/account/AccountCreated'
import AccountVerified from 'screens/account/AccountCreated/AccountVerified'
import YouTubeVideo from 'components/YouTubeVideo'
import ChooseVolunteerOpportunity from 'components/ChooseVolunteerOpportunity'
import VolunteerApplicationScreen from 'screens/VolunteerApplicationScreen'
import VolunteerApplicationCreated from 'screens/VolunteerApplicationScreen/VolunteerApplicationCreated'
import ShareUserScreen from 'screens/ShareUserScreen'
import ShareUserCreated from 'screens/ShareUserScreen/ShareUserCreated'
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
  shareUser: ShareUserScreen,
  shareUserCreated: ShareUserCreated,
  createSubmission: CreateSubmissionScreen,
  createTestimonial: CreateTestimonialScreen,
}

const ModalSelector = ({
  modalName,
  modalClassName = '',
  modalTransparent = false,
  modalWide = false,
  modalPadded = true,
  modalCancelShortcut = true,
  ...rest
}) => {
  const Component = componentByName[modalName]
  if (!Component) return null

  return (
    <Modal
      contentClassName={modalClassName || modalWide ? Styles.selectorContentWide : Styles.selectorContent}
      transparent={modalTransparent}
      padded={modalPadded}
      cancelShortcut={modalCancelShortcut}
    >
      <Component {...rest} />
    </Modal>
  )
}

ModalSelector.propTypes = {
  modalName: PropTypes.string,
  modalClassName: PropTypes.string,
  modalTransparent: PropTypes.bool,
  modalPadded: PropTypes.bool,
  modalWide: PropTypes.bool,
  modalCancelShortcut: PropTypes.bool,
}

const mapStateToProps = (state) => {
  return state.modal
}

export default connect(mapStateToProps, null)(ModalSelector)
