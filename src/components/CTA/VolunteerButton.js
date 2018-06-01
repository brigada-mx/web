import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Button.css'


class VolunteerButton extends React.Component {
  handleClick = () => {
    const { actionId, onClick } = this.props
    if (onClick) onClick(actionId)
  }

  render() {
    const { opportunities } = this.props

    const value = opportunities.reduce((sum, o) => sum + (o.progress || 0), 0)
    const max = opportunities.reduce((sum, o) => sum + (o.target || 0), 0)
    return (
      <div className={Styles.container}>
        <span className={Styles.need}>Faltan {max - value} voluntarios para llegar a {max}</span>
        <span className={Styles.button} onClick={this.handleClick}>Postular</span>
      </div>
    )
  }
}

VolunteerButton.propTypes = {
  actionId: PropTypes.number.isRequired,
  opportunities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
}

export default VolunteerButton
