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
        <TextField name="fullName" hintText="Nombre completo" />
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

const validate = (values) => {
  if (!values.fullName) return { fullName: 'Se requiere un nombre' }
  return {}
}

const mapStateToProps = (state) => {
  const { me = {} } = state.getter
  return { initialValues: me.data || {} }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'me', validate })(UserForm))
