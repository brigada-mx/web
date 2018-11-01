import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Modal from 'components/Modal'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import FormStyles from 'src/Form.css'
import UserForm from './UserForm'
import CreateUserForm from './CreateUserForm'
import ResetPasswordForm from './ResetPasswordForm'
import ResetSecretKeyForm from './ResetSecretKeyForm'
import UserTable from './UserTable'


class Profile extends React.Component {
  state = { resetKeyOpen: false, createUserModal: false }

  componentDidMount() {
    document.title = 'Perfil - Brigada'
    this.loadMe()
    this.loadUsers()
    this.loadOrganization()
  }

  loadMe = () => {
    getBackoff(service.getMe, { key: 'orgMe' })
  }

  loadUsers = () => {
    getBackoff(service.accountGetUsers, { key: 'accountUsers' })
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
    this.loadUsers()
    this.props.snackbar('Cambiaste tu nombre', 'success')
  }

  handleSubmitPassword = async ({ old_password, password }) => {
    const { data } = await service.setPassword(old_password, password)
    this.props.reset()
    if (!data) {
      this.props.snackbar('Contraseña actual incorrecta', 'error')
      return
    }
    this.props.snackbar('Cambiaste tu contraseña', 'success')
  }

  handleResetKeyOpen = () => {
    this.setState({ resetKeyOpen: true })
  }

  handleResetKeyClose = () => {
    this.setState({ resetKeyOpen: false })
  }

  handleResetKey = async () => {
    const { data } = await service.accountResetKey()
    this.setState({ resetKeyOpen: false })
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Cambiaste la llave secreta de tu grupo', 'success')
  }

  handleCreateUser = async (body) => {
    const { data } = await service.accountCreateUser(body)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadUsers()
    this.handleToggleCreateUserModal(false)
    this.props.snackbar('Creaste un nuevo usuario para tu organización', 'success')
  }

  handleToggleMainuser = async (id, value) => {
    const { data } = await service.accountUpdateUser(id, { is_mainuser: value })
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadUsers()
    const msg = value ? 'Este usuario ya es administrador, puede crear y administrar otros usuarios' : 'Este usuario ya no es administrador'
    this.props.snackbar(msg, 'success', 5000)
  }

  handleToggleIsActive = async (id, value) => {
    const { data } = await service.accountUpdateUser(id, { is_active: value })
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadUsers()
    const msg = value ? 'Activaste este usuario, ya puede ingresar a su cuenta' : 'Bloqueaste este usuario, se ha cerrada su sesión y no podrá ingresar a su cuenta'
    this.props.snackbar(msg, 'success', 5000)
  }

  handleToggleCreateUserModal = (open) => {
    this.setState({ createUserModal: open })
  }

  render() {
    const { me, users } = this.props
    const { createUserModal } = this.state

    if (!me.email || !users.length) return <LoadingIndicatorCircle />

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
            <div className={FormStyles.sectionHeader}>
              <span>Nuestros usuarios</span>
              {me.is_mainuser &&
                <RaisedButton
                  backgroundColor="#3DC59F"
                  labelColor="#ffffff"
                  className={FormStyles.primaryButton}
                  label="Agregar"
                  onClick={() => this.handleToggleCreateUserModal(true)}
                />
              }
            </div>
            {users.length > 0 &&
              <UserTable
                users={users}
                me={me}
                onToggleMainuser={this.handleToggleMainuser}
                onToggleIsActive={this.handleToggleIsActive}
              />
            }
          </div>

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
            {'Si cambias tu llave secreta, tendrás que mandar la nueva llave a toda persona que sube fotos a tu grupo.'}
          </Dialog>
        </div>

        {createUserModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateUserModal(false)}
          >
            <div className={FormStyles.sectionHeader}>Agrega otro usuario a tu organización</div>
            <CreateUserForm onSubmit={this.handleCreateUser} />
          </Modal>
        }
      </WithSideNav>
    )
  }
}

Profile.propTypes = {
  snackbar: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  me: PropTypes.object,
  users: PropTypes.arrayOf(PropTypes.object),
}

Profile.defaultProps = {
  me: {},
  users: [],
}

const mapStateToProps = (state) => {
  try {
    return { me: state.getter.orgMe.data, users: state.getter.accountUsers.data.results }
  } catch (e) {
    return {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    reset: () => dispatch(reset('orgResetPassword')),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
