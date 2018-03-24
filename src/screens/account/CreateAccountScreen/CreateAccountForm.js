import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import { store } from 'src/App'
import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'
import GlobalStyles from 'src/Global.css'
import Styles from './CreateAccountForm.css'


const CreateAccountForm = ({ handleSubmit, submitting, modal }) => {
  const handleForgotPassword = () => {
    try {
      const { email } = store.getState().form.login.values
      modal('forgotPassword', { email })
    } catch (e) {
      modal('forgotPassword')
    }
  }

  const handleCreateAccount = () => {
    modal('createAccount')
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
      <span className={FormStyles.formHeader}>Ingresar a tu cuenta</span>
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
      <div className={Styles.linkContainer}>
        <span className={`${Styles.link} ${GlobalStyles.link}`} onClick={handleForgotPassword}>Olvidé mi contraseña</span>
        <span className={`${Styles.link} ${GlobalStyles.link}`} onClick={handleCreateAccount}>Crear una cuenta</span>
      </div>
    </form>
  )
}

CreateAccountForm.propTypes = {
  ...rxfPropTypes,
  modal: PropTypes.func.isRequired,
}

const validate = ({ email, password }) => {
  const errors = {}
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!password) errors.password = 'Ingresa tu contraseña'
  return errors
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default reduxForm({ form: 'login', validate })(connect(null, mapDispatchToProps)(CreateAccountForm))
