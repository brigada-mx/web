import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import LogoImg from 'assets/img/logo.png'
import Styles from './FilterHeader.css'


const FilterHeader = (props) => {
  const {
    onStateChange,
    onMuniChange,
    onMargChange,
    onKeyUp,
    localities,
    numResults,
  } = props

  const stateOptions = () => {
    const items = _.uniqBy(localities, l => l.properties.cvegeoState)

    return items.sort((a, b) => {
      if (a.properties.stateName < b.properties.stateName) return -1
      if (a.properties.stateName > b.properties.stateName) return 1
      return 0
    }).map((i) => {
      const { cvegeoS, stateName } = i.properties
      return <option key={i.properties.cvegeoState} value={cvegeoS}>{stateName}</option>
    })
  }

  const muniOptions = () => {
    const items = _.uniqBy(localities, l => l.properties.cvegeoMuni)

    return items.sort((a, b) => {
      if (a.properties.munName < b.properties.munName) return -1
      if (a.properties.munName > b.properties.munName) return 1
      return 0
    }).map((i) => {
      const { cvegeoS, munName, stateName } = i.properties
      return <option key={i.properties.cvegeoMuni} value={cvegeoS}>{munName}, {stateName}</option>
    })
  }

  return (
    <div className={`${Styles.container} wrapper row middle`}>

      <div className="lg-hidden md-hidden col-sm-1 col-xs-2">
        <a className={Styles.logo} href="/">
          <img src={LogoImg} width="74px" height="auto" alt="Logo" />
        </a>
      </div>

      <div className="col-lg-9 col-md-9 sm-hidden xs-hidden">

        <select className={Styles.filter} onChange={onStateChange}>
          <option value="">Estado</option>
          {stateOptions()}
        </select>

        <select className={Styles.filter} onChange={onMuniChange}>
          <option value="">Municipio</option>
          {muniOptions()}
        </select>

        <select className={Styles.filter} onChange={onMargChange}>
          <option value="">Marginación social</option>
          <option value="muy_alto">Muy alta</option>
          <option value="alto">Alta</option>
          <option value="medio">Media</option>
          <option value="bajo">Baja</option>
        </select>

      </div>

      <div className="col-lg-3 col-md-3 col-sm-4 col-sm-offset-3 col-xs-2 end-lg end-md end-sm">

        <span className={Styles.numResults}>{numResults.toLocaleString()} resultados</span>
        <div className={Styles.searchWrapper}>
          <input
            className={Styles.search}
            type="text"
            placeholder="Buscar"
            onKeyUp={e => onKeyUp(e.target.value)}
          />
        </div>

        <div className={`${Styles.hamburger} lg-hidden md-hidden`} />

      </div>

    </div>

  )
}

FilterHeader.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  onMuniChange: PropTypes.func.isRequired,
  onMargChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  numResults: PropTypes.number.isRequired,
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default FilterHeader
