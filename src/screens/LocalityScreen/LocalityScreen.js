import React from 'react'
import PropTypes from 'prop-types'

import service, { getBackoffComponent } from 'api/service'
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
    getBackoffComponent(this, 'locality', () => service.getLocality(id))
    getBackoffComponent(this, 'actions', () => service.getLocalityActions(id))
    getBackoffComponent(this, 'establishments', () => service.getLocalityEstablishments(id, 2000))
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
