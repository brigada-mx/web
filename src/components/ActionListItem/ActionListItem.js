/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

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
        </div>
      )
    }

    const organizationLink = () => {
      return (
        <Link className={Styles.link} onClick={e => e.stopPropagation()} to={{ pathname: `/organizaciones/${orgId}` }}>
          {orgName}
        </Link>
      )
    }

    const localityLink = () => {
      return (
        <Link className={Styles.link} onClick={e => e.stopPropagation()} to={{ pathname: `/comunidades/${locId}` }}>
          {stateName}, {muniName}, {locName}
        </Link>
      )
    }

    const thumbnails = () => {
      const thumbs = [].concat(...action.submissions.map(s => s.thumbnails_small))
      const l = thumbs.length
      if (l === 0) return <div className={Styles.emptyThumbnail} />

      const count = l > 1 ? (
        <div
          className={Styles.thumbnailCount}
          style={{ backgroundImage: `url(${thumbs[1]})` }}
        >
          <span className={Styles.thumbnailCountOverlay}>+{l - 1}</span>
        </div>) : null
      return (
        <div
          className={Styles.thumbnail}
          style={{ backgroundImage: `url(${thumbs[0]})` }}
        >
          {count}
        </div>
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
        <div className={Styles.summaryContainer}>
          <div className={Styles.textContainer}>
            {screen === 'loc' && organizationLink()}
            {screen === 'org' && localityLink()}
            <div className={Styles.header}>{`Construcción de ${actionType.toLowerCase()}`}</div>
            <div className={Styles.fieldsContainer}>
              <div className={Styles.budgetContainer}>
                <span className={Styles.label}>PRESUPUESTO: </span>
                <span className={Styles.value}>{budget ? `$${fmtNum(budget)}` : 'No disponible'}</span>
              </div>
              {metrics()}
            </div>
          </div>
          <div className={Styles.thumbnailContainer}>
            {thumbnails()}
          </div>
        </div>
        {(desc && focused) &&
          <React.Fragment>
            <div className={Styles.description}>{desc}</div>
            {dates()}
          </React.Fragment>
        }
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
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default ActionListItem
