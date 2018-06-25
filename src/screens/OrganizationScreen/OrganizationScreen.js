import React from 'react'
import PropTypes from 'prop-types'

import sortBy from 'lodash/sortBy'
import { connect } from 'react-redux'

import service, { getBackoffComponent } from 'api/service'
import OrganizationScreenView from './OrganizationScreenView'


class OrganizationScreen extends React.Component {
  state = {
    organization: {
      loading: true,
    },
  }

  componentDidMount() {
    this._mounted = true
    const { id } = this.props
    getBackoffComponent(this, () => service.getOrganization(id), {
      stateKey: 'organization',
      onResponse: ({ data }) => {
        if (!data) return
        data.actions = sortBy(data.actions, a => -a.score) // eslint-disable-line no-param-reassign
        return { data } // eslint-disable-line consistent-return
      },
    })
  }

  componentDidUpdate({ id }) {
    if (id !== this.props.id) {
      getBackoffComponent(this, () => service.getOrganization(this.props.id), { stateKey: 'organization' })
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <OrganizationScreenView {...this.state} myOrganization={this.props.myOrganization} />
  }
}

OrganizationScreen.propTypes = {
  id: PropTypes.number.isRequired,
  myOrganization: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, { id }) => {
  const { token, organization_id: authOrgId } = state.auth.org || {}
  return { myOrganization: Boolean(token && authOrgId === id) }
}

export default connect(mapStateToProps, null)(OrganizationScreen)
