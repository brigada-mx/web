import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Legend.css'


const style = { opacity: 0.80, width: 'unset' }
const color = { backgroundColor: '#3DC59F' }

const TextLegend = ({ text }) => {
  return (
    <div className={Styles.container} style={style}>
      <div className={Styles.legendItem}>
        <div>
          <span className={Styles.circle} style={color} />
          <span className={Styles.label}>{text}</span>
        </div>
      </div>
    </div>
  )
}

TextLegend.propTypes = {
  text: PropTypes.string.isRequired,
}

export default TextLegend
