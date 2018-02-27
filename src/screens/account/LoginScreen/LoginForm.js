import React from 'react'

import { Link } from 'react-router-dom'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { store } from 'src/App'
import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'screens/account/Form.css'
import Styles from './LoginForm.css'


const LoginForm = ({ handleSubmit, submitting }) => {
  const forgotPasswordLink = () => {
    try {
      const { email } = store.getState().form.login.values
      return { pathname: '/restablecer/email', state: { email } }
    } catch (e) {
      return '/restablecer/email'
    }
  }

  return (
    <div className={FormStyles.formContainer}>
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
      <RaisedButton className={FormStyles.button} disabled={submitting} label="INGRESAR" onClick={handleSubmit} />
      <Link className={Styles.link} to={forgotPasswordLink()}>No sé mi contraseña</Link>
    </div>
  )
}

LoginForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ email, password }) => {
  const errors = {}
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!password) errors.password = 'Ingresa tu contraseña'
  return errors
}

export default reduxForm({ form: 'login', validate })(LoginForm)
