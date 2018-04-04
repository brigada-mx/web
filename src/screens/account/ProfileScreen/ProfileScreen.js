import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import FormStyles from 'src/Form.css'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import UserForm from './UserForm'
import ResetPasswordForm from './ResetPasswordForm'
import ResetSecretKeyForm from './ResetSecretKeyForm'


class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resetKeyOpen: false,
    }
  }

  componentDidMount() {
    document.title = 'Perfil - Brigada'
    this.loadMe()
    this.loadOrganization()
  }

  loadMe = () => {
    getBackoff(service.getMe, { key: 'orgMe' })
  }

  loadOrganization = () => {
    getBackoff(service.accountGetOrganization, { key: 'accountOrganization' })
  }

  handleSubmitName = async (values) => {
    const { data } = await service.updateMe(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadMe()
    this.props.snackbar('Cambiaste tu nombre', 'success')
  }

  handleSubmitPassword = async ({ old_password, password }) => {
    const { data } = await service.setPassword(old_password, password)
    if (!data) {
      this.props.snackbar('Contraseña actual incorrecta', 'error')
      return
    }
    this.props.reset()
    this.props.snackbar('Cambiaste tu contraseña', 'success')
  }

  handleResetKeyOpen = () => {
    this.setState({ resetKeyOpen: true })
  }

  handleResetKeyClose = () => {
    this.setState({ resetKeyOpen: false })
  }

  handleResetKey = async (values) => {
    const { data } = await service.accountResetKey()
    this.setState({ resetKeyOpen: false })
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Cambiaste la llave secreta de tu organización', 'success')
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancelar"
        primary
        onClick={this.handleResetKeyClose}
      />,
      <FlatButton
        label="Cambiar"
        primary
        onClick={this.handleResetKey}
      />,
    ]

    return (
      <WithSideNav navComponents={<BackButton to="/cuenta" />}>
        <div className={FormStyles.formContainer}>
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>Tu nombre</div>
            <UserForm type="org" form="orgMe" onSubmit={this.handleSubmitName} enableReinitialize />
          </div>
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>Tu contraseña</div>
            <ResetPasswordForm form="orgResetPassword" onSubmit={this.handleSubmitPassword} />
          </div>
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>Tu llave secreta</div>
            <ResetSecretKeyForm onSubmit={this.handleResetKeyOpen} enableReinitialize />
          </div>
          <Dialog
            title="¡Cuidado!"
            actions={actions}
            modal={false}
            open={this.state.resetKeyOpen}
            onRequestClose={this.handleResetKeyClose}
          >
            {'Si cambias tu llave secreta, tendrás que mandar la nueva llave a todas las personas que suben fotos a tu organización.'}
          </Dialog>
        </div>
      </WithSideNav>
    )
  }
}

Profile.propTypes = {
  snackbar: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    reset: () => dispatch(reset('orgResetPassword')),
  }
}

export default connect(null, mapDispatchToProps)(Profile)
