import React from 'react'

import { NavLink } from 'react-router-dom'

import Colors from 'src/Colors'
import Styles from './Nav.css'


const Nav = (props) => {
  const selected = { color: Colors.brandGreen }
  return (
    <div className={Styles.container}>
      <nav className={Styles.nav}>
        <NavLink activeStyle={selected} exact to="/">COMUNIDADES</NavLink>
        <NavLink activeStyle={selected} to="/organizaciones">ORGANIZACIONES</NavLink>
        <NavLink activeStyle={selected} to="/practicas">MEJORES PRÁCTICAS</NavLink>
        <NavLink activeStyle={selected} to="/nosotros">NOSTOTROS</NavLink>
      </nav>
    </div>
  )
}

export default Nav
