import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service from 'api/service'
import { parseQs } from 'tools/string'
import DonorCreateAccountForm, { prepareDonorBody } from './DonorCreateAccountForm'


const DonorCreateAccountScreen = ({
  snackbar, modal, className = '', initialValues, location, donorId, donorName,
}) => {
  const handleSubmit = async ({ email, ...rest }) => {
    const body = donorId !== undefined ? { email, donor_id: donorId, ...rest } : prepareDonorBody({ email, ...rest })
    const { data, status } = await service.donorCreateAccount(body)
    if (data) {
      modal('accountCreated', { email, type: 'donor' })
      return
    }

    if (status === 400) snackbar('Hubo un error: igual y ya existe un usuario con este email, o un grupo con este nombre', 'error', 5000)
    else snackbar('Checa tu conexión', 'error')
  }

  const obj = parseQs(location.search)
  const { name, id } = obj
  let _initialValues = initialValues
  if (name && id !== undefined) {
    _initialValues = {
      ...initialValues,
      donor: { text: decodeURI(name), value: Number.parseInt(id, 10) },
    }
  }

  const form = (
    <DonorCreateAccountForm
      onSubmit={handleSubmit}
      initialValues={_initialValues}
      donorDisabled={donorId !== undefined}
      donorName={donorName}
    />
  )

  if (className) return <div className={className}>{form}</div>
  return form
}

DonorCreateAccountScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  modal: PropTypes.func.isRequired,
  className: PropTypes.string,
  initialValues: PropTypes.object,
  location: PropTypes.object.isRequired,
  donorId: PropTypes.number,
  donorName: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth, type: 'org' }),
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(DonorCreateAccountScreen))
