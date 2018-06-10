import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import FileUploader from 'components/FileUploader'
import ChooseLocationMap from 'components/FeatureMap/ChooseLocationMap'
import service, { getBackoff } from 'api/service'
import FormStyles from 'src/Form.css'
import Styles from './CreateSubmissionScreen.css'


class CreateSubmissionScreen extends React.Component {
  state = { step: 'meta' }

  static getDerivedStateFromProps({ action }, { location } = {}) {
    if (action && !location) return { location: { ...action.locality.location } }
    return null
  }

  componentDidMount() {
    this.loadAction()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.accountGetAction(actionKey) }, { key: `accountAction_${actionKey}` })
  }

  handleCreateSubmission = async (body) => {
    const { snackbar, closeModal } = this.props
    const { data } = await service.accountCreateSubmission(body)
    if (!data) {
      snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    closeModal()
    snackbar('Agregaste estas fotos', 'success')
  }

  handleSubmitMeta = () => {
    this.setState({ step: 'files' })
  }

  handleLocationChange = ({ lat, lng }) => {
    this.setState({ location: { lat, lng } })
  }

  handleSubmitFiles = (files) => {
    console.log(files)
  }

  render() {
    const { step } = this.state
    const { action } = this.props
    if (!action) return <LoadingIndicatorCircle />

    const { locality: { location: { lat, lng } } } = action

    const meta = (
      <React.Fragment>
        <ChooseLocationMap onLocationChange={this.handleLocationChange} coordinates={[lng, lat]} />
        <div className={Styles.buttonContainer}>
          <RaisedButton
            backgroundColor="#3DC59F"
            labelColor="#ffffff"
            className={FormStyles.primaryButton}
            label="SEGUIR"
            onClick={this.handleSubmitMeta}
            disabled={false}
          />
        </div>
      </React.Fragment>
    )
    if (step === 'meta') return meta
    if (step === 'files') return <FileUploader onSubmit={this.handleSubmitFiles} />
    return null
  }
}

CreateSubmissionScreen.propTypes = {
  action: PropTypes.object,
  actionKey: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { actionKey } = props
  try {
    return { action: state.getter[`accountAction_${actionKey}`].data }
  } catch (e) {
    return {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubmissionScreen)
