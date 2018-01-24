import React from 'react'
import PropTypes from 'prop-types'

import { NavLink, withRouter } from 'react-router-dom'

import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import Carousel from 'components/Carousel'
import ActionList from 'components/ActionList'
import PhoneBox from 'components/PhoneBox'
import ActionMap from 'components/FeatureMap/ActionMap'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { addProtocol, emailLink, fmtBudget } from 'tools/string'
import { fitBoundsFromCoords, itemFromScrollEvent } from 'tools/other'
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

class OrganizationScreenView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popup: {},
      focused: null,
      carousel: {},
    }
  }

  componentWillUpdate(nextProps) {
    const { data } = nextProps.organization
    if (!this.props.organization.data && data) {
      const [focused] = data.actions
      this.setState({ focused })
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

  handleClickListItem = (item) => {
    this.setState({ carousel: { actionId: item.id } })
  }

  handleEnterListItem = (item) => {
    this.setState({ focused: item })
  }

  handleScroll = (e, actions) => {
    if (window.innerWidth >= 980) return
    this.setState({ focused: itemFromScrollEvent(e, actions) })
  }

  handleClickActionFeature = (feature) => {
    const actionId = JSON.parse(feature.properties.action).id
    const [lng, lat] = feature.geometry.coordinates
    this.setState({ carousel: { actionId, lat, lng } })
  }

  handleEnterActionFeature = (feature) => {
    this.setState({ focused: JSON.parse(feature.properties.action) })
  }

  handleCarouselClose = () => {
    this.setState({ carousel: {} })
  }

  renderCarousel = () => {
    const { actionId, lat, lng } = this.state.carousel
    if (actionId === undefined) return null

    return (
      <Carousel onClose={this.handleCarouselClose} actionId={actionId} lat={lat} lng={lng} />
    )
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
    const { focused } = this.state

    const actionMap = (
      <ActionMap
        actions={actions}
        selectedId={focused && focused.id}
        onClickFeature={this.handleClickActionFeature}
        onEnterFeature={this.handleEnterActionFeature}
      />
    )

    const numPhotos = actions.reduce((_sum, action) => {
      return _sum + (
        action.submissions.reduce((sum, submission) => sum + submission.thumbnails_small.length, 0)
      )
    }, 0)

    return (
      <React.Fragment>
        <div className="wrapper-lg wrapper-md wrapper-sm">
          <OrganizationBreadcrumb name={name} sector={sector} />

          <div className="row">
            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-6 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className="col-lg-12 col-md-12 col-sm-6 col-xs-4 gutter">
                <div className={Styles.name}>{name}</div>
              </div>
              <div className="col-lg-8 col-md-9 col-sm-5 col-xs-4 gutter">
                <div className={Styles.summaryContainer}>
                  <div className={Styles.fieldContainer}>
                    <span className={Styles.fieldLabel}>WEB</span>
                    {website &&
                      <span className={`${Styles.fieldValue} ${Styles.ellipsis}`}>
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
              <div className="col-lg-12 col-md-12 col-sm-8 col-xs-4 gutter">
                <span className={Styles.mission}>{desc}</span>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-7 col-xs-4 xs-gutter">
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
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Fotos<br />capturadas</span>
                    <span className={Styles.metricValue}>{numPhotos}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-lg-offset-2 col-md-3 col-md-offset-2 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-xs-4 center-xs gutter">
                  <div className={Styles.buttonsContainer}>
                    {website &&
                      <a
                        target="_blank"
                        className={`${Styles.button} ${Styles.website}`}
                        href={addProtocol(website)}
                      />
                    }
                    {phone && <PhoneBox phone={phone} />}
                    {email &&
                      <a
                        target="_blank"
                        className={`${Styles.button} ${Styles.email}`}
                        href={emailLink(email)}
                      />
                    }
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-2 col-xs-4 gutter">
                  <div className={Styles.hq}>
                    <p className={Styles.subtitle}>¿Dónde estamos?</p>
                    {this.renderAddress(address)}
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-4 col-xs-4 gutter">
                  <div className={Styles.ops}>
                    <p className={Styles.subtitle}>¿Dónde operamos?</p>
                    {this.renderMap(actions)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${Styles.actionsContainer} row`}>
          <div className="col-lg-7 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter">
            <ActionList
              screen="org"
              containerStyle={Styles.cardsContainer}
              actions={actions}
              onScroll={this.handleScroll}
              focusedId={focused && focused.id}
              onClick={this.handleClickListItem}
              onMouseEnter={this.handleEnterListItem}
            />
          </div>
          <div className="col-lg-5 col-md-5 sm-hidden xs-hidden">
            {actionMap &&
              <div className={Styles.mapContainer}>
                {actionMap}
              </div>
            }
          </div>
        </div>

        {this.renderCarousel()}
      </React.Fragment>
    )
  }
}

OrganizationScreenView.propTypes = {
  organization: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(OrganizationScreenView)
