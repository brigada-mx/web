import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'src/Form.css'
import Styles from './AccountCreated.css'


const AccountCreated = ({ email, type }) => {
  if (type === 'org') {
    return (
      <div className={Styles.container}>
        <span className={FormStyles.formHeader}>¡Gracias por registrarte!</span>
        <p className={Styles.formText}>
          Hemos enviado un correo a {email} para que actives tu cuenta.
        </p>
      </div>
    )
  }
  if (type === 'donor') {
    return (
      <div className={Styles.container}>
        <span className={FormStyles.formHeader}>¡Gracias por registrarte!</span>
        <p className={Styles.formText}>
          Por razones de seguridad, donadores no pueden entrar a su cuenta hasta que el equipo de Brigada verifique su identificación. Tipicamente este proceso tarda menos de un día.
        </p>
        <p className={Styles.formText}>
          En cuanto terminemos la verificación, te mandaremos un correo a {email} para que actives tu cuenta.
        </p>
      </div>
    )
  }
  return null
}

AccountCreated.propTypes = {
  email: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['org', 'donor']).isRequired,
}

export default AccountCreated
