import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import service, { getBackoff } from 'api/service'
import { thumborUrl } from 'tools/string'
import env from 'src/env'
import Styles from './Button.css'


class FacebookButton extends React.Component {
  componentDidMount() {
    const { actionId } = this.props
    getBackoff(() => service.getActionShare(actionId), { key: `actionShares_${actionId}` })
  }

  handleClick = () => {
    if (!window.FB) return

    const { actionId, brigada, modal, snackbar } = this.props

    FB.ui({
      method: 'share',
      href: `${env.siteUrl}/proyectos/${actionId}`,
    }, async (response) => {
      if (response.error_message) return

      const { data } = await service.createShare({ action: actionId })
      if (!data) return

      if (brigada.email) {
        const { data: shareData } = await service.shareSetUser(brigada.email, data.id)
        if (shareData) snackbar('Gracias por compartir este proyecto', 'success')
      } else {
        modal('shareUser', { shareId: data.id })
      }
    })
  }

  setOgMeta = () => {
    if (this._ogMeta || !this.props.share) return
    this._ogMeta = true

    const { share: { image, action_id: actionId } } = this.props
    const metaTags = document.getElementsByTagName('meta')
    for (const meta of metaTags) {
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:title') meta.content = 'Ayuda X a X'
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:description') meta.content = 'X está haciendo X en X y necesita su ayuda para difundir Y. Ve más sobre su proyecto aquí.'
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:url') meta.content = `${env.siteUrl}/proyectos/${actionId}`
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:image') meta.content = thumborUrl(image, 1280, 1280)
    }
  }

  render() {
    if (!this.props.share) return <LoadingIndicatorCircle />
    this.setOgMeta()
    const { share: { progress, target } } = this.props

    return (
      <div className={Styles.container}>
        <span className={Styles.need}>Faltan {target - progress} shares para llegar a {target}</span>
        <span className={Styles.button} onClick={this.handleClick}>Compartir</span>
      </div>
    )
  }
}

FacebookButton.propTypes = {
  actionId: PropTypes.number.isRequired,
  brigada: PropTypes.object.isRequired,
  modal: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
  share: PropTypes.object,
}

const mapStateToProps = (state, { actionId }) => {
  const { brigada = {} } = state.auth
  try {
    return { brigada, share: state.getter[`actionShares_${actionId}`].data }
  } catch (e) {
    return { brigada }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacebookButton)
