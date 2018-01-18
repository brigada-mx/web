import React from 'react'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'

import Drawer from 'components/Drawer'
import LogoImg from 'assets/img/logo.png'
import Colors from 'src/Colors'
import Styles from './Nav.css'


const NavLinks = ({ classNameCustom }) => {
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
      <NavLink className={classNameCustom} isActive={locIsActive} activeStyle={selected} exact to="/">COMUNIDADES</NavLink>
      <NavLink className={classNameCustom} isActive={orgIsActive} activeStyle={selected} to="/organizaciones">ORGANIZACIONES</NavLink>
      <NavLink className={classNameCustom} activeStyle={selected} to="/practicas">MEJORES PRÁCTICAS</NavLink>
      <NavLink className={classNameCustom} activeStyle={selected} to="/nosotros">NOSOTROS</NavLink>
    </React.Fragment>
  )
}

NavLinks.propTypes = {
  classNameCustom: PropTypes.string,
}

const Nav = () => {
  return (
    <React.Fragment>
      <nav className={`${Styles.container} wrapper row middle between`}>

        <a href="/"><img src={LogoImg} width="74px" height="auto" alt="Logo" /></a>

        <div className="end">
          <div className={`${Styles.links} sm-hidden xs-hidden`}>
            <NavLinks />
          </div>
          <Drawer classNameWrapper="lg-hidden md-hidden">
            <NavLinks classNameCustom={Styles.burgerNavLinks} />
          </Drawer>
        </div>

      </nav>

    </React.Fragment>
  )
}

export default Nav
export { NavLinks }
