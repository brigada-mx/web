import React from 'react'
import PropTypes from 'prop-types'

import service from 'api/service'
import { localStorage } from 'tools/storage'


class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <span>login</span>
    )
  }
}

LoginScreen.propTypes = {
}

LoginScreen.defaultProps = {
}

export default LoginScreen
