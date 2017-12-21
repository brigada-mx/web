import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import FilterHeader from 'components/FilterHeader'
import Map from 'components/Map'
import LocalityPopup from 'components/Map/LocalityPopup'
import LocalityLegend from 'components/Map/LocalityLegend'
import { tokenMatch } from 'tools/string'
import Styles from './LocalityScreen.css'


class LocalityScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { cvegeo } = this.props
    return <span>{cvegeo}</span>
  }
}

LocalityScreen.propTypes = {
  cvegeo: PropTypes.string.isRequired,
}

export default LocalityScreen
