import React from 'react'
import PropTypes from 'prop-types'

import service from 'api/service'
import LocalityScreenView from './LocalityScreenView'


class LocalityScreen extends React.Component {
  state = {
    locality: {
      loading: true,
    },
    actions: {
      loading: true,
    },
    establishments: {
      loading: true,
    },
  };

  componentDidMount() {
    const { id = 209735 } = this.props
    service.getLocality(id)
      .then(r => r.json())
      .then(
        data => this.setState({ locality: { loading: false, data, error: undefined } }),
        error => this.setState({ locality: { loading: false, error } }),
      )

    service.getLocalityActions(id)
      .then(r => r.json())
      .then(
        data => this.setState(
          { actions: { loading: false, data: data.results, error: undefined } }
        ),
        error => this.setState({ actions: { loading: false, error } }),
      )

    service.getLocalityEstablishments(id, 2000)
      .then(r => r.json())
      .then(
        data => this.setState(
          { establishments: { loading: false, data: data.results, error: undefined } }
        ),
        error => this.setState({ establishments: { loading: false, error } }),
      )
  }

  render() {
    return <LocalityScreenView {...this.state} />
  }
}

LocalityScreen.propTypes = {
  id: PropTypes.number.isRequired,
}

export default LocalityScreen
