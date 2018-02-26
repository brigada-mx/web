import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import moment from 'moment'
import { reset } from 'redux-form'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import Styles from 'screens/account/Form.css'
import OrganizationForm from './OrganizationForm'
import ContactForm from './ContactForm'
import { CreateActionForm, UpdateActionForm } from './ActionForm'


const initialActionValues = { published: true }

const UpdateActionFormList = ({ actions, ...rest }) => {
  const actionList = actions.map((a) => {
    const { municipality_name, name, state_name } = a.action_locality
    const localityText = `${name}, ${municipality_name}, ${state_name}`
    const initialValues = {
      ...a,
      locality: { text: localityText, value: a.locality },
      start_date: a.start_date ? moment(a.start_date).toDate() : null,
      end_date: a.end_date ? moment(a.end_date).toDate() : null,
    }
    return (
      <div key={a.id} className={Styles.formContainer}>
        <UpdateActionForm
          form={`accountNewAction_${a.id}`}
          initialValues={initialValues}
          enableReinitialize
          {...rest}
        />
      </div>
    )
  })
  return <React.Fragment>{actionList}</React.Fragment>
}

UpdateActionFormList.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const mapStateToProps = (state) => {
  const { accountActions = { data: {} } } = state.getter
  return { actions: accountActions.data.results || [] }
}

const UpdateActionFormListRedux = connect(mapStateToProps, null)(UpdateActionFormList)

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

  handleResetKey = async (values) => {
    const { data } = await service.resetAccountKey(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.snackbar('Cambiaste la llave secreta de tu organización', 'success')
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

  handleUpdateAction = async (body) => {
    const { data } = await service.updateAccountAction(body.id, this.prepareActionBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadActions()
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

  render() {
    return (
      <div>
        <div className={Styles.sectionHeader}>Tu Organización</div>
        <div className={Styles.formContainer}>
          <OrganizationForm
            onResetKey={this.handleResetKey}
            onSubmit={this.handleSubmitOrganization}
            enableReinitialize
          />
        </div>

        <div className={Styles.sectionHeader}>Datos de contacto</div>
        <div className={Styles.formContainer}>
          <ContactForm onSubmit={this.handleSubmitContact} enableReinitialize />
        </div>

        <div className={Styles.sectionHeader}>Agregar proyecto</div>
        <div className={Styles.formContainer}>
          <CreateActionForm
            onSubmit={this.handleCreateAction}
            initialValues={initialActionValues}
            onLocalityChange={this.handleLocalityChange}
            localitiesSearch={this.state.localitiesSearch}
          />
        </div>

        <div className={Styles.sectionHeader}>Actualizar proyectos</div>
        <UpdateActionFormListRedux
          onSubmit={this.handleUpdateAction}
          onLocalityChange={this.handleLocalityChange}
          localitiesSearch={this.state.localitiesSearch}
        />
      </div>
    )
  }
}

HomeScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetAction: () => dispatch(reset('accountNewAction')),
  }
}

export default connect(null, mapDispatchToProps)(HomeScreen)
