import React from 'react'
import PropTypes from 'prop-types'

import { withRouter, Redirect } from 'react-router-dom'
import { Sticky, StickyContainer } from 'react-sticky'

import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import Carousel from 'components/Carousel'
import ActionList from 'components/ActionList'
import PhoneBox from 'components/PhoneBox'
import Icon from 'components/Icon'
import ActionMap from 'components/FeatureMap/ActionMap'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import ProfileStrengthPublic from 'components/Strength/ProfileStrengthPublic'
import { addProtocol, emailLink, fmtBudget, renderLinks } from 'tools/string'
import { itemFromScrollEvent, fireGaEvent, setDocumentMetaThis } from 'tools/other'
import { sectorByValue } from 'src/choices'
import OrganizationBreadcrumb from './OrganizationBreadcrumb'
import Styles from './OrganizationScreenView.css'


class OrganizationScreenView extends React.Component {
  state = {
    popup: null,
    focused: {},
    carousel: {},
  }

  static getDerivedStateFromProps({ organization }, { focused: _focused }) {
    const { data } = organization
    if (_focused.id === undefined && data && data.actions.length) {
      const [focused] = data.actions
      return { focused }
    }
    return null
  }

  handleClickFeature = (feature) => {
    this.props.history.push(`/comunidades/${feature.properties.id}`)
  }

  handleEnterFeature = (feature) => {
    const locality = JSON.parse(feature.properties.locality)
    this.setState({ popup: { locality } })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: null })
  }

  handleClickPhotos = (item) => {
    this.setState({ carousel: { actionId: item.id } })
  }

  handleMouseEnterItem = (item) => {
    this.setState({ focused: item })
  }

  handleScroll = (e, actions) => {
    if (window.innerWidth >= 980) return
    this.setState({ focused: itemFromScrollEvent(e, actions) })
  }

  handleClickActionFeature = (feature) => {
    const { actionId, lat, lng } = feature.properties
    this.setState({ carousel: { actionId, lat, lng } })
  }

  handleEnterActionFeature = (feature) => {
    const { actionId: id } = feature.properties
    if (this.state.focused.id === id) return
    this.setState({ focused: { id } })
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

    const { popup } = this.state
    return (
      <div className={Styles.opsMap}>
        <LocalityDamageMap
          dragPan={window.innerWidth >= 980}
          zoomControl={false}
          features={features}
          popup={popup && <LocalityPopup locality={popup.locality} screen="org" onlyLocality />}
          onClickFeature={this.handleClickFeature}
          onEnterFeature={this.handleEnterFeature}
          onLeaveFeature={this.handleLeaveFeature}
          initialZoom={4}
        />
      </div>
    )
  }

  render() {
    const { organization: { loading, data, status } } = this.props
    if (status === 404) return <Redirect to="/reconstructores" />
    if (loading || !data) return <LoadingIndicatorCircle />

    setDocumentMetaThis(this, `${data.name} - Brigada`, data.desc)

    const {
      actions,
      contact: { email, phone, website, address, person_responsible: person },
      desc,
      name,
      sector,
      year_established: established,
      image_count: numPhotos,
      id,
    } = data
    const { focused } = this.state

    const actionMap = (
      <ActionMap
        actions={actions}
        selectedId={focused.id}
        onClickFeature={this.handleClickActionFeature}
        onEnterFeature={this.handleEnterActionFeature}
      />
    )

    const transparent = actions.length > 0 && actions.every(a => a.level >= 3)
    const budget = actions.reduce((sum, action) => sum + (action.budget || 0), 0)

    return (
      <React.Fragment>
        <div className="wrapper-lg wrapper-md wrapper-sm">
          <OrganizationBreadcrumb name={name} sector={sector} id={id} />

          <div className="row">
            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter">

              {transparent &&
                <div className={Styles.transparencyContainer}>
                  <img
                    src="/assets/img/circle-checkmark-accent.svg"
                    alt="Proyecto transparente"
                    height={16}
                    className={Styles.checkmark}
                  />
                  <span className={Styles.transparencyInfo}>ORGANIZACIÓN TRANSPARENTE</span>
                  <Icon
                    src="/assets/img/moreinfo.svg"
                    alt="Proyecto transparente"
                    height={16}
                    ttText="Todos los proyectos de esta organización cumplen con criterios mínimos de transparencia establecidos en conjunto con Alternativas y Capacidades A.C."
                    ttTop={-87}
                    ttWidth={360}
                    ttLeft={-177}
                    className={Styles.moreinfo}
                  />
                </div>
              }

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
                          rel="noopener noreferrer"
                          href={addProtocol(website)}
                          onClick={() => fireGaEvent('website')}
                        >
                          {website}
                        </a>
                      </span>
                    }
                    {!website && <span className={Styles.fieldValue} style={{ color: '#9F9F9F' }}>No disponible</span>}
                  </div>
                  <div className={Styles.fieldContainer}>
                    <span className={Styles.fieldLabel}>SECTOR</span>
                    {sector && <span className={Styles.fieldValue}>{sectorByValue[sector] || sector}</span>}
                    {!sector && <span className={Styles.fieldValue} style={{ color: '#9F9F9F' }}>No disponible</span>}
                  </div>
                  <div className={Styles.fieldContainer}>
                    <span className={Styles.fieldLabel}>ESTABLECIDA</span>
                    {established && <span className={Styles.fieldValue}>{established}</span>}
                    {!established && <span className={Styles.fieldValue} style={{ color: '#9F9F9F' }}>No disponible</span>}
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-8 col-xs-4 gutter">
                <p className={Styles.mission}>{renderLinks(desc)}</p>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-7 col-xs-4 xs-gutter">
                <div className={Styles.metricsContainer}>
                  <div className={budget > 0 ? Styles.metric : Styles.emptyMetric}>
                    <span className={Styles.metricLabel}>Inversión<br />comprometida</span>
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
                        rel="noopener noreferrer"
                        className={`${Styles.button} ${Styles.website}`}
                        href={addProtocol(website)}
                        onClick={() => fireGaEvent('website')}
                      />
                    }
                    {phone && <PhoneBox phone={phone} name={person} />}
                    {email &&
                      <a
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

        {actions.length > 0 &&
          <StickyContainer className={`${Styles.actionsContainer} row`}>
            <div className={`${Styles.actionListContainer} col-lg-7 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter`}>
              <ActionList
                screen="org"
                containerStyle={Styles.cardsContainer}
                actions={actions}
                onScroll={this.handleScroll}
                focusedId={focused.id}
                onClickPhotos={this.handleClickPhotos}
                onMouseEnter={this.handleMouseEnterItem}
              />
            </div>
            <div className="col-lg-5 col-md-5 sm-hidden xs-hidden">
              <Sticky>
                {({ style }) => {
                  return <div style={{ ...style, height: '100vh', width: '100%', overflow: 'auto' }}>{actionMap}</div>
                }}
              </Sticky>
            </div>
          </StickyContainer>
        }

        {this.props.myOrganization && <ProfileStrengthPublic />}
        {this.renderCarousel()}
      </React.Fragment>
    )
  }
}

OrganizationScreenView.propTypes = {
  organization: PropTypes.object.isRequired,
  myOrganization: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(OrganizationScreenView)
