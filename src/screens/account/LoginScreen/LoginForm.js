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
          name="email"
          hintText="Email"
          autoCapitalize="off"
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
      <a className={Styles.link} href="https://goo.gl/forms/GPMPXnnK2j2IPeYk1">Crear una cuenta</a>
    </form>
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
