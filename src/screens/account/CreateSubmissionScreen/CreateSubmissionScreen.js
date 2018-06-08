import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import service, { getBackoff } from 'api/service'
import FormStyles from 'src/Form.css'
import FileUploader from './FileUploader'
import Styles from './CreateSubmissionScreen.css'


class CreateSubmissionScreen extends React.Component {
  state = {
    step: 'files',
  }

  componentDidMount() {
    this.loadAction()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.accountGetAction(actionKey) }, { key: `accountAction_${actionKey}` })
  }

  handleCreateSubmission = async (body) => {
    const { data } = await service.accountCreateSubmission(prepareSubmissionBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.props.snackbar('Agregaste estas fotos', 'success')
  }

  handleSubmitFiles = (files) => {
    console.log(files)
  }

  render() {
    const { step } = this.state
    const { action } = this.props
    if (!action) return <LoadingIndicatorCircle />
    if (step === 'files') return <FileUploader onSubmit={this.handleSubmitFiles} />
    return null
  }
}

CreateSubmissionScreen.propTypes = {
  action: PropTypes.object,
  actionKey: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
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
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateSubmissionScreen))
