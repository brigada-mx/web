import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, FieldArray, propTypes as rxfPropTypes } from 'redux-form'
import AutoCompleteMui from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField, DatePicker, AutoComplete } from 'components/Fields'
import FormStyles from 'screens/account/Form.css'


const Donations = ({ fields, donorsSearch }) => { // eslint-disable-line react/prop-types
  const donors = donorsSearch.map((d) => {
    const { id, name, desc } = d
    const text = [name]
    if (desc) text.push(desc)
    return { text: text.join(' - '), value: id }
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
      <RaisedButton
        className={FormStyles.button}
        label="AGREGAR DONACIÓN"
        onClick={() => fields.unshift({})}
      />
      {fields.map((donation, i) => (
        <div key={i}>
          <div>
            <AutoComplete
              className={FormStyles.wideInput}
              floatingLabelText="Donador"
              name={`${donation}.donor`}
              dataSource={donors}
              filter={AutoCompleteMui.fuzzyFilter}
              format={formatAutoComplete}
              normalize={normalizeAutoComplete}
            />
          </div>
          <div className={FormStyles.row}>
            <TextField
              type="number"
              min="0"
              floatingLabelText="Monto MXN"
              name={`${donation}.amount`}
              normalize={(value) => { return value ? parseInt(value, 10) : null }}
            />
            <DatePicker
              floatingLabelText="Fecha recibida"
              name={`${donation}.received_date`}
              format={formatDatePicker}
            />
            <RaisedButton
              className={FormStyles.button}
              label="QUITAR DONACIÓN"
              onClick={() => fields.remove(i)}
            />
          </div>
          <TextField
            className={FormStyles.hidden}
            type="hidden"
            name="id"
          />
        </div>
      ))}
    </React.Fragment>
  )
}

const DonationsForm = ({ handleSubmit, reset, submitting, donorsSearch }) => {
  return (
    <React.Fragment>
      <FieldArray name="donations" component={Donations} donorsSearch={donorsSearch} />
      <div className={FormStyles.row}>
        <RaisedButton
          className={FormStyles.button}
          disabled={submitting}
          label="GUARDAR CAMBIOS"
          onClick={handleSubmit}
        />
        <RaisedButton
          className={FormStyles.button}
          disabled={submitting}
          label="DESHACER CAMBIOS"
          onClick={reset}
        />
      </div>
    </React.Fragment>
  )
}

DonationsForm.propTypes = {
  ...rxfPropTypes,
  donorsSearch: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const validate = ({ donations }) => {
  if (!donations || !donations.length) return {}

  const allErrors = {}
  const donationErrors = []
  donations.forEach(({ id, amount, donor }, i) => {
    const errors = {}
    if (amount && amount < 0) errors.amount = 'El monto no puede ser negativo'

    if (id) {
      if (!donor || !donor.value) errors.donor = 'Escoge un donante de la lista'
    } else if (!donor || (!donor.value && !donor.text)) {
      errors.donor = 'Escoge un donante de la lista, o ingresa un nuevo donante'
    }

    if (errors.donor || errors.amount) donationErrors[i] = errors
  })
  if (donationErrors.length) allErrors.donations = donationErrors
  return allErrors
}

export const prepareDonationBody = (body) => {
  const { donor, received_date: date } = body
  const prepared = {
    ...body,
    donor: donor.value,
    donor_name: donor.text,
    received_date: date ? moment(date).format('YYYY-MM-DD') : null,
  }
  if (donor.value) prepared.donor_id = donor.value
  return prepared
}

export const prepareInitialDonationValues = (values) => {
  const {
    received_date: date,
    donor: { id, name },
  } = values
  return {
    ...values,
    received_date: date && moment(date).toDate(),
    donor: { text: name, value: id },
  }
}

export default reduxForm({ validate })(DonationsForm) // pass `form` arg when instantiating form
