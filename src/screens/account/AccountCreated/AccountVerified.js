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
      <p className={Styles.formText}>Pero todavía falta un paso para convertirte en usuario experto: ¡hacer la capacitación! Manda un email a <ReactGA.OutboundLink eventLabel="scheduleTraining" to="mailto:eduardo@brigada.mx?Subject=Brigada Agendar Capacitación">eduardo@brigada.mx</ReactGA.OutboundLink> con tu disponibilidad.</p>
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
