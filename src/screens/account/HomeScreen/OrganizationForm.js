import React from 'react'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField } from 'components/Fields'
import Styles from 'screens/account/Form.css'


const OrganizationForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <h2>Tu Organización</h2>
      <div>
        <TextField
          name="secretKey"
          readOnly
          disabled
        />
      </div>
      <div>
        <TextField
          name="name"
          hintText="Nombre"
        />
      </div>
      <div>
        <TextField
          name="desc"
          hintText="Descripción"
        />
      </div>
      <div>
        <TextField
          type="number"
          name="yearEstablished"
          hintText="Anó establecido"
        />
      </div>
      <RaisedButton
        className={Styles.button}
        disabled={submitting}
        label="ACTUALIZAR"
        onClick={handleSubmit}
      />
    </React.Fragment>
  )
}

OrganizationForm.propTypes = {
  ...rxfPropTypes,
}

const validate = ({ name, desc, yearEstablished }) => {
  const errors = {}
  if (!name) errors.name = 'Debes ingresar el nombre'
  if (!desc) errors.desc = 'Debes ingresar la descripción'
  if (!yearEstablished || yearEstablished.toString().length !== 4) {
    errors.yearEstablished = 'Ingresa un año válido'
  }
  return errors
}

const mapStateToProps = (state) => {
  const { accountOrganization = {} } = state.getter
  return { initialValues: accountOrganization.data || {} }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'accountOrganization', validate })(OrganizationForm))
