import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import MenuItem from 'material-ui/MenuItem'
import AutoCompleteMui from 'material-ui/AutoComplete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Add from 'material-ui/svg-icons/content/add'
import Done from 'material-ui/svg-icons/action/done'
import Reset from 'material-ui/svg-icons/navigation/close'

import { TextField, SelectField, Checkbox, DatePicker, AutoComplete } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const Fields = ({ update, onLocalityChange, localitiesSearch = [] }) => {
  const localities = localitiesSearch.map((l) => {
    const { id, name, municipality_name, state_name } = l
    return { text: `${name}, ${municipality_name}, ${state_name}`, value: id }
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
          className={Styles.wideInput}
          floatingLabelText="Localidad"
          name="locality"
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
          <MenuItem value="houses" primaryText="Vivienda" />
          <MenuItem value="roads_bridges" primaryText="Carreteras y puentes" />
          <MenuItem value="schools" primaryText="Escuelas" />
          <MenuItem value="consumer_goods" primaryText="Bienes de consumo" />
          <MenuItem value="clothes" primaryText="Ropa" />
          <MenuItem value="health" primaryText="Salud" />
          <MenuItem value="water_infrastructure" primaryText="Infraestructura hidráulica" />
          <MenuItem value="administration" primaryText="Administración y operación" />
          <MenuItem value="social_development" primaryText="Desarrollo social" />
          <MenuItem value="public_spaces" primaryText="Espacio público" />
          <MenuItem value="sports_installations" primaryText="Instalaciones deportivas" />
          <MenuItem value="cultural_sites" primaryText="Patrimonio histórico y cultural" />
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
          floatingLabelText="Meta"
          name="target"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
        />
        <TextField
          floatingLabelText="Unidad de medida de meta"
          name="unit_of_measurement"
        />
        <TextField
          type="number"
          floatingLabelText="Avance contra meta"
          name="progress"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
        />
        <TextField
          type="number"
          floatingLabelText="Presupuesto estimado (opcional)"
          name="budget"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
        />
      </div>
      <div className={Styles.row}>
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
      <div className={Styles.row}>
        <FloatingActionButton
          className={Styles.button}
          onClick={reset}
          disabled={submitting}
        >
          <Reset />
        </FloatingActionButton>
        <FloatingActionButton
          className={Styles.button}
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Add />
        </FloatingActionButton>
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
      <div className={Styles.row}>
        <FloatingActionButton
          className={Styles.button}
          onClick={reset}
          disabled={submitting}
        >
          <Reset />
        </FloatingActionButton>
        <FloatingActionButton
          className={Styles.button}
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Done />
        </FloatingActionButton>
      </div>
    </React.Fragment>
  )
}

UpdateForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ locality, action_type, desc, budget, target, progress }) => {
  const errors = {}
  if (!locality || !locality.value) errors.locality = 'Escoge una localidad de la lista'
  if (!action_type) errors.action_type = 'Escoge el tipo de proyecto'
  if (!desc) errors.desc = 'Agrega una descripción del proyecto'
  if (budget && budget < 0) errors.budget = 'El presupuesto no puede ser negativo'
  if (target && target < 0) errors.target = 'Le meta no puede ser negativo'
  if (progress && progress < 0) errors.progress = 'El avance no puede ser negativo'
  return errors
}

const ReduxCreateForm = reduxForm({ form: 'accountNewAction', validate })(CreateForm)
const ReduxUpdateForm = reduxForm({ validate })(UpdateForm)
export { ReduxCreateForm as CreateActionForm, ReduxUpdateForm as UpdateActionForm }
