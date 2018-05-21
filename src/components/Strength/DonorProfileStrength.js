import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import '!style-loader!css-loader!react-circular-progressbar/dist/styles.css'

import service, { getBackoff } from 'api/service'
import ExpandableTask from './ExpandableTask'
import Styles from './Strength.css'


const barStyles = {
  trail: { stroke: '#CACCD5' },
  path: { stroke: '#3DC587' },
  text: { stroke: '#3DC587', fontSize: '1.7em' },
}

class DonorProfileStrength extends React.Component {
  componentDidMount() {
    getBackoff(service.donorGetProfileStrength, { key: 'donorProfileStrength' })
  }

  render() {
    const { profile } = this.props
    if (!profile) return null
    const {
      ratio,
      status_by_category: {
        contact_email: email,
        contact_full: contact,
        desc,
        donating,
        donations,
        discourse_post: post,
      },
    } = profile

    const tasks = [
      {
        value: email,
        label: 'Agregar email',
      },
      {
        value: desc,
        label: 'Completar descripción',
        videoId: 'dk8ixgfgD10',
        durationString: '0:47',
      },
      {
        value: contact,
        label: 'Agregar datos de contacto',
        videoId: 'C8lC_Ujyaj4',
        durationString: '1:04',
      },
      {
        value: donations,
        label: 'Documentar donativos',
        videoId: 'uvuFrvaaUVU',
        durationString: '1:29',
      },
      {
        value: donating,
        label: 'Abrir convocatoria',
        videoId: 'y6LJx6-J3xw',
        durationString: '0:50',
      },
      {
        value: post,
        label: 'Postear en el foro',
        videoId: '823KA-GAvl4',
        durationString: '0:51',
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
          <span className={Styles.strength}>FUERZA DE TU PERFIL</span>
        </div>
        <div className={Styles.middle}>
          {tasks.map((t, i) => <ExpandableTask key={i} {...t} />)}
        </div>
      </div>
    )
  }
}

DonorProfileStrength.propTypes = {
  profile: PropTypes.object,
}

const mapStateToProps = (state) => {
  try {
    return { profile: state.getter.donorProfileStrength.data }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(DonorProfileStrength)
