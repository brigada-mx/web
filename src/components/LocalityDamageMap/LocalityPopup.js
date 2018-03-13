import React from 'react'
import PropTypes from 'prop-types'

import { Popup } from 'react-mapbox-gl'

import { fmtNum, fmtBudget } from 'tools/string'
import Styles from './LocalityPopup.css'


const LocalityPopup = ({ locality, organization, screen }) => {
  if (!locality) return null
  const { state_name: stateName, name, location: { lat, lng } } = locality
  const { habit, notHabit, destroyed, total, margGrade } = locality.meta

  if (screen === 'loc') {
    return (
      <Popup coordinates={[lng, lat]}>
        <span className={Styles.header}>
          <span className={Styles.loc}>{name},</span><span className={Styles.state}>{'\u00A0'}{stateName}</span>
        </span>
        <div className={Styles.item}>
          <span className={Styles.label}>Viviendas dañadas</span>
          <span className={Styles.value}>{fmtNum(total)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Daño Parcial</span>
          <span className={Styles.value}>{fmtNum(habit)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Reubicación</span>
          <span className={Styles.value}>{fmtNum(notHabit)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Pérdida total</span>
          <span className={Styles.value}>{fmtNum(destroyed)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Rezago social</span>
          <span className={Styles.value}>{fmtNum(margGrade)}</span>
        </div>
      </Popup>
    )
  }

  if (screen === 'org') {
    if (!organization) {
      return (
        <Popup coordinates={[lng, lat]}>
          <span className={Styles.header}>{name}, {stateName}</span>
          <div className={Styles.item}>
            <span className={Styles.label}>Viviendas dañadas</span>
            <span className={Styles.value}>{fmtNum(total)}</span>
          </div>
          <div className={Styles.item}>
            <span className={Styles.label}>Rezago social</span>
            <span className={Styles.value}>{fmtNum(margGrade)}</span>
          </div>
        </Popup>
      )
    }

    const actions = organization.actions.filter(a => locality.cvegeo === a.locality.cvegeo)
    return (
      <Popup coordinates={[lng, lat]}>
        <span className={Styles.header}>{name}, {stateName}</span>
        <div className={Styles.item}>
          <span className={Styles.label}>Viviendas dañadas</span>
          <span className={Styles.value}>{fmtNum(total)}</span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Rezago social</span>
          <span className={Styles.value}>{fmtNum(margGrade)}</span>
        </div>

        <span className={Styles.header}>{organization.name}</span>
        <div className={Styles.item}>
          <span className={Styles.label}>Inversión estimada</span>
          <span className={Styles.value}>
            {fmtBudget(actions.reduce((sum, action) => sum + (action.budget || 0), 0))}
          </span>
        </div>
        <div className={Styles.item}>
          <span className={Styles.label}>Proyectos registrados</span>
          <span className={Styles.value}>{actions.length}</span>
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
