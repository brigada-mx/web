import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import FileUploader from 'components/FileUploader'
import ChooseLocationMap from 'components/FeatureMap/ChooseLocationMap'
import service, { getBackoff } from 'api/service'
import TextLegend from 'components/FeatureMap/TextLegend'
import MetaForm from './MetaForm'
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

  handleSubmitMeta = ({ desc }) => {
    this.setState({ step: 'files', desc })
  }

  handleLocationChange = ({ lat, lng }) => {
    this.setState({ location: { lat, lng } })
  }

  handleSubmitFiles = async (files) => {
    const { action, snackbar, closeModal } = this.props
    const { location: { lat, lng }, desc } = this.state
    const images = files.map((f) => { return { url: f.url } })

    const { data } = await service.accountCreateSubmission(action.id,
      { desc, location: `${lat},${lng}`, images }
    )
    if (!data) {
      snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    closeModal()
    snackbar('Agregaste estas fotos', 'success')
  }

  render() {
    const { step } = this.state
    const { action } = this.props
    if (!action) return <LoadingIndicatorCircle />

    const { locality: { location: { lat, lng } } } = action

    const meta = (
      <div className={Styles.metaContainer}>
        <div className={Styles.mapContainer}>
          <ChooseLocationMap
            onLocationChange={this.handleLocationChange}
            coordinates={[lng, lat]}
            legend={<TextLegend text="DALE CLIC PARA ESCOGER LA UBICACIÓN DE LAS FOTOS" />}
          />
        </div>
        <MetaForm onSubmit={this.handleSubmitMeta} enableReinitialize />
      </div>
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
