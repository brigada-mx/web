import React from 'react'
import PropTypes from 'prop-types'

import { NavLink, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import Drawer from 'components/Drawer'
import LogoImg from 'assets/img/logo-sintonia.svg'
import Colors from 'src/Colors'
import Styles from './Nav.css'


const NavLinks = ({ token, classNameLink, activeStyle = {}, onHideDrawer }) => {
  const selected = { color: Colors.brandGreen }

  const locIsActive = (match, location) => {
    const { pathname } = location
    return (pathname === '/' || pathname.startsWith('/comunidades'))
  }

  const orgIsActive = (match, location) => {
    const { pathname } = location
    return pathname.startsWith('/organizaciones')
  }

  return (
    <React.Fragment>
      <NavLink onClick={onHideDrawer} className={classNameLink} isActive={locIsActive} activeStyle={{ ...selected, ...activeStyle }} exact to="/">Comunidades</NavLink>
      <NavLink onClick={onHideDrawer} className={classNameLink} isActive={orgIsActive} activeStyle={{ ...selected, ...activeStyle }} to="/organizaciones">Organizaciones</NavLink>
      <a href="http://ensintonia.org/nosotros">Nosotros</a>
      <Link onClick={onHideDrawer} className={classNameLink} to="/cuenta">{token ? 'Mi cuenta' : 'Login'}</Link>
    </React.Fragment>
  )
}

NavLinks.propTypes = {
  onHideDrawer: PropTypes.func.isRequired,
  token: PropTypes.string,
  classNameLink: PropTypes.string,
  activeStyle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const { token } = state.auth || {}
  return { token }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onHideDrawer: () => Actions.drawerToggle(dispatch, { visible: false }),
  }
}

const ReduxNavLinks = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavLinks))

const Nav = () => {
  return (
    <React.Fragment>
      <nav className={`${Styles.container} wrapper row middle between`}>

        <a href="/"><img src={LogoImg} width="auto" height="22px" alt="Logo" /></a>

        <div className="end">
          <div className={`${Styles.links} sm-hidden xs-hidden`}>
            <ReduxNavLinks />
          </div>
          <Drawer classNameWrapper="lg-hidden md-hidden">
            <ReduxNavLinks activeStyle={{ borderRight: '2px solid #3DC59F' }} classNameLink={Styles.burgerNavLinks} />
          </Drawer>
        </div>

      </nav>

    </React.Fragment>
  )
}

export default Nav
export { ReduxNavLinks as NavLinks }
