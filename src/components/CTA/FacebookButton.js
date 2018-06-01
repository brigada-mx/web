import React from 'react'
import PropTypes from 'prop-types'

import env from 'src/env'
import { localStorage } from 'tools/storage'
import Styles from './Button.css'


class FacebookButton extends React.Component {
  handleClick = () => {
    if (!window.FB) return

    const { actionId, onClick } = this.props

    FB.ui({
      method: 'share',
      href: `${env.siteUrl}/proyectos/${actionId}`,
    }, (response) => {
      if (response.error_message) return
      const user = JSON.parse(localStorage.getItem('719s:brigadaUser'))
      if (user) {

      }
    })

    if (onClick) onClick(actionId)
  }

  setOgMeta = () => {
    if (this._ogMeta) return
    this._ogMeta = true

    const metaTags = document.getElementsByTagName('meta')
    for (const meta of metaTags) {
      if (meta.property && meta.property.toLowerCase() === 'og:title') meta.content = 'Fund Maxwells healthcare on Watsi'
      if (meta.property && meta.property.toLowerCase() === 'og:description') meta.content = 'Maxwell is a baby from Kenya who needs $1,097 to fund spinal surgery. 100% of your donation funds Maxwells care.'
      if (meta.property && meta.property.toLowerCase() === 'og:url') meta.content = 'https://watsi.org/profile/26a1fcb0aab2-maxwell'
      if (meta.property && meta.property.toLowerCase() === 'og:image') meta.content = 'https://d3w52z135jkm97.cloudfront.net/uploads/profile/photo/17416/profile_638x479_44bb5c24-8153-42f9-b473-8abad599065d.JPG'
    }
  }

  render() {
    this.setOgMeta()
    const value = 10
    const max = 20

    return (
      <div className={Styles.container}>
        <span className={Styles.need}>Faltan {max - value} shares para llegar a {max}</span>
        <span className={Styles.button} onClick={this.handleClick}>Compartir</span>
      </div>
    )
  }
}

FacebookButton.propTypes = {
  actionId: PropTypes.number.isRequired,
  onClick: PropTypes.func,
}

export default FacebookButton
