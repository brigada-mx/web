import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import '!style-loader!css-loader!react-circular-progressbar/dist/styles.css'

import service, { getBackoff } from 'api/service'
import ExpandableTask from './ExpandableTask'
import ActionTransparencyLevel from './ActionTransparencyLevel'
import Styles from './Strength.css'


const barStyles = {
  trail: { stroke: '#CACCD5' },
  path: { stroke: '#3DC59F' },
  text: { stroke: '#3DC59F', fontSize: '1.7em' },
}

class ActionStrength extends React.Component {
  componentDidMount() {
    const { actionId } = this.props
    getBackoff(() => { return service.accountGetActionStrength(actionId) }, { key: `actionStrength_${actionId}` })
  }

  render() {
    const { strength } = this.props
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
      {
        value: desc,
        label: 'Completar descripción',
      },
      {
        value: dates,
        label: 'Agregar fechas',
      },
      {
        value: progress,
        label: 'Agregar unidades de medida',
      },
      {
        value: budget,
        label: 'Agregar presupuesto',
      },
      {
        value: images > 0,
        label: 'Agregar fotos',
      },
      {
        value: donations > 0,
        label: 'Agregar donativo',
      },
      {
        value: verifiedDonations > 0,
        label: 'Agregar donativo verificado',
      },
    ]
    for (const task of tasks) {
      if (!task.value) {
        task.open = true
        break
      }
    }

    return (
      <div className={Styles.container}>
        <div className={Styles.top}>
          <div className={Styles.barContainer}>
            <CircularProgressbar
              percentage={Math.round(100 * ratio)}
              strokeWidth={4}
              initialAnimation
              styles={barStyles}
            />
          </div>
          {strength && <span className={Styles.strength}><ActionTransparencyLevel strength={strength} /></span>}
        </div>
        <div className={Styles.middle}>
          {tasks.map((t, i) => <ExpandableTask key={i} {...t} />)}
        </div>
      </div>
    )
  }
}

ActionStrength.propTypes = {
  actionId: PropTypes.number.isRequired,
  strength: PropTypes.object,
}

const mapStateToProps = (state, { actionId }) => {
  try {
    return { strength: state.getter[`actionStrength_${actionId}`].data }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(ActionStrength)
