import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import Styles from 'screens/account/Form.css'
import OrganizationForm from './OrganizationForm'
import ContactForm from './ContactForm'
import { CreateActionForm } from './ActionForm'


const initialActionValues = { published: true }

class HomeScreen extends React.Component {
  loadOrganization = () => {
    getBackoff(service.getAccountOrganization, { key: 'accountOrganization' })
  }

  loadActions = () => {
    getBackoff(service.getAccountActions, { key: 'accountActions' })
  }

  handleResetKey = async (values) => {
    const { data } = await service.resetAccountKey(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Cambiaste la llave secreta de tu organización', 'success')
  }

  handleSubmitOrganization = async (values) => {
    const { data } = await service.updateAccountOrganization(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Actualizaste tu organización', 'success')
  }

  handleSubmitContact = async ({ zip, city, state, street, locality, ...rest }) => {
    const { data } = await service.updateAccountOrganization({ contact: {
      ...rest,
      address: { zip, city, state, street, locality },
    } })
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Actualizaste tus datos de contacto', 'success')
  }

  handleCreateAction = async (body) => {
    const { data } = await service.createAccountAction(body)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetAction()
    this.loadActions()
    this.props.snackbar('Agregaste un nuevo proyecto', 'success')
  }

  componentDidMount() {
    this.loadOrganization()
    this.loadActions()
  }

  render() {
    return (
      <div>
        <div className={Styles.formContainer}>
          <h2>Tu Organización</h2>
          <OrganizationForm onSubmit={this.handleSubmitOrganization} enableReinitialize />
          <RaisedButton
            className={Styles.button}
            label="CAMBIAR LLAVE SECRETA"
            onClick={this.handleResetKey}
          />
        </div>

        <div className={Styles.formContainer}>
          <h2>Datos de contacto</h2>
          <ContactForm onSubmit={this.handleSubmitContact} enableReinitialize />
        </div>

        <div className={Styles.formContainer}>
          <h2>Agregar proyecto</h2>
          <CreateActionForm onSubmit={this.handleCreateAction} initialValues={initialActionValues} />
        </div>
      </div>
    )
  }
}

HomeScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetAction: () => dispatch(reset('accountNewAction')),
  }
}

export default connect(null, mapDispatchToProps)(HomeScreen)
