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
    const { brigada, modal, snackbar, share } = this.props
    if (!window.FB || !share) return

    const {
      image,
      action: {
        id: actionId,
        locality: { name, state_name: stateName, meta: { total } },
        organization: { name: orgName },
      },
    } = share

    FB.ui({
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
        object: {
          'og:url': `${env.siteUrl}/proyectos/${actionId}`,
          'og:title': `Apoya el proyecto de ${orgName} en ${stateName}`,
          'og:description': `Se dañaron ${total} viviendas en ${name}, ${stateName}. Súmate a la reconstrucción.`,
          'og:image': image.url ? thumborUrl(image, 1280, 1280) : 'http://brigada.mx/assets/img/footer.jpg',
        },
      }),
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

  render() {
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
