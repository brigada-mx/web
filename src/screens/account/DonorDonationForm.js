import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import { TextField, Toggle, DatePicker, AutoComplete, Checkbox } from 'components/Fields'
import { getProjectType } from 'src/choices'
import { tokenMatch } from 'tools/string'
import service, { getBackoff } from 'api/service'
import ConfirmButton from 'components/ConfirmButton'
import FormStyles from 'src/Form.css'


class Fields extends React.Component {
  componentDidMount() {
    getBackoff(service.getActionsMini, { key: 'miniActions' })
  }

  filter = (searchText, key) => {
    if (!searchText || searchText.length < 5) return false
    return tokenMatch(key, searchText)
  }

  render() {
    const { actions } = this.props
    const dataSource = actions.map((a) => {
      const {
        id,
        key,
        action_type: type,
        locality: { municipality_name: muniName, name },
        organization: { name: orgName },
      } = a
      const friendlyType = getProjectType(type)
      return { text: `${key}, ${orgName}, ${friendlyType} - ${name}, ${muniName}`, value: id }
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
            floatingLabelText="Proyecto (escribe al menos 5 caracteres para ver opciones)"
            name="action"
            fullWidth
            dataSource={dataSource}
            filter={this.filter}
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
          <div className={FormStyles.toggle}>
            <Toggle
              label="¿Aprobada por tí?"
              name="approved_by_donor"
            />
          </div>
          <div className={FormStyles.toggle}>
            <Checkbox
              label="¿Aprobada por reconstructor?"
              name="approved_by_org"
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
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const mapStateToProps = (state) => {
  try {
    return { actions: state.getter.miniActions.data.results }
  } catch (e) {
    return { actions: [] }
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

const validate = ({ action, amount }) => {
  const errors = {}
  if (!action || !action.value) errors.action = 'Escoge un proyecto de la lista'
  if (amount < 0) errors.amount = 'Agrega un monto positivo'
  return errors
}

export const prepareDonationBody = (body) => {
  const { action, received_date: date } = body
  const prepared = {
    ...body,
    action: action.value,
    received_date: date ? moment(date).format('YYYY-MM-DD') : null,
  }
  return prepared
}

export const prepareInitialDonationValues = (values) => {
  const {
    received_date: date,
    action: {
      id,
      key,
      action_type: type,
      locality: { municipality_name: muniName, name },
      organization: { name: orgName },
    },
  } = values
  const friendlyType = getProjectType(type)
  return {
    ...values,
    received_date: date && moment(date).toDate(),
    action: { text: `${key}, ${orgName}, ${friendlyType} - ${name}, ${muniName}`, value: id }
  }
}

const ReduxCreateForm = reduxForm({ form: 'donorNewDonation', validate })(CreateForm)
const ReduxUpdateForm = reduxForm({ validate })(UpdateForm) // pass `form` arg when instantiating form
export { ReduxCreateForm as CreateDonationForm, ReduxUpdateForm as UpdateDonationForm }
