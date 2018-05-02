import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import CircularProgressbar from 'react-circular-progressbar'
import '!style-loader!css-loader!react-circular-progressbar/dist/styles.css'

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

  render() {
    const { value, label, desc } = this.props
    const { open } = this.state
    const checkbox = (
      <Checkbox
        label={label}
        checked={value}
      />
    )
    if (!open) return <div onClick={this.toggleOpen}>{checkbox}</div>
    return (
      <div onClick={this.toggleOpen}>
        {checkbox}
        <div className={Styles.desc}>{desc}</div>
      </div>
    )
  }
}

ExpandableTask.propTypes = {
  value: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  open: PropTypes.bool,
  desc: PropTypes.string,
}

ExpandableTask.defaultProps = {
  open: false,
}

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
        desc: 'Agregar email',
      },
      {
        value: desc,
        label: 'Completar descripción',
        desc: 'Completar descripción',
      },
      {
        value: contact,
        label: 'Agregar datos de contacto',
        desc: 'Agregar datos de contacto',
      },
      {
        value: actions,
        label: 'Agregar un proyecto',
        desc: 'Agregar un proyecto',
      },
      {
        value: submissions,
        label: 'Capturar fotos',
        desc: 'Capturar fotos',
      },
      {
        value: donations,
        label: 'Documentar donativos',
        desc: 'Documentar donativos',
      },
      {
        value: help,
        label: 'Atraer voluntarios',
        desc: 'Atraer voluntarios',
      },
      {
        value: post,
        label: 'Postear en el foro',
        desc: 'Postear en el foro',
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
          Perfiles al 100% tienen 4 veces la probabilidad de atraer voluntarios o donativos.
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
