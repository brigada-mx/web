import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'


const SupportForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <span className={FormStyles.formHeader}>Soporte</span>
      <div className={FormStyles.row}>
        <TextField
          className={FormStyles.wideInput}
          floatingLabelText="Tu nombre"
          name="name"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          className={FormStyles.wideInput}
          floatingLabelText="Tu email"
          name="email"
          autoCapitalize="off"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          className={FormStyles.wideInput}
          floatingLabelText="Tu teléfono"
          name="phone"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          floatingLabelText="¿Qué problema o duda tienes? Descríbelo para que podamos ayudarte mejor."
          className={FormStyles.wideInput}
          name="reason"
          multiLine
          rows={3}
        />
      </div>

      <TextField className={FormStyles.hidden} name="meta" />

      <div className={FormStyles.row}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="ENVIAR"
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

SupportForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ email, phone, name, reason }) => {
  const errors = {}
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!phone) errors.phone = 'Agrega tu teléfono'
  if (!name) errors.name = 'Agrega tu nombre'
  if (!reason) errors.reason = 'Describe tu duda o problema'
  else if (reason.length > 500) errors.reason = 'Limita tu descripción a 500 caracteres'
  return errors
}

export default reduxForm({ validate, form: 'support' })(SupportForm)
