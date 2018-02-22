/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import Styles from 'screens/account/Form.css'


const UserForm = ({ onChange, onSubmitName, full_name, disabled }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          name="full_name"
          value={full_name}
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
  full_name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

export default UserForm
