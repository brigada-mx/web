import React from 'react'

import service, { getBackoff } from 'api/service'
import OrganizationListScreenView from './OrganizationListScreenView'


class OrganizationListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      organizations: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    getBackoff(this, 'organizations', () => service.getOrganizations)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <OrganizationListScreenView {...this.state} />
  }
}

export default OrganizationListScreen
