import React from 'react'
import PropTypes from 'prop-types'

import Styles from './SearchInput.css'


const SearchInput = ({ onKeyUp, numResults }) => {
  return (
    <div className="wrapper">
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
  )
}

SearchInput.propTypes = {
  numResults: PropTypes.number.isRequired,
  onKeyUp: PropTypes.func.isRequired,
}

export default SearchInput
