import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'
import Styles from './ShareUserScreen.css'


const ShareUserForm = ({ handleSubmit, submitting }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form
      className={FormStyles.formContainer}
      onKeyDown={handleKeyDown}
    >
      <span className={FormStyles.formLogo} />
      <span className={FormStyles.formHeader}>¡Gracias por compartir!</span>
      <span className={FormStyles.formText}>Deja tus datos para recibir actualizaciones de este proyecto.</span>
      <div>
        <TextField
          name="first_name"
          hintText="Nombre"
        />
        <TextField
          name="surnames"
          hintText="Apellido"
        />
      </div>

      <div className={Styles.inputGroup}>
        <TextField
          name="email"
          hintText="Email"
          autoCapitalize="off"
        />
      </div>
      <div className={FormStyles.buttonContainer}>
        <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="ENVIAR" onClick={handleSubmit} />
      </div>
    </form>
  )
}

ShareUserForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ first_name: firstName, surnames, email }) => {
  const errors = {}
  if (!firstName) errors.first_name = 'Ingresa tu nombre'
  if (!surnames) errors.surnames = 'Ingresa apellidos'
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  return errors
}

export default reduxForm({ form: 'shareUser', validate })(ShareUserForm)
