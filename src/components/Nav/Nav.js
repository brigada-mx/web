import React from 'react'

import { NavLink } from 'react-router-dom'

import Colors from 'src/Colors'
import Styles from './Nav.css'

import LogoImg from 'assets/img/logo.png'

const Nav = (props) => {
  const selected = { color: Colors.brandGreen }
  return (
      <nav className={`${Styles.container} wrapper`}>
        <div className="row">
          <div className="col-lg-1 col-md-1 col-sm-2 col-xs-2">
            <a className={Styles.logo} href="/">
              <img src={LogoImg} width="74px" height="auto" alt="Logo" />
            </a>
          </div>
          <div className="col-lg-11 col-md-10 col-sm-9 col-xs-12 end-lg">
          <div className={Styles.links}>
            <NavLink activeStyle={selected} exact to="/">COMUNIDADES</NavLink>
            <NavLink activeStyle={selected} to="/organizaciones">ORGANIZACIONES</NavLink>
            <NavLink activeStyle={selected} to="/practicas">MEJORES PRÁCTICAS</NavLink>
            <NavLink activeStyle={selected} to="/nosotros">NOSOTROS</NavLink>
          </div>
          </div>
        </div>
      </nav>
  )
}

export default Nav
