import React from 'react'
import PropTypes from 'prop-types'

import { withRouter, Redirect } from 'react-router-dom'
import { Sticky, StickyContainer } from 'react-sticky'

import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import Carousel from 'components/Carousel'
import ActionList from 'components/ActionList'
import PhoneBox from 'components/PhoneBox'
import ActionMap from 'components/FeatureMap/ActionMap'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import MapErrorBoundary from 'components/MapErrorBoundary'
import { addProtocol, emailLink, fmtBudget } from 'tools/string'
import { fitBoundsFromCoords, itemFromScrollEvent, fireGaEvent } from 'tools/other'
import { sectorByValue } from 'src/choices'
import OrganizationBreadcrumb from './OrganizationBreadcrumb'
import HelpWanted from './HelpWanted'
import Styles from './OrganizationScreenView.css'


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

  setDocumentMeta = (name, description) => {
    if (this._documentTitle) return
    const title = `${name} - Brigada`
    document.title = title
    this._documentTitle = title

    if (!description) return
    const metaTags = document.getElementsByTagName('meta')
    for (const meta of metaTags) {
      if (meta.name.toLowerCase() === 'description') {
        meta.content = description
      }
    }
  }

  handleClickFeature = (feature) => {
    this.props.history.push(`/comunidades/${feature.properties.id}`)
  }

  handleEnterFeature = (feature) => {
    const locality = JSON.parse(feature.properties.locality)
    this.setState({ popup: { locality } })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: {} })
  }

  handleClickPhotos = (item) => {
    this.setState({ carousel: { actionId: item.id } })
  }

  handleClickListItem = (item) => {
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
        <MapErrorBoundary>
          <LocalityDamageMap
            dragPan={window.innerWidth >= 980}
            zoomControl={false}
            features={features}
            popup={popup ? <LocalityPopup
              locality={popup.locality}
              screen="org"
              onlyLocality
            /> : null}
            onClickFeature={this.handleClickFeature}
            onEnterFeature={this.handleEnterFeature}
            onLeaveFeature={this.handleLeaveFeature}
            fitBounds={fitBounds.length > 0 ? fitBounds : undefined}
          />
        </MapErrorBoundary>
      </div>
    )
  }

  render() {
    const { organization: { loading, data, status } } = this.props
    if (status === 404) return <Redirect to="/reconstructores" />
    if (loading || !data) return <LoadingIndicatorCircle />

    this.setDocumentMeta(data.name, data.desc)
    const {
      actions,
      contact: { email, phone, website, address, person_responsible: person },
      desc,
      name,
      sector,
      year_established: established,
      image_count: numPhotos,
      accepting_help: help,
      help_desc: helpDesc,
      id,
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

    const budget = actions.reduce((sum, action) => sum + (action.budget || 0), 0)

    return (
      <React.Fragment>
        <div className="wrapper-lg wrapper-md wrapper-sm">
          <OrganizationBreadcrumb name={name} sector={sector} />

          <div className="row">
            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className="col-lg-12 col-md-12 col-sm-6 col-xs-4 gutter">
                <div className={Styles.name}>{name}</div>
              </div>
              <div className="col-lg-8 col-md-9 col-sm-6 col-xs-4 gutter">
                <div className={Styles.summaryContainer}>
                  <div className={Styles.fieldContainer}>
                    <span className={Styles.fieldLabel}>WEB</span>
                    {website &&
                      <span className={`${Styles.fieldValue} ${Styles.ellipsis}`}>
                        <a
                          target="_blank"
                          href={addProtocol(website)}
                          onClick={() => fireGaEvent('website')}
                        >
                          {website}
                        </a>
                      </span>
                    }
                    {!website && <span className={Styles.fieldValue}>No disponible</span>}
                  </div>
                  <div className={Styles.fieldContainer}>
                    <span className={Styles.fieldLabel}>SECTOR</span>
                    <span className={Styles.fieldValue}>{sectorByValue[sector] || sector}</span>
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
                  <div className={budget > 0 ? Styles.metric : Styles.emptyMetric}>
                    <span className={Styles.metricLabel}>Inversión<br />estimada</span>
                    <span className={Styles.metricValue}>
                      {fmtBudget(budget)}
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
            <div className="col-lg-3 col-lg-offset-2 col-md-3 col-md-offset-1 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-xs-4 center-xs gutter">
                  <div className={Styles.buttonsContainer}>
                    {website &&
                      <a
                        target="_blank"
                        className={`${Styles.button} ${Styles.website}`}
                        href={addProtocol(website)}
                        onClick={() => fireGaEvent('website')}
                      />
                    }
                    {phone && <PhoneBox phone={phone} name={person} />}
                    {email &&
                      <a
                        target="_blank"
                        className={`${Styles.button} ${Styles.email}`}
                        href={emailLink(email)}
                        onClick={() => fireGaEvent('email')}
                      />
                    }
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-3 col-xs-4 gutter">
                  <div className={Styles.hq}>
                    <p className={Styles.subtitle}>¿Dónde estamos?</p>
                    {address && this.renderAddress(address)}
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

        <HelpWanted help={help} helpDesc={helpDesc} organizationId={id} email={email} />

        <StickyContainer className={`${!help ? Styles.actionsContainer : ''} row`}>
          <div className={`${Styles.actionListContainer} col-lg-7 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter`}>
            <ActionList
              screen="org"
              containerStyle={Styles.cardsContainer}
              actions={actions}
              onScroll={this.handleScroll}
              focusedId={focused && focused.id}
              onClickPhotos={this.handleClickPhotos}
              onClickItem={this.handleClickListItem}
            />
          </div>
          <div className="col-lg-5 col-md-5 sm-hidden xs-hidden">
            <Sticky>
              {
                ({ style }) => {
                  return actionMap &&
                    <div style={{ ...style, height: '100vh', width: '100%', overflow: 'auto' }}>
                      {actionMap}
                    </div>
                }
              }
            </Sticky>
          </div>
        </StickyContainer>

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
