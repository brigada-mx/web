import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import MenuItem from 'material-ui/MenuItem'
import AutoCompleteMui from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField, SelectField, Checkbox, DatePicker, AutoComplete } from 'components/Fields'
import { projectTypes } from 'src/choices'
import FormStyles from 'screens/account/Form.css'


const Fields = ({ update, onLocalityChange, localitiesSearch = [] }) => {
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

  return (
    <React.Fragment>
      {update &&
        <div>
          <TextField
            floatingLabelText="Clave"
            name="key"
            readOnly
            disabled
          />
        </div>
      }
      <div>
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
      <div>
        <SelectField
          floatingLabelText="Tipo de proyecto"
          name="action_type"
        >
          {projectTypes.map(({ value, label }) => {
            return <MenuItem key={value} value={value} primaryText={label} />
          })}
        </SelectField>
        <TextField
          floatingLabelText="Descripción"
          name="desc"
          multiLine
          rows={3}
        />
      </div>
      <div>
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
        <TextField
          type="number"
          min="0"
          floatingLabelText="Presupuesto estimado MXN"
          name="budget"
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
      <div>
        <Checkbox
          label="¿Publicado?"
          name="published"
        />
      </div>
    </React.Fragment>
  )
}

Fields.propTypes = {
  update: PropTypes.bool.isRequired,
  onLocalityChange: PropTypes.func.isRequired,
  localitiesSearch: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const CreateForm = ({ handleSubmit, reset, submitting, ...rest }) => {
  return (
    <React.Fragment>
      <Fields update={false} {...rest} />
      <div className={FormStyles.row}>
        <RaisedButton
          className={FormStyles.button}
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
}

const UpdateForm = ({ handleSubmit, reset, submitting, ...rest }) => {
  return (
    <React.Fragment>
      <Fields update {...rest} />
      <div className={FormStyles.row}>
        <RaisedButton
          className={FormStyles.button}
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
}

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
}) => {
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

  if (startDate && endDate && startDate > endDate) {
    errors.start_date = 'Fecha inicio debe ser antes de fecha fin'
    errors.end_date = 'Fecha inicio debe ser antes de fecha fin'
  }
  return errors
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
    start_date: startDate,
    end_date: endDate,
    locality: { id, name, municipality_name: muniName, state_name: stateName },
  } = values
  return {
    ...values,
    start_date: startDate && moment(startDate).toDate(),
    end_date: endDate && moment(endDate).toDate(),
    locality: { text: `${name}, ${muniName}, ${stateName}`, value: id },
  }
}

const ReduxCreateForm = reduxForm({ form: 'accountNewAction', validate })(CreateForm)
const ReduxUpdateForm = reduxForm({ validate })(UpdateForm) // pass `form` arg when instantiating form
export { ReduxCreateForm as CreateActionForm, ReduxUpdateForm as UpdateActionForm }
