import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'

import { sectors } from 'src/choices'
import { TextField, SelectField } from 'components/Fields'
import FormStyles from 'src/Form.css'


const DonorForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
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
            floatingLabelText="Descripción"
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
            label="ACTUALIZAR"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

DonorForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ name, desc, year_established: year, sector }) => {
  const errors = {}
  if (!name) errors.name = 'Agrega el nombre'
  if (!desc) errors.desc = 'Agrega la descripción de donador'
  if (!year || year.toString().length !== 4) errors.year_established = 'Ingresa un año válido'
  if (!sector) errors.sector = 'Agrega el sector'
  return errors
}

const mapStateToProps = (state) => {
  try {
    return { initialValues: state.getter.donorDonor.data || {} }
  } catch (e) {
    return { initialValues: {} }
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'donorDonor', validate })(DonorForm))
