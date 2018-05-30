/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

import { volunteerLocations } from 'src/choices'
import { TextField, Toggle, DatePicker, SelectField } from 'components/Fields'
import FormStyles from 'src/Form.css'


const Fields = ({ location }) => {
  const formatDatePicker = value => value || null

  return (
    <React.Fragment>
      <div className={FormStyles.row}>
        <TextField
          floatingLabelText="Nombre de puesto (max 3 palabras)"
          name="position"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          floatingLabelText="Objetivos del voluntariado"
          name="desc"
          multiLine
          rows={2}
          className={FormStyles.wideInput}
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          floatingLabelText="Habilidades requeridas, separadas por comas (ej: Arquitectura, Diseño gráfico, Medicina)"
          name="required_skills"
          className={FormStyles.wideInput}
        />
      </div>
      <div className={FormStyles.row}>
        <DatePicker
          floatingLabelText="¿Cuándo empieza el trabajo?"
          name="start_date"
          format={formatDatePicker}
        />
        <DatePicker
          floatingLabelText="¿Cuándo termina el trabajo?"
          name="end_date"
          format={formatDatePicker}
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          type="number"
          min="0"
          floatingLabelText="¿Cuántos voluntarios buscan en total?"
          name="target"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
        />
        <TextField
          type="number"
          min="0"
          floatingLabelText="¿Cuántos voluntarios han encontrado?"
          name="progress"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
        />
      </div>
      <div className={FormStyles.row}>
        <SelectField
          className={FormStyles.wideInput}
          floatingLabelText="¿Dónde van a trabajar los voluntarios?"
          name="location"
        >
          {volunteerLocations.map(({ value, label }) => {
            return <MenuItem key={value} value={value} primaryText={label} />
          })}
        </SelectField>
      </div>
      {location === 'other' &&
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="Describe el o los lugares"
            className={FormStyles.wideInput}
            name="location_desc"
          />
        </div>
      }
      {location !== 'anywhere' &&
        <React.Fragment>
          <div className={FormStyles.row}>
            <div className={FormStyles.toggle}>
              <Toggle
                label="¿Transporte incluido?"
                name="transport_included"
              />
            </div>
            <div className={FormStyles.toggle}>
              <Toggle
                label="¿Comida incluida?"
                name="food_included"
              />
            </div>
          </div>
        </React.Fragment>
      }
      <div className={FormStyles.row}>
        <div className={FormStyles.toggle}>
          <Toggle
            label="¿Publicado?"
            name="published"
          />
        </div>
      </div>
    </React.Fragment>
  )
}

Fields.propTypes = {
  location: PropTypes.string.isRequired,
}

const CreateForm = ({ handleSubmit, submitting, location = 'anywhere' }) => {
  return (
    <React.Fragment>
      <Fields location={location} />
      <div className={FormStyles.row}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="AGREGAR"
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

CreateForm.propTypes = {
  ...rxfPropTypes,
  location: PropTypes.string,
}

const UpdateForm = ({ handleSubmit, submitting, id, location = 'anywhere' }) => {
  return (
    <React.Fragment>
      <Fields location={location} id={id} />
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

UpdateForm.propTypes = {
  ...rxfPropTypes,
  id: PropTypes.number.isRequired,
  location: PropTypes.string,
}

const validate = ({ position, desc, required_skills, target, location, location_desc: locDesc }) => {
  const errors = {}
  if (!position) errors.position = 'Agrega el nombre del puesto'
  else if (position.split(' ').filter(s => Boolean(s.trim())).length > 3) errors.position = 'Limita el nombre a 3 palabras'

  if (!desc) errors.desc = 'Agrega objetivos del voluntariado'
  else if (desc.length > 500) errors.desc = 'Limita la descripción a 500 caracteres'

  if (!required_skills) errors.required_skills = 'Agrega las habilidades requeridas, separadas por comas'
  else if (required_skills.split(',').length > 5) errors.required_skills = 'No poner más de 5 habilidades'
  else if (required_skills.split(',').some(s => s.length > 50)) errors.required_skills = 'Limita las habilidades a 50 caracteres'

  if (target === null || target === undefined) errors.target = 'Agrega el número de voluntarios que están buscando'
  if (location === 'other' && !locDesc) errors.location_desc = 'Agrega la descripción de el o los lugares'
  return errors
}

export const prepareOpportunityBody = (body) => {
  const { start_date: startDate, end_date: endDate, required_skills: skills } = body
  return {
    ...body,
    start_date: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
    end_date: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
    required_skills: skills.split(',').map(s => s.trim()).filter(s => Boolean(s)),
  }
}

export const prepareInitialOpportunityValues = (values) => {
  const { start_date: startDate, end_date: endDate, required_skills: skills } = values
  return {
    ...values,
    start_date: startDate && moment(startDate).toDate(),
    end_date: endDate && moment(endDate).toDate(),
    required_skills: skills.join(', '),
  }
}

const mapStateToPropsCreate = (state) => {
  try {
    return { location: state.form.accountNewOpportunity.values.location }
  } catch (e) {
    return {}
  }
}

const mapStateToPropsUpdate = (state, { id }) => {
  try {
    return { location: state.form[`accountUpdateOpportunity_${id}`].values.location }
  } catch (e) {
    return {}
  }
}

const ReduxCreateForm = connect(mapStateToPropsCreate, null)(reduxForm({ form: 'accountNewOpportunity', validate })(CreateForm))
const ReduxUpdateForm = connect(mapStateToPropsUpdate, null)(reduxForm({ validate })(UpdateForm)) // pass `form` arg when instantiating form

export {
  ReduxCreateForm as CreateOpportunityForm,
  ReduxUpdateForm as UpdateOpportunityForm,
}
