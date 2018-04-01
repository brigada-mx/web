import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'

import { TextField, SelectField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'
import Styles from './CreateAccountForm.css'


const CreateAccountForm = ({ handleSubmit, submitting }) => {
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
      <span className={FormStyles.formHeader}>Registro para Brigada</span>
      <div>
        <TextField
          className={FormStyles.wideInput}
          name="first_name"
          hintText="Nombre"
        />
      </div>
      <div>
        <TextField
          className={FormStyles.wideInput}
          name="surnames"
          hintText="Apellido"
        />
      </div>
      <div className={Styles.inputGroup}>
        <TextField
          className={FormStyles.wideInput}
          name="email"
          hintText="Email"
          autoCapitalize="off"
        />
      </div>
      <div className={Styles.inputGroup}>
        <TextField
          className={FormStyles.wideInput}
          name="name"
          hintText="¿Cómo se llama tu organización?"
        />
      </div>
      <div className={FormStyles.dropdown}>
        <SelectField floatingLabelText="¿A qué sector pertenece?" className={FormStyles.wideInput} name="sector">
          <MenuItem value="civil" primaryText="Civil" />
          <MenuItem value="public" primaryText="Público" />
          <MenuItem value="private" primaryText="Privado" />
          <MenuItem value="religious" primaryText="Religioso" />
        </SelectField>
      </div>
      <div className={FormStyles.buttonContainer}>
        <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="REGISTRAR" onClick={handleSubmit} />
      </div>
    </form>
  )
}

CreateAccountForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ first_name: firstName, surnames, email, name, sector }) => {
  const errors = {}
  if (!firstName) errors.first_name = 'Ingresa tu nombre'
  if (!surnames) errors.surnames = 'Ingresa apellidos'
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!name) errors.name = 'Ingresa el nombre de tu grupo'
  if (!sector) errors.sector = 'Selecciona un sector'
  return errors
}

export default reduxForm({ form: 'createAccount', validate })(CreateAccountForm)
