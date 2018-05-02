import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import '!style-loader!css-loader!react-circular-progressbar/dist/styles.css'

import service, { getBackoff } from 'api/service'
import Styles from './ProfileStrength.css'


const barStyles = {
  trail: { stroke: '#CACCD5' },
  path: { stroke: '#3DC587' },
  text: { stroke: '#3DC587', fontSize: '1.7em' },
}

class ProfileStrength extends React.Component {
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
