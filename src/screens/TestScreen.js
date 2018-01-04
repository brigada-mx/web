import React from 'react'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'

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

const TestScreen = () => {
  const props = {
    organization: {
      name: 'Reconstruyendo Comunidades Integrales',
      website: 'Civil',
      sector: 'Vivienda',
      established: 'Planeación urbana',
      mission: 'Buscamos impulsar la solidaridad en los voluntarios, mediante proyectos de construcción enfocados a elevar la calidad de vida de las familias mexicanas más…',
      investment: 72000,
      projects: 11,
      photos: 72,
      phone: '55-1292-9190',
      email: 'reconstruyendo@rci.org.mx',
      street: 'Bosque de Alisos 21',
      locality: 'Granjas Palo Alto',
      city: 'Ciudad de México',
      state: 'CDMX',
      zip: '05110',
    },
    breadcrumb: {
      orgList: 'Organizaciones',
      sector: 'Civil',
      orgDetail: 'Reconstruyendo Comunidades Integrales',
    },
    actions: {
      actHeader: 'Construcción de vivienda',
      actLoc: 'Unión Hidalgo',
      actState: 'Oaxaca',
      actBudget: 565000,
      actUnit: 'Viviendas',
      actCurrent: 16,
      actGoal: 50,
      actDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim vehicula mauris, at rhoncus metus imperdiet nec. Nam non ligula neque. Donec hendrerit justo sed elit pharetra, mollis pellentesque risus imperdiet. Vestibulum ultrices, turpis ut pellentesque ornare, lacus tellus bibendum nisl.',
      actStartDate: '12.11.17',
      actEndDate: '17.12.17',
    },
  }

  renderOrgSection = ({ organization }) => {
    const {
      name, website, sector, established, mission, investment, projects, photos, phone, email, street, locality, city, state, zip
    } = organization

    return (
      <div className="wrapper">
        <OrgBreadcrumb {...props} />
        <div className="row">
          <div className="col-lg-offset-1 col-lg-7 col-md-offset-1 col-md-7 col-sm-8 col-xs-4">
            <div className={Styles.placeName}>{name}</div>
          </div>
        </div>
      </div>
    )
  }

  OrgBreadcrumb.propTypes = {
    breadcrumb: PropTypes.string.isRequired,
  }
}

export default TestScreen
