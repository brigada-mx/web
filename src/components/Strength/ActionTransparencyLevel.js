import React from 'react'
import PropTypes from 'prop-types'

import { transparencyLabelByLevel } from 'tools/string'
import Styles from './StrengthPublic.css'


const ActionTransparencyLevel = ({ strength }) => {
  const { level } = strength
  const transparencyStyles = [
    Styles.lowTransparency, Styles.midTransparency, Styles.highTransparency, Styles.veryHighTransparency,
  ]
  return (
    <React.Fragment>
      <span className={transparencyStyles[level]} />
      <span>{`PROYECTO ${transparencyLabelByLevel(level)}`.toUpperCase()}</span>
    </React.Fragment>
  )
}

ActionTransparencyLevel.propTypes = {
  strength: PropTypes.object.isRequired,
}

export default ActionTransparencyLevel
