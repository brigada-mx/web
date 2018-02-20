import React from 'react'
import PropTypes from 'prop-types'

import service, { getBackoff } from 'api/service'
import { localStorage } from 'tools/storage'
import Styles from './AccountScreen.css'


class AccountScreen extends React.Component {
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
    getBackoff(this, 'organization', () => service.getAccountOrganization())
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return (
      null
    )
  }
}

AccountScreen.propTypes = {
}

AccountScreen.defaultProps = {
}

export default AccountScreen
