import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import AutoCompleteMui from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { projectTypeByValue } from 'src/choices'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { TextField, Checkbox, AutoComplete } from 'components/Fields'
import FormStyles from 'screens/account/Form.css'


const UpdateForm = ({ handleSubmit, reset, submitting, actionSearch = [] }) => {
  const actions = actionSearch.map((a) => {
    const { id, key, action_type: type, desc } = a
    return { text: `${key} — ${projectTypeByValue[type] || '?'} — ${desc}`, value: id }
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
    <React.Fragment>
      <div>
        <AutoComplete
          className={FormStyles.wideInput}
          floatingLabelText="Proyecto"
          name="action"
          dataSource={actions}
          filter={AutoCompleteMui.fuzzyFilter}
          format={formatAutoComplete}
          normalize={normalizeAutoComplete}
        />
      </div>
      <div>
        <TextField
          floatingLabelText="Descripción"
          name="description"
          multiLine
          rows={3}
        />
        <TextField
          floatingLabelText="Dirección"
          name="address"
          multiLine
          rows={3}
        />
      </div>
      <div>
        <Checkbox
          label="¿Publicado?"
          name="published"
        />
      </div>
      <div className={FormStyles.row}>
        <RaisedButton
          className={FormStyles.button}
          disabled={submitting}
          label="CANCELAR"
          onClick={reset}
        />
        <RaisedButton
          className={FormStyles.button}
          disabled={submitting}
          label="ACTUALIZAR"
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}

UpdateForm.propTypes = {
  ...rxfPropTypes,
  actionSearch: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const validate = ({ action }) => {
  const errors = {}
  if (!action || !action.value) errors.action = 'Escoge un proyecto de la lista'
  return errors
}

export const prepareSubmissionBody = (body) => {
  const { action, description, address } = body
  return {
    ...body,
    action: action.value,
    desc: description,
    addr: address,
  }
}

const ReduxUpdateForm = reduxForm({ validate })(UpdateForm) // pass `form` arg when instantiating form

class SubmissionFormWrapper extends React.Component {
  componentDidMount() {
    this.loadActionsForSearch()
    this.loadSubmission()
  }

  loadSubmissionsForAction = () => {
    try {
      const { key } = this.props.submission.action
      getBackoff(() => { return service.getAccountAction(key) }, { key: `accountAction_${key}` })
    } catch (e) {
      getBackoff(service.getAccountSubmissions, { key: 'accountSubmissions' })
    }
  }

  loadActionsForSearch = () => {
    getBackoff(service.getAccountActionsMinimal, { key: 'accountActionsMinimal' })
  }

  loadSubmission = () => {
    const { submissionId } = this.props
    getBackoff(
      () => { return service.getAccountSubmission(submissionId) },
      { key: `accountSubmission_${submissionId}` }
    )
  }

  handleSubmit = async (values) => {
    const body = prepareSubmissionBody(values)
    const { data } = await service.updateAccountSubmission(this.props.submissionId, body)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadSubmission()
    this.loadSubmissionsForAction()
    this.props.snackbar('Actualizaste estas fotos', 'success')
  }

  render() {
    const { submission, actions } = this.props
    if (!submission.id) return <LoadingIndicatorCircle className={FormStyles.loader} />

    return (
      <div className={FormStyles.formContainerLeft}>
        <ReduxUpdateForm
          onSubmit={this.handleSubmit}
          initialValues={submission}
          actionSearch={actions}
          form={`accountUpdateSubmission_${this.props.submissionId}`}
          enableReinitialize
        />
      </div>
    )
  }
}

SubmissionFormWrapper.propTypes = {
  submissionId: PropTypes.number.isRequired,
  submission: PropTypes.object.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  snackbar: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { submissionId } = props
  try {
    return {
      action: state.getter[`accountSubmission_${submissionId}`].data || {},
    }
  } catch (e) {
    return { action: {} }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionFormWrapper)
