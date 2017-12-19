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
    <div className={`${Styles.container} wrapper`}>

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
        <option value="muy_alto">Muy alto</option>
        <option value="alto">Alto</option>
        <option value="medio">Medio</option>
        <option value="bajo">Bajo</option>
      </select>

      <input
        type="text"
        placeholder="Buscar localidades"
        onKeyUp={e => onKeyUp(e.target.value)}
      />

    </div>
  )
}

FilterHeader.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  onMuniChange: PropTypes.func.isRequired,
  onMargChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default FilterHeader
