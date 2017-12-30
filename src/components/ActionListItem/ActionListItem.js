/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import MetricsBar from 'components/MetricsBar'
import Styles from './ActionListItem.css'


const ActionListItem = ({ action }) => {
  const {
    action_type: type,
    desc,
    unit_of_measurement: unit,
    target,
    progress = 0,
    budget,
    start_date: startDate = '?',
    end_date: endDate = '?',
    organization: { name, key },
  } = action

  const metrics = () => {
    if (!target) return null
    return (
      <div>
        <span className={Styles.light}>{progress} DE {target}</span>
        <MetricsBar value={progress} max={target} />
      </div>
    )
  }

  const dates = () => {
    return <span>FECHAS: {startDate.replace(/-/g, '.')} - {endDate.replace(/-/g, '.')}</span>
  }

  return (
    <div className={Styles.listItem}>
      <div className={Styles.orgName}>{name || key}</div>
      <div className={Styles.header}>{`Construcción de ${type.toLowerCase()}`}</div>
      {budget && <div>PRESUPUESTO: ${fmtNum(budget)}</div>}
      {metrics()}
      {desc && <div className={Styles.desc}>{desc}</div>}
      {dates()}
    </div>
  )
}

ActionListItem.propTypes = {
  action: PropTypes.object.isRequired,
}

export default ActionListItem

