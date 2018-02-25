import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Add from 'material-ui/svg-icons/content/add'
import Done from 'material-ui/svg-icons/action/done'
import Reset from 'material-ui/svg-icons/action/cached'

import { TextField, SelectField, Checkbox, DatePicker, AutoComplete } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const Fields = ({ update, onLocalityChange }) => {
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
          onChange={onLocalityChange}
        />
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
        <TextField
          floatingLabelText="Unidad de medida de meta"
          name="unitOfMeasurement"
        />
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
        <DatePicker
          floatingLabelText="Fecha de inicio"
          name="startDate"
        />
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

Fields.propTypes = {
  update: PropTypes.bool.isRequired,
  onLocalityChange: PropTypes.func.isRequired,
}

const CreateForm = ({ handleSubmit, reset, submitting, onLocalityChange }) => {
  return (
    <React.Fragment>
      <Fields update={false} onLocalityChange={onLocalityChange} />
      <div className={Styles.buttonGroup}>
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
  onLocalityChange: PropTypes.func.isRequired,
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
