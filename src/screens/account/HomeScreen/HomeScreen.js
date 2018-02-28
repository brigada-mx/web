import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import FormStyles from 'screens/account/Form.css'
import { CreateActionForm, prepareActionBody } from 'screens/account/ActionForm'
import OrganizationForm from './OrganizationForm'
import ContactForm from './ContactForm'
import ActionTable from './ActionTable'
import Styles from './HomeScreen.css'


const initialActionValues = { published: true }

class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
    }

    this.handleLocalityChange = _.debounce(
      this.handleLocalityChange, 250
    )
  }

  componentDidMount() {
    this.loadOrganization()
    this.loadActions()
  }

  loadOrganization = () => {
    getBackoff(service.getAccountOrganization, { key: 'accountOrganization' })
  }

  loadActions = () => {
    getBackoff(service.getAccountActions, { key: 'accountActions' })
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

  handleTogglePublished = async (id, published) => {
    const { data } = await service.updateAccountAction(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} este proyecto`, 'error')
      return
    }
    this.loadActions()
    const message = published ? 'Publicaste este proyecto' : 'Ocultaste este proyecto'
    this.props.snackbar(message, 'success')
  }

  render() {
    const { actions } = this.props

    return (
      <div>
        <div className={FormStyles.sectionHeader}>Tu Organización</div>
        <div className={FormStyles.formContainerLeft}>
          <OrganizationForm onSubmit={this.handleSubmitOrganization} enableReinitialize />
        </div>

        <div className={FormStyles.sectionHeader}>Datos de contacto</div>
        <div className={FormStyles.formContainerLeft}>
          <ContactForm onSubmit={this.handleSubmitContact} enableReinitialize />
        </div>

        <div className={FormStyles.sectionHeader}>Agregar proyecto</div>
        <div className={FormStyles.formContainerLeft}>
          <CreateActionForm
            onSubmit={this.handleCreateAction}
            initialValues={initialActionValues}
            onLocalityChange={this.handleLocalityChange}
            localitiesSearch={this.state.localitiesSearch}
          />
        </div>

        {actions.length && (
          <React.Fragment>
            <div className={FormStyles.sectionHeader}>Proyectos</div>
            <ActionTable actions={actions} onTogglePublished={this.handleTogglePublished} />
          </React.Fragment>
        )}

      </div>
    )
  }
}

HomeScreen.propTypes = {
  history: PropTypes.object.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  snackbar: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  try {
    const actions = (state.getter.accountActions.data.results || []).sort((a, b) => {
      if (a.published < b.published) return 1
      if (a.published > b.published) return -1
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })
    return { actions }
  } catch (e) {
    return { actions: [] }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetAction: () => dispatch(reset('accountNewAction')),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeScreen))
