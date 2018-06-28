import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import SupportForm from './SupportForm'


const Support = ({ closeModal, snackbar, initialValues }) => {
  const handleSubmit = async (body) => {
    const { data } = await service.supportTicketCreate(body)
    if (!data) {
      this.props.snackbar('Hubo un error, inténtalo de nuevo', 'error')
      return
    }
    closeModal()
    snackbar('¡Hemos notificado al equipo de Brigada, te responderán a la brevedad!', 'success', 6000)
  }

  return <SupportForm initialValues={initialValues} onSubmit={handleSubmit} />
}

Support.propTypes = {
  closeModal: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
}

const mapStateToProps = (state) => {
  let email
  let meta = ''
  const { org = {}, donor = {} } = state.auth

  if (org.email) {
    ({ email } = org)
    meta = `reconstructor ${org.id}`
  }
  if (donor.email) {
    ({ email } = donor)
    meta = `donador ${donor.id}`
  }

  return { initialValues: { email, meta } }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => Actions.modal(dispatch, ''),
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Support)
