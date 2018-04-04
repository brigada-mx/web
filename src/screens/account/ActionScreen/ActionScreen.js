import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import Modal from 'components/Modal'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import { UpdateActionForm, prepareActionBody, prepareInitialActionValues } from 'screens/account/ActionForm'
import { CreateDonationForm, UpdateDonationForm,
  prepareDonationBody, prepareInitialDonationValues } from 'screens/account/DonationForm'
import DonationTable from 'screens/account/DonationTable'
import SubmissionForm from 'screens/account/SubmissionForm'
import SubmissionTable from 'screens/account/SubmissionTable'
import SubmissionTrash from 'screens/account/SubmissionTrash'
import { getProjectType } from 'src/choices'
import FormStyles from 'src/Form.css'
import Styles from './ActionScreen.css'


const initialDonationValues = { approved_by_donor: false, approved_by_org: true }

class ActionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
      submissionId: undefined,
      donationId: undefined,
      trashModal: false,
      createDonationModal: false,
    }

    this.handleLocalityChange = _.debounce(this.handleLocalityChange, 250)
  }

  componentDidMount() {
    document.title = `Proyecto ${this.props.actionKey} - Brigada`
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

  handleToggleSubmissionTrashModal = (open) => {
    this.setState({ trashModal: open })
  }

  handleToggleCreateDonationModal = (open) => {
    this.setState({ createDonationModal: open })
  }

  handleDeleteAction = async () => {
    const { data } = await service.archiveAccountAction(this.props.action.id, true)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.snackbar(`Mandaste proyecto ${this.props.action.key} al basurero`, 'success')
    this.props.history.push('/cuenta')
  }

  handleCreateDonation = async (body) => {
    const { data } = await service.createAccountDonation(prepareDonationBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetDonation()
    this.loadAction()
    this.props.snackbar('Agregaste una nueva donación', 'success')
    this.handleToggleCreateDonationModal(false)
  }

  handleToggleDonationApproved = async (id, approved) => {
    const { data } = await service.updateAccountDonation(id, { approved_by_org: approved })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${approved ? 'aprobar' : 'ocultar'} esta donación`, 'error')
      return
    }
    this.loadAction()
    const message = approved ? `Aprobaste donación ${id}` : `Ocultaste donación ${id}`
    this.props.snackbar(message, 'success')
  }

  render() {
    const { action, donations, status } = this.props
    if (status === 404) return <Redirect to="/cuenta" />
    const { submissions = [] } = action
    const {
      submissionId,
      donationId,
      localitiesSearch,
      trashModal,
      createDonationModal,
    } = this.state

    const content = (
      <div>
        {action.id &&
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>{getProjectType(action.action_type)}</div>
            <div className={FormStyles.formContainerLeft}>
              <UpdateActionForm
                onSubmit={this.handleUpdateAction}
                initialValues={action}
                onLocalityChange={this.handleLocalityChange}
                localitiesSearch={localitiesSearch}
                form={`accountUpdateAction_${this.props.actionKey}`}
                enableReinitialize
                onDelete={this.handleDeleteAction}
              />
            </div>
          </div>
        }

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Donaciones</span>
            <div>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="AGREGAR"
                onClick={() => this.handleToggleCreateDonationModal(true)}
              />
            </div>
          </div>
          {donations.length > 0 &&
            <DonationTable
              donations={donations}
              onToggleApproved={this.handleToggleDonationApproved}
            />
          }
        </div>

        {submissions.length > 0 &&
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>
              <span>Fotos</span>
              <span
                className={FormStyles.link}
                onClick={() => this.handleToggleSubmissionTrashModal(true)}
              >
                Basurero
              </span>
            </div>
            <SubmissionTable
              submissions={submissions}
              onTogglePublished={this.handleTogglePublishedSubmission}
              onRowClicked={this.handleRowClickedSubmission}
            />
          </div>
        }

        {submissionId !== undefined &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={this.handleModalClose}
            gaName={`submission/${submissionId}`}
          >
            <SubmissionForm submissionId={submissionId} />
          </Modal>
        }

        {trashModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainer}`}
            onClose={() => this.handleToggleSubmissionTrashModal(false)}
            gaName="submissionTrashModal"
          >
            <SubmissionTrash />
          </Modal>
        }

        {createDonationModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateDonationModal(false)}
            gaName="orgCreateDonationModal"
          >
            <div className={FormStyles.sectionHeader}>Agregar donación</div>
            <CreateDonationForm
              onSubmit={this.handleCreateDonation}
              initialValues={initialDonationValues}
              onLocalityChange={this.handleLocalityChange}
            />
          </Modal>
        }
      </div>
    )
    return <WithSideNav navComponents={<BackButton to="/cuenta" />}>{content}</WithSideNav>
  }
}

ActionScreen.propTypes = {
  action: PropTypes.object.isRequired,
  donations: PropTypes.object.isRequired,
  actionKey: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.number,
  resetDonation: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { actionKey } = props
  let action = {}
  let donations = []

  const reduxAction = state.getter[`accountAction_${actionKey}`]
  const status = reduxAction && reduxAction.status
  try {
    action = prepareInitialActionValues(reduxAction.data || {})
    donations = [...action.donations]
  } catch (e) {}

  return { action, donations, status }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetDonation: () => dispatch(reset('orgNewDonation')),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionScreen))
