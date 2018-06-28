import React from 'react'
import PropTypes from 'prop-types'

import { fireGaEvent } from 'tools/other'
import Styles from './Button.css'


class VolunteerButton extends React.Component {
  handleClick = () => {
    fireGaEvent('volunteerButton')
    const { actionId, onClick } = this.props
    if (onClick) onClick(actionId)
  }

  render() {
    const { opportunities } = this.props

    const max = opportunities.reduce((sum, o) => sum + (o.target || 0), 0)
    return (
      <div className={Styles.container}>
        <span className={Styles.need}>Buscamos {max} voluntario{max !== 1 ? 's' : ''}</span>
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
