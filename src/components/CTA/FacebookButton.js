import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
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
        const { exception } = await service.shareSetUser(brigada.email, data.id)
        if (!exception) {
          snackbar('Gracias por compartir este proyecto', 'success')
          modal('shareUserCreated', { shareId: data.id, userCreated: false })
        }
      } else {
        modal('shareUser', { shareId: data.id })
      }
    })
  }

  setOgMeta = () => {
    if (this._ogMeta || !this.props.share) return
    this._ogMeta = true

    const {
      share: {
        image,
        action: {
          id: actionId,
          locality: { name, state_name: stateName, meta: { total } },
          organization: { name: orgName },
        },
      },
    } = this.props

    const metaTags = document.getElementsByTagName('meta')
    for (const meta of metaTags) {
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:title') {
        meta.content = `Apoya el proyecto de ${orgName} en ${stateName}`
      }
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:description') {
        meta.content = `Se dañaron ${total} viviendas en ${name}, ${stateName}. Súmate a la reconstrucción.`
      }
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:url') {
        meta.content = `${env.siteUrl}/proyectos/${actionId}`
      }
      if (meta.getAttribute('property') && meta.getAttribute('property').toLowerCase() === 'og:image') {
        meta.content = thumborUrl(image, 1280, 1280)
      }
    }
  }

  render() {
    this.setOgMeta()
    const { share } = this.props
    const handleClick = share ? this.handleClick : () => {}

    return (
      <div className={Styles.container}>
        {share &&
          <span className={Styles.need}>
            Faltan {share.target - share.progress} shares para llegar a {share.target}
          </span>
        }
        <span className={Styles.button} onClick={handleClick}>Compartir</span>
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
