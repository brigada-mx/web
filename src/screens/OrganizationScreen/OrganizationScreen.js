import React from 'react'
import PropTypes from 'prop-types'

import service, { getBackoffComponent } from 'api/service'
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
    getBackoffComponent(this, 'organization', () => service.getOrganization(id))
  }

  componentWillReceiveProps({ id }) {
    if (id === this.props.id) return
    getBackoffComponent(this, 'organization', () => service.getOrganization(id))
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
