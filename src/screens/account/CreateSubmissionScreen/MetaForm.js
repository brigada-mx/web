import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import FormStyles from 'src/Form.css'
import Styles from './CreateSubmissionScreen.css'


const MetaForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div className={Styles.description}>
        <TextField name="desc" hintText="Descripción de las fotos" className={FormStyles.wideInput} />
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

const validate = ({ desc }) => {
  const errors = {}
  if (!desc) errors.desc = 'Se requiere una descripción de estas fotos'
  return errors
}

export default reduxForm({ form: 'submissionMetaForm', validate })(MetaForm)
