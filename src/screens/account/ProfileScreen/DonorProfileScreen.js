import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import FormStyles from 'src/Form.css'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import UserForm from './UserForm'
import ResetPasswordForm from './ResetPasswordForm'


class DonorProfile extends React.Component {
  componentDidMount() {
    document.title = 'Perfil - Brigada'
    this.loadMe()
  }

  loadMe = () => {
    getBackoff(service.donorGetMe, { key: 'donorMe' })
  }

  handleSubmitName = async (values) => {
    const { data } = await service.donorUpdateMe(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadMe()
    this.props.snackbar('Cambiaste tu nombre', 'success')
  }

  handleSubmitPassword = async ({ old_password, password }) => {
    const { data } = await service.donorSetPassword(old_password, password)
    if (!data) {
      this.props.snackbar('Contraseña actual incorrecta', 'error')
      return
    }
    this.props.reset()
    this.props.snackbar('Cambiaste tu contraseña', 'success')
  }

  render() {
    return (
      <WithSideNav navComponents={<BackButton to="/donador" />}>
        <div className={FormStyles.formContainer}>
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>Tu nombre</div>
            <UserForm type="donor" form="donorMe" onSubmit={this.handleSubmitName} enableReinitialize />
          </div>
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>Tu contraseña</div>
            <ResetPasswordForm form="donorResetPassword" onSubmit={this.handleSubmitPassword} />
          </div>
        </div>
      </WithSideNav>
    )
  }
}

DonorProfile.propTypes = {
  snackbar: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    reset: () => dispatch(reset('donorResetPassword')),
  }
}

export default connect(null, mapDispatchToProps)(DonorProfile)
