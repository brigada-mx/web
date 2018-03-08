import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { projectTypeByValue } from 'src/choices'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { TextField, Toggle, SelectField } from 'components/Fields'
import { thumborUrl } from 'tools/string'
import FormStyles from 'screens/account/Form.css'
import Styles from './SubmissionForm.css'


const UpdateForm = ({ handleSubmit, reset, submitting, actionSearch = [] }) => {
  const actions = actionSearch.map((a) => {
    const { id, key, action_type: type, desc } = a
    return { label: `${key} — ${projectTypeByValue[type] || '?'} — ${desc}`, value: id }
  })

  return (
    <React.Fragment>
      <div>
        <SelectField
          className={FormStyles.wideInput}
          floatingLabelText="Proyecto"
          name="action_id"
        >
          {actions.map(({ value, label }) => {
            return <MenuItem key={value} value={value} primaryText={label} />
          })}
        </SelectField>
      </div>
      <div>
        <TextField
          floatingLabelText="Descripción"
          name="description"
          multiLine
          rows={3}
        />
      </div>
      <div>
        <Toggle
          label="¿Publicado?"
          name="published"
        />
      </div>
      <div className={FormStyles.row}>
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
  return {}
}

export const prepareSubmissionBody = (body) => {
  const { action_id: id, description } = body
  return {
    ...body,
    action: id,
    desc: description,
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

    const thumbs = submission.image_urls.map((url) => {
      return (
        <a
          key={url}
          className={Styles.thumbnail}
          style={{ backgroundImage: `url(${thumborUrl(url, 480, 480, true)})` }}
          href={thumborUrl(url, 1280, 1280)}
          target="_blank"
        />
      )
    })

    return (
      <React.Fragment>
        <div className={FormStyles.formContainerLeft}>
          <ReduxUpdateForm
            onSubmit={this.handleSubmit}
            initialValues={submission}
            actionSearch={actions}
            form={`accountUpdateSubmission_${this.props.submissionId}`}
            enableReinitialize
          />
        </div>
        <div className={Styles.thumbnailContainer}>{thumbs}</div>
      </React.Fragment>
    )
  }
}

SubmissionFormWrapper.propTypes = {
  submissionId: PropTypes.number.isRequired,
  submission: PropTypes.object.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  snackbar: PropTypes.func.isRequired,
}

const mapStateToProps = (state, { submissionId }) => {
  let submission = {}
  let actions = []

  try {
    submission = { ...state.getter[`accountSubmission_${submissionId}`].data }
    if (submission.action) submission.action_id = submission.action.id
  } catch (e) {}
  try {
    actions = state.getter.accountActionsMinimal.data.results.sort((a, b) => {
      if (a.key < b.key) return 1
      if (a.key > b.key) return -1
      return 0
    })
  } catch (e) {}

  return { submission, actions }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionFormWrapper)
