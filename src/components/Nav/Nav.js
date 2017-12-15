import React from 'react'

import { NavLink } from 'react-router-dom'

import Styles from './Nav.css'


const Nav = (props) => {
  return (
    <div>
      <NavLink to="/">COMUNIDADES</NavLink>
      <NavLink to="/organizaciones">ORGANIZACIONES</NavLink>
      <NavLink to="/practicas">MEJORES PRÁCTICAS</NavLink>
      <NavLink to="/nostotros">NOSTOTROS</NavLink>
    </div>
  )
}

export default Nav
