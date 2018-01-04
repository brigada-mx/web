/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import MetricsBar from 'components/MetricsBar'
import Styles from './ActionListItem.css'


const ActionListItem = ({ action, screen }) => {
  const {
    action_type: actionType,
    desc,
    unit_of_measurement: unit,
    target,
    progress = 0,
    budget,
    start_date: startDate = '?',
    end_date: endDate = '?',
    organization: { name, key },
    locality: { name: locName, state_name: stateName },
  } = action

  const metrics = () => {
    if (!target) return null
    return (
      <div className={Styles.goalProgress}>
        <span className={Styles.label}>{fmtNum(progress)} DE {fmtNum(target)}</span>
        <span className={Styles.bar}><MetricsBar value={progress} max={target} /></span>
      </div>
    )
  }

  const dates = () => {
    return (
      <div>
        <span className={Styles.label}>FECHAS: </span>
        <span className={Styles.dates}>{startDate.replace(/-/g, '.')} - {endDate.replace(/-/g, '.')}</span>
      </div>
    )
  }

  return (
    <div className={Styles.listItem}>
      {screen === 'loc' && <div className={Styles.orgName}>{name || key}</div>}
      <div className={Styles.header}>{`Construcción de ${actionType.toLowerCase()}`}</div>
      <div className={Styles.summaryContainer}>
        {screen === 'org' && <div className={Styles.locName}>{locName}, {stateName}</div>}
        {budget &&
          <div>
            <span className={Styles.label}>PRESUPUESTO: </span>
            <span className={Styles.budget}>${fmtNum(budget)}</span>
          </div>}
        {metrics()}
      </div>
      {desc && <div className={Styles.description}>{desc}</div>}
      {dates()}
    </div>
  )
}

ActionListItem.propTypes = {
  action: PropTypes.object.isRequired,
  screen: PropTypes.oneOf(['org', 'loc']).isRequired,
}

export default ActionListItem

