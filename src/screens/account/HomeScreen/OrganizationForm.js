import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'

import { TextField, SelectField } from 'components/Fields'
import { sectors } from 'src/choices'
import Styles from 'screens/account/Form.css'


const OrganizationForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div>
        <TextField
          floatingLabelText="Llave secreta"
          name="secret_key"
          readOnly
          disabled
          format={(value) => { return value ? value.replace(/\./g, ' ') : '' }}
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Nombre"
          name="name"
        />
        <TextField
          floatingLabelText="Año establecido"
          type="number"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
          name="year_established"
        />
      </div>
      <div>
        <SelectField
          floatingLabelText="Sector"
          name="sector"
        >
          {sectors.map(({ value, label }) => <MenuItem key={value} value={value} primaryText={label} />)}
        </SelectField>
        <TextField
          floatingLabelText="Descripción"
          name="desc"
          multiLine
          rows={3}
        />
      </div>
      <div>
        <RaisedButton
          className={Styles.button}
          disabled={submitting}
          label="ACTUALIZAR"
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

OrganizationForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ name, desc, year_established }) => {
  const errors = {}
  if (!name) errors.name = 'Angresa el nombre'
  if (!desc) errors.desc = 'Agrega la descripción de tu organización'
  if (!year_established || year_established.toString().length !== 4) {
    errors.year_established = 'Ingresa un año válido'
  }
  return errors
}

const mapStateToProps = (state) => {
  try {
    return { initialValues: state.getter.accountOrganization.data || {} }
  } catch (e) {
    return { initialValues: {} }
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'accountOrganization', validate })(OrganizationForm))
