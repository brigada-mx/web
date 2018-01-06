import React from 'react'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'

import { fmtNum, fmtBudget } from 'tools/string'
import ActionListItem from 'components/ActionListItem'
import Styles from './TestScreen.css'


const OrgBreadcrumb = ({ breadcrumb }) => {
  const {
    orgList, sector, orgDetail,
  } = breadcrumb

  return (
    <div className={Styles.breadcrumbLinks}>
      <span className={Styles.orgList}><NavLink to="/">{orgList}</NavLink></span>
      <span className={Styles.sector}>
        <NavLink to="#">{sector}</NavLink>
      </span>
      <span className={Styles.orgDetail}>
        <NavLink to="#">{orgDetail}</NavLink>
      </span>
    </div>
  )
}

OrgBreadcrumb.propTypes = {
  breadcrumb: PropTypes.object.isRequired,
}

const TestScreen = () => {
  const organization = {
    name: 'Reconstruyendo Comunidades Integrales',
    website: 'construyendo.org',
    websiteURL: 'http://construyendo.org',
    sector: 'Civil',
    established: '1995',
    mission: 'Buscamos impulsar la solidaridad en los voluntarios, mediante proyectos de construcción enfocados a elevar la calidad de vida de las familias mexicanas más…',
    investment: '72K',
    projects: 11,
    photos: 72,
    phone: '55-1292-9190',
    email: 'reconstruyendo@rci.org.mx',
    street: 'Bosque de Alisos 21',
    locality: 'Granjas Palo Alto',
    city: 'Ciudad de México',
    state: 'CDMX',
    zip: '05110',
  }
  const breadcrumb = {
    orgList: 'Organizaciones',
    sector: 'Civil',
    orgDetail: 'Reconstruyendo Comunidades Integrales',
  }
  const actionListItemProps = {
    action: {
      action_type: 'Construcción de vivienda',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim vehicula mauris, at rhoncus metus imperdiet nec. Nam non ligula neque. Donec hendrerit justo sed elit pharetra, mollis pellentesque risus imperdiet. Vestibulum ultrices, turpis ut pellentesque ornare, lacus tellus bibendum nisl.',
      unit_of_measurement: 'Viviendas',
      target: 50,
      progress: 7,
      budget: 565000,
      start_date: '12.11.17',
      end_date: '17.12.17',
      organization: { name: 'Reconstruyendo Comunidades Integrales', key: '_FCM' },
      locality: { name: 'Unión Hidalgo', state_name: 'Oaxaca' },
    },
    screen: 'org',
  }

  const {
    name, website, sector, established, mission, investment, projects, photos, phone, email, street, locality, city, state, zip
  } = organization

  return (
    <div>
      <div className="wrapper">
        <OrgBreadcrumb breadcrumb={breadcrumb} />
        <div className="row">
          <div className="col-lg-offset-1 col-lg-7 col-md-offset-1 col-md-7 col-sm-8 col-xs-4">
            <div className={Styles.name}>{name}</div>
          </div>
          <div className="col-lg-3 col-md-3 end-lg end-md sm-hidden xs-hidden">
            <div className={Styles.buttonsContainer}>
              <a target="_blank" className={`${Styles.button} ${Styles.website}`} href={website} />
              <a target="_blank" className={`${Styles.button} ${Styles.phone}`} href={phone} />
              <a target="_blank" className={`${Styles.button} ${Styles.email}`} href={email} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-offset-1 col-lg-4 col-md-offset-1 col-md-4 col-sm-8 col-xs-4">
            <div className={Styles.summaryContainer}>
              <div className={Styles.fieldContainer}>
                <span className={Styles.fieldLabel}>WEB</span>
                <span className={Styles.fieldValue}><a href="{websiteURL}">{website}</a></span>
              </div>
              <div className={Styles.fieldContainer}>
                <span className={Styles.fieldLabel}>SECTOR</span>
                <span className={Styles.fieldValue}>{sector}</span>
              </div>
              <div className={Styles.fieldContainer}>
                <span className={Styles.fieldLabel}>ESTABLECIDA</span>
                <span className={Styles.fieldValue}>{established}</span>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-lg-offset-4 col-md-2 col-md-offset-4 end-lg end-md sm-hidden xs-hidden">
            <div className={Styles.placeContainer}>
              <p className={Styles.subtitle}>¿Dónde estamos?</p>
              <ul className={Styles.addressFields}>
                <li>{street}</li>
                <li>{locality}</li>
                <li>{city}</li>
                <li>{state}, {zip}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-6 col-sm-8 col-xs-4">
            <span className={Styles.mission}>{mission}</span>
          </div>
          <div className="col-lg-2 col-lg-offset-2 col-md-2 col-md-offset-2 end-lg end-md sm-hidden xs-hidden">
            <div className={`${Styles.placeContainer} ${Styles.ops}`}>
              <p className={Styles.subtitle}>¿Dónde operamos?</p>
              <div className={Styles.opsMap} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-offset-1 col-lg-5 col-md-offset-1 col-md-5 col-sm-8 col-xs-4">
            <div className={Styles.metricsContainer}>
              <div className={Styles.metric}>
                <span className={Styles.metricLabel}>Inversión<br />estimada</span>
                <span className={Styles.metricValue}>{investment}</span>
              </div>
              <div className={Styles.metric}>
                <span className={Styles.metricLabel}>Proyectos<br />registrados</span>
                <span className={Styles.metricValue}>{projects}</span>
              </div>
              <div className={Styles.metric}>
                <span className={Styles.metricLabel}>Fotos<br />capturadas</span>
                <span className={Styles.metricValue}>{photos}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${Styles.cardsContainer} wrapper`}>
        <ActionListItem {...actionListItemProps} />
        <ActionListItem {...actionListItemProps} />
        <ActionListItem {...actionListItemProps} />
      </div>
    </div>
  )
}

export default TestScreen
