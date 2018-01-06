import React from 'react'
import PropTypes from 'prop-types'

import service, { getBackoff } from 'api/service'
import OrganizationScreenView from './OrganizationScreenView'


class OrganizationScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      organization: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    const { id } = this.props
    getBackoff(this, 'organization', () => service.getOrganization(id))
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <OrganizationScreenView {...this.state} />
  }
}

OrganizationScreen.propTypes = {
  id: PropTypes.number.isRequired,
}

export default OrganizationScreen
