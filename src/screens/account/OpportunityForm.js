/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField, Toggle, DatePicker } from 'components/Fields'
import service, { getBackoff } from 'api/service'
import FormStyles from 'src/Form.css'


class Fields extends React.Component {
  componentDidMount() {
    getBackoff(service.getDonorsMini, { key: 'miniDonors' })
  }

  render() {
    const { anywhere } = this.props

    const formatDatePicker = value => value || null

    return (
      <React.Fragment>
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="Nombre de puesto"
            name="position"
          />
        </div>
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="Descripción del trabajo"
            name="desc"
            multiLine
            rows={2}
            className={FormStyles.wideInput}
          />
        </div>
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="Habilidades requeridas, separadas por comas"
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
        <div>
          <Toggle
            label="¿Se puede hacer desde cualquier lugar?"
            className={FormStyles.toggle}
            name="from_anywhere"
          />
        </div>
        {!anywhere &&
          <React.Fragment>
            <div className={FormStyles.row}>
              <TextField
                floatingLabelText="¿Dónde estarán trabajando los voluntarios?"
                className={FormStyles.wideInput}
                name="location_desc"
              />
            </div>
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
}

Fields.propTypes = {
  anywhere: PropTypes.bool.isRequired,
}

const CreateForm = ({ handleSubmit, submitting, anywhere = false }) => {
  return (
    <React.Fragment>
      <Fields anywhere={anywhere} />
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
  anywhere: PropTypes.bool,
}

const UpdateForm = ({ handleSubmit, submitting, id, anywhere = false }) => {
  return (
    <React.Fragment>
      <Fields anywhere={anywhere} id={id} />
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
  anywhere: PropTypes.bool,
}

const validate = ({ position, desc, required_skills, target, from_anywhere: anywhere, location_desc: location }) => {
  const errors = {}
  if (!position) errors.position = 'Agrega el nombre del puesto'
  if (!desc) errors.desc = 'Agrega una descripción del trabajo'
  if (!required_skills) errors.required_skills = 'Agrega las habiliades requeridas, separadas por comas'
  if (target === null || target === undefined) errors.target = 'Agrega el número de voluntarios que están buscando'
  if (!anywhere && !location) errors.location_desc = '¿Dónde estarán trabajando los voluntarios?'
  return errors
}

export const prepareOpportunityBody = (body) => {
  const { start_date: startDate, end_date: endDate, required_skills: skills } = body
  return {
    ...body,
    start_date: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
    end_date: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
    required_skills: skills.split(','),
  }
}

export const prepareInitialOpportunityValues = (values) => {
  const { start_date: startDate, end_date: endDate, required_skills: skills } = values
  return {
    ...values,
    start_date: startDate && moment(startDate).toDate(),
    end_date: endDate && moment(endDate).toDate(),
    required_skills: skills.join(','),
  }
}

const mapStateToPropsCreate = (state) => {
  try {
    return { anywhere: state.form.accountNewOpportunity.values.from_anywhere }
  } catch (e) {
    return {}
  }
}

const mapStateToPropsUpdate = (state, { id }) => {
  try {
    return { anywhere: state.form[`accountUpdateOpportunity_${id}`].values.from_anywhere }
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
