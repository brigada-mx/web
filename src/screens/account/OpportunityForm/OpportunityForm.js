/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton } from 'material-ui/RadioButton'

import { volunteerLocations } from 'src/choices'
import { TextField, Toggle, DatePicker, RadioButtonGroup, PhotoGalleryPicker } from 'components/Fields'
import FormStyles from 'src/Form.css'
import Styles from './OpportunityForm.css'


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

      <div className={Styles.section}>
        <div className={Styles.sectionHeader}>¿Dónde van a trabajar los voluntarios?</div>
        <div className={FormStyles.row}>
          <RadioButtonGroup
            className={`${FormStyles.radioButtonGroup} ${Styles.row}`}
            name="location"
          >
            {volunteerLocations.map(({ value, label }) => {
              return <RadioButton key={value} value={value} label={label} />
            })}
          </RadioButtonGroup>
        </div>
        {location === 'other' &&
          <div className={Styles.row}>
            <TextField
              floatingLabelText="Describe el o los lugares"
              className={FormStyles.wideInput}
              name="location_desc"
            />
          </div>
        }
        {location !== 'anywhere' &&
          <React.Fragment>
            <div className={Styles.row}>
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
      </div>
    </React.Fragment>
  )
}

Fields.propTypes = {
  location: PropTypes.string.isRequired,
}

const picker = (action) => {
  const { testimonials, submissions } = action
  const images = [].concat(...submissions.map(s => s.images))
  const gallery = (images.length > 0 || testimonials.length > 0) &&
    <PhotoGalleryPicker
      name="photo"
      testimonials={testimonials}
      submissions={submissions}
      columns={4}
    />
  return gallery || null
}

const CreateForm = ({ handleSubmit, submitting, location = 'anywhere', action }) => {
  return (
    <React.Fragment>
      <Fields location={location} action={action} />
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
      {picker(action)}
    </React.Fragment>
  )
}

CreateForm.propTypes = {
  ...rxfPropTypes,
  location: PropTypes.string,
  action: PropTypes.object.isRequired,
}

const UpdateForm = ({ handleSubmit, submitting, id, location = 'anywhere', action }) => {
  return (
    <React.Fragment>
      <Fields location={location} id={id} action={action} />
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
      {picker(action)}
    </React.Fragment>
  )
}

UpdateForm.propTypes = {
  ...rxfPropTypes,
  id: PropTypes.number.isRequired,
  location: PropTypes.string,
  action: PropTypes.object.isRequired,
}

const validate = ({ position, desc, required_skills, target, location, location_desc: locDesc, photo }) => {
  const errors = {}
  if (!position) errors.position = 'Agrega el nombre del puesto'
  else if (position.split(' ').filter(s => Boolean(s.trim())).length > 3) errors.position = 'Limita el nombre a 3 palabras'

  if (!desc) errors.desc = 'Agrega objetivos del voluntariado'
  else if (desc.length > 500) errors.desc = 'Limita la descripción a 500 caracteres'

  if (!required_skills) errors.required_skills = 'Agrega las habilidades requeridas, separadas por comas'
  else if (required_skills.split(',').length > 5) errors.required_skills = 'No poner más de 5 habilidades'
  else if (required_skills.split(',').some(s => s.length > 50)) errors.required_skills = 'Limita las habilidades a 50 caracteres'

  if (target === null || target === undefined) errors.target = 'Agrega el número de voluntarios que están buscando'
  if (location === 'other') {
    if (!locDesc) errors.location_desc = 'Agrega la descripción de el o los lugares'
    else if (locDesc.length > 200) errors.location_desc = 'Limita la descripción a 200 caracteres'
  }
  if (!photo || photo && !photo.url) errors.photo = 'Escoge una foto o un vídeo'

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

export { ReduxCreateForm as CreateOpportunityForm, ReduxUpdateForm as UpdateOpportunityForm }
