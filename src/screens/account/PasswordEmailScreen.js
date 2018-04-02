import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import { TextField } from 'components/Fields'
import service from 'api/service'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'


const Form = ({ handleSubmit, submitting, type }) => {
  const headerText = type === 'donor' ? 'Olvidé mi contraseña de donador' : 'Olvidé mi contraseña'
  return (
    <div className={FormStyles.formContainer}>
      <span className={FormStyles.formLogo} />
      <span className={FormStyles.formHeader}>{headerText}</span>
      <span className={FormStyles.formText}>Ingresa tu email y te mandaremos un correo para restablecer tu contraseña</span>
      <div className={FormStyles.row}>
        <TextField
          className={FormStyles.wideInput}
          name="email"
          hintText="Email"
          autoCapitalize="off"
        />
      </div>
      <div className={FormStyles.buttonContainer}>
        <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="ENVIAR EMAIL" onClick={handleSubmit} />
      </div>
    </div>
  )
}

Form.propTypes = {
  ...rxfPropTypes,
  type: PropTypes.oneOf(['org', 'donor']).isRequired,
}

const validate = ({ email }) => {
  if (!validateEmail(email)) return { email: 'Se requiere un email válido' }
  return {}
}

const ReduxForm = reduxForm({ form: 'passwordEmail', validate })(Form)

const PasswordEmailScreen = ({ snackbar, email: initialEmail = '', type }) => {
  const handleSubmit = async ({ email }) => {
    const f = { org: service.sendSetPasswordEmail, donor: service.donorSendSetPasswordEmail }[type]
    const { data } = await f(email)
    if (!data) {
      snackbar(`No pudimos mandar el email a ${email}`, 'error')
      return
    }
    snackbar(`Mandamos un email a ${email}`, 'success')
  }

  return <ReduxForm type={type} onSubmit={handleSubmit} initialValues={{ email: initialEmail }} />
}

PasswordEmailScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  email: PropTypes.string,
  type: PropTypes.oneOf(['org', 'donor']).isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(null, mapDispatchToProps)(PasswordEmailScreen)
