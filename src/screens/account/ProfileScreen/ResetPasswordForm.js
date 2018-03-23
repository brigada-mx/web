import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import Styles from 'src/Form.css'


const ResetPasswordForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          type="password"
          name="old_password"
          hintText="Contraseña actual"
        />
      </div>
      <div>
        <TextField
          type="password"
          name="password"
          hintText="Contraseña nueva"
        />
      </div>
      <div>
        <TextField
          type="password"
          name="confirmPassword"
          hintText="Confirmar contraseña nueva"
        />
      </div>
      <RaisedButton
        className={Styles.button}
        disabled={submitting}
        label="CAMBIAR CONTRASEÑA"
        onClick={handleSubmit}
      />
    </React.Fragment>
  )
}

ResetPasswordForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ old_password, password, confirmPassword }) => {
  const errors = {}
  if (!old_password) errors.old_password = 'Ingresa tu contraseña actual'
  if (!password || password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'
  if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas tienen que ser iguales'
  return errors
}

export default reduxForm({ form: 'resetPassword', validate })(ResetPasswordForm)
