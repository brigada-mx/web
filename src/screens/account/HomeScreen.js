import React from 'react'
import PropTypes from 'prop-types'

import service, { getBackoff } from 'api/service'
import HomeScreenView from './HomeScreenView'


class HomeScreen extends React.Component {
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
      <HomeScreenView />
    )
  }
}

HomeScreen.propTypes = {
}

HomeScreen.defaultProps = {
}

export default HomeScreen