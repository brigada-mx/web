import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Modal from 'components/Modal'
import FormStyles from 'src/Form.css'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import CreateUserForm from './CreateUserForm'
import UserForm from './UserForm'
import ResetPasswordForm from './ResetPasswordForm'
import UserTable from './UserTable'


class DonorProfile extends React.Component {
  state = { createUserModal: false }

  componentDidMount() {
    document.title = 'Perfil Donador - Brigada'
    this.loadUsers()
    this.loadMe()
  }

  loadMe = () => {
    getBackoff(service.donorGetMe, { key: 'donorMe' })
  }

  loadUsers = () => {
    getBackoff(service.donorGetUsers, { key: 'donorUsers' })
  }

  handleSubmitName = async (values) => {
    const { data } = await service.donorUpdateMe(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadMe()
    this.loadUsers()
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

  handleCreateUser = async (body) => {
    const { data } = await service.donorCreateUser(body)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadUsers()
    this.handleToggleCreateUserModal(false)
    this.props.snackbar('Creaste un nuevo usuario para tu organización', 'success')
  }

  handleToggleMainuser = async (id, value) => {
    const { data } = await service.donorUpdateUser(id, { is_mainuser: value })
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadUsers()
    const msg = value ? 'Este usuario ya es administrador, puede crear y administrar otros usuarios' : 'Este usuario ya no es administrador'
    this.props.snackbar(msg, 'success', 5000)
  }

  handleToggleIsActive = async (id, value) => {
    const { data } = await service.donorUpdateUser(id, { is_active: value })
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

    return (
      <WithSideNav navComponents={<BackButton to="/donador" />}>
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
            <UserForm type="donor" form="donorMe" onSubmit={this.handleSubmitName} enableReinitialize />
          </div>
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>Tu contraseña</div>
            <ResetPasswordForm form="donorResetPassword" onSubmit={this.handleSubmitPassword} />
          </div>
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

DonorProfile.propTypes = {
  snackbar: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  me: PropTypes.object,
  users: PropTypes.arrayOf(PropTypes.object),
}

DonorProfile.defaultProps = {
  me: {},
  users: [],
}

const mapStateToProps = (state) => {
  try {
    return { me: state.getter.donorMe.data, users: state.getter.donorUsers.data.results }
  } catch (e) {
    return {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    reset: () => dispatch(reset('donorResetPassword')),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorProfile)
