import React from 'react'
import PropTypes from 'prop-types'


const VolunteerApplicationCreated = ({ position, name, className }) => {
  const content = (
    <React.Fragment>
      <div>Aplicaste exitosamente por el puesto de {position}.</div>
      <div>Los administradores de {name} han sido notificados y se pondrán en contacto contigo si quieren integrarte a su equipo.</div>
      <div>¡Gracias!</div>
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
