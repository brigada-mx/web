import React from 'react'
import PropTypes from 'prop-types'

import { Popup } from 'react-mapbox-gl'

import { fmtNum } from 'tools/string'
import Styles from './LocalityPopup.css'


const LocalityPopup = ({ locality, organization, screen }) => {
  if (!locality) return null
  const { state_name: stateName, name, location: { lat, lng } } = locality
  const { habit, notHabit, destroyed, total, margGrade } = locality.meta

  if (screen === 'loc') {
    return (
      <Popup coordinates={[lng, lat]}>
        <span className={Styles.header}>{name}, {stateName}</span>
        <div className={Styles.item}>
          <span className={Styles.label}>Viviendas dañadas</span>
          <span className={Styles.value}>{fmtNum(total)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Habitables</span>
          <span className={Styles.value}>{fmtNum(habit)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>No habitables</span>
          <span className={Styles.value}>{fmtNum(notHabit)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Pérdida total</span>
          <span className={Styles.value}>{fmtNum(destroyed)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Marginación social</span>
          <span className={Styles.value}>{fmtNum(margGrade)}</span>
        </div>
      </Popup>
    )
  }

  if (screen === 'org') {
    return (
      <Popup coordinates={[lng, lat]}>
        <span className={Styles.header}>{name}, {stateName}</span>
        <div className={Styles.item}>
          <span className={Styles.label}>Marginación social</span>
          <span className={Styles.value}>{fmtNum(margGrade)}</span>
        </div>
      </Popup>
    )
  }
  return null
}

LocalityPopup.propTypes = {
  locality: PropTypes.object,
  organization: PropTypes.object,
  screen: PropTypes.oneOf(['org', 'loc']).isRequired,
}

export default LocalityPopup
