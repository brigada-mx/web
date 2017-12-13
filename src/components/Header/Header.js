import React from 'react'

import LogoImg from 'assets/img/logo.png'
import Styles from './Header.css'


const Header = (props) => {
  return (
    <div className={Styles.container}>

      <a className={Styles.logo} href="/">
        <img src={LogoImg} width="74px" height="auto" alt="Logo" />
      </a>

      <select value="" className={Styles.filter}>
        <option value="">Estado</option>
      </select>

      <select value="" className={Styles.filter}>
        <option value="">Municipio</option>
      </select>

      <select value="" className={Styles.filter}>
        <option value="">Marginación social</option>
        <option value="muy_alto">Muy alto</option>
        <option value="alto">Alto</option>
        <option value="medio">Medio</option>
        <option value="bajo">Bajo</option>
      </select>

      <div className={Styles.beta}>
        <span>Versión beta</span>
      </div>

    </div>
  )
}

export default Header
