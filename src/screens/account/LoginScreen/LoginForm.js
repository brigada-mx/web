import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import Styles from 'screens/account/Form.css'


const LoginForm = ({ handleSubmit, submitting, history }) => {
  const handleForgotPassword = () => {
    history.push('/restablecer/email')
  }

  return (
    <div className={Styles.formContainer}>
      <div>
        <TextField
          name="email"
          hintText="Email"
        />
      </div>
      <div>
        <TextField
          type="password"
          name="password"
          hintText="Contraseña"
        />
      </div>
      <RaisedButton className={Styles.button} disabled={submitting} label="INGRESAR" onClick={handleSubmit} />
      <RaisedButton className={Styles.button} label="NO SÉ MI CONTRASEÑA" onClick={handleForgotPassword} />
    </div>
  )
}

LoginForm.propTypes = {
  ...rxfPropTypes,
  history: PropTypes.object.isRequired,
}

const validate = ({ email, password }) => {
  const errors = {}
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!password) errors.password = 'Debes ingresar una contraseña'
  return errors
}

export default withRouter(reduxForm({ form: 'login', validate })(LoginForm))
