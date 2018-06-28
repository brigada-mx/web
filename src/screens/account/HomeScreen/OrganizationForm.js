import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'

import { TextField, SelectField } from 'components/Fields'
import { sectors } from 'src/choices'
import FormStyles from 'src/Form.css'
import Styles from './OrganizationForm.css'


const OrganizationForm = ({ handleSubmit, submitting, initialValues }) => {
  const { secret_key: key } = initialValues
  return (
    <React.Fragment>
      <span className={Styles.key}>Llave: {key ? key.replace(/\./g, ' ') : ''}</span>
      <div className={FormStyles.formContainerLeft}>
        <div className={FormStyles.row}>
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
          <SelectField
            floatingLabelText="Sector"
            name="sector"
          >
            {sectors.map(
              ({ value, label }) => <MenuItem key={value} value={value} primaryText={label} />
            )}
          </SelectField>
        </div>
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="Misión de tu organización"
            className={FormStyles.wideInput}
            name="desc"
            multiLine
            rows={3}
          />
        </div>
        <div className={FormStyles.row}>
          <RaisedButton
            backgroundColor="#3DC59F"
            labelColor="#ffffff"
            className={FormStyles.primaryButton}
            disabled={submitting}
            label="GUARDAR"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

OrganizationForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ name, desc, year_established: year }) => {
  const errors = {}
  if (!name) errors.name = 'Agrega el nombre'
  if (!desc) errors.desc = 'Agrega la misión de tu grupo'
  if (!year || year.toString().length !== 4) errors.year_established = 'Ingresa un año válido'
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
