import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import AutoCompleteMui from 'material-ui/AutoComplete'

import { TextField, Toggle, DatePicker, AutoComplete, Checkbox } from 'components/Fields'
import { tokenMatch } from 'tools/string'
import service, { getBackoff } from 'api/service'
import ConfirmButton from 'components/ConfirmButton'
import FormStyles from 'src/Form.css'


class Fields extends React.Component {
  componentDidMount() {
    getBackoff(service.getDonorsMini, { key: 'miniDonors' })
  }

  filter = (searchText, key) => {
    if (!searchText || searchText.length < 5) return false
    return tokenMatch(key, searchText)
  }

  render() {
    const { donors } = this.props
    const dataSource = donors.map((d) => {
      const { id, name } = d
      return { text: name, value: id }
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
        <div className={FormStyles.row}>
          <AutoComplete
            className={FormStyles.wideInput}
            floatingLabelText="Donador"
            name="donor"
            dataSource={dataSource}
            fullWidth
            filter={AutoCompleteMui.fuzzyFilter}
            format={formatAutoComplete}
            normalize={normalizeAutoComplete}
          />
        </div>
        <div className={FormStyles.row}>
          <TextField
            type="number"
            min="0"
            floatingLabelText="Monto donado MXN"
            name="amount"
            normalize={(value) => { return value ? parseInt(value, 10) : null }}
          />
          <DatePicker
            floatingLabelText="Fecha cuando se recibió donación"
            name="received_date"
            format={formatDatePicker}
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
          <div className={FormStyles.toggle}>
            <Toggle
              label="¿Aprobada por tí?"
              name="approved_by_org"
            />
          </div>
          <div className={FormStyles.toggle}>
            <Checkbox
              label="¿Aprobada por donador?"
              name="approved_by_donor"
              labelPosition="left"
              disabled
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

Fields.propTypes = {
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const mapStateToProps = (state) => {
  try {
    return { donors: state.getter.miniDonors.data.results }
  } catch (e) {
    return { donors: [] }
  }
}

const ReduxFields = connect(mapStateToProps, null)(Fields)

const CreateForm = ({ handleSubmit, submitting }) => {
  return (
    <React.Fragment>
      <ReduxFields />
      <div className={FormStyles.row}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="AGREGAR"
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

CreateForm.propTypes = {
  ...rxfPropTypes,
}

const UpdateForm = ({ handleSubmit, submitting, onDelete }) => {
  return (
    <React.Fragment>
      <ReduxFields />
      <div className={FormStyles.row}>
        <RaisedButton
          backgroundColor="#3DC59F"
          labelColor="#ffffff"
          className={FormStyles.primaryButton}
          disabled={submitting}
          label="ACTUALIZAR"
          onClick={handleSubmit}
        />
        <ConfirmButton
          className={FormStyles.button}
          disabled={submitting}
          text="Borrar"
          onConfirm={onDelete}
        />
      </div>
    </React.Fragment>
  )
}

UpdateForm.propTypes = {
  ...rxfPropTypes,
  onDelete: PropTypes.func.isRequired,
}

const validate = ({ id, amount, donor }) => {
  const errors = {}
  if (id) {
    if (!donor || !donor.value) errors.donor = 'Escoge un donador de la lista'
  } else if (!donor || (!donor.value && !donor.text)) {
    errors.donor = 'Escoge un donador de la lista, o ingresa un nuevo donador'
  }
  if (amount < 0) errors.amount = 'Agrega un monto positivo'
  return errors
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

const ReduxCreateForm = reduxForm({ form: 'orgNewDonation', validate })(CreateForm)
const ReduxUpdateForm = reduxForm({ validate })(UpdateForm) // pass `form` arg when instantiating form
export { ReduxCreateForm as CreateDonationForm, ReduxUpdateForm as UpdateDonationForm }
