import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import service, { getBackoffComponent } from 'api/service'
import ActionScreenView from './ActionScreenView'


class ActionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    const { id } = this.props
    getBackoffComponent(this, 'action', () => service.getAction(id))
  }

  componentWillReceiveProps({ id }) {
    if (id === this.props.id) return
    getBackoffComponent(this, 'action', () => service.getAction(id))
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    const { authOrgId } = this.props
    const { data } = this.state.action
    const myAction = Boolean(authOrgId && data && authOrgId === data.organization.id)
    return <ActionScreenView {...this.state} myAction={myAction} />
  }
}

ActionScreen.propTypes = {
  id: PropTypes.number.isRequired,
  authOrgId: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { token, organization_id: authOrgId } = state.auth.org || {}
  return { authOrgId: token ? authOrgId : undefined }
}

export default connect(mapStateToProps, null)(ActionScreen)
