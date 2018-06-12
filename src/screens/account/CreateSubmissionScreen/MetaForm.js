import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField, DatePicker } from 'components/Fields'
import FormStyles from 'src/Form.css'
import Styles from './CreateSubmissionScreen.css'


const MetaForm = ({ handleSubmit, submitting }) => {
  const formatDatePicker = value => value || null

  return (
    <React.Fragment>
      <div className={Styles.description}>
        <TextField name="desc" hintText="Descripción de las fotos" className={FormStyles.wideInput} />
      </div>
      <div className={FormStyles.row}>
        <DatePicker
          floatingLabelText="Fecha cuando se tomaron las fotos"
          name="submitted"
          format={formatDatePicker}
        />
      </div>
      <div className={FormStyles.row}>
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

const validate = ({ desc, submitted }) => {
  const errors = {}
  if (!desc) errors.desc = 'Se requiere una descripción de estas fotos'
  if (!submitted) errors.submitted = 'Agrega la fecha cuando se tomaron las fotos'
  return errors
}

export default reduxForm({ form: 'submissionMetaForm', validate })(MetaForm)
