import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import ShareUserForm from './ShareUserForm'


const ShareUserScreen = ({ snackbar, modal, className = '', shareId, onLogin, brigada }) => {
  const handleSubmit = async (body) => {
    const { data, exception } = await service.createBrigadaUser(body)
    if (exception) {
      snackbar('Checa tu conexión', 'error')
      return
    }
    if (data) onLogin(data.user)

    const { data: shareData, exception: shareException } = await service.shareSetUser(body.email, shareId)
    if (shareException) {
      snackbar('Checa tu conexión', 'error')
      return
    }
    if (shareData) modal('shareUserCreated', { modalWide: true })
  }

  const form = <ShareUserForm initialValues={brigada} onSubmit={handleSubmit} />
  if (!className) return form
  return <div className={className}>{form}</div>
}

ShareUserScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  shareId: PropTypes.number.isRequired,
  brigada: PropTypes.object.isRequired,
  modal: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapStateToProps = (state) => {
  const { brigada = {} } = state.auth
  return { brigada }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status, duration) => Actions.snackbar(dispatch, { message, status, duration }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
    onLogin: auth => Actions.authSet(dispatch, { auth, type: 'brigada' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareUserScreen)
