import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'

import flattenObject from 'tools/flatten'
import { TextField, SelectField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import { states } from 'src/choices'
import Styles from './OrganizationForm.css'
import FormStyles from 'src/Form.css'


const ContactForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          floatingLabelText="Persona responsable"
          name="person_responsible"
        />
        <TextField
          floatingLabelText="Email"
          name="email"
          autoCapitalize="off"
        />
        <TextField
          floatingLabelText="Teléfono"
          name="phone"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          floatingLabelText="Sitio web"
          name="website"
        />
        <TextField
          floatingLabelText="Calle y número"
          name="street"
        />
        <TextField
          floatingLabelText="Localidad o colonia"
          name="locality"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          floatingLabelText="Municipio o delegación"
          name="city"
        />
        <SelectField
          floatingLabelText="Estado"
          name="state"
        >
        <TextField
          floatingLabelText="Código postal"
          name="zip"
        />
          {states.map(s => <MenuItem key={s} value={s} primaryText={s} />)}
        </SelectField>
      </div>
      <div className={FormStyles.row}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="ACTUALIZAR"
          onClick={handleSubmit}
        />
      </div>
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
