import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

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
    const items = _.uniqBy(localities, l => l.cvegeo_state)

    return items.sort((a, b) => {
      if (a.state_name < b.state_name) return -1
      if (a.state_name > b.state_name) return 1
      return 0
    }).map((i) => {
      const { cvegeo, state_name: stateName } = i
      return <option key={i.cvegeo_state} value={cvegeo}>{stateName}</option>
    })
  }

  const muniOptions = () => {
    const items = _.uniqBy(localities, l => l.cvegeo_municipality)

    return items.sort((a, b) => {
      if (a.municipality_name < b.municipality_name) return -1
      if (a.municipality_name > b.municipality_name) return 1
      return 0
    }).map((i) => {
      const { cvegeo, municipality_name: munName, state_name: stateName } = i
      return (
        <option key={i.cvegeo_municipality} value={cvegeo}>
          {munName}, {stateName}
        </option>
      )
    })
  }

  return (
    <div className={`${Styles.container} wrapper row middle`}>

      <div className="col-lg-9 col-md-9 col-sm-2 col-xs-2">

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

      <div className="col-lg-3 col-md-3 col-sm-2 col-xs-2 end-lg end-md">

        <span className={Styles.numResults}>{numResults.toLocaleString()} resultados</span>
        <div className={Styles.searchWrapper}>
          <input
            className={Styles.search}
            type="text"
            placeholder="Buscar"
            onKeyUp={e => onKeyUp(e.target.value)}
          />
        </div>

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
