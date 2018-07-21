import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'


class WindowListener extends React.Component {
  componentDidMount() {
    window.addEventListener('orientationchange', this.handleOrientationChange)
    const { innerWidth, innerHeight } = window
    this.props.onChange({ innerWidth, innerHeight })
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.handleOrientationChange)
  }

  handleOrientationChange = () => {
    setTimeout(() => {
      const { innerWidth, innerHeight } = window
      this.props.onChange({ innerWidth, innerHeight })
    }, 350)
  }

  render() {
    return null
  }
}

WindowListener.propTypes = {
  onChange: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (properties) => { Actions.windowProperties(dispatch, { properties }) },
  }
}

export default connect(null, mapDispatchToProps)(WindowListener)
