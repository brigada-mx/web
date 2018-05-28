import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import VolunteerApplicationForm from './VolunteerApplicationForm'


const VolunteerApplicationScreen = ({ snackbar, modal, className = '', position, id, name }) => {
  const handleSubmit = async (body) => {
    const { data, status } = await service.createVolunteerApplication({ ...body, opportunity_id: id })
    if (data) {
      modal('volunteerApplicationCreated', { position, name, modalWide: true })
      return
    }

    if (status === 400) snackbar('Hubo un error', 'error')
    else snackbar('Checa tu conexión', 'error')
  }

  if (!className) return <VolunteerApplicationForm position={position} onSubmit={handleSubmit} />
  return <div className={className}><VolunteerApplicationForm position={position} onSubmit={handleSubmit} /></div>
}

VolunteerApplicationScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  modal: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(VolunteerApplicationScreen)
