import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import ActionListItem from 'components/ActionListItem'
import FormStyles from 'screens/account/Form.css'
import { CreateActionForm, prepareActionBody } from 'screens/account/ActionForm'
import OrganizationForm from './OrganizationForm'
import ContactForm from './ContactForm'
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
            <div className={FormStyles.sectionHeader}>Acciones publicadas</div>
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
  try {
    return { actions: state.getter.accountActions.data.results || [] }
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
