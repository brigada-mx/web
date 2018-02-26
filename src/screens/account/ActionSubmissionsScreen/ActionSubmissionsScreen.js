import React from 'react'
import PropTypes from 'prop-types'

import Styles from './ActionSubmissionsScreen.css'


class ActionSubmissionsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <span>{this.props.actionKey}</span>
    )
  }
}

ActionSubmissionsScreen.propTypes = {
  actionKey: PropTypes.number,
}

export default ActionSubmissionsScreen
