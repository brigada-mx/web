import React from 'react'
import PropTypes from 'prop-types'

import service, { getBackoff } from 'api/service'
import LocalityScreenView from './LocalityScreenView'


class LocalityScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locality: {
        loading: true,
      },
      actions: {
        loading: true,
      },
      establishments: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    const { id } = this.props
    getBackoff(this, 'locality', service.getLocality, id)
    getBackoff(this, 'actions', service.getLocalityActions, id)
    getBackoff(this, 'establishments', service.getLocalityEstablishments, id, 2000)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <LocalityScreenView {...this.state} />
  }
}

LocalityScreen.propTypes = {
  id: PropTypes.number.isRequired,
}

export default LocalityScreen
