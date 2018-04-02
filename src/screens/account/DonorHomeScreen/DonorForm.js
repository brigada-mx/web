import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import FormStyles from 'src/Form.css'


const DonorForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <div className={FormStyles.formContainerLeft}>
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="Nombre"
            name="name"
          />
          <TextField
            floatingLabelText="Sitio web"
            name="website"
          />
        </div>
        <div className={FormStyles.row}>
          <TextField
            floatingLabelText="Descripción"
            className={FormStyles.wideInput}
            name="desc"
            multiLine
            rows={3}
          />
        </div>
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
      </div>
    </React.Fragment>
  )
}

DonorForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ name, desc, website }) => {
  const errors = {}
  if (!name) errors.name = 'Agrega el nombre'
  if (!desc) errors.desc = 'Agrega la descripción de donador'
  if (!website) errors.desc = 'Agrega el sitio web de donador'
  return errors
}

const mapStateToProps = (state) => {
  try {
    return { initialValues: state.getter.donorDonor.data || {} }
  } catch (e) {
    return { initialValues: {} }
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'donorDonor', validate })(DonorForm))
