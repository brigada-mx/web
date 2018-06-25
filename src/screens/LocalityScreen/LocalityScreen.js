import React from 'react'
import PropTypes from 'prop-types'

import sortBy from 'lodash/sortBy'

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
    getBackoffComponent(this, () => service.getLocality(id), { stateKey: 'locality' })
    getBackoffComponent(this, () => service.getLocalityActions(id), {
      stateKey: 'actions',
      onResponse: ({ data }) => {
        if (!data) return
        data.results = sortBy(data.results, a => -a.score) // eslint-disable-line no-param-reassign
        return { data } // eslint-disable-line consistent-return
      },
    })
    getBackoffComponent(this, () => service.getLocalityEstablishments(id, 2000), { stateKey: 'establishments' })
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
