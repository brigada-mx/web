import React from 'react'
import PropTypes from 'prop-types'

import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import Styles from 'screens/account/Form.css'


const UserForm = ({ onChange, onSubmitName, fullName, disabled }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          name="fullName"
          value={fullName}
          hintText="Nombre completo"
          onChange={onChange}
        />
      </div>
      <RaisedButton
        className={Styles.button}
        disabled={disabled}
        label="ACTUALIZAR"
        onClick={onSubmitName}
      />
    </React.Fragment>
  )
}

UserForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmitName: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

export default reduxForm({ form: 'contact' })(UserForm)
