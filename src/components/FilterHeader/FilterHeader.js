import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import Select from 'react-select'
import '!style-loader!css-loader!react-select/dist/react-select.css'

import LogoImg from 'assets/img/logo.png'
import Styles from './FilterHeader.css'


const FilterHeader = (props) => {
  const {
    onStateChange,
    onMuniChange,
    onMargChange,
    onNumActionsChange,
    onKeyUp,
    localities,
    numResults,
    valState,
    valMuni,
    valMarg,
    valNumActions,
  } = props

  const stateOptions = () => {
    const items = _.uniqBy(localities, l => l.cvegeo_state)

    return items.sort((a, b) => {
      if (a.state_name < b.state_name) return -1
      if (a.state_name > b.state_name) return 1
      return 0
    }).map((i) => {
      const { cvegeo, state_name: stateName } = i
      return { value: cvegeo, label: stateName }
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
      return { value: cvegeo, label: `${munName}, ${stateName}` }
    })
  }

  return (
    <div className={`${Styles.container} wrapper row middle`}>

      <div className="lg-hidden md-hidden col-sm-1 col-xs-2">
        <a className={Styles.logo} href="/">
          <img src={LogoImg} width="74px" height="auto" alt="Logo" />
        </a>
      </div>

      <div className={`${Styles.filterContainer} sm-hidden xs-hidden`}>

        <Select
          multi
          className={Styles.filter}
          value={valState}
          placeholder="Estado"
          onChange={onStateChange}
          options={stateOptions()}
        />

        <Select
          multi
          className={Styles.filter}
          value={valMuni}
          placeholder="Municipio"
          onChange={onMuniChange}
          options={muniOptions()}
        />

        <Select
          multi
          className={Styles.filter}
          value={valMarg}
          placeholder="Marginación social"
          onChange={onMargChange}
          options={[
            { value: 'muy_alto', label: 'Muy alta' },
            { value: 'alto', label: 'Alta' },
            { value: 'medio', label: 'Media' },
            { value: 'bajo', label: 'Baja' },
          ]}
        />

        <Select
          multi
          className={Styles.filter}
          value={valNumActions}
          placeholder="Acciones"
          onChange={onNumActionsChange}
          options={[
            { value: '0', label: '0-9' },
            { value: '1', label: '10-49' },
            { value: '2', label: '50-249' },
            { value: '3', label: '250+' },
          ]}
        />

      </div>

      <div className="col-sm-4 col-sm-offset-3 col-xs-2 end-lg end-md end-sm end-xs">

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
  onNumActionsChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  numResults: PropTypes.number.isRequired,
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  valState: PropTypes.arrayOf(PropTypes.any),
  valMuni: PropTypes.arrayOf(PropTypes.any),
  valMarg: PropTypes.arrayOf(PropTypes.any),
  valNumActions: PropTypes.arrayOf(PropTypes.any),
}

export default FilterHeader
