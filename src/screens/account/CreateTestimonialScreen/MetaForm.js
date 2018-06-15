import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField, DatePicker } from 'components/Fields'
import FormStyles from 'src/Form.css'
import Styles from './CreateTestimonialScreen.css'


const MetaForm = ({ handleSubmit, submitting }) => {
  const formatDatePicker = value => value || null

  return (
    <React.Fragment>
      <div className={Styles.container}>
        <div className={Styles.largeText}>Paso 2: Completa información sobre el testimonio</div>
        <div className={Styles.description}>
          <TextField
            name="desc"
            hintText="Descripción de la ayuda que recibió la persona"
            className={FormStyles.wideInput}
          />
        </div>
        <div className={FormStyles.row}>
          <DatePicker
            floatingLabelText="Fecha cuando se grabó el vídeo"
            name="submitted"
            format={formatDatePicker}
          />
        </div>

        <div className={Styles.mediumText}>Agrega información sobre la persona beneficiada</div>
        <div className={FormStyles.row}>
          <TextField
            name="first_name"
            hintText="Nombre"
          />
          <TextField
            name="surnames"
            hintText="Apellidos"
          />
        </div>

        <TextField
          type="number"
          min="0"
          floatingLabelText="¿Cuántos años tiene?"
          name="age"
          normalize={(value) => { return value ? parseInt(value, 10) : null }}
        />
      </div>
      <div className={Styles.buttonContainer}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="SEGUIR"
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

MetaForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ desc, submitted, first_name: firstName, surnames, age }) => {
  const errors = {}
  if (!desc) errors.desc = 'Se requiere una descripción del testimonio'
  if (!submitted) errors.submitted = 'Agrega la fecha cuándo se grabó el vídeo'
  if (!firstName) errors.first_name = 'Ingresa su nombre'
  if (!surnames) errors.surnames = 'Ingresa sus apellidos'
  if (!age) errors.age = 'Agrega su edad'
  return errors
}

export default reduxForm({ form: 'submissionMetaForm', validate })(MetaForm)
