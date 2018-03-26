import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import CreateAccountForm from './CreateAccountForm'


const CreateAccountScreen = ({ snackbar, modal }) => {
  const handleSubmit = async ({ email, ...rest }) => {
    const { data, status } = await service.createAccount({ email, ...rest })
    if (data) {
      modal('accountCreated', { email })
      return
    }

    if (status === 400) snackbar('Hubo un error: igual y ya existe un usuario con este email, o un grupo con este nombre', 'error', 5000)
    else snackbar('Checa tu conexión', 'error')
  }

  return <CreateAccountForm onSubmit={handleSubmit} />
}

CreateAccountScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  modal: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth }),
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(CreateAccountScreen)
