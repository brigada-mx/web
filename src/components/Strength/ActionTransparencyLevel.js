import React from 'react'
import PropTypes from 'prop-types'

import Styles from './StrengthPublic.css'


export const transparencyLevel = (strength) => { // in response from `accountGetActionStrength`
  const {
    status_by_category: {
      desc,
      dates,
      progress,
      budget,
      image_count: images,
      donations,
      verified_donations: verifiedDonations,
    },
  } = strength
  if (!desc || !progress || !budget) return { label: 'poco transparente', level: 0 }

  const score = images * (
    (dates ? 1 : 0) +
    (progress ? 1 : 0) +
    (budget ? 1 : 0) +
    (donations > 0 ? 1 : 0) +
    (verifiedDonations > 0 ? 1 : 0)
  )
  if (score < 30) return { label: 'semi-transparente', level: 1 }
  return { label: 'transparente', level: 2 }
}

const ActionTransparencyLevel = ({ strength }) => {
  const { level: transLevel, label: transLabel } = transparencyLevel(strength)
  const transparencyStyles = [Styles.lowTransparency, Styles.midTransparency, Styles.highTransparency]
  return (
    <React.Fragment>
      <span className={transparencyStyles[transLevel]} />
      {strength && <span>{`PROYECTO ${transLabel}`.toUpperCase()}</span>}
    </React.Fragment>
  )
}

ActionTransparencyLevel.propTypes = {
  strength: PropTypes.object.isRequired,
}

export default ActionTransparencyLevel
