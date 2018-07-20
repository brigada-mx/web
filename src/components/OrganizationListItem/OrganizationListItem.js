import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import { fmtBudget, truncate } from 'tools/string'
import { getProjectType } from 'src/choices'
import Icon from 'components/Icon'
import Styles from './OrganizationListItem.css'


class OrganizationListItem extends React.PureComponent {
  render() {
    const { organization, onClick, focused, onMouseEnter, onMouseLeave, to = '' } = this.props
    const { name, actions, desc, image_count: numImages } = organization
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

    const transparent = actions.length > 0 && actions.every(a => a.level >= 3)

    const handleClick = onClick && (() => { onClick(organization) })
    const handleMouseEnter = onMouseEnter && (() => { onMouseEnter(organization) })
    const handleMouseLeave = onMouseLeave && (() => { onMouseLeave(organization) })

    let className = Styles.orgCard
    if (focused) className = `${Styles.orgCard} ${Styles.orgCardFocused}`

    return (
      <Link
        to={to}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
        style={{ textDecoration: 'none' }}
      >
        <div className={Styles.descriptionContainer}>
          <div className={Styles.nameContainer}>
            <span className={Styles.name}>{name}</span>
            {transparent &&
              <Icon
                src="/assets/img/circle-checkmark-accent.svg"
                alt="Organización transparente"
                height={25}
                ttText="Todos los proyectos de esta organización cumplen con criterios mínimos de transparencia establecidos en conjunto con Alternativas y Capacidades A.C."
                ttTop={-83}
                ttWidth={360}
                ttLeft={-170}
                className={Styles.checkmark}
              />
            }
          </div>

          <div className={`${Styles.tagContainer} lg-hidden md-hidden`}>
            {count.slice(0, 3).map((t, i) => <span key={i} className={Styles.tag}>{getProjectType(t.tag)}</span>)}
          </div>
          <span className={Styles.desc}>{truncate(desc, 154)}</span>
        </div>
        <div className={Styles.metricsContainer}>
          <div className={budget > 0 ? Styles.metric : Styles.emptyMetric}>
            <span className={Styles.label}>Inversión<br />comprometida</span>
            <span className={Styles.value}>{fmtBudget(budget)}</span>
          </div>
          <div className={Styles.metric}>
            <span className={Styles.label}>Proyectos<br />registrados</span>
            <span className={Styles.value}>{actions.length}</span>
          </div>
          <div className={Styles.metric}>
            <span className={Styles.label}>Fotos<br />capturadas</span>
            <span className={Styles.value}>{numImages}</span>
          </div>
        </div>
      </Link>
    )
  }
}

OrganizationListItem.propTypes = {
  organization: PropTypes.object.isRequired,
  to: PropTypes.string,
  focused: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

export default OrganizationListItem
