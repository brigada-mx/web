import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'
import AutoCompleteMui from 'material-ui/AutoComplete'

import service, { getBackoff } from 'api/service'
import { TextField, SelectField, AutoComplete } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'
import Styles from './CreateAccountForm.css'


class DonorCreateAccountForm extends React.Component {
  componentDidMount() {
    getBackoff(service.getDonorsMini, { key: 'miniDonors' })
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      this.props.handleSubmit()
    }
  }

  render() {
    const { handleSubmit, submitting, donors } = this.props
    const dataSource = donors.map((d) => {
      const { id, name } = d
      return { text: name, value: id }
    })
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
      <form
        className={FormStyles.formContainer}
        onKeyDown={this.handleKeyDown}
      >
        <span className={FormStyles.formLogo} />
        <span className={Styles.formHeader}>Registro para donador</span>

        <div>
          <AutoComplete
            className={FormStyles.wideInput}
            floatingLabelText="¿Cómo se llama tu organización?"
            name="donor"
            dataSource={dataSource}
            fullWidth
            filter={AutoCompleteMui.fuzzyFilter}
            format={formatAutoComplete}
            normalize={normalizeAutoComplete}
          />
        </div>
        <div className={Styles.dropdown}>
          <SelectField floatingLabelText="¿A qué sector pertenece?" className={FormStyles.wideInput} name="sector">
            <MenuItem value="civil" primaryText="Civil" />
            <MenuItem value="public" primaryText="Público" />
            <MenuItem value="private" primaryText="Privado" />
            <MenuItem value="religious" primaryText="Religioso" />
          </SelectField>
        </div>

        <div>
          <TextField
            className={FormStyles.wideInput}
            name="email"
            hintText="Email"
            autoCapitalize="off"
          />
        </div>
        <div>
          <TextField
            className={FormStyles.wideInput}
            name="first_name"
            hintText="Nombre"
          />
        </div>
        <div>
          <TextField
            className={FormStyles.wideInput}
            name="surnames"
            hintText="Apellido"
          />
        </div>

        <div className={FormStyles.buttonContainer}>
          <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="REGISTRAR" onClick={handleSubmit} />
        </div>
      </form>
    )
  }
}

DonorCreateAccountForm.propTypes = {
  ...rxfPropTypes,
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export const prepareDonorBody = (body) => {
  const { donor, ...rest } = body
  const prepared = {
    ...rest,
    donor_name: donor.text,
  }
  if (donor.value) prepared.donor_id = donor.value
  return prepared
}

const mapStateToProps = (state) => {
  try {
    return { donors: state.getter.miniDonors.data.results.filter(d => !d.has_user) }
  } catch (e) {
    return { donors: [] }
  }
}

const validate = ({ first_name: firstName, surnames, email, donor, sector }) => {
  const errors = {}
  if (!firstName) errors.first_name = 'Ingresa tu nombre'
  if (!surnames) errors.surnames = 'Ingresa apellidos'
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!donor || !donor.text) errors.donor = 'Ingresa el nombre de tu grupo'
  if (!sector) errors.sector = 'Selecciona un sector'
  return errors
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'donorCreateAccount', validate })(DonorCreateAccountForm))
