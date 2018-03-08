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
import FormStyles from 'screens/account/Form.css'
import { CreateActionForm, prepareActionBody } from 'screens/account/ActionForm'
import SubmissionTable from 'screens/account/SubmissionTable'
import OrganizationForm from './OrganizationForm'
import ContactForm from './ContactForm'
import ActionTable from './ActionTable'


const initialActionValues = { published: true }

class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
      createAction: false,
    }

    this.handleLocalityChange = _.debounce(
      this.handleLocalityChange, 250
    )
  }

  componentDidMount() {
    this.loadOrganization()
    this.loadActions()
    this.loadSubmissions()
  }

  loadOrganization = () => {
    getBackoff(service.getAccountOrganization, { key: 'accountOrganization' })
  }

  loadActions = () => {
    getBackoff(service.getAccountActions, { key: 'accountActions' })
  }

  loadSubmissions = () => {
    getBackoff(service.getAccountSubmissions, { key: 'accountSubmissions' })
  }

  handleSubmitOrganization = async (values) => {
    const { data } = await service.updateAccountOrganization(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Actualizaste tu organización', 'success')
  }

  handleSubmitContact = async ({ zip, city, state, street, locality, ...rest }) => {
    const { data } = await service.updateAccountOrganization({ contact: {
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
    const { data } = await service.createAccountAction(prepareActionBody(body))
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
    const { data } = await service.updateAccountAction(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} este proyecto`, 'error')
      return
    }
    this.loadActions()
    const message = published ? `Publicaste proyecto #${key}` : `Ocultaste proyecto #${key}`
    this.props.snackbar(message, 'success')
  }

  handleTogglePublishedSubmission = async (id, published) => {
    const { data } = await service.updateAccountSubmission(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} estas fotos`, 'error')
      return
    }
    this.loadSubmissions()
    const message = published ? 'Publicaste estas fotos' : 'Ocultaste estas fotos'
    this.props.snackbar(message, 'success')
  }

  handleToggleCreateActionModal = (open) => {
    this.setState({ createAction: open })
  }

  render() {
    const { actions, submissions } = this.props
    const { createAction } = this.state

    return (
      <div>
        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>ORGANIZACIÓN</div>
          <OrganizationForm onSubmit={this.handleSubmitOrganization} enableReinitialize />
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>CONTACTO</div>
          <div className={FormStyles.formContainerLeft}>
            <ContactForm onSubmit={this.handleSubmitContact} enableReinitialize />
          </div>
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>PROYECTOS</span>
            <RaisedButton
              label="AGREGAR"
              onClick={() => this.handleToggleCreateActionModal(true)}
            />
          </div>
          {actions.length > 0 &&
            <ActionTable actions={actions} onTogglePublished={this.handleTogglePublished} />
          }
        </div>

        {submissions.length > 0 &&
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>FOTOS SIN PROYECTO</div>
            <SubmissionTable
              submissions={submissions}
              onTogglePublished={this.handleTogglePublishedSubmission}
            />
          </div>
        }

        {createAction &&
          <Modal
            className={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateActionModal(false)}
            gaName="createAction"
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
      </div>
    )
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
    actions = (state.getter.accountActions.data.results || []).sort((a, b) => {
      if (a.published < b.published) return 1
      if (a.published > b.published) return -1
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })
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
