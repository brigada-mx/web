import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import AutoCompleteMui from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton } from 'material-ui/RadioButton'

import {
  TextField,
  SelectField,
  Toggle,
  DatePicker,
  AutoComplete,
  PhotoGalleryPicker,
  RadioButtonGroup,
} from 'components/Fields'
import Modal from 'components/Modal'
import ConfirmButton from 'components/ConfirmButton'
import Preview from 'components/Preview'
import { projectTypes, actionBeneficiariesCriteria } from 'src/choices'
import FormStyles from 'src/Form.css'
import Styles from './ActionForm.css'


class Fields extends React.Component {
  state = { pickerOpen: false }

  handleOpenPicker = () => {
    this.setState({ pickerOpen: true })
  }

  handleClosePicker = () => {
    this.setState({ pickerOpen: false })
  }

  handleClosePickerDelay = () => {
    setTimeout(this.handleClosePicker, 500)
  }

  render() {
    const { update, onLocalityChange, initialValues, localitiesSearch = [], preview = {}, criteria = '' } = this.props

    const localities = localitiesSearch.map((l) => {
      const { id, name, municipality_name: muniName, state_name: stateName } = l
      return { text: `${name}, ${muniName}, ${stateName}`, value: id }
    })
    const formatDatePicker = value => value || null
    const formatAutoComplete = (value) => {
      try {
        return value.text
      } catch (e) {
        return value || ''
      }
    }
    const normalizeAutoComplete = (value) => {
      if (!value) return { value: '', text: '' }
      if (typeof value === 'string') return { value: '', text: value }
      return value
    }

    const picker = () => {
      if (!update) return null
      const { submissions, testimonials } = initialValues
      const images = [].concat(...submissions.map(s => s.images))
      if (images.length === 0 && testimonials.length === 0) return null

      if (!this.state.pickerOpen) {
        return (
          <React.Fragment>
            <div className={Styles.pickerContainer}>
              <div>
                <Preview
                  {...preview}
                  onClick={this.handleOpenPicker}
                  width={240}
                  height={180}
                  emptySrc="/assets/img/empty-featured-img.svg"
                  emptyStyle={{ backgroundSize: '86px 76px' }}
                />
              </div>
            </div>
            <div />
          </React.Fragment>
        )
      }

      return (
        <Modal
          contentClassName={FormStyles.modal}
          onClose={this.handleClosePicker}
        >
          <PhotoGalleryPicker
            name="preview"
            testimonials={testimonials}
            submissions={submissions}
            columns={4}
            onChange={this.handleClosePickerDelay}
          />
        </Modal>
      )
    }

    return (
      <React.Fragment>
        {update &&
          <div className={Styles.pickerRow}>{picker()}</div>
        }

        <p className={Styles.sectionHeader}>Descripción general</p>
        <div className={FormStyles.row}>
          <SelectField
            floatingLabelText="Tipo de proyecto"
            name="action_type"
          >
            {projectTypes.map(({ value, label }) => {
              return <MenuItem key={value} value={value} primaryText={label} />
            })}
          </SelectField>
          <TextField
            type="number"
            min="0"
            floatingLabelText="Presupuesto estimado MXN"
            name="budget"
            normalize={(value) => { return value ? parseInt(value, 10) : null }}
          />
        </div>
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="¿Qué problemática atiende el proyecto? ¿Qué resultados esperan lograr?"
            className={FormStyles.wideInput}
            name="desc"
            multiLine
            rows={3}
          />
        </div>

        <p className={Styles.sectionHeader}>Selección de beneficiarios</p>
        <p className={Styles.label}>¿Qué mecanismos utilizan para recibir o seleccionar a los beneficiarios?</p>
        <div className={FormStyles.row}>
          <RadioButtonGroup
            className={`${FormStyles.radioButtonGroup} ${Styles.row}`}
            name="beneficiaries_criteria"
          >
            {actionBeneficiariesCriteria.map(({ value, label }) => {
              return <RadioButton key={value} value={value} label={label} className={Styles.radioButton} />
            })}
          </RadioButtonGroup>
        </div>

        {criteria === 'other' &&
          <div className={FormStyles.row}>
            <TextField
              floatingLabelText="Describe el mecanismo que usan (limita a 80 caracteres)"
              className={FormStyles.wideInput}
              name="beneficiaries_criteria_desc"
            />
          </div>
        }

        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="¿Qué características deben cumplir los beneficiarios (edad, sexo, grupo indígena, lugar, nivel económico, etc)?"
            className={FormStyles.wideInput}
            name="beneficiaries_desc"
            multiLine
            rows={2}
          />
        </div>

        <p className={Styles.sectionHeader}>Datos específicos</p>
        <div className={FormStyles.row}>
          <AutoComplete
            className={FormStyles.wideInput}
            floatingLabelText="Localidad"
            name="locality"
            fullWidth
            onChange={onLocalityChange}
            dataSource={localities}
            filter={AutoCompleteMui.noFilter}
            format={formatAutoComplete}
            normalize={normalizeAutoComplete}
          />
        </div>
        <div className={FormStyles.row}>
          <TextField
            type="number"
            min="0"
            floatingLabelText="Núm. de unidades a entregar"
            name="target"
            normalize={(value) => { return value ? parseInt(value, 10) : null }}
          />
          <TextField
            floatingLabelText="Unidad de medida"
            name="unit_of_measurement"
          />
          <TextField
            type="number"
            min="0"
            floatingLabelText="Núm. de unidades ya entregadas"
            name="progress"
            normalize={(value) => { return value ? parseInt(value, 10) : null }}
          />
        </div>
        <div className={FormStyles.row}>
          <DatePicker
            floatingLabelText="Fecha de inicio"
            name="start_date"
            format={formatDatePicker}
          />
          <DatePicker
            floatingLabelText="Fecha final estimada"
            name="end_date"
            format={formatDatePicker}
          />
        </div>
        <div className={FormStyles.toggle}>
          <Toggle
            label="¿Publicado?"
            name="published"
          />
        </div>
      </React.Fragment>
    )
  }
}

