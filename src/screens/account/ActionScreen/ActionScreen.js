import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import Modal from 'components/Modal'
import { UpdateActionForm, prepareActionBody, prepareInitialValues } from 'screens/account/ActionForm'
import SubmissionTable from 'screens/account/SubmissionTable'
import FormStyles from 'screens/account/Form.css'
import Styles from './ActionScreen.css'


class ActionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
      submissionId: undefined,
    }

    this.handleLocalityChange = _.debounce(
      this.handleLocalityChange, 250
    )
  }

  componentDidMount() {
    this.loadAction()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.getAccountAction(actionKey) }, { key: `accountAction_${actionKey}` })
  }

  handleUpdateAction = async (body) => {
    const { id } = this.props.action
    if (!id) return

    const { data } = await service.updateAccountAction(id, prepareActionBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.props.snackbar('Actualizaste tu proyecto', 'success')
  }

  handleLocalityChange = async (e, v) => {
    if (v.value) {
      this.setState({ localitiesSearch: [] })
      return
    }
    const { data } = await service.getLocalitiesSearch(cleanAccentedChars(v.text), 10)
    if (!data) return
    this.setState({ localitiesSearch: data.results })
  }

  handleTogglePublishedSubmission = async (id, published) => {
    const { data } = await service.updateAccountSubmission(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} estas fotos`, 'error')
      return
    }
    this.loadAction()
    const message = published ? 'Publicaste estas fotos' : 'Ocultaste estas fotos'
    this.props.snackbar(message, 'success')
  }

  handleRowClickedSubmission = (id) => {
    this.setState({ submissionId: id })
  }

  handleModalClose = async () => {
    this.setState({ submissionId: undefined })
  }

  render() {
    const { action } = this.props
    const { submissions = [] } = action
    return (
      <div>
        <div className={FormStyles.sectionHeader}>Actualizar proyecto</div>
        {action.id &&
          <div className={FormStyles.formContainerLeft}>
            <UpdateActionForm
              onSubmit={this.handleUpdateAction}
              initialValues={action}
              onLocalityChange={this.handleLocalityChange}
              localitiesSearch={this.state.localitiesSearch}
              form={`accountUpdateAction_${this.props.actionKey}`}
              enableReinitialize
            />
          </div>
        }

        {submissions.length > 0 &&
          <React.Fragment>
            <div className={FormStyles.sectionHeader}>Fotos</div>
            <SubmissionTable
              submissions={submissions}
              onTogglePublished={this.handleTogglePublishedSubmission}
              onRowClicked={this.handleRowClickedSubmission}
            />
          </React.Fragment>
        }

        {this.state.submissionId !== undefined &&
          <Modal className={Styles.modal} onClose={this.handleModalClose}><span>101010</span></Modal>
        }
      </div>
    )
  }
}

ActionScreen.propTypes = {
  action: PropTypes.object.isRequired,
  actionKey: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { actionKey } = props
  try {
    return {
      action: prepareInitialValues(state.getter[`accountAction_${actionKey}`].data || {}),
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

export default connect(mapStateToProps, mapDispatchToProps)(ActionScreen)
