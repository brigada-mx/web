import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import '!style-loader!css-loader!react-circular-progressbar/dist/styles.css'

import service, { getBackoff } from 'api/service'
import ExpandableTask from './ExpandableTask'
import Styles from './ProfileStrength.css'


const barStyles = {
  trail: { stroke: '#CACCD5' },
  path: { stroke: '#3DC587' },
  text: { stroke: '#3DC587', fontSize: '1.7em' },
}

class ProfileStrength extends React.Component {
  componentDidMount() {
    getBackoff(service.accountGetProfileStrength, { key: 'profileStrength' })
  }

  render() {
    const { profile } = this.props
    if (!profile) return null
    const {
      ratio,
      status_by_category: {
        accepting_help: help,
        actions,
        contact_email: email,
        contact_full: contact,
        desc,
        discourse_post: post,
        donations,
        submissions,
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
        videoId: 'SXGlY1LuFAY',
        durationString: '0:51',
      },
      {
        value: contact,
        label: 'Agregar datos de contacto',
        videoId: 'C8lC_Ujyaj4',
        durationString: '1:04',
      },
      {
        value: actions,
        label: 'Agregar un proyecto',
        videoId: 'o2qCc9P4KT0',
        durationString: '2:04',
      },
      {
        value: submissions,
        label: 'Capturar fotos',
        videoId: 'wzRyByw2t9c',
        durationString: '3:00',
      },
      {
        value: donations,
        label: 'Documentar donativos',
        videoId: 'oJ-W0o7Y-lo',
        durationString: '1:47',
      },
      {
        value: help,
        label: 'Atraer voluntarios',
        videoId: 'SUi0vUFee1Y',
        durationString: '0:58',
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
        <div className={Styles.bottom}>
          Perfiles al 100% tienen 6 veces la probabilidad de atraer voluntarios o donativos.
        </div>
      </div>
    )
  }
}

ProfileStrength.propTypes = {
  profile: PropTypes.object,
}

const mapStateToProps = (state) => {
  try {
    return { profile: state.getter.profileStrength.data }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(ProfileStrength)
