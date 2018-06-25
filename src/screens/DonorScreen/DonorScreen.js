import React from 'react'
import PropTypes from 'prop-types'

import sortBy from 'lodash/sortBy'
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

  loadData = (id) => {
    getBackoffComponent(this, () => service.getDonor(id), { stateKey: 'donor' })
    getBackoffComponent(this, () => service.getDonorDonations(id), {
      stateKey: 'donations',
      onResponse: ({ data }) => {
        if (!data) return
        data.results = sortBy(data.results, d => -d.action.score) // eslint-disable-line no-param-reassign
        return { data } // eslint-disable-line consistent-return
      },
    })
  }

  componentDidMount() {
    this._mounted = true
    const { id } = this.props
    this.loadData(id)
  }

  componentDidUpdate({ id }) {
    if (id !== this.props.id) this.loadData(this.props.id)
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
