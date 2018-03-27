import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'

import { TextField, SelectField, Toggle } from 'components/Fields'
import { sectors } from 'src/choices'
import { normalizeTransparencyScore } from 'tools/other'
import FormStyles from 'src/Form.css'
import Styles from './OrganizationForm.css'


const OrganizationForm = ({ handleSubmit, submitting, initialValues, help = false }) => {
  const { secret_key: key, score } = initialValues
  const normalizedScore = Number(normalizeTransparencyScore(score || 0)).toFixed(1)
  return (
    <React.Fragment>
      <span className={Styles.key}>Llave: {key ? key.replace(/\./g, ' ') : ''}</span>
      {false && <span className={Styles.score}>indicador de transparencia: {normalizedScore}</span>}
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
        <div>
          <Toggle
            label="Estamos buscando voluntarios"
            className={FormStyles.toggle}
            name="accepting_help"
          />
        </div>
        {help ? (
          <div className={FormStyles.row}>
            <TextField
              floatingLabelText="Describe el perfil de voluntario que están buscando"
              className={FormStyles.wideInput}
              name="help_desc"
              multiLine
              rows={3}
            />
          </div>
        ) : null}
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

OrganizationForm.propTypes = {
  ...rxfPropTypes,
  help: PropTypes.bool,
}

const validate = ({ name, desc, year_established: year }) => {
  const errors = {}
  if (!name) errors.name = 'Angresa el nombre'
  if (!desc) errors.desc = 'Agrega la descripción de tu organización'
  if (!year || year.toString().length !== 4) errors.year_established = 'Ingresa un año válido'
  return errors
}

const mapStateToProps = (state) => {
  try {
    const { accepting_help: help } = state.form.accountOrganization.values
    return { initialValues: state.getter.accountOrganization.data || {}, help }
  } catch (e) {
    return { initialValues: {} }
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'accountOrganization', validate })(OrganizationForm))