Fields.propTypes = {
  update: PropTypes.bool.isRequired,
  onLocalityChange: PropTypes.func.isRequired,
  localitiesSearch: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialValues: PropTypes.object.isRequired,
  preview: PropTypes.object,
  criteria: PropTypes.string,
}

const CreateForm = ({ handleSubmit, reset, submitting, ...rest }) => {
  return (
    <React.Fragment>
      <Fields update={false} {...rest} />
      <div className={FormStyles.row}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="Agregar"
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

CreateForm.propTypes = {
  ...rxfPropTypes,
}

const UpdateForm = ({ handleSubmit, reset, submitting, onDelete, error, submitFailed, ...rest }) => {
  return (
    <React.Fragment>
      <Fields update {...rest} />
      <div className={FormStyles.row}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="GUARDAR"
          onClick={handleSubmit}
        />
        <ConfirmButton
          className={FormStyles.button}
          disabled={submitting}
          text="Borrar"
          onConfirm={onDelete}
        />
        {submitFailed && error && <div className={FormStyles.errorText}>{error}</div>}
      </div>
    </React.Fragment>
  )
}

UpdateForm.propTypes = {
  ...rxfPropTypes,
  onDelete: PropTypes.func.isRequired,
}

const validator = (update: boolean = false) => {
  const validate = ({
    locality,
    action_type:
    actionType,
    desc,
    budget,
    target,
    progress,
    start_date: startDate,
    end_date: endDate,
    preview,
    beneficiaries_criteria: criteria,
    beneficiaries_criteria_desc: criteriaDesc,
  }, { initialValues }) => {
    const errors = {}
    if (!locality || !locality.value) errors.locality = 'Escoge una localidad de la lista'
    if (!actionType) errors.action_type = 'Escoge el tipo de proyecto'
    if (!desc) errors.desc = 'Agrega una descripción del proyecto'
    if (budget && budget < 0) errors.budget = 'El presupuesto no puede ser negativo'

    if (target && target < 0) errors.target = 'La meta no puede ser negativa'
    if (progress && progress < 0) errors.progress = 'El avance no puede ser negativo'

    if (progress && !target || (progress && target && progress > target)) {
      errors.progress = 'El avance no puede ser mayor que la meta'
      errors.target = 'El avance no puede ser mayor que la meta'
    }

    if (criteria && !criteriaDesc) errors.beneficiaries_criteria_desc = 'Agrega una descripción de las características'
    if (criteriaDesc && criteriaDesc.length > 80) errors.beneficiaries_criteria_desc = 'Limita la descripción a 80 caracteres'

    if (startDate && endDate && startDate > endDate) {
      errors.start_date = 'Fecha inicio debe ser antes de fecha fin'
      errors.end_date = 'Fecha inicio debe ser antes de fecha fin'
    }

    if (update && (!preview || !preview.url)) {
      const { submissions, testimonials } = initialValues
      const images = [].concat(...submissions.map(s => s.images))
      if (images.length > 0 || testimonials.length > 0) {
        errors.preview = 'Escoge una foto o un vídeo para acompañar a este proyecto'
        errors._error = 'Escoge una foto o un vídeo para acompañar a este proyecto'
      }
    }
    return errors
  }
  return validate
}

export const prepareActionBody = (body) => {
  const { locality, start_date: startDate, end_date: endDate } = body
  return {
    ...body,
    locality: locality.value,
    start_date: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
    end_date: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
  }
}

export const prepareInitialActionValues = (values) => {
  const {
    progress,
    start_date: startDate,
    end_date: endDate,
    locality: { id, name, municipality_name: muniName, state_name: stateName },
  } = values

  return {
    ...values,
    progress: progress !== null && progress !== undefined ? progress : 0,
    start_date: startDate && moment(startDate).toDate(),
    end_date: endDate && moment(endDate).toDate(),
    locality: { text: `${name}, ${muniName}, ${stateName}`, value: id },
  }
}

const mapStateToPropsCreate = (state) => {
  try {
    return { criteria: state.form.accountNewAction.values.beneficiaries_criteria }
  } catch (e) {
    return {}
  }
}

const mapStateToPropsUpdate = (state, { initialValues }) => {
  try {
    return {
      preview: state.form[`accountUpdateAction_${initialValues.key}`].values.preview,
      criteria: state.form[`accountUpdateAction_${initialValues.key}`].values.beneficiaries_criteria,
    }
  } catch (e) {
    return {}
  }
}

const ReduxCreateForm = connect(mapStateToPropsCreate, null)(
  reduxForm({ form: 'accountNewAction', validate: validator(false) })(CreateForm))
const ReduxUpdateForm = connect(mapStateToPropsUpdate, null)(reduxForm({ validate: validator(true) })(UpdateForm)) // pass `form` arg when instantiating form
export { ReduxCreateForm as CreateActionForm, ReduxUpdateForm as UpdateActionForm }
