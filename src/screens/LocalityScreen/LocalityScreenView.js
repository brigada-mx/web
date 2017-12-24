import React from 'react'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'

import FeatureMap from 'components/FeatureMap'
import LoadingIndicator from 'components/LoadingIndicator'
import Styles from './LocalityScreenView.css'


const LocalityBreadcrumb = ({ cvegeo, stateName, munName, name }) => (
  <div className={Styles.links}>
    <NavLink to="/">Comunidades</NavLink>
    <NavLink to={`/${cvegeo.substring(0, 2)}`}>{stateName}</NavLink>
    <NavLink to={`/${cvegeo.substring(0, 5)}`}>{munName}</NavLink>
    <NavLink to="#">{name}</NavLink>
  </div>
)

LocalityBreadcrumb.propTypes = {
  cvegeo: PropTypes.string.isRequired,
  stateName: PropTypes.string.isRequired,
  munName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

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
    const { locality, actions, establishments } = this.props
    const { loading: locLoading, data: locData, error: locError } = locality
    if (locData) {
      const { name, municipality_name, state_name, cvegeo } = locData
      return LocalityBreadcrumb({ cvegeo, munName: municipality_name, stateName: state_name, name })
    }

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
