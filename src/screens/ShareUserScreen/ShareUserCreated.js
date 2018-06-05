import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'src/Form.css'
import Styles from './ShareUserScreen.css'


const ShareUserCreated = ({ className, userCreated = true }) => {
  const content = (
    <React.Fragment>
      <p className={FormStyles.formHeader}>{userCreated ? '¡Éxito!' : '¡Gracias por compartir!'}</p>
      <p className={Styles.formText}>Estaremos en contacto con actualizaciones sobre este proyecto.</p>
    </React.Fragment>
  )
  if (!className) return content
  return <div className={className}>{content}</div>
}

ShareUserCreated.propTypes = {
  className: PropTypes.string,
  userCreated: PropTypes.bool,
}

export default ShareUserCreated
