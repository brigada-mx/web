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

    const tasks = [email, desc, contact, actions, submissions, donations, help, post]
    const commands = [
      'agrega tu email',
      'completa la descripción de tu organización',
      'agrega el teléfono y la dirección de tu organización',
      'agrega un proyecto',
      'agrega fotos a tus proyectos',
      'documenta los donativos que has recibido',
      'agrega oportunidades de voluntariado',
      'postea en el foro',
    ]
    let index
    for (let i = 0; i < tasks.length; i += 1) {
      if (!tasks[i]) {
        index = i
        break
      }
    }

    return (
      <div className={`${Styles.container} wrapper animated slideInUp delay-800`}>
        <div className={Styles.barContainer}>
          <span className={Styles.strength}>
            La fuerza de tu perfil es del {Math.round(100 * ratio)}%.
          </span>
          {index !== undefined &&
            <span className={Styles.nextTask}>Para incrementarla, {commands[index]}.</span>
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
