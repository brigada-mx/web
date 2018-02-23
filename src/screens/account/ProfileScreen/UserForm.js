import React from 'react'

import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const UserForm = ({ handleSubmit, pristine, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <Field name="fullName" component={TextField} hintText="Nombre completo" />
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
  ...reduxFormPropTypes,
}

export default reduxForm({ form: 'contact' })(UserForm)
