import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import flattenObject from 'tools/flatten'
import { TextField } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const ContactForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          floatingLabelText="Email"
          name="email"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Teléfono"
          name="phone"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Persona responsable"
          name="person_responsible"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Sitio web"
          name="website"
        />
      </div>
      <div>
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
      </div>
      <div>
        <TextField
          floatingLabelText="Estado"
          name="state"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Calle y número"
          name="street"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Localidad o colonia"
          name="locality"
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
  if (!email) errors.email = 'Debes ingresar el nombre'
  if (!phone) errors.phone = 'Debes ingresar la descripción'
  return errors
}

const mapStateToProps = (state) => {
  const { accountOrganization = {} } = state.getter
  const { data } = accountOrganization
  if (!data) return { initialValues: {} }
  return { initialValues: flattenObject(data.contact || {}) }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'accountContact', validate })(ContactForm))
