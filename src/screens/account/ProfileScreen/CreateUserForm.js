import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'


const CreateUserForm = ({ handleSubmit, submitting }) => {
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
      <div>
        <TextField
          name="first_name"
          floatingLabelText="Nombre del nuevo usuario"
        />
        <TextField
          name="surnames"
          floatingLabelText="Sus apellidos"
        />
        <TextField
          className={FormStyles.wideInput}
          name="email"
          floatingLabelText="Email que usará el nuevo usuario para ingresar a su cuenta"
          autoCapitalize="off"
        />
      </div>

      <div className={FormStyles.buttonContainer}>
        <RaisedButton
          className={FormStyles.primaryButton}
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          disabled={submitting}
          label="CREAR USUARIO"
          onClick={handleSubmit}
        />
      </div>
    </form>
  )
}

CreateUserForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ first_name: firstName, surnames, email }) => {
  const errors = {}
  if (!firstName) errors.first_name = 'Ingresa el nombre del nuevo usuario'
  if (!surnames) errors.surnames = 'Ingresa sus apellidos'
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  return errors
}

export default reduxForm({ form: 'accountCreateUser', validate })(CreateUserForm)
