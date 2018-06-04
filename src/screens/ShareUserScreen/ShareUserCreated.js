import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'src/Form.css'
import Styles from './ShareUserScreen.css'


const VolunteerApplicationCreated = ({ updates = false, className }) => {
  const content = (
    <React.Fragment>
      <p className={FormStyles.formHeader}>¡Éxito!</p>
      <p className={Styles.formText}>Compartiste este proyecto.</p>
      {updates &&
        <p className={Styles.formText}>Te mandaremos actualizaciones a su estado.</p>
      }
    </React.Fragment>
  )
  if (!className) return content
  return <div className={className}>{content}</div>
}

VolunteerApplicationCreated.propTypes = {
  updates: PropTypes.bool,
  className: PropTypes.string,
}

export default VolunteerApplicationCreated
