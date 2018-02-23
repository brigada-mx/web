import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const UserForm = ({ handleSubmit, pristine, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField name="fullName" hintText="Nombre completo" />
      </div>
      <RaisedButton
        className={Styles.button}
        disabled={pristine || submitting}
        label="ACTUALIZAR"
        onClick={handleSubmit}
      />
    </React.Fragment>
  )
}

UserForm.propTypes = {
  ...rxfPropTypes,
}

export default reduxForm({ form: 'user' })(UserForm)
