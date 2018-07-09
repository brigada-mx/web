import React from 'react'
import PropTypes from 'prop-types'

import { NavLink, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import Drawer from 'components/Drawer'
import LogoImg from 'assets/img/logo.svg'
import colors from 'src/colors'
import Styles from './Nav.css'


const NavLinks = ({
  orgToken,
  donorToken,
  classNameLink,
  activeStyle = {},
  onHideDrawer,
  modal,
}) => {
  const selected = { color: colors.brandGreen }

  const locIsActive = (match, location) => {
    const { pathname } = location
    return (pathname === '/' || pathname.startsWith('/comunidades'))
  }

  const orgIsActive = (match, location) => {
    const { pathname } = location
    return ['/reconstructores', '/proyectos', '/voluntariado'].some(s => pathname.startsWith(s))
  }

  const donorIsActive = (match, location) => {
    const { pathname } = location
    return pathname.startsWith('/donadores')
  }

  const volunteerIsActive = (match, location) => {
    const { pathname } = location
    return pathname.startsWith('/voluntarios')
  }

  const handleClickSupport = (e) => {
    e.preventDefault()
    onHideDrawer()
    modal('support')
  }

  const handleClickLogin = () => {
    onHideDrawer()
    modal('login', { type: 'org' })
  }

  const loginButton = () => {
    const className = `${classNameLink} ${Styles.button}`
    if (orgToken) return <Link onClick={onHideDrawer} className={className} to="/cuenta">Mi cuenta</Link>
    if (donorToken) return <Link onClick={onHideDrawer} className={className} to="/donador">Mi cuenta</Link>
    return <a onClick={handleClickLogin} className={className}>Login</a>
  }

  const forumButton = () => {
    if (orgToken || donorToken) return <a href="http://foro.brigada.mx/session/sso">Foro</a>
    return <a href="http://foro.brigada.mx">Foro</a>
  }

  return (
    <React.Fragment>
      <NavLink onClick={onHideDrawer} className={classNameLink} isActive={locIsActive} activeStyle={{ ...selected, ...activeStyle }} exact to="/">Comunidades</NavLink>
      <NavLink onClick={onHideDrawer} className={classNameLink} isActive={volunteerIsActive} activeStyle={{ ...selected, ...activeStyle }} to="/voluntarios">Voluntarios</NavLink>
      <NavLink onClick={onHideDrawer} className={classNameLink} isActive={orgIsActive} activeStyle={{ ...selected, ...activeStyle }} to="/reconstructores">Reconstructores</NavLink>
      <NavLink onClick={onHideDrawer} className={classNameLink} isActive={donorIsActive} activeStyle={{ ...selected, ...activeStyle }} to="/donadores">Donadores</NavLink>
      {forumButton()}
      <Link onClick={handleClickSupport} className={classNameLink} to="#">Soporte</Link>
      {loginButton()}
    </React.Fragment>
  )
}

NavLinks.propTypes = {
  onHideDrawer: PropTypes.func.isRequired,
  modal: PropTypes.func.isRequired,
  orgToken: PropTypes.string,
  donorToken: PropTypes.string,
  classNameLink: PropTypes.string,
  activeStyle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const { token: orgToken } = state.auth.org || {}
  const { token: donorToken } = state.auth.donor || {}
  return { orgToken, donorToken }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onHideDrawer: () => Actions.drawerToggle(dispatch, { visible: false }),
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

const ReduxNavLinks = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavLinks))

const Nav = () => {
  return (
    <React.Fragment>
      <nav className={`${Styles.container} wrapper row middle between`}>

        <a href="http://brigada.mx"><img src={LogoImg} width="auto" height="24px" alt="Logo" /></a>

        <div className="end">
          <div className={`${Styles.big} sm-hidden xs-hidden`}>
            <ReduxNavLinks />
          </div>
          <Drawer classNameWrapper={`${Styles.small} lg-hidden md-hidden`}>
            <ReduxNavLinks activeStyle={{ borderRight: '2px solid #3DC59F' }} />
          </Drawer>
        </div>

      </nav>

    </React.Fragment>
  )
}

export default Nav
export { ReduxNavLinks as NavLinks }
