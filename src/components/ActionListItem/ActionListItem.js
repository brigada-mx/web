/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { projectStatus, labelByProjectStatus } from 'tools/other'
import { Link } from 'react-router-dom'

import { fmtNum } from 'tools/string'
import MetricsBar from 'components/MetricsBar'
import Styles from './ActionListItem.css'


class ActionListItem extends React.PureComponent {
  render() {
    const { action, screen, focused, onClick, onMouseEnter, onMouseLeave } = this.props
    const {
      action_type: actionType,
      desc,
      unit_of_measurement: unit,
      target,
      progress = 0,
      budget,
      start_date: startDate = '?',
      end_date: endDate = '?',
      organization: { id: orgId, name: orgName },
      locality: { id: locId, name: locName, municipality_name: muniName, state_name: stateName },
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
          <span className={Styles.dates}>{startDate.replace(/-/g, '.')} - {endDate.replace(/-/g, '.')} </span>
          <span className={Styles.label}>
            ({labelByProjectStatus(projectStatus(startDate, endDate))})
          </span>
        </div>
      )
    }

    const organizationLink = () => {
      return (
        <Link to={{ pathname: `/organizaciones/${orgId}` }}>
          <span className={Styles.label}>{orgName}</span>
        </Link>
      )
    }

    const localityLink = () => {
      return (
        <Link to={{ pathname: `/comunidades/${locId}` }}>
          <span className={Styles.label}>COMUNIDAD: </span>
          <span className={Styles.dates}>{stateName}, {muniName}, {locName}</span>
        </Link>
      )
    }

    const handleClick = () => { onClick(action) }
    const handleMouseEnter = () => { onMouseEnter(action) }
    const handleMouseLeave = () => { onMouseLeave(action) }

    let className = Styles.listItem
    if (focused) className = `${Styles.listItem} ${Styles.listItemFocused}`

    return (
      <div
        onClick={handleClick}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={Styles.header}>{`Construcción de ${actionType.toLowerCase()}`}</div>
        {screen === 'loc' && organizationLink()}
        <div className={Styles.summaryContainer}>
          {budget &&
            <div>
              <span className={Styles.label}>PRESUPUESTO: </span>
              <span className={Styles.value}>${fmtNum(budget)}</span>
            </div>}
          {metrics()}
        </div>
        {(desc && focused) && <div className={Styles.description}>{desc}</div>}
        {screen === 'org' && localityLink()}
        {dates()}
      </div>
    )
  }
}

ActionListItem.propTypes = {
  action: PropTypes.object.isRequired,
  screen: PropTypes.oneOf(['org', 'loc']).isRequired,
  focused: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

ActionListItem.defaultProps = {
  focused: false,
}

export default ActionListItem
