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


const Form = ({ handleSubmit, submitting }) => {
  return (
    <div className={FormStyles.formContainer}>
      <span className={FormStyles.formHeader}>Establecer tu contraseña</span>
      <span className={FormStyles.formText}>
        Ingresa tu nueva contraseña y repítela para confirmar
      </span>
      <div className={FormStyles.row}>
        <TextField
          className={FormStyles.wideInput}
          type="password"
          name="password"
          hintText="Contraseña"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          className={FormStyles.wideInput}
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

const SetPasswordWithTokenScreen = ({
  history, location, snackbar, onLogin, modal, className = ''
}) => {
  const handleSubmit = async ({ password }) => {
    const params = parseQs(location.search)
    const { token = '', email = '', type = 'org', created = false } = params

    const fSetPasswordByType = {
      org: service.setPasswordWithToken,
      donor: service.donorSetPasswordWithToken,
    }
    const fGetTokenByType = { org: service.token, donor: service.donorToken }
    const accountUrlByType = { org: '/cuenta', donor: '/donador' }

    const { data } = await fSetPasswordByType[type](token, password, created === 'true')
    if (!data) {
      snackbar('El email que te mandamos ya no es válido, pide otro', 'error')
      return
    }

    // log user in to site
    const { data: loginData } = await fGetTokenByType[type](email, password)
    if (loginData) onLogin({ ...loginData, email }, type)

    history.push(accountUrlByType[type])
    if (created === 'true') {
      snackbar('¡Activaste tu cuenta!', 'success', 5000)
      modal('accountVerified', { type })
    } else snackbar('Cambiaste tu contraseña', 'success')
  }

  if (className) return <div className={className}><ReduxForm onSubmit={handleSubmit} /></div>
  return <ReduxForm onSubmit={handleSubmit} />
}

SetPasswordWithTokenScreen.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  snackbar: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  modal: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (auth, type) => Actions.authSet(dispatch, { auth, type }),
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(SetPasswordWithTokenScreen))
