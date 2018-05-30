import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import { Link, withRouter, Redirect } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import Modal from 'components/Modal'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import ActionStrength from 'components/Strength/ActionStrength'
import { UpdateActionForm, prepareActionBody, prepareInitialActionValues } from 'screens/account/ActionForm'
import { CreateDonationForm, UpdateDonationForm,
  prepareDonationBody, prepareInitialDonationValues } from 'screens/account/DonationForm'
import { CreateOpportunityForm, UpdateOpportunityForm,
  prepareOpportunityBody, prepareInitialOpportunityValues } from 'screens/account/OpportunityForm'
import DonationTable from 'screens/account/DonationTable'
import OpportunityTable from 'screens/account/OpportunityTable'
import ApplicationTable from 'screens/account/ApplicationTable'
import SubmissionForm from 'screens/account/SubmissionForm'
import SubmissionTable from 'screens/account/SubmissionTable'
import SubmissionTrash from 'screens/account/SubmissionTrash'
import { getProjectType } from 'src/choices'
import FormStyles from 'src/Form.css'
import Styles from './ActionScreen.css'


const initialDonationValues = { approved_by_donor: false, approved_by_org: true }
const initialOpportunityValues = { location: 'anywhere', published: true }

class ActionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
      submissionId: undefined,
      donationId: undefined,
      opportunityId: undefined,
      trashModal: false,
      createDonationModal: false,
      createOpportunityModal: false,
    }

    this.handleLocalityChange = _.debounce(this.handleLocalityChange, 250)
  }

  componentDidMount() {
    document.title = `Proyecto ${this.props.actionKey} - Brigada`
    this.loadAction()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.accountGetAction(actionKey) }, { key: `accountAction_${actionKey}` })

    const { id } = this.props.action
    if (id !== undefined) {
      getBackoff(() => { return service.accountGetActionStrength(id) }, { key: `actionStrength_${id}` })
    }
  }

  handleUpdateAction = async (body) => {
    const { id } = this.props.action
    if (!id) return

    const { data } = await service.accountUpdateAction(id, prepareActionBody(body))
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
    const { data } = await service.accountUpdateSubmission(id, { published })
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

  handleDonationRowClicked = (donationId) => {
    this.setState({ donationId })
  }

  handleUpdateDonationModalClose = () => {
    this.setState({ donationId: undefined })
  }

  handleToggleCreateOpportunityModal = (open) => {
    this.setState({ createOpportunityModal: open })
  }

  handleOpportunityRowClicked = (opportunityId) => {
    this.setState({ opportunityId })
  }

  handleUpdateOpportunityModalClose = () => {
    this.setState({ opportunityId: undefined })
  }

  handleDeleteAction = async () => {
    const { data } = await service.accountArchiveAction(this.props.action.id, true)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.snackbar(`Mandaste proyecto ${this.props.action.key} al basurero`, 'success')
    this.props.history.push('/cuenta')
  }

  handleCreateDonation = async (body) => {
    const { data } = await service.accountCreateDonation(prepareDonationBody(
      { ...body, action: this.props.action.id })
    )
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetDonation()
    this.loadAction()
    this.handleToggleCreateDonationModal(false)
    this.props.snackbar('Agregaste un nuevo donativo', 'success')
  }

  handleUpdateDonation = async (id, body) => {
    const { data } = await service.accountUpdateDonation(id, prepareDonationBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.props.snackbar(`Modificaste donativo ${id}`, 'success')
  }

  handleDeleteDonation = async (id) => {
    const { snackbar } = this.props
    const { data } = await service.accountDeleteDonation(id, true)
    if (!data) {
      snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.handleUpdateDonationModalClose()
    snackbar(`Borraste donativo ${id}`, 'success')
  }

  handleToggleDonationApproved = async (id, approved) => {
    const { data } = await service.accountUpdateDonation(id, { approved_by_org: approved })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${approved ? 'aprobar' : 'ocultar'} este donativo`, 'error')
      return
    }
    this.loadAction()
    const message = approved ? `Aprobaste donativo ${id}` : `Ocultaste donativo ${id}`
    this.props.snackbar(message, 'success')
  }

  handleCreateOpportunity = async (body) => {
    const { data } = await service.accountCreateOpportunity(prepareOpportunityBody(
      { ...body, action: this.props.action.id })
    )
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetOpportunity()
    this.loadAction()
    this.handleToggleCreateOpportunityModal(false)
    this.props.snackbar('Agregaste una nueva oportunidad de voluntariado', 'success')
  }

  handleUpdateOpportunity = async (id, body) => {
    const { data } = await service.accountUpdateOpportunity(id, prepareOpportunityBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.props.snackbar(`Modificaste oportunidad de voluntariado ${id}`, 'success')
  }

  handleToggleOpportunityPublished = async (id, published) => {
    const { data } = await service.accountUpdateOpportunity(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} esta oportunidad`, 'error')
      return
    }
    this.loadAction()
    const message = published ? `Publicaste oportunidad ${id}` : `Ocultaste oportunidad ${id}`
    this.props.snackbar(message, 'success')
  }

  render() {
    const { action, donations, opportunities, submissions, status } = this.props
    if (status === 404) return <Redirect to="/cuenta" />
    const {
      submissionId,
      donationId,
      opportunityId,
      localitiesSearch,
      trashModal,
      createDonationModal,
      createOpportunityModal,
    } = this.state
    const donation = _.find(donations, d => d.id === donationId)
    const opportunity = _.find(opportunities, o => o.id === opportunityId)

    const content = (
      <div>
        {action.id !== undefined &&
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>{getProjectType(action.action_type)}</div>
            <Link className={Styles.link} to={`/proyectos/${action.id}`}>Ver proyecto</Link>
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
            <span>Donativos</span>
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
              onRowClicked={this.handleDonationRowClicked}
            />
          }
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Oportunidades de voluntariado</span>
            <div>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="AGREGAR"
                onClick={() => this.handleToggleCreateOpportunityModal(true)}
              />
            </div>
          </div>
          {opportunities.length > 0 &&
            <OpportunityTable
              opportunities={opportunities}
              onTogglePublished={this.handleToggleOpportunityPublished}
              onRowClicked={this.handleOpportunityRowClicked}
            />
          }
        </div>

        {opportunities.length > 0 && action.id !== undefined &&
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>
              <span>Candidatos de voluntariado</span>
            </div>
            <ApplicationTable actionId={action.id} />
          </div>
        }

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
            <div className={FormStyles.sectionHeader}>Agregar donativo</div>
            <CreateDonationForm
              onSubmit={this.handleCreateDonation}
              initialValues={initialDonationValues}
            />
          </Modal>
        }

        {createOpportunityModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateOpportunityModal(false)}
            gaName="orgCreateOpportunityModal"
          >
            <div className={FormStyles.sectionHeader}>Agregar oportunidad de voluntariado</div>
            <CreateOpportunityForm
              onSubmit={this.handleCreateOpportunity}
              initialValues={initialOpportunityValues}
            />
          </Modal>
        }

        {donation &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={this.handleUpdateDonationModalClose}
            gaName={`orgDonation/${donationId}`}
          >
            <UpdateDonationForm
              onSubmit={body => this.handleUpdateDonation(donationId, body)}
              initialValues={prepareInitialDonationValues(donation)}
              form={`accountUpdateDonation_${donationId}`}
              enableReinitialize
              onDelete={() => this.handleDeleteDonation(donationId)}
              id={donationId}
            />
          </Modal>
        }

        {opportunity &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={this.handleUpdateOpportunityModalClose}
            gaName={`orgOpportunity/${opportunityId}`}
          >
            <UpdateOpportunityForm
              onSubmit={body => this.handleUpdateOpportunity(opportunityId, body)}
              initialValues={prepareInitialOpportunityValues(opportunity)}
              form={`accountUpdateOpportunity_${opportunityId}`}
              enableReinitialize
              id={opportunityId}
            />
          </Modal>
        }
      </div>
    )

    return (
      <WithSideNav
        navComponents={
          <React.Fragment>
            <BackButton to="/cuenta" />
            {action.id !== undefined &&
              <div style={{ marginTop: 15 }}>
                <ActionStrength actionId={action.id} />
              </div>
            }
          </React.Fragment>
        }
      >{content}
      </WithSideNav>
    )
  }
}

ActionScreen.propTypes = {
  action: PropTypes.object.isRequired,
  donations: PropTypes.arrayOf(PropTypes.object).isRequired,
  opportunities: PropTypes.arrayOf(PropTypes.object).isRequired,
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionKey: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.number,
  resetDonation: PropTypes.func.isRequired,
  resetOpportunity: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { actionKey } = props
  let action = {}
  let donations = []
  let opportunities = []
  let submissions = []

  const reduxAction = state.getter[`accountAction_${actionKey}`]
  const status = reduxAction && reduxAction.status
  try {
    action = prepareInitialActionValues(reduxAction.data || {});
    ({ donations, opportunities, submissions } = action)
  } catch (e) {}

  return { action, donations, opportunities, submissions, status }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetDonation: () => dispatch(reset('orgNewDonation')),
    resetOpportunity: () => dispatch(reset('accountNewOpportunity')),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionScreen))
