import React from 'react'
import PropTypes from 'prop-types'

import ReactGA from 'react-ga'

import FormStyles from 'src/Form.css'
import Styles from './AccountCreated.css'


const AccountVerified = ({ type }) => {
  const text = {
    org: 'Ya puedes documentar los proyectos de tu organización.',
    donor: 'Ya puedes crear, aprobar y ocultar los donativos de tu organización.',
  }[type]
  return (
    <div className={Styles.container}>
      <span className={FormStyles.formHeader}>¡Gracias por verificar tu cuenta!</span>
      <p className={Styles.formText}>{text}</p>
      <p className={Styles.formText}>Pero todavía falta un paso para convertirte en usuario experto: <ReactGA.OutboundLink eventLabel="scheduleTraining" to="https://calendly.com/brigada/capacitacion" target="_blank">tomar una capacitación virtual</ReactGA.OutboundLink>.</p>
      <p className={Styles.formText}>
        Dale clic en el link para agendar tu capacitación.
      </p>
    </div>
  )
}

AccountVerified.propTypes = {
  type: PropTypes.oneOf(['org', 'donor']).isRequired,
}

export default AccountVerified
