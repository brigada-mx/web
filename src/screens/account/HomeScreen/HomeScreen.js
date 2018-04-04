import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import Modal from 'components/Modal'
import WithSideNav from 'components/WithSideNav'
import FormStyles from 'src/Form.css'
import { CreateActionForm, prepareActionBody } from 'screens/account/ActionForm'
import SubmissionTable from 'screens/account/SubmissionTable'
import ActionTable from 'screens/account/ActionTable'
import ActionTrash from 'screens/account/ActionTrash'
import SubmissionTrash from 'screens/account/SubmissionTrash'
import OrganizationForm from './OrganizationForm'
import ContactForm from './ContactForm'


const initialActionValues = { published: true }

class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
      createActionModal: false,
      trashModal: false,
      submissionTrashModal: false,
    }

    this.handleLocalityChange = _.debounce(this.handleLocalityChange, 250)
  }

  componentDidMount() {
    document.title = 'Cuenta - Brigada'
    this.loadOrganization()
    this.loadActions()
    this.loadSubmissions()
  }

  loadOrganization = () => {
    getBackoff(service.accountGetOrganization, { key: 'accountOrganization' })
  }

  loadActions = () => {
    getBackoff(service.accountGetActions, { key: 'accountActions' })
  }

  loadSubmissions = () => {
    getBackoff(service.accountGetSubmissions, { key: 'accountSubmissions' })
  }

  handleSubmitOrganization = async (values) => {
    const { data } = await service.accountUpdateOrganization(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Actualizaste tu organización', 'success')
  }

  handleSubmitContact = async ({ zip, city, state, street, locality, ...rest }) => {
    const { data } = await service.accountUpdateOrganization({ contact: {
      ...rest,
      address: { zip, city, state, street, locality },
    } })
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Actualizaste tus datos de contacto', 'success')
  }

  handleCreateAction = async (body) => {
    const { data } = await service.accountCreateAction(prepareActionBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetAction()
    this.loadActions()
    this.props.snackbar('Agregaste un nuevo proyecto', 'success')
    this.handleToggleCreateActionModal(false)
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

  handleTogglePublished = async (id, key, published) => {
    const { data } = await service.accountUpdateAction(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} este proyecto`, 'error')
      return
    }
    this.loadActions()
    const message = published ? `Publicaste proyecto ${key}` : `Ocultaste proyecto ${key}`
    this.props.snackbar(message, 'success')
  }

  handleDeleteSubmission = async (id) => {
    const { data } = await service.accountArchiveSubmission(id, true)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadSubmissions()
    this.props.snackbar('Mandaste estas fotos al basurero', 'success')
  }

  handleChangeSubmissionAction = async (id, actionId) => {
    const { data } = await service.accountUpdateSubmission(id, { action: actionId })
    if (!data) {
      this.props.snackbar('Hubo un error, no se pudo asignar estas fotos a un proyecto', 'error')
      return
    }
    this.loadSubmissions()
    const action = _.find(this.props.actions, a => a.id === actionId)
    const message = `Asignaste estas fotos a proyecto ${action && action.key}`
    this.props.snackbar(message, 'success')
  }

  handleToggleCreateActionModal = (open) => {
    this.setState({ createActionModal: open })
  }

  handleToggleActionTrashModal = (open) => {
    this.setState({ trashModal: open })
  }

  handleToggleSubmissionTrashModal = (open) => {
    this.setState({ submissionTrashModal: open })
  }

  handleRestoreAction = () => {
    this.loadActions()
  }

  handleRestoreSubmission = () => {
    this.loadSubmissions()
  }

  render() {
    const { actions, submissions } = this.props
    const { createActionModal, trashModal, submissionTrashModal } = this.state

    const content = (
      <div>
        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>Organización</div>
          <OrganizationForm onSubmit={this.handleSubmitOrganization} enableReinitialize />
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>Contacto</div>
          <div className={FormStyles.formContainerLeft}>
            <ContactForm onSubmit={this.handleSubmitContact} enableReinitialize />
          </div>
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Proyectos</span>
            <div>
              <span
                className={FormStyles.link}
                onClick={() => this.handleToggleActionTrashModal(true)}
              >
                Basurero
              </span>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="AGREGAR"
                onClick={() => this.handleToggleCreateActionModal(true)}
              />
            </div>
          </div>
          {actions.length > 0 &&
            <ActionTable actions={actions} onTogglePublished={this.handleTogglePublished} />
          }
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Fotos sin proyecto</span>
            <span
              className={FormStyles.link}
              onClick={() => this.handleToggleSubmissionTrashModal(true)}
            >
              Basurero
            </span>
          </div>
          {submissions.length > 0 &&
            <SubmissionTable
              submissions={submissions}
              onDelete={this.handleDeleteSubmission}
              onChangeAction={this.handleChangeSubmissionAction}
            />
          }
        </div>

        {createActionModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateActionModal(false)}
            gaName="createActionModal"
          >
            <div className={FormStyles.sectionHeader}>Agregar proyecto</div>
            <CreateActionForm
              onSubmit={this.handleCreateAction}
              initialValues={initialActionValues}
              onLocalityChange={this.handleLocalityChange}
              localitiesSearch={this.state.localitiesSearch}
            />
          </Modal>
        }

        {trashModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainer}`}
            onClose={() => this.handleToggleActionTrashModal(false)}
            gaName="actionTrashModal"
          >
            <ActionTrash onRestore={this.handleRestoreAction} />
          </Modal>
        }

        {submissionTrashModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainer}`}
            onClose={() => this.handleToggleSubmissionTrashModal(false)}
            gaName="submissionTrashModal"
          >
            <SubmissionTrash onRestore={this.handleRestoreSubmission} />
          </Modal>
        }
      </div>
    )
    return <WithSideNav>{content}</WithSideNav>
  }
}

HomeScreen.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  snackbar: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  let actions = []
  let submissions = []

  try {
    actions = state.getter.accountActions.data.results || []
  } catch (e) {}
  try {
    submissions = (state.getter.accountSubmissions.data.results || []).sort((a, b) => {
      if (a.published < b.published) return 1
      if (a.published > b.published) return -1
      if (a.submitted < b.submitted) return 1
      if (a.submitted > b.submitted) return -1
      return 0
    })
  } catch (e) {}

  return { actions, submissions }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetAction: () => dispatch(reset('accountNewAction')),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
