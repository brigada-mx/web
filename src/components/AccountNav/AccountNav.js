import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'

import Styles from './AccountNav.css'


const AccountNav = ({ history, location }) => {
  const handleClick = () => {
    if (location.pathname !== '/cuenta') history.push('/cuenta')
  }

  return (
    <AppBar
      title="ADMIN"
      onTitleClick={handleClick}
      showMenuIconButton={false}
      titleStyle={{ cursor: 'pointer' }}
    />
  )
}

AccountNav.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(AccountNav)
