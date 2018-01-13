import React from 'react'
import PropTypes from 'prop-types'

import { NavLink, withRouter } from 'react-router-dom'

import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import ActionListItem from 'components/ActionListItem'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { addProtocol, phoneLink, emailLink, fmtBudget } from 'tools/string'
import { fitBoundsFromCoords } from 'tools/other'
import Styles from './OrganizationScreenView.css'


const OrganizationBreadcrumb = ({ name, sector }) => {
  const labelBySector = {
    civil: 'Civil',
    public: 'Público',
    private: 'Privado',
    religious: 'Religioso',
  }

  return (
    <div className={Styles.breadcrumbLinks}>
      <span className={Styles.orgList}><NavLink to="/organizaciones">Organizaciones</NavLink></span>
      <span className={Styles.sector}>
        <NavLink
          to={{ pathname: '/organizaciones',
            state: { valSector: [{ value: sector, label: labelBySector[sector] }] } }}
        >
          {labelBySector[sector]}
        </NavLink>
      </span>
      <span className={Styles.orgDetail}>
        <NavLink to="#">{name}</NavLink>
      </span>
    </div>
  )
}

OrganizationBreadcrumb.propTypes = {
  name: PropTypes.string.isRequired,
  sector: PropTypes.string.isRequired,
}

class ActionList extends React.PureComponent {
  render() {
    const { actions, focusedId, ...rest } = this.props
    const items = actions.map((a) => {
      return (
        <ActionListItem
          screen="org"
          key={a.id}
          action={a}
          {...rest}
          focused={focusedId === a.id && a.id !== undefined}
        />
      )
    })
    return <div className={`${Styles.cardsContainer} wrapper`}>{items}</div>
  }
}

ActionList.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  focusedId: PropTypes.number,
}

class OrganizationScreenView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popup: {},
    }
  }

  handleClickFeature = (feature) => {
    this.props.history.push(`/comunidades/${feature.properties.id}`)
  }

  handleEnterFeature = (feature) => {
    const { data } = this.props.organization
    if (!data) return
    const locality = JSON.parse(feature.properties.locality)
    this.setState({ popup: { locality, organization: data } })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: {} })
  }

  handleClickListItem = (f) => {
  }

  handleEnterListItem = (i) => {
  }

  handleLeaveListItem = (i) => {
  }

  renderAddress = (address) => {
    const { street, locality, city, state, zip } = address
    let stateZip = null
    if (state && zip) stateZip = <li>{state}, {zip}</li>
    else if (state) stateZip = <li>{state}</li>
    else if (zip) stateZip = <li>{zip}</li>

    return (
      <ul className={Styles.addressFields}>
        {street && <li>{street}</li>}
        {locality && <li>{locality}</li>}
        {city && <li>{city}</li>}
        {stateZip}
      </ul>
    )
  }

  renderMap = (actions) => {
    const coords = []
    const features = actions.map((action) => {
      const {
        location: { lat, lng },
        meta: { total },
        cvegeo,
        id,
        state_name: stateName,
        municipality_name: muniName,
        name,
      } = action.locality
      coords.push(action.locality.location)

      return {
        type: 'Feature',
        properties: {
          cvegeo,
          id,
          total,
          fullName: `${stateName}, ${muniName}, ${name}`,
          locality: action.locality,
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }
    })

    const fitBounds = fitBoundsFromCoords(coords)
    const { popup } = this.state
    return (
      <div className={Styles.opsMap}>
        <LocalityDamageMap
          zoomControl={false}
          features={features}
          popup={popup ? <LocalityPopup
            locality={popup.locality}
            organization={popup.organization}
            screen="org"
          /> : null}
          onClickFeature={this.handleClickFeature}
          onEnterFeature={this.handleEnterFeature}
          onLeaveFeature={this.handleLeaveFeature}
          fitBounds={fitBounds.length > 0 ? fitBounds : undefined}
        />
      </div>
    )
  }

  render() {
    const { organization: { loading, data, error } } = this.props
    if (loading || !data) return <LoadingIndicatorCircle />

    const {
      actions,
      contact: { email, phone, website, address },
      desc,
      name,
      sector,
      year_established: established,
    } = data

    return (
      <div>
        <div className="wrapper">
          <OrganizationBreadcrumb name={name} sector={sector} />

          <div className="row">
            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-6 col-sm-8 col-xs-4">
              <div className={Styles.name}>{name}</div>
            </div>
            <div className="col-lg-3 col-lg-offset-2 col-md-3 col-md-offset-2 sm-hidden xs-hidden">
              <div className={Styles.buttonsContainer}>
                {website &&
                  <a
                    target="_blank"
                    className={`${Styles.button} ${Styles.website}`}
                    href={addProtocol(website)}
                  />
                }
                {phone &&
                  <a
                    target="_blank"
                    className={`${Styles.button} ${Styles.phone}`}
                    href={phoneLink(phone)}
                  />
                }
                {email &&
                  <a
                    target="_blank"
                    className={`${Styles.button} ${Styles.email}`}
                    href={emailLink(email)}
                  />
                }
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-offset-1 col-lg-4 col-md-offset-1 col-md-4 col-sm-8 col-xs-4">
              <div className={Styles.summaryContainer}>
                <div className={Styles.fieldContainer}>
                  <span className={Styles.fieldLabel}>WEB</span>
                  {website &&
                    <span className={Styles.fieldValue}>
                      <a target="_blank" href={addProtocol(website)}>{website}</a>
                    </span>
                  }
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
            <div className="col-lg-2 col-lg-offset-4 col-md-2 col-md-offset-4 sm-hidden xs-hidden">
              <p className={Styles.subtitle}>¿Dónde estamos?</p>
              {this.renderAddress(address)}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-lg-offset-1 col-md-6 col-md-offset-1 col-sm-8 col-xs-4">
              <span className={Styles.mission}>{desc}</span>
              <div className={Styles.metricsContainer}>
                <div className={Styles.metric}>
                  <span className={Styles.metricLabel}>Inversión<br />estimada</span>
                  <span className={Styles.metricValue}>
                    {fmtBudget(actions.reduce((sum, action) => sum + (action.budget || 0), 0))}
                  </span>
                </div>
                <div className={Styles.metric}>
                  <span className={Styles.metricLabel}>Proyectos<br />registrados</span>
                  <span className={Styles.metricValue}>{actions.length}</span>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-lg-offset-2 col-md-2 col-md-offset-2 sm-hidden xs-hidden">
              <div className={Styles.ops}>
                <p className={Styles.subtitle}>¿Dónde operamos?</p>
                {this.renderMap(actions)}
              </div>
            </div>
          </div>
        </div>

        <ActionList actions={actions} />
      </div>
    )
  }
}

OrganizationScreenView.propTypes = {
  organization: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(OrganizationScreenView)
