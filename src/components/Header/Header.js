import React from 'react'
import PropTypes from 'prop-types'

import LogoImg from 'assets/img/logo.png'
import Styles from './Header.css'


const Header = (props) => {
  const {
    onStateChange,
    onMuniChange,
    onMargChange,
    states,
    municipalities,
  } = props

  return (
    <div className={Styles.container}>

      <a className={Styles.logo} href="/">
        <img src={LogoImg} width="74px" height="auto" alt="Logo" />
      </a>

      <select className={Styles.filter} onChange={onStateChange}>
        <option value="">Estado</option>
      </select>

      <select className={Styles.filter} onChange={onMuniChange}>
        <option value="">Municipio</option>
      </select>

      <select className={Styles.filter} onChange={onMargChange}>
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

Header.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  onMuniChange: PropTypes.func.isRequired,
  onMargChange: PropTypes.func.isRequired,
  states: PropTypes.arrayOf(PropTypes.object).isRequired,
  municipalities: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Header
