import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import flattenObject from 'tools/flatten'
import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import Styles from 'screens/account/Form.css'


const ContactForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          floatingLabelText="Email"
          name="email"
          autoCapitalize="off"
        />
        <TextField
          floatingLabelText="Teléfono"
          name="phone"
        />
        <TextField
          floatingLabelText="Persona responsable"
          name="person_responsible"
        />
        <TextField
          floatingLabelText="Sitio web"
          name="website"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Calle y número"
          name="street"
        />
        <TextField
          floatingLabelText="Localidad o colonia"
          name="locality"
        />
        <TextField
          floatingLabelText="Código postal"
          name="zip"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Ciudad"
          name="city"
        />
        <TextField
          floatingLabelText="Estado"
          name="state"
        />
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

ContactForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ email, phone }) => {
  const errors = {}
  if (!validateEmail(email)) return { email: 'Se requiere un email válido' }
  if (!phone) errors.phone = 'Agrega un teléfono'
  return errors
}

const mapStateToProps = (state) => {
  try {
    return { initialValues: flattenObject(state.getter.accountOrganization.data.contact || {}) }
  } catch (e) {
    return { initialValues: {} }
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'accountContact', validate })(ContactForm))
