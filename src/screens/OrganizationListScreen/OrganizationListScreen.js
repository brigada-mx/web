import React from 'react'

import service, { getBackoff } from 'api/service'
import { dmgGrade } from 'tools/other'
import OrganizationListScreenView from './OrganizationListScreenView'


class OrganizationListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localityById: {},
      localities: {
        loading: true,
      },
      organizations: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    getBackoff(this, 'organizations', service.getOrganizations)
    getBackoff(this, 'localities', service.getLocalitiesStatic, {
      onData: (data) => {
        const localityById = {}
        for (const result of data.results) {
          result.dmgGrade = dmgGrade(result)
          localityById[result.id] = result
        }
        this.setState({ localityById })
      },
    })
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <OrganizationListScreenView {...this.state} />
  }
}

export default OrganizationListScreen
