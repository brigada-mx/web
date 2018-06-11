import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { projectTypeByValue } from 'src/choices'
import ConfirmButton from 'components/ConfirmButton'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { TextField, Toggle, SelectField } from 'components/Fields'
import FormStyles from 'src/Form.css'
import Styles from './SubmissionForm.css'
import EditableImage from './EditableImage'


const UpdateForm = ({ handleSubmit, submitting, onDelete, actionSearch = [] }) => {
  const actions = actionSearch.map((a) => {
    const { id, key, action_type: type, desc } = a
    return { label: `${key} — ${projectTypeByValue[type] || '?'} — ${desc}`, value: id }
  })
  actions.unshift({ value: null, label: 'Ninguno' })

  return (
    <React.Fragment>
      <div className={FormStyles.row}>
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
      <div className={FormStyles.row}>
        <TextField
          className={FormStyles.wideInput}
          floatingLabelText="Descripción"
          name="description"
          multiLine
          rows={3}
        />
      </div>
      <div className={FormStyles.toggle}>
        <Toggle
          label="¿Publicado?"
          name="published"
        />
      </div>
      <div className={FormStyles.row}>
        <RaisedButton
          className={FormStyles.button}
          disabled={submitting}
          label="GUARDAR"
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
      getBackoff(() => { return service.accountGetAction(key) }, { key: `accountAction_${key}` })
    } catch (e) {
      getBackoff(service.accountGetSubmissions, { key: 'accountSubmissions' })
    }
  }

  loadActionsForSearch = () => {
    getBackoff(service.accountGetActionsMinimal, { key: 'accountActionsMinimal' })
  }

  loadSubmission = () => {
    const { submissionId } = this.props
    getBackoff(
      () => { return service.accountGetSubmission(submissionId) },
      { key: `accountSubmission_${submissionId}` }
    )
  }

  handleSubmit = async (values) => {
    const body = prepareSubmissionBody(values)
    const { data } = await service.accountUpdateSubmission(this.props.submissionId, body)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadSubmission()
    this.loadSubmissionsForAction()
    this.props.snackbar('Actualizaste estas fotos', 'success')
  }

  handleDelete = async () => {
    const { data } = await service.accountArchiveSubmission(this.props.submissionId, true)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadSubmissionsForAction()
    this.props.snackbar('Mandaste estas fotos al basurero', 'success')
  }

  handleUpdatePhoto = () => {
    this.loadSubmission()
    this.loadSubmissionsForAction()
  }

  render() {
    const { submission, actions, submissionId } = this.props
    if (!submission.id) return <LoadingIndicatorCircle className={Styles.loader} />

    const thumbs = submission.images.map((image) => {
      return (
        <EditableImage
          onUpdate={this.handleUpdatePhoto}
          key={image.url}
          image={image}
          submissionId={submissionId}
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
            form={`accountUpdateSubmission_${submissionId}`}
            onDelete={this.handleDelete}
            enableReinitialize
          />
        </div>
        <div className={Styles.thumbnailsContainer}>{thumbs}</div>
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
