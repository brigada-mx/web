/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import _ from 'lodash'

import { fmtNum, thumborUrl } from 'tools/string'
import MetricsBar from 'components/MetricsBar'
import { getProjectType } from 'src/choices'
import Styles from './ActionListItem.css'


class ActionListItem extends React.PureComponent {
  render() {
    const { action, screen, focused, onClick, onMouseEnter, onMouseLeave, onClickItem } = this.props
    const {
      action_type: actionType,
      desc,
      target,
      progress = 0,
      budget,
      donations,
      start_date: startDate,
      end_date: endDate,
      organization: { id: orgId, name: orgName },
      locality: { id: locId, name: locName, municipality_name: muniName, state_name: stateName },
      unit_of_measurement: unit,
    } = action

    const getDonors = () => {
      if (donations.length === 0) return null

      const amountByDonor = {}
      for (const d of donations) {
        const { amount = 0, donor: { name } } = d
        if (name in amountByDonor) amountByDonor[name] += amount
        else amountByDonor[name] = amount
      }
      const donors = _.sortBy(Object.keys(amountByDonor).map((donor) => {
        return { donor, amount: amountByDonor[donor] }
      }), d => -d.amount)
      return (
        <React.Fragment>
          <span className={`${Styles.link} ${Styles.donorsDivider} `}>/</span>
          <span className={`${Styles.link} ${Styles.donors}`}>Financiado por {donors.map(d => d.donor).join(', ')}</span>
        </React.Fragment>
      )
    }

    const metrics = () => {
      if (!target) return null
      return (
        <div className={Styles.goalProgress}>
          <span className={Styles.label}>{fmtNum(progress)} DE {fmtNum(target)} {unit && <span>{unit}</span>}</span>
          <span className={Styles.bar}><MetricsBar value={progress} max={target} /></span>
        </div>
      )
    }

    const dates = () => {
      return (
        <div>
          <span className={Styles.label}>FECHAS: </span>
          <span className={Styles.dates}>
            {(startDate || '?').replace(/-/g, '.')} - {(endDate || '?').replace(/-/g, '.')}
          </span>
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
          {locName}, {muniName}, {stateName}
        </Link>
      )
    }

    const handleClick = onClick && (() => { onClick(action) })
    const handleMouseEnter = onMouseEnter && (() => { onMouseEnter(action) })
    const handleMouseLeave = onMouseLeave && (() => { onMouseLeave(action) })
    const handleClickItem = onClickItem && (() => { onClickItem(action) })

    const renderThumbnails = () => {
      const images = [].concat(...action.submissions.map(s => s.image_urls))
      const l = images.length
      if (l === 0) return <div className={Styles.emptyThumbnail} />

      const count = l > 1 ? (
        <div
          className={Styles.thumbnailCount}
          style={{ backgroundImage: `url(${thumborUrl(images[1], 240, 240, true)})` }}
        >
          <span className={Styles.thumbnailCountOverlay}>+{l - 1}</span>
        </div>) : null
      return (
        <div onClick={handleClick} className={Styles.thumbnailContainer}>
          <div
            className={`${Styles.thumbnail} xs-hidden`}
            style={{ backgroundImage: `url(${thumborUrl(images[0], 240, 240, true)})` }}
          >
            {count}
          </div>
          <div
            className={`${Styles.thumbnail} lg-hidden md-hidden sm-hidden`}
            style={{ backgroundImage: `url(${thumborUrl(images[0], 1280, 240, true)})` }}
          >
            {count}
          </div>
        </div>
      )
    }

    const classNames = [Styles.listItem]
    if (focused) classNames.push(Styles.listItemFocused)

    return (
      <div
        className={classNames.join(' ')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClickItem}
      >
        <div className={Styles.summaryContainer}>
          <div className={Styles.textContainer}>
            <div className={Styles.row}>
              {screen === 'loc' && organizationLink()}
              {screen === 'org' && localityLink()}
              {getDonors()}
            </div>
            <div className={Styles.header}>{getProjectType(actionType)}</div>
            <div className={Styles.fieldsContainer}>
              <div className={Styles.budgetContainer}>
                <span className={Styles.label}>PRESUPUESTO: </span>
                <span className={Styles.value}>{budget ? `$${fmtNum(budget)}` : 'No disponible'}</span>
              </div>
              {metrics()}
            </div>
          </div>

          {renderThumbnails()}
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
  onClickItem: PropTypes.func,
}

ActionListItem.defaultProps = {
  focused: false,
}

export default ActionListItem
