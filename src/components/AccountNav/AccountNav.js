import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import ReactGA from 'react-ga'
import { withRouter, Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'

import * as Actions from 'src/actions'
import env from 'src/env'
import service from 'api/service'
import Styles from './AccountNav.css'


const AccountNav = ({ history, location, onLogout, livechat, token, orgId }) => {
  const handleHomeClick = () => {
    if (location.pathname !== '/cuenta') history.push('/cuenta')
  }

  const handleProfileClick = () => {
    if (location.pathname !== '/cuenta/perfil') history.push('/cuenta/perfil')
  }

  const handleLogoutClick = () => {
    service.deleteToken()
    onLogout()
    if (location.pathname !== '/cuenta') history.push('/cuenta')
  }

  const platformLink = () => {
    if (orgId) return `/organizaciones/${orgId}`
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
        containerElement={<ReactGA.OutboundLink eventLabel="survey" to={env.surveyUrl} target="_blank" />}
        className={Styles.button}
        label="Subir Fotos"
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

AccountNav.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  livechat: PropTypes.func.isRequired,
  token: PropTypes.string,
  orgId: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { token, organization_id: orgId } = state.auth || {}
  return { token, orgId }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => Actions.authUnset(dispatch),
    livechat: open => Actions.livechat(dispatch, { open }),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountNav))
