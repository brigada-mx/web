import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import { store } from 'src/App'
import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'
import Styles from './LoginForm.css'


const LoginForm = (
  { handleSubmit, submitting, modal, closeModal, type, discourse, changeType }
) => {
  const handleForgotPassword = () => {
    try {
      const { email } = store.getState().form.login.values
      modal('forgotPassword', { email, type })
    } catch (e) {
      modal('forgotPassword', { type })
    }
  }

  const handleCreateAccount = () => {
    modal('chooseAccountType', { type })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const links = () => {
    if (discourse) {
      if (type === 'org') return <span className={Styles.link} onClick={() => changeType('donor')}>Soy donador</span>
      return <span className={Styles.link} onClick={() => changeType('org')}>Soy reconstructor</span>
    }

    if (type === 'org') return <Link className={Styles.link} onClick={closeModal} to="/donador">Soy donador</Link>
    return <Link className={Styles.link} onClick={closeModal} to="/cuenta">Soy reconstructor</Link>
  }

  const header = () => {
    if (discourse) return <span className={FormStyles.formHeader}>Ingresar al foro</span>
    if (type === 'org') return <span className={FormStyles.formHeader}>Ingresar a tu cuenta</span>
    if (type === 'donor') return <span className={FormStyles.formHeader}>Ingresar a tu cuenta de donador</span>
  }

  return (
    <form
      className={FormStyles.formContainer}
      onKeyDown={handleKeyDown}
    >
      <span className={FormStyles.formLogo} />
      {header()}
      <div className={FormStyles.row}>
        <TextField
          name="email"
          hintText="Email"
          className={FormStyles.wideInput}
          autoCapitalize="off"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          type="password"
          name="password"
          className={FormStyles.wideInput}
          hintText="Contraseña"
        />
      </div>
      <div className={FormStyles.buttonContainer}>
        <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="INGRESAR" onClick={handleSubmit} />

        <div className={Styles.linkContainer}>
          {links()}
          <span className={Styles.link} onClick={handleForgotPassword}>Olvidé mi contraseña</span>
          <span className={Styles.link} onClick={handleCreateAccount}>Crear una cuenta</span>
        </div>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  ...rxfPropTypes,
  modal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['org', 'donor']).isRequired,
  discourse: PropTypes.bool,
  changeType: PropTypes.func,
}

LoginForm.defaultProps = {
  discourse: false,
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
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default reduxForm({ form: 'login', validate })(connect(null, mapDispatchToProps)(LoginForm))
