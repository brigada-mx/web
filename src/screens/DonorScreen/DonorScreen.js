import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import service, { getBackoffComponent } from 'api/service'
import DonorScreenView from './DonorScreenView'


class DonorScreen extends React.Component {
  state = {
    donor: {
      loading: true,
    },
    donations: {
      loading: true,
    },
  }

  componentDidMount() {
    this._mounted = true
    const { id } = this.props
    getBackoffComponent(this, 'donor', () => service.getDonor(id))
    getBackoffComponent(this, 'donations', () => service.getDonorDonations(id))
  }

  componentDidUpdate({ id }) {
    if (id !== this.props.id) {
      getBackoffComponent(this, 'donor', () => service.getDonor(this.props.id))
      getBackoffComponent(this, 'donations', () => service.getDonorDonations(this.props.id))
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <DonorScreenView {...this.state} myDonor={this.props.myDonor} />
  }
}

DonorScreen.propTypes = {
  id: PropTypes.number.isRequired,
  myDonor: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, { id }) => {
  const { token, donor_id: authDonorId } = state.auth.donor || {}
  return { myDonor: Boolean(token && authDonorId === id) }
}

export default connect(mapStateToProps, null)(DonorScreen)
