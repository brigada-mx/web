import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'src/Form.css'
import Styles from './VolunteerApplicationScreen.css'


const VolunteerApplicationCreated = ({ position, name, className }) => {
  const content = (
    <React.Fragment>
      <p className={FormStyles.formHeader}>¡Éxito!</p>
      <p className={Styles.formText}>Aplicaste por el puesto de {position}.</p>
      <p className={Styles.formText}>Los administradores de {name} han sido notificados y se pondrán en contacto contigo si quieren integrarte a su equipo.</p>
      <p className={Styles.formText}>¡Gracias!</p>
    </React.Fragment>
  )
  if (!className) return content
  return <div className={className}>{content}</div>
}

VolunteerApplicationCreated.propTypes = {
  position: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default VolunteerApplicationCreated
