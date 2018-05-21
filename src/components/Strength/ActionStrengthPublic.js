import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import MetricsBar from 'components/MetricsBar'
import service, { getBackoff } from 'api/service'
import Styles from './StrengthPublic.css'


class ActionStrengthPublic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const { actionId } = this.props
    getBackoff(() => { return service.accountGetActionStrength(actionId) }, { key: `actionStrength_${actionId}` })
  }

  render() {
    const { strength, actionKey } = this.props
    if (!strength) return null
    const {
      ratio,
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

    const tasks = [
      { value: desc, label: 'completa la descripción del proyecto' },
      { value: dates, label: 'agrega fechas de principio y fin del proyecto' },
      { value: progress, label: 'agrega la unidad de medida, la meta y el avance' },
      { value: budget, label: 'agrega el presupuesto de este proyecto' },
      { value: images, label: 'agrega fotos o videos a este proyecto' },
      { value: donations, label: 'agrega un donativo' },
      { value: verifiedDonations, label: 'agrega un donativo verificado' },
    ]
    const task = tasks.find(t => !t.value)

    return (
      <div className={`${Styles.container} wrapper animated slideInUp delay-800`}>
        <div className={Styles.barContainer}>
          <span className={Styles.profile}>
            El score de transparencia de este proyecto es del {Math.round(100 * ratio)}%.
          </span>
          {task && ratio < 1 &&
            <span className={Styles.nextTask}>Para incrementarlo, {task.label}.</span>
          }
          <MetricsBar value={ratio} max={1} className={Styles.bar} />
        </div>
        <Link className={Styles.button} to={`/cuenta/proyectos/${actionKey}`}>Editar este proyecto</Link>
      </div>
    )
  }
}

ActionStrengthPublic.propTypes = {
  actionId: PropTypes.number.isRequired,
  actionKey: PropTypes.number.isRequired,
  strength: PropTypes.object,
}

const mapStateToProps = (state, { actionId }) => {
  try {
    return { strength: state.getter[`actionStrength_${actionId}`].data }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(ActionStrengthPublic)
