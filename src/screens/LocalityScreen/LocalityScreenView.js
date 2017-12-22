import React from 'react'
import PropTypes from 'prop-types'

import FeatureMap from 'components/FeatureMap'
import LoadingIndicator from 'components/LoadingIndicator'
import Styles from './LocalityScreenView.css'


class LocalityScreenView extends React.Component {
  constructor(props) {
    super(props)
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
    return (
      <FeatureMap
        onClickFeature={this.handleClickFeature}
        onEnterFeature={this.handleEnterFeature}
        onLeaveFeature={this.handleLeaveFeature}
      />
    )
  }
}

LocalityScreenView.propTypes = {
  locality: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  establishments: PropTypes.object.isRequired,
}

export default LocalityScreenView
