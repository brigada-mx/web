import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import FileUploader from 'components/FileUploader'
import ChooseLocationMap from 'components/FeatureMap/ChooseLocationMap'
import service, { getBackoff } from 'api/service'
import TextLegend from 'components/FeatureMap/TextLegend'
import FormStyles from 'src/Form.css'
import MetaForm from './MetaForm'
import Styles from './CreateTestimonialScreen.css'


class CreateTestimonialScreen extends React.Component {
  state = { step: 'location', values: {} }

  static getDerivedStateFromProps({ action }, { values: { location } } = {}) {
    if (action && !location) return { values: { location: { ...action.locality.location } } }
    return null
  }

  componentDidMount() {
    this.loadAction()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.accountGetAction(actionKey) }, { key: `accountAction_${actionKey}` })
  }

  handleSubmitMeta = ({ desc, submitted, first_name, surnames, age }) => {
    this.setState({
      step: 'files',
      values: { ...this.state.values, desc, submitted, recipient: { first_name, surnames, age } },
    })
  }

  handleSubmitLocation = () => {
    this.setState({ step: 'meta' })
  }

  handleLocationChange = ({ lat, lng }) => {
    this.setState({ values: { location: { lat, lng } } })
  }

  handleSubmitFiles = async (files) => {
    if (files.length === 0) return
    const { action: { id }, snackbar, closeModal } = this.props
    const { location, desc, submitted, recipient } = this.state.values

    const { data } = await service.accountCreateTestimonial(id,
      { location, desc, submitted, recipient, video: { url: files[0].url } }
    )
    if (!data) {
      snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    getBackoff(() => { return service.accountGetActionStrength(id) }, { key: `actionStrength_${id}` })
    closeModal()
    snackbar('Agregaste un testimonio', 'success')
  }

  render() {
    const { step } = this.state
    const { action } = this.props
    if (!action) return <LoadingIndicatorCircle />

    const { locality: { location: { lat, lng } } } = action

    const location = (
      <React.Fragment>
        <div className={Styles.container}>
          <div className={Styles.largeText}>Paso 1: Indica dónde se grabó el testimonio</div>
          <div className={Styles.mapContainer}>
            <ChooseLocationMap
              onLocationChange={this.handleLocationChange}
              coordinates={[lng, lat]}
              legend={<TextLegend text="UBICACIÓN DEL TESTIMONIO" />}
            />
          </div>
        </div>
        <div className={Styles.buttonContainer}>
          <RaisedButton
            backgroundColor="#3DC59F"
            labelColor="#ffffff"
            className={FormStyles.primaryButton}
            label="SEGUIR"
            onClick={this.handleSubmitLocation}
          />
        </div>
      </React.Fragment>
    )

    const meta = <MetaForm onSubmit={this.handleSubmitMeta} enableReinitialize />

    const files = (
      <FileUploader
        onSubmit={this.handleSubmitFiles}
        instructions="Paso 3: Arrastra un vídeo"
        subInstructions="120MB tamaño máximo"
        maxSizeBytes={120 * 1024 * 1024}
        maxFiles={1}
        allowedTypePrefixes={['video/']}
        allowedTypeString="video/*"
      />
    )

    if (step === 'location') return location
    if (step === 'meta') return meta
    if (step === 'files') return files
    return null
  }
}

CreateTestimonialScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTestimonialScreen)
