import React from 'react'

import service, { getBackoffComponent } from 'api/service'
import DonorListScreenView from './DonorListScreenView'


class DonorListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      donors: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    getBackoffComponent(this, service.getDonors, {
      stateKey: 'donors',
      onResponse: ({ data }) => {
        if (!data) return
        const sorted = data.results.sort((a, b) => {
          if (a.metrics.total_donated < b.metrics.total_donated) return 1
          if (a.metrics.total_donated > b.metrics.total_donated) return -1
          return 0
        }).filter(d => d.donations.length > 0)
        return { data: { results: sorted } } // eslint-disable-line consistent-return
      },
    })
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <DonorListScreenView {...this.state} />
  }
}

export default DonorListScreen
