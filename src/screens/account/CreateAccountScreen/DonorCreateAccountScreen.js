import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import DonorCreateAccountForm, { prepareDonorBody } from './DonorCreateAccountForm'


const DonorCreateAccountScreen = ({ snackbar, modal, className = '', initialValues }) => {
  const handleSubmit = async ({ email, ...rest }) => {
    const { data, status } = await service.donorCreateAccount(prepareDonorBody({ email, ...rest }))
    if (data) {
      modal('accountCreated', { email, type: 'donor' })
      return
    }

    if (status === 400) snackbar('Hubo un error: igual y ya existe un usuario con este email, o un grupo con este nombre', 'error', 5000)
    else snackbar('Checa tu conexión', 'error')
  }

  if (className) {
    return (
      <div className={className}>
        <DonorCreateAccountForm onSubmit={handleSubmit} initialValues={initialValues} />
      </div>
    )
  }
  return <DonorCreateAccountForm onSubmit={handleSubmit} initialValues={initialValues} />
}

DonorCreateAccountScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  modal: PropTypes.func.isRequired,
  className: PropTypes.string,
  initialValues: PropTypes.object,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth, type: 'org' }),
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(DonorCreateAccountScreen)
