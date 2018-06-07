import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import service, { getBackoff } from 'api/service'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import FormStyles from 'src/Form.css'
import Styles from './CreateSubmissionScreen.css'


class CreateSubmissionScreen extends React.Component {
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

  render() {
    const { action } = this.props
    if (!action) return <LoadingIndicatorCircle />
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
