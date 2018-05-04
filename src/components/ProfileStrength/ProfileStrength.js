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
  path: { stroke: '#3DC59F' },
  text: { stroke: '#3DC59F', fontSize: '1.7em' },
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
        videoId: 'lxq938kqIss',
        durationString: '0:25',
      },
      {
        value: contact,
        label: 'Agregar datos de contacto',
        videoId: 'lxq938kqIss',
        durationString: '0:22',
      },
      {
        value: actions,
        label: 'Agregar un proyecto',
        videoId: 'lxq938kqIss',
        durationString: '1:25',
      },
      {
        value: submissions,
        label: 'Capturar fotos',
        videoId: 'lxq938kqIss',
        durationString: '1:45',
      },
      {
        value: donations,
        label: 'Documentar donativos',
        videoId: 'lxq938kqIss',
        durationString: '0:36',
      },
      {
        value: help,
        label: 'Atraer voluntarios',
        videoId: 'lxq938kqIss',
        durationString: '0:25',
      },
      {
        value: post,
        label: 'Postear en el foro',
        videoId: 'lxq938kqIss',
        durationString: '0:35',
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
