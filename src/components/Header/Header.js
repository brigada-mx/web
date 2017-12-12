import React from 'react'

const Header = (props) => {
  return <header>
    <div class="container wrap">
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

          <select class="state-filter xs-hidden">
            <option value="" selected="selected">Estado</option>
          </select>

          <select class="municipality-filter xs-hidden">
            <option value="" selected="selected">Municipio</option>
          </select>

          <select class="marginalization-filter xs-hidden">
            <option value="" selected="selected">Marginación social</option>
            <option value="muy_alto">Muy alto</option>
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
            <option value="bajo">Bajo</option>
          </select>

          <span id="beta">Versión beta</span>

        </div>
      </div>
    </div>
  </header>
}

export default Header
