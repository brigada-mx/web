import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'

import * as Actions from 'src/actions'
import service from 'api/service'
import Styles from './DonorNav.css'


const DonorNav = ({ history, location, onLogout, livechat, token, donorId }) => {
  const handleHomeClick = () => {
    if (location.pathname !== '/donador') history.push('/donador')
  }

  const handleProfileClick = () => {
    if (location.pathname !== '/donador/perfil') history.push('/donador/perfil')
  }

  const handleLogoutClick = () => {
    service.deleteToken()
    onLogout()
    if (location.pathname !== '/donador') history.push('/donador')
  }

  const platformLink = () => {
    if (donorId) return `/donadores/${donorId}`
    return '/'
  }

  const openChat = () => {
    livechat(true)
  }

  const menu = (
    <React.Fragment>
      <FlatButton
        containerElement={<Link to="#" />}
        onClick={openChat}
        className={Styles.button}
        label="Soporte"
      />
      <FlatButton
        containerElement={<Link to={platformLink()} />}
        className={Styles.button}
        label="Perfil Público"
      />

      <IconMenu
        iconButtonElement={
          <IconButton>
            <MoreVertIcon
              className={Styles.menuButton}
            />
          </IconButton>
        }

        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="Perfil" onClick={handleProfileClick} />
        <MenuItem primaryText="Salir" onClick={handleLogoutClick} />
      </IconMenu>
    </React.Fragment>
  )

  if (!token) return null
  return (
    <AppBar
      className={Styles.nav}
      title="Mi Cuenta"
      onTitleClick={handleHomeClick}
      showMenuIconButton={false}
      titleStyle={{ cursor: 'pointer' }}
      iconElementRight={menu}
    />
  )
}

DonorNav.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  livechat: PropTypes.func.isRequired,
  token: PropTypes.string,
  donorId: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { token, donor_id: donorId } = state.auth.donor || {}
  return { token, donorId }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => Actions.authUnset(dispatch, { type: 'donor' }),
    livechat: open => Actions.livechat(dispatch, { open }),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DonorNav))
