import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import Styles from 'screens/account/Form.css'
import OrganizationForm from './OrganizationForm'


class HomeScreen extends React.Component {
  loadOrganization = () => {
    getBackoff(service.getAccountOrganization, { key: 'accountOrganization' })
  }

  handleResetKey = async (values) => {
    const { data } = await service.resetAccountKey(values)
    if (!data) {
      this.props.onResponse('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.onResponse('Cambiaste la llave secreta de tu organización', 'success')
  }

  handleSubmitOrganization = async (values) => {
    const { data } = await service.updateAccountOrganization(values)
    if (!data) {
      this.props.onResponse('Hubo un error', 'error')
      return
    }
    this.loadOrganization()
    this.props.onResponse('Actualizaste tu organización', 'success')
  }

  componentDidMount() {
    this.loadOrganization()
  }

  render() {
    return (
      <div className={Styles.formContainer}>
        <OrganizationForm onSubmit={this.handleSubmitOrganization} enableReinitialize />
        <RaisedButton
          className={Styles.button}
          label="CAMBIAR LLAVE SECRETA"
          onClick={this.handleResetKey}
        />
      </div>
    )
  }
}

HomeScreen.propTypes = {
  onResponse: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onResponse: (message, status) => Actions.snackbar(dispatch, { message, status }),
    reset: () => dispatch(reset('accountNewAction')),
  }
}

export default connect(null, mapDispatchToProps)(HomeScreen)
