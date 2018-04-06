import React from 'react'
import PropTypes from 'prop-types'

import service, { getBackoffComponent } from 'api/service'
import DonorScreenView from './DonorScreenView'


class DonorScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      donor: {
        loading: true,
      },
      donations: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    const { id } = this.props
    getBackoffComponent(this, 'donor', () => service.getDonor(id))
    getBackoffComponent(this, 'donations', () => service.getDonorDonations(id))
  }

  componentWillReceiveProps({ id }) {
    if (id === this.props.id) return
    getBackoffComponent(this, 'donor', () => service.getDonor(id))
    getBackoffComponent(this, 'donations', () => service.getDonorDonations(id))
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <DonorScreenView {...this.state} />
  }
}

DonorScreen.propTypes = {
  id: PropTypes.number.isRequired,
}

export default DonorScreen
