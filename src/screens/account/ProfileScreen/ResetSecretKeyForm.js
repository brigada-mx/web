import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const ResetSecretKeyForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          floatingLabelText="Llave secreta"
          name="secret_key"
          readOnly
          disabled
          format={(value) => { return value ? value.replace(/\./g, ' ') : '' }}
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Confirmar para cambiar llave"
          name="confirmSecretKey"
          format={(value) => { return value ? value.replace(/\./g, ' ') : '' }}
        />
      </div>
      <RaisedButton
        className={Styles.button}
        label="CAMBIAR LLAVE SECRETA"
        onClick={handleSubmit}
        disabled={submitting}
      />
    </React.Fragment>
  )
}

ResetSecretKeyForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ secret_key, confirmSecretKey }) => {
  if (!confirmSecretKey || confirmSecretKey !== secret_key.replace(/\./g, ' ')) {
    return { confirmSecretKey: 'Ingresa tu llave actual si quieres cambiarla.' }
  }
  return {}
}

const mapStateToProps = (state) => {
  try {
    return { initialValues: state.getter.accountOrganization.data || {} }
  } catch (e) {
    return { initialValues: {} }
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'resetSecretKey', validate })(ResetSecretKeyForm))
