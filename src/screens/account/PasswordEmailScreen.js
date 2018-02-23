import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import { TextField } from 'components/Fields'
import service from 'api/service'
import { validateEmail } from 'tools/string'
import Styles from 'screens/account/Form.css'


const Form = ({ handleSubmit, submitting }) => {
  return (
    <div className={Styles.formContainer}>
      <div><TextField name="email" hintText="Email" /></div>
      <RaisedButton className={Styles.button} disabled={submitting} label="ENVIAR EMAIL" onClick={handleSubmit} />
    </div>
  )
}

Form.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ email }) => {
  if (!validateEmail(email)) return { email: 'Se requiere un email válido' }
  return {}
}

const ReduxForm = reduxForm({ form: 'passwordEmail', validate })(Form)

const PasswordEmailScreen = ({ history, onResponse }) => {
  const handleSubmit = async ({ email }) => {
    const { data } = await service.sendSetPasswordEmail(email)
    if (data) history.push('/cuenta')
  }

  return <ReduxForm onSubmit={handleSubmit} />
}

PasswordEmailScreen.propTypes = {
  history: PropTypes.object.isRequired,
  onResponse: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onResponse: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(PasswordEmailScreen))
