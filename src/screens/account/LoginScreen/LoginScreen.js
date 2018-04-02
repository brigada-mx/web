import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import { parseQs } from 'tools/string'
import service from 'api/service'
import LoginForm from './LoginForm'


const LoginScreen = ({ onLogin, snackbar, history, location, closeModal, className, type }) => {
  const handleSubmit = async ({ email, password }) => {
    const fGetTokenByType = { org: service.token, donor: service.donorToken }
    const accountUrl = { org: '/cuenta', donor: '/donador' }[type]

    const { data } = await fGetTokenByType[type](email, password)
    if (data) {
      onLogin({ ...data, email }, type)

      const params = parseQs(location.search)
      if (params.next) history.push(params.next)
      else if (location.pathname !== accountUrl) history.push(accountUrl)

      closeModal()
    } else {
      snackbar('No reconocemos este email/contraseña', 'error')
    }
  }

  if (!className) return <LoginForm type={type} onSubmit={handleSubmit} />
  return <div className={className}><LoginForm type={type} onSubmit={handleSubmit} /></div>
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['org', 'donor']).isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (auth, type) => Actions.authSet(dispatch, { auth, type }),
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(LoginScreen))
