import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import FormStyles from 'src/Form.css'
import service, { getBackoff } from 'api/service'
import { getProjectType, volunteerLocationByValue } from 'src/choices'
import LocalityDamageMap from 'components/LocalityDamageMap'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Styles from './VolunteerOpportunityScreen.css'


class VolunteerOpportunityScreen extends React.Component {
  componentDidMount() {
    const { id } = this.props
    getBackoff(() => service.getOpportunity(id), { key: `opportunity_${id}` })
  }

  handleOpportunityClick = () => {
    const { opportunity } = this.props
    if (!opportunity) return
    const { position, action: { organization: { name } } } = opportunity
    this.props.modal('volunteerApplication', { id: this.props.id, modalWide: true, position, name })
  }

  handleClickFeature = (feature) => {
    this.props.history.push(`/comunidades/${feature.properties.id}`)
    this.props.closeModal()
  }

  renderMap = (locality) => {
    const { location: { lat, lng }, meta: { total }, id } = locality
    const features = [
      {
        type: 'Feature',
        properties: { id, total, locality },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    ]

    return (
      <div className={Styles.opsMap}>
        <LocalityDamageMap
          dragPan={window.innerWidth >= 980}
          zoomControl={false}
          features={features}
          onClickFeature={this.handleClickFeature}
          initialZoom={4}
        />
      </div>
    )
  }

  render() {
    const { opportunity, className } = this.props
    if (!opportunity) return <LoadingIndicatorCircle />
    const {
      position, desc, target, required_skills: skills, start_date: startDate, end_date: endDate,
      location_desc: place, location, food_included: food, transport_included: transport,
      action: {
        action_type: type, organization: { name: orgName }, locality: { name, state_name: stateName }, locality,
      },
    } = opportunity

    const detailedDesc = `${orgName} busca ${target} voluntari@${target !== 1 ? 's' : ''} para un proyecto de ${getProjectType(type)} en ${name}, ${stateName}.`
    const start = startDate ? moment(startDate).format('MMMM YYYY') : '?'
    const end = endDate ? moment(endDate).format('MMMM YYYY') : '?'

    const content = (
      <div className={Styles.container}>
        <div className={Styles.left}>
          <span className={Styles.position}>{position}</span>
          <span className={Styles.text}>{detailedDesc}</span>
          <span className={Styles.title}>Objetivos de voluntariado</span>
          <span className={Styles.text}>{desc}</span>
          <span className={Styles.title}>Habilidades requeridas</span>
          <ul className={Styles.list}>
            {skills.map((s, i) => <li className={Styles.item} key={i}>{s}</li>)}
          </ul>
          <RaisedButton
            backgroundColor="#3DC59F"
            labelColor="#ffffff"
            className={FormStyles.primaryButton}
            label="POSTULAR"
            onClick={this.handleOpportunityClick}
          />
        </div>

        <div className={Styles.rightTemp} />

        <div className={Styles.right}>
          <div>{location === 'other' ? place : volunteerLocationByValue[location]}</div>
          <div>{start} - {end}</div>
          <div>{transport ? 'Transporte incluido' : 'Transporte no incluido'}</div>
          <div>{food ? 'Comida incluida' : 'Comida no incluida'}</div>

          <p className={Styles.subtitle}>{`${name}, ${stateName}`}</p>
          {this.renderMap(locality)}
          <div className={`${Styles.mapMeta} row middle between`}>
            <div>
              <div>{locality.meta.total}</div>
              <div>VIVIENDAS DAÑADAS</div>
            </div>

            <div>
              <div>{locality.meta.margGrade}</div>
              <div>REZAGO SOCIAL</div>
            </div>
          </div>
        </div>
      </div>
    )
    if (className) return <div className={className}>{content}</div>
    return content
  }
}

VolunteerOpportunityScreen.propTypes = {
  id: PropTypes.number.isRequired,
  modal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  opportunity: PropTypes.object,
  className: PropTypes.string,
}

const mapStateToProps = (state, { id }) => {
  try {
    return { opportunity: state.getter[`opportunity_${id}`].data }
  } catch (e) {
    return {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VolunteerOpportunityScreen))
