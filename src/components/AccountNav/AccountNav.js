import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'

import * as Actions from 'src/actions'
import service from 'api/service'
import Styles from './AccountNav.css'


const AccountNav = ({ history, location, onLogout, token }) => {
  const handleHomeClick = () => {
    history.push('/')
  }

  const handleProfileClick = () => {
    history.push('/cuenta/perfil')
  }

  const handleLogoutClick = () => {
    service.deleteToken()
    onLogout()
    history.push('/cuenta')
  }

  const menu = (
    <IconMenu
      iconButtonElement={
        <IconButton><MoreVertIcon /></IconButton>
      }
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem primaryText="Plataforma" onClick={handleHomeClick} />
      {token && <MenuItem primaryText="Perfil" onClick={handleProfileClick} />}
      {token && <MenuItem primaryText="Salir" onClick={handleLogoutClick} />}
    </IconMenu>
  )

  const handleTitleClick = () => {
    if (location.pathname !== '/cuenta') history.push('/cuenta')
  }

  return (
    <AppBar
      title="Admin"
      onTitleClick={handleTitleClick}
      showMenuIconButton={false}
      titleStyle={{ cursor: 'pointer' }}
      iconElementRight={menu}
    />
  )
}

const mapStateToProps = (state) => {
  const { token } = state.auth || {}
  return { token }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => Actions.authUnset(dispatch),
  }
}

AccountNav.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  token: PropTypes.string,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountNav))
