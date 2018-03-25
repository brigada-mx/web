import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton } from 'material-ui/RadioButton'

import { TextField, RadioButtonGroup } from 'components/Fields'
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
      <span className={FormStyles.formHeader}>Registro para Brigada</span>
      <div>
        <TextField
          name="first_name"
          hintText="Tu nombre"
        />
      </div>
      <div>
        <TextField
          name="surnames"
          hintText="Tus apellidos"
        />
      </div>
      <div>
        <TextField
          name="email"
          hintText="Tu email"
          autoCapitalize="off"
        />
      </div>
      <span className={FormStyles.formHeaderSmall}>¿Cómo se llama tu grupo?</span>
      <div>
        <TextField
          name="name"
          hintText="Nombre de tu grupo"
        />
      </div>
      <span className={FormStyles.formHeaderSmall}>¿A qué sector pertenece?</span>
      <RadioButtonGroup className={Styles.buttonGroup} name="sector">
        <RadioButton className={Styles.radioButton} value="civil" label="Civil" />
        <RadioButton className={Styles.radioButton} value="public" label="Público" />
        <RadioButton className={Styles.radioButton} value="private" label="Privado" />
        <RadioButton className={Styles.radioButton} value="religious" label="Religioso" />
      </RadioButtonGroup>
      <RaisedButton className={FormStyles.button} disabled={submitting} label="REGISTRAR" onClick={handleSubmit} />
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
