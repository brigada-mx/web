import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { getProjectType, volunteerLocationByValue } from 'src/choices'
import LocalityDamageMap from 'components/LocalityDamageMap'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import OrganizationBreadcrumb from 'screens/OrganizationScreen/OrganizationBreadcrumb'
import FormStyles from 'src/Form.css'
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
        id: actionId,
        action_type: type,
        organization: { sector, name: orgName, id: organizationId },
        locality: { name, state_name: stateName },
        locality,
      },
    } = opportunity

    const detailedDesc = `${orgName} busca ${target} voluntari@${target !== 1 ? 's' : ''} para un proyecto de ${getProjectType(type)} en ${name}, ${stateName}.`
    const start = startDate ? moment(startDate).format('MMMM YYYY') : '?'
    const end = endDate ? moment(endDate).format('MMMM YYYY') : '?'

    const breadcrumb = (
      <OrganizationBreadcrumb
        name={orgName}
        sector={sector}
        id={organizationId}
        projectType={type}
        position={position}
      />
    )

    const content = (

      <div>
        <div className="wrapper-lg wrapper-md wrapper-sm">
          {breadcrumb}
          <div className="row wrapper-xs">
            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-6 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <span className={Styles.position}>{position}</span>
              <span className={Styles.text}>{detailedDesc}</span>
              <span className={Styles.title}>Objetivos de voluntariado</span>
              <span className={Styles.text}>{desc}</span>
              <span className={Styles.title}>Habilidades requeridas</span>
              <ul className={Styles.list}>
                {skills.map((s, i) => <li className={`${Styles.item} ${Styles.checkmark}`} key={i}>{s}</li>)}
              </ul>
              <a className={`${Styles.button} sm-hidden xs-hidden`} onClick={this.handleOpportunityClick}>Postular</a>
            </div>
            <div className="col-lg-offset-2 col-lg-3 col-md-offset-2 col-md-3 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-3 col-xs-4 gutter">
                  <span className={`${Styles.title} ${Styles.details}`}>Detalles</span>
                  <ul className={Styles.list}>
                    <li className={`${Styles.item} ${Styles.location}`}>{location === 'other' ? place : volunteerLocationByValue[location]}</li>
                    <li className={`${Styles.item} ${Styles.dates}`}>{start} - {end}</li>
                    <li className={`${Styles.item} ${Styles.transport}`}>{transport ? 'Transporte incluido' : 'Transporte no incluido'}</li>
                    <li className={`${Styles.item} ${Styles.food}`}>{food ? 'Comida incluida' : 'Comida no incluida'}</li>
                  </ul>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-offset-1 col-sm-4 col-xs-4 gutter">
                  <span className={`${Styles.title} ${Styles.mapTitle}`}>Comunidad beneficiada</span>
                  <span className={`${Styles.item} ${Styles.community}`}>{`${name}, ${stateName}`}</span>
                  {this.renderMap(locality)}
                  <div className={`${Styles.mapMeta} middle between xs-hidden`}>
                    <div>
                      <p className={Styles.mapValue}>{locality.meta.total}</p>
                      <p className={Styles.mapLabel}>VIVIENDAS<br />DAÑADAS</p>
                    </div>
                    <div>
                      <p className={Styles.mapValue}>{locality.meta.margGrade}</p>
                      <p className={Styles.mapLabel}>REZAGO<br />SOCIAL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.spacer} />
        </div>
        <div className={`${Styles.sticky} lg-hidden md-hidden`}>
          <a className={`${Styles.button}`} onClick={this.handleOpportunityClick}>Postular</a>
        </div>
      </div>


    )

    if (className) return <div className={className}>{content}</div>
    return <React.Fragment>{content}</React.Fragment>
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
