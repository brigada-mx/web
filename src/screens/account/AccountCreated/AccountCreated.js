import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'src/Form.css'
import Styles from './AccountCreated.css'


const AccountCreated = ({ email }) => {
  return (
    <div className={Styles.container}>
      <span className={FormStyles.formHeader}>¡Registraste tu cuenta!</span>
      <p className={Styles.info}>Hemos mandado un correo a {email} para que definas tu contraseña y actives tu cuenta. Por favor revisa tu correo.</p>
      <p className={Styles.info}>Para empezar a documentar tus proyectos de reconstrucción, es necesario tomar una capacitación de 30 minutos via video-chat.</p>
      <a href="https://calendly.com/brigada/capacitacion" target="_blank" className={Styles.primaryButton}>AGENDAR VIDEO-CHAT</a>
    </div>
  )
}

AccountCreated.propTypes = {
  email: PropTypes.string.isRequired,
}

export default AccountCreated
