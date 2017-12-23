import React from 'react'
import PropTypes from 'prop-types'

import service from 'api/service'
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
    this.getLocality()
    this.getLocalityActions()
    this.getLocalityEstablishments()
  }

  componentWillUnmount() {
    this._mounted = false
  }

  getLocality = async () => {
    const { data, error, exception } = await service.getLocality(this.props.id)
    if (data) this.setState({ locality: { loading: false, data, error: undefined } })
    if (error) this.setState({ locality: { loading: false, error } })
    if (exception && this._mounted) setTimeout(this.getLocality, 10000)
  }

  getLocalityActions = async () => {
    const { data, error, exception } = await service.getLocalityActions(this.props.id)
    if (data) this.setState({ actions: { loading: false, data, error: undefined } })
    if (error) this.setState({ actions: { loading: false, error } })
    if (exception && this._mounted) setTimeout(this.getLocalityActions, 10000)
  }

  getLocalityEstablishments = async () => {
    const { data, error, exception } = await service.getLocalityEstablishments(this.props.id, 2000)
    if (data) this.setState({ establishments: { loading: false, data, error: undefined } })
    if (error) this.setState({ establishments: { loading: false, error } })
    if (exception && this._mounted) setTimeout(this.getLocalityEstablishments, 10000)
  }

  render() {
    return <LocalityScreenView {...this.state} />
  }
}

LocalityScreen.propTypes = {
  id: PropTypes.number.isRequired,
}

export default LocalityScreen
