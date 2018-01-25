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
    getBackoff(this, 'organizations', service.getOrganizations, {
      onData: (data) => {
        for (const result of data.results) {
          const actionCvegeos = new Set()
          for (const action of result.actions) {
            const { cvegeo } = action.locality
            actionCvegeos.add(cvegeo.substring(0, 2))
            actionCvegeos.add(cvegeo.substring(0, 5))
          }
          result.actionCvegeos = actionCvegeos
        }
      },
    })
    getBackoff(this, 'localities', service.getLocalities, {
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
