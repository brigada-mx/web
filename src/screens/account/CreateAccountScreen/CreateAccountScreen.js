import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service from 'api/service'
import CreateAccountForm from './CreateAccountForm'


const CreateAccountScreen = ({ onLogin, snackbar, history, location, closeModal }) => {
  const handleSubmit = async ({ email, password }) => {
    const { data } = await service.token(email, password)
    if (data) {
      onLogin({ ...data, email })
      if (location.pathname !== '/cuenta') history.push('/cuenta')
      closeModal()
    } else {
      snackbar('No reconocemos este email/contraseña', 'error')
    }
  }

  return <CreateAccountForm onSubmit={handleSubmit} />
}

CreateAccountScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth }),
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(CreateAccountScreen))
