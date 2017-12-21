import React from 'react'
import PropTypes from 'prop-types'

import FeatureMap from 'components/FeatureMap'
import LoadingIndicator from 'components/LoadingIndicator'
import Styles from './LocalityScreen.css'


class LocalityScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      establishments: [],
    }
  }

  handleClickFeature = (f) => {
    console.log(f)
  }

  handleEnterFeature = (f) => {
    console.log(f)
  }

  handleLeaveFeature = (f) => {
    console.log(f)
  }

  render() {
    const { cvegeo } = this.props
    const { establishments } = this.state
    if (establishments.length === 0) return <LoadingIndicator />
    return (
      <FeatureMap
        onClickFeature={this.handleClickFeature}
        onEnterFeature={this.handleEnterFeature}
        onLeaveFeature={this.handleLeaveFeature}
      />
    )
  }
}

LocalityScreen.propTypes = {
  cvegeo: PropTypes.string.isRequired,
}

LocalityScreen.propTypes = {
  cvegeo: PropTypes.string,
  id: (props, propName) => {
    if (props.cvegeo === undefined && props[propName] === undefined) {
      return new Error('exactly one of `cvegeo` and `id` must be passed')
    }
    if (props.cvegeo !== undefined && props[propName] !== undefined) {
      return new Error('exactly one of `cvegeo` and `id` must be passed')
    }
    return null
  },
}

export default LocalityScreen
