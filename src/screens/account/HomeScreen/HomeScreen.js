import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import moment from 'moment'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import ActionListItem from 'components/ActionListItem'
import FormStyles from 'screens/account/Form.css'
import OrganizationForm from './OrganizationForm'
import ContactForm from './ContactForm'
import { CreateActionForm } from './ActionForm'
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

  prepareActionBody = (body) => {
    const { locality, start_date, end_date } = body
    return {
      ...body,
      locality: locality.value,
      start_date: start_date ? moment(start_date).format('YYYY-MM-DD') : null,
      end_date: end_date ? moment(end_date).format('YYYY-MM-DD') : null,
    }
  }

  handleCreateAction = async (body) => {
    const { data } = await service.createAccountAction(this.prepareActionBody(body))
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

  handleClickAction = (action) => {
    this.props.history.push(`/cuenta/proyectos/${action.key}`)
  }

  render() {
    const { actions } = this.props
    const publishedActions = actions.filter(a => a.published).map((a) => {
      return <ActionListItem key={a.id} action={a} screen="admin" focused onClickItem={this.handleClickAction} />
    })
    const unpublishedActions = actions.filter(a => !a.published).map((a) => {
      return <ActionListItem key={a.id} action={a} screen="admin" focused onClickItem={this.handleClickAction} />
    })

    return (
      <div>
        <div className={FormStyles.sectionHeader}>Tu Organización</div>
        <div className={FormStyles.formContainer}>
          <OrganizationForm onSubmit={this.handleSubmitOrganization} enableReinitialize />
        </div>

        <div className={FormStyles.sectionHeader}>Datos de contacto</div>
        <div className={FormStyles.formContainer}>
          <ContactForm onSubmit={this.handleSubmitContact} enableReinitialize />
        </div>

        <div className={FormStyles.sectionHeader}>Agregar proyecto</div>
        <div className={FormStyles.formContainer}>
          <CreateActionForm
            onSubmit={this.handleCreateAction}
            initialValues={initialActionValues}
            onLocalityChange={this.handleLocalityChange}
            localitiesSearch={this.state.localitiesSearch}
          />
        </div>

        {publishedActions.length && (
          <React.Fragment>
            <div className={FormStyles.sectionHeader}>Acciones publicados</div>
            <div className={Styles.actionList}>{publishedActions}</div>
          </React.Fragment>
        )}

        {unpublishedActions.length && (
          <React.Fragment>
            <div className={FormStyles.sectionHeader}>Acciones sin publicar</div>
            <div className={Styles.actionList}>{unpublishedActions}</div>
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
  const { accountActions = { data: {} } } = state.getter
  return { actions: accountActions.data.results || [] }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetAction: () => dispatch(reset('accountNewAction')),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeScreen))
