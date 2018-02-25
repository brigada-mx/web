import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Add from 'material-ui/svg-icons/content/add'
import Reset from 'material-ui/svg-icons/action/cached'

import { TextField, SelectField, Checkbox, DatePicker, AutoComplete } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const fields = (update = true) => {
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
        <TextField
          floatingLabelText="Localidad"
          name="localityId"
        />
      </div>
      <div>
        <SelectField
          floatingLabelText="Tipo de proyecto"
          name="actionType"
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
      </div>
      <div>
        <TextField
          floatingLabelText="Descripción"
          name="desc"
        />
      </div>
      <div>
        <TextField
          type="number"
          floatingLabelText="Meta"
          name="target"
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Unidad de medida de meta"
          name="unitOfMeasurement"
        />
      </div>
      <div>
        <TextField
          type="number"
          floatingLabelText="Avance contra meta"
          name="progress"
        />
      </div>
      <div>
        <TextField
          type="number"
          floatingLabelText="Presupuesto estimado (opcional)"
          name="budget"
        />
      </div>
      <div>
        <DatePicker
          floatingLabelText="Fecha de inicio"
          name="startDate"
        />
      </div>
      <div>
        <DatePicker
          floatingLabelText="Fecha final estimada"
          name="endDate"
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

const CreateForm = ({ handleSubmit, reset, submitting }) => {
  return (
    <React.Fragment>
      {fields(false)}
      <FloatingActionButton onClick={handleSubmit} disabled={submitting}>
        <Add />
      </FloatingActionButton>
      <FloatingActionButton onClick={reset} disabled={submitting}>
        <Reset />
      </FloatingActionButton>
    </React.Fragment>
  )
}

CreateForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ email, phone }) => {
  const errors = {}
  if (!email) errors.email = 'Debes ingresar el nombre'
  if (!phone) errors.phone = 'Debes ingresar la descripción'
  return errors
}

const ReduxCreateForm = reduxForm({ form: 'accountNewAction', validate })(CreateForm)
export { ReduxCreateForm as CreateActionForm }
