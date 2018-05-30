import React from 'react'
import PropTypes from 'prop-types'

import Styles from './CTAButton.css'


class CTAButton extends React.Component {
  handleClick = () => {
    const { actionId, type, onClick } = this.props
    if (onClick) onClick(actionId, type)
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
    const { type, opportunities } = this.props

    if (type === 'volunteer') {
      const value = opportunities.reduce((sum, o) => sum + (o.progress || 0), 0)
      const max = opportunities.reduce((sum, o) => sum + (o.target || 0), 0)
      return (
        <div className={Styles.container} onClick={this.handleClick}>
          <span className={Styles.need}>Faltan {max - value} voluntarios para llegar a {max}</span>
          <span className={Styles.button}>Postular</span>
        </div>
      )
    }

    if (type === 'share') {
      const value = 10
      const max = 20

      const url = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwatsi.org%2Fprofile%2F26a1fcb0aab2-maxwell'

      this.setOgMeta()

      return (
        <div className={Styles.container} onClick={this.handleClick}>
          <span className={Styles.need}>Faltan {max - value} shares para llegar a {max}</span>
          <a target="_blank" className={`${Styles.button} ${Styles.link}`} href={url}>Compartir</a>
        </div>
      )
    }
    return null
  }
}

CTAButton.propTypes = {
  actionId: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['volunteer', 'donate', 'share']).isRequired,
  onClick: PropTypes.func,
  opportunities: PropTypes.arrayOf(PropTypes.object),
}

export default CTAButton
