import React from 'react'
import PropTypes from 'prop-types'

import { fmtBudget, truncate } from 'tools/string'
import Styles from './OrganizationListItem.css'


class OrganizationListItem extends React.PureComponent {
  render() {
    const { organization, onClick, focused, onMouseEnter, onMouseLeave } = this.props
    const { name, actions, desc } = organization
    let budget = 0
    const countByTags = {}
    for (const action of actions) {
      if (!action.action_type) continue
      if (!countByTags[action.action_type]) {
        countByTags[action.action_type] = 1
      } else {
        countByTags[action.action_type] += 1
      }
      if (action.budget) budget += action.budget
    }
    const count = Object.keys(countByTags).map((k) => {
      return { tag: k, count: countByTags[k] }
    }).sort((a, b) => a.count - b.count)

    const handleClick = () => { onClick(organization) }
    const handleMouseEnter = () => { onMouseEnter(organization) }
    const handleMouseLeave = () => { onMouseLeave(organization) }

    let className = Styles.orgCard
    if (focused) className = `${Styles.orgCard} ${Styles.orgCardFocused}`

    return (
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        <div className={Styles.descriptionContainer}>
          <span className={Styles.name}>{name}</span>
          <div className={`${Styles.tagContainer} lg-hidden md-hidden`}>
            {count.slice(0, 3).map((t, i) => <span key={i} className={Styles.tag}>{t.tag}</span>)}
          </div>
          <span className={Styles.desc}>{truncate(desc, 154)}</span>
        </div>
        <div className={Styles.metricsContainer}>
          <div className={budget > 0 ? Styles.metric : Styles.emptyMetric}>
            <span className={Styles.label}>Inversión<br />estimada</span>
            <span className={Styles.value}>{fmtBudget(budget)}</span>
          </div>
          <div className={Styles.metric}>
            <span className={Styles.label}>Proyectos<br />registrados</span>
            <span className={Styles.value}>{actions.length}</span>
          </div>
          <div className={Styles.metric}>
            <span className={Styles.label}>Fotos<br />capturadas</span>
            <span className={Styles.value}>0</span>
          </div>
        </div>
      </div>
    )
  }
}

OrganizationListItem.propTypes = {
  organization: PropTypes.object.isRequired,
  focused: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

OrganizationListItem.defaultProps = {
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default OrganizationListItem
