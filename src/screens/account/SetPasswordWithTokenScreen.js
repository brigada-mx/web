import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service from 'api/service'
import { parseQs } from 'tools/string'
import { TextField } from 'components/Fields'
import FormStyles from 'src/Form.css'
import Styles from 'src/Form.css'


const Form = ({ handleSubmit, submitting }) => {
  return (
    <div className={Styles.formContainer}>
      <span className={FormStyles.formHeader}>Establecer tu contraseña</span>
      <span className={FormStyles.formText}>Ingresa tu nueva contraseña y repítela para confirmar</span>
      <div>
        <TextField
          type="password"
          name="password"
          hintText="Contraseña"
        />
      </div>
      <div>
        <TextField
          type="password"
          name="confirmPassword"
          hintText="Confirmar contraseña"
        />
      </div>
      <div className={FormStyles.buttonContainer}>
        <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="ESTABLECER" onClick={handleSubmit} />
      </div>
    </div>
  )
}

Form.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ password, confirmPassword }) => {
  const errors = {}
  if (password !== undefined && password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'
  if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas tienen que ser iguales'
  return errors
}

const ReduxForm = reduxForm({ form: 'setPasswordWithToken', validate })(Form)

const SetPasswordWithTokenScreen = ({ history, location, snackbar, onLogin, className = '' }) => {
  const handleSubmit = async ({ password }) => {
    const params = parseQs(location.search)
    const { token = '', email = '' } = params

    const { data } = await service.setPasswordWithToken(token, password)
    if (!data) {
      snackbar('El email que te mandamos ya no es válido, pide otro', 'error')
      return
    }

    // log user in to site
    const { data: loginData } = await service.token(email, password)
    if (loginData) onLogin({ ...loginData, email })

    history.push('/cuenta')
    snackbar('Cambiaste tu contraseña', 'success')
  }

  if (className) return <div className={className}><ReduxForm onSubmit={handleSubmit} /></div>
  return <ReduxForm onSubmit={handleSubmit} />
}

SetPasswordWithTokenScreen.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  snackbar: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth }),
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(SetPasswordWithTokenScreen))
