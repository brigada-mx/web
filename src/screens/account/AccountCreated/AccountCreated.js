import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'src/Form.css'
import Styles from './AccountCreated.css'


const AccountCreated = ({ email, type }) => {
  if (type === 'org') {
    return (
      <div className={Styles.container}>
        <span className={FormStyles.formHeader}>¡Gracias por registrarte!</span>
        <p className={FormStyles.formText}>
          Hemos enviado un correo a {email} para que actives tu cuenta.
        </p>
      </div>
    )
  }
  if (type === 'donor') {
    return (
      <div className={Styles.container}>
        <span className={FormStyles.formHeader}>¡Gracias por registrarte!</span>
        <p className={FormStyles.formText}>
          Hemos enviado un correo a {email} para que actives tu cuenta.
        </p>
        <p className={FormStyles.formText}>
          Por razones de seguridad, no puedes entrar a tu cuenta hasta que el equipo de Brigada verifique tu identificación. Típicamente, este proceso tarda menos de un día.
        </p>
        <p className={FormStyles.formText}>
          Te mandaremos un email en cuanto terminemos la verificación.
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
