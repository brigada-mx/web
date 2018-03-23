import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'

import flattenObject from 'tools/flatten'
import { TextField, SelectField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import { states } from 'src/choices'
import Styles from 'src/Form.css'


const ContactForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          floatingLabelText="Persona responsable"
          name="person_responsible"
        />
      </div>
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
          floatingLabelText="Municipio o delegación"
          name="city"
        />
        <SelectField
          floatingLabelText="Estado"
          name="state"
        >
          {states.map(s => <MenuItem key={s} value={s} primaryText={s} />)}
        </SelectField>
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
