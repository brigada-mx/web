import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import MetricsBar from 'components/MetricsBar'
import service, { getBackoff } from 'api/service'
import Styles from './ProfileStrengthPublic.css'


class DonorProfileStrengthPublic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

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
        desc,
        contact_full: contact,
        donations,
        donating,
        discourse_post: post,
      },
    } = profile

    const tasks = [
      { value: email, label: 'agrega tu email' },
      { value: desc, label: 'completa la descripción de tu organización' },
      { value: contact, label: 'agrega el teléfono y la dirección de tu organización' },
      { value: donations, label: 'documenta los donativos que has dado' },
      { value: donating, label: 'agrega información de convocatoria abierta' },
      { value: post, label: 'postea en el foro' },
    ]
    const task = tasks.find(t => t.value === false)

    return (
      <div className={`${Styles.container} wrapper animated slideInUp delay-800`}>
        <div className={Styles.barContainer}>
          <span className={Styles.strength}>
            La fuerza de tu perfil es del {Math.round(100 * ratio)}%.
          </span>
          {task &&
            <span className={Styles.nextTask}>Para incrementarla, {task.label}.</span>
          }
          <MetricsBar value={ratio} max={1} className={Styles.bar} />
        </div>
        <Link className={Styles.button} to="/donador">Editar tu perfil</Link>
      </div>
    )
  }
}

DonorProfileStrengthPublic.propTypes = {
  profile: PropTypes.object,
}

const mapStateToProps = (state) => {
  try {
    return { profile: state.getter.donorProfileStrength.data }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(DonorProfileStrengthPublic)
