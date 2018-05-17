import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import MetricsBar from 'components/MetricsBar'
import service, { getBackoff } from 'api/service'
import Styles from './ProfileStrengthPublic.css'


class ProfileStrengthPublic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

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
      { value: email, label: 'agrega tu email' },
      { value: desc, label: 'completa la descripción de tu organización' },
      { value: contact, label: 'agrega el teléfono y la dirección de tu organización' },
      { value: actions, label: 'agrega un proyecto' },
      { value: submissions, label: 'agrega fotos a tus proyectos' },
      { value: donations, label: 'documenta los donativos que has recibido' },
      { value: help, label: 'agrega oportunidades de voluntariado' },
      { value: post, label: 'postea en el foro' },
    ]
    const task = tasks.find(t => t.value === false)

    return (
      <div className={`${Styles.container} wrapper animated slideInUp delay-800`}>
        <div className={Styles.barContainer}>
          <span className={Styles.strength}>
            La fuerza de tu perfil es del {Math.round(100 * ratio)}%.
          </span>
          {task && ratio < 1 &&
            <span className={Styles.nextTask}>Para incrementarla, {task.label}.</span>
          }
          <MetricsBar value={ratio} max={1} className={Styles.bar} />
        </div>
        <Link className={Styles.button} to="/cuenta">Editar tu perfil</Link>
      </div>
    )
  }
}

ProfileStrengthPublic.propTypes = {
  profile: PropTypes.object,
}

const mapStateToProps = (state) => {
  try {
    return { profile: state.getter.profileStrength.data }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(ProfileStrengthPublic)
