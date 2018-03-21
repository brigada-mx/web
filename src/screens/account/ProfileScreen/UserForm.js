import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const UserForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField name="first_name" hintText="Nombre" />
      </div>
      <div>
        <TextField name="surnames" hintText="Apellidos" />
      </div>
      <RaisedButton
        className={Styles.button}
        disabled={submitting}
        label="ACTUALIZAR"
        onClick={handleSubmit}
      />
    </React.Fragment>
  )
}

UserForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ first_name: name, surnames }) => {
  const errors = {}
  if (!name) errors.first_name = 'Se requiere un nombre'
  if (!surnames) errors.surnames = 'Se requieren apellidos'
  return errors
}

const mapStateToProps = (state) => {
  try {
    return { initialValues: state.getter.me.data || {} }
  } catch (e) {
    return { initialValues: {} }
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'me', validate })(UserForm))
