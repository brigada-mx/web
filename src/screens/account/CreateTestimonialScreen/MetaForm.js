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
        <div className={FormStyles.row}>
          <TextField
            className={FormStyles.wideInput}
            name="recipients"
            hintText="Nombre(s) de las persona beneficiadas, separados por comas"
          />
        </div>
        <div className={FormStyles.row}>
          <DatePicker
            floatingLabelText="Fecha cuando se grabó el vídeo"
            name="submitted"
            format={formatDatePicker}
          />
        </div>
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

const validate = ({ submitted, recipients }) => {
  const errors = {}
  if (!submitted) errors.submitted = 'Agrega la fecha cuándo se grabó el vídeo'
  if (!recipients) errors.recipients = 'Agrega los nombre(s) de las personas beneficiadas, separados por comas'
  return errors
}

export default reduxForm({ form: 'submissionMetaForm', validate })(MetaForm)
