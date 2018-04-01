import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import CreateAccountForm from './CreateAccountForm'


const CreateAccountScreen = ({ snackbar, modal, className = '' }) => {
  const handleSubmit = async ({ email, ...rest }) => {
    const { data, status } = await service.createAccount({ email, ...rest })
    if (data) {
      modal('accountCreated', { email })
      return
    }

    if (status === 400) snackbar('Hubo un error: igual y ya existe un usuario con este email, o un grupo con este nombre', 'error', 5000)
    else snackbar('Checa tu conexión', 'error')
  }

  if (className) return <div className={className}><CreateAccountForm onSubmit={handleSubmit} /></div>
  return <CreateAccountForm onSubmit={handleSubmit} />
}

CreateAccountScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  modal: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth, type: 'org' }),
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(CreateAccountScreen)
