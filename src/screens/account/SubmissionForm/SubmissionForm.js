import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { projectTypeByValue } from 'src/choices'
import { roundTo } from 'tools/string'
import ConfirmButton from 'components/ConfirmButton'
import TextLegend from 'components/FeatureMap/TextLegend'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import ChooseLocationMap from 'components/FeatureMap/ChooseLocationMap'
import { TextField, Toggle, SelectField, DatePicker } from 'components/Fields'
import FormStyles from 'src/Form.css'
import Styles from './SubmissionForm.css'
import EditableImage from './EditableImage'


const UpdateForm = ({ handleSubmit, submitting, onDelete, actionSearch = [], location, onLocationClick }) => {
  const actions = actionSearch.map((a) => {
    const { id, key, action_type: type, desc } = a
    return { label: `${key} — ${projectTypeByValue[type] || '?'} — ${desc}`, value: id }
  })
  actions.unshift({ value: null, label: 'Ninguno' })

  const formatDatePicker = value => value || null

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
      <div className={FormStyles.row}>
        <DatePicker
          floatingLabelText="Fecha cuando se tomaron las fotos"
          name="submitted"
          format={formatDatePicker}
        />
        {location &&
          <React.Fragment>
            <span>{`Ubicación: ${roundTo(location.lat, 5)}, ${roundTo(location.lng, 5)}`}</span>
            <span className={Styles.locationButton} onClick={onLocationClick}>Editar</span>
          </React.Fragment>
        }
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
  onLocationClick: PropTypes.func.isRequired,
  location: PropTypes.object,
}

export const prepareInitialValues = ({ submitted, ...rest }) => {
  return {
    ...rest,
    submitted: submitted && new Date(submitted),
  }
}

export const prepareBody = (body) => {
  const { action_id: id, description } = body
  return {
    ...body,
    action: id,
    desc: description,
  }
}

const validate = () => {
  return {}
}

const ReduxUpdateForm = reduxForm({ validate })(UpdateForm)

class SubmissionFormWrapper extends React.Component {
  state = {
    editingLocation: false,
  }

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
    const body = prepareBody(values)
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

  handleLocationClick = () => {
    this.setState({ editingLocation: true })
  }

  handleLocationChange = ({ lat, lng }) => {
    this.setState({ location: { lat, lng } })
  }

  handleLocationSubmit = async () => {
    await this.handleSubmit({ location: this.state.location })
    this.setState({ editingLocation: false })
  }

  handleLocationCancel = () => {
    this.setState({ editingLocation: false })
  }

  render() {
    const { submission, actions, submissionId } = this.props
    const { location } = submission
    const { editingLocation } = this.state
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

    if (editingLocation && location) {
      return (
        <div className={FormStyles.formContainerLeft}>
          <div className={Styles.mapContainer}>
            <ChooseLocationMap
              onLocationChange={this.handleLocationChange}
              coordinates={[location.lng, location.lat]}
              legend={<TextLegend text="UBICACIÓN DE LAS FOTOS" />}
            />
          </div>
          <div className={FormStyles.row}>
            <RaisedButton
              backgroundColor="#3DC59F"
              labelColor="#ffffff"
              className={FormStyles.primaryButton}
              label="GUARDAR"
              onClick={this.handleLocationSubmit}
            />
            <FlatButton
              className={Styles.locationBackButton}
              label="CANCELAR"
              onClick={this.handleLocationCancel}
            />
          </div>
        </div>
      )
    }

    return (
      <React.Fragment>
        <div className={FormStyles.formContainerLeft}>
          <ReduxUpdateForm
            onSubmit={this.handleSubmit}
            initialValues={prepareInitialValues(submission)}
            location={submission.location}
            submissionId={submissionId}
            actionSearch={actions}
            form={`accountUpdateSubmission_${submissionId}`}
            onDelete={this.handleDelete}
            onLocationClick={this.handleLocationClick}
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
