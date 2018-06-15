import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'
import Styles from './VolunteerApplicationScreen.css'


const VolunteerApplicationForm = ({ handleSubmit, submitting, position }) => {
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
      <span className={FormStyles.formHeader}>{position}</span>
      <div>
        <TextField
          name="first_name"
          hintText="Nombre"
        />
        <TextField
          name="surnames"
          hintText="Apellidos"
        />
      </div>

      <div className={Styles.inputGroup}>
        <TextField
          type="number"
          min="0"
          floatingLabelText="¿Cuántos años tienes?"
          name="age"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
        />
        <TextField
          name="email"
          hintText="Email"
          autoCapitalize="off"
        />
      </div>

      <div className={Styles.inputGroup}>
        <TextField
          className={FormStyles.wideInput}
          name="reason_why"
          hintText="¿Porqué te emociona esta oportunidad?"
          multiLine
          rows={2}
        />
      </div>

      <div className={Styles.inputGroup}>
        <TextField
          name="phone"
          hintText="Celular"
          autoCapitalize="off"
        />
      </div>
      <div className={FormStyles.buttonContainer}>
        <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="ENVIAR" onClick={handleSubmit} />
      </div>
    </form>
  )
}

VolunteerApplicationForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ first_name: firstName, surnames, email, phone, age, reason_why: reason }) => {
  const errors = {}
  if (!firstName) errors.first_name = 'Ingresa tu nombre'
  if (!surnames) errors.surnames = 'Ingresa apellidos'
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!phone) errors.phone = 'Agrega tu celular'
  if (!age) errors.age = 'Agrega tu edad'

  if (!reason) errors.reason_why = 'Explica porqué te emociona esta oportunidad'
  else if (reason.length > 500) errors.reason_why = 'Limita tu explicación a 500 caracteres'
  return errors
}

export default reduxForm({ form: 'volunteerApplication', validate })(VolunteerApplicationForm)
