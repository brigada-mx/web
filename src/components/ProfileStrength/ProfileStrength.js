import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import CircularProgressbar from 'react-circular-progressbar'
import '!style-loader!css-loader!react-circular-progressbar/dist/styles.css'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import Styles from './ProfileStrength.css'


class ExpandableTask extends React.Component {
  state = { open: this.props.open }

  static getDerivedStateFromProps({ open }, { open: _open } = {}) {
    if (open !== undefined && open !== _open) return { open }
    return null
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  openVideoModal = () => {
    this.props.modal('youTubeVideo', { modalTransparent: true, videoId: this.props.videoId })
  }

  render() {
    const { value, label, videoId, durationString } = this.props
    const { open } = this.state
    const checkbox = (
      <div onClick={this.toggleOpen}>
        <Checkbox
          label={label}
          checked={value}
        />
      </div>
    )
    if (!open || !videoId) return checkbox
    return (
      <React.Fragment>
        {checkbox}
        <div className={Styles.tutorial} onClick={this.openVideoModal}>
          <div className={Styles.tutorialIcon} />
          <span className={Styles.tutorialMeta}>Tutorial {durationString ? `(${durationString})` : ''}</span>
        </div>
      </React.Fragment>
    )
  }
}

ExpandableTask.propTypes = {
  value: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  open: PropTypes.bool,
  videoId: PropTypes.string,
  durationString: PropTypes.string,
  modal: PropTypes.func.isRequired,
}

ExpandableTask.defaultProps = {
  open: false,
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

const ReduxExpandableTask = connect(null, mapDispatchToProps)(ExpandableTask)

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
        videoId: 'lxq938kqIss',
        durationString: '0:36',
      },
      {
        value: desc,
        label: 'Completar descripción',
        videoId: 'lxq938kqIss',
        durationString: '0:36',
      },
      {
        value: contact,
        label: 'Agregar datos de contacto',
        videoId: 'lxq938kqIss',
        durationString: '0:36',
      },
      {
        value: actions,
        label: 'Agregar un proyecto',
        videoId: 'lxq938kqIss',
        durationString: '0:36',
      },
      {
        value: submissions,
        label: 'Capturar fotos',
        videoId: 'lxq938kqIss',
        durationString: '0:36',
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
        durationString: '0:36',
      },
      {
        value: post,
        label: 'Postear en el foro',
        videoId: 'lxq938kqIss',
        durationString: '0:36',
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
          {tasks.map((t, i) => <ReduxExpandableTask key={i} {...t} />)}
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
