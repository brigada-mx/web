import React from 'react'

import LogoImg from 'assets/img/logo.png';
import Styles from './Header.css';

console.log(Styles);


const Header = (props) => {
  return <header>
    <div className={Styles.container}>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

          <a className={Styles.logo} href="/">
            <img src={LogoImg} width="74px" height="auto" alt="Logo" />
          </a>

          <select value="" className="state-filter xs-hidden">
            <option value="">Estado</option>
          </select>

          <select value="" className="municipality-filter xs-hidden">
            <option value="">Municipio</option>
          </select>

          <select value="" className="marginalization-filter xs-hidden">
            <option value="">Marginación social</option>
            <option value="muy_alto">Muy alto</option>
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
            <option value="bajo">Bajo</option>
          </select>

          <span className={Styles.beta}>Versión beta</span>

        </div>
      </div>
    </div>
  </header>
}

export default Header
