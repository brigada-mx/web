import React from 'react'
import PropTypes from 'prop-types'

import { withRouter, Redirect } from 'react-router-dom'
import { Sticky, StickyContainer } from 'react-sticky'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import Carousel from 'components/Carousel'
import ActionList from 'components/ActionList'
import PhoneBox from 'components/PhoneBox'
import Icon from 'components/Icon'
import HelpWanted from 'components/HelpWanted'
import ActionMap from 'components/FeatureMap/ActionMap'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import DonorProfileStrengthPublic from 'components/Strength/DonorProfileStrengthPublic'
import { addProtocol, emailLink, fmtBudget, renderLinks } from 'tools/string'
import { fitBoundsFromCoords, itemFromScrollEvent, fireGaEvent, setDocumentMetaThis } from 'tools/other'
import { sectorByValue } from 'src/choices'
import DonorBreadcrumb from './DonorBreadcrumb'
import Styles from './DonorScreenView.css'


class DonorScreenView extends React.Component {
  state = {
    popup: null,
    focused: {},
    carousel: {},
  }

  static getDerivedStateFromProps({ donations }, { focused: _focused }) {
    const { data } = donations
    if (_focused.id === undefined && data && data.results.length) {
      const focused = { ...data.results[0].action }
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

    const fitBounds = fitBoundsFromCoords(coords)
    const { popup } = this.state
    return (
      <div className={Styles.opsMap}>
        <LocalityDamageMap
          dragPan={window.innerWidth >= 980}
          zoomControl={false}
          features={features}
          popup={popup && <LocalityPopup locality={popup.locality} screen="donor" onlyLocality />}
          onClickFeature={this.handleClickFeature}
          onEnterFeature={this.handleEnterFeature}
          onLeaveFeature={this.handleLeaveFeature}
          fitBounds={fitBounds.length > 0 ? fitBounds : undefined}
        />
      </div>
    )
  }

  render() {
    const {
      donor: { loading, data, status },
      donations: { loading: donationsLoading, data: donationsData },
      modal,
    } = this.props
    if (status === 404) return <Redirect to="/donadores" />
    if (loading || !data || donationsLoading || !donationsData) return <LoadingIndicatorCircle />

    setDocumentMetaThis(this, `${data.name} - Donador Brigada`, data.desc)

    const {
      metrics,
      contact: { email, phone, website, address, person_responsible: person },
      desc,
      name,
      sector,
      donating,
      donating_desc: donatingDesc,
      id,
      has_user: donorHasUser,
    } = data

    const actions = Object.values(donationsData.results.reduce((obj, d) => {
      obj[d.action.id] = { ...d.action } // eslint-disable-line no-param-reassign
      return obj
    }, {}))

    const { focused } = this.state

    const actionMap = (
      <ActionMap
        actions={actions}
        selectedId={focused.id}
        onClickFeature={this.handleClickActionFeature}
        onEnterFeature={this.handleEnterActionFeature}
      />
    )

    const contactButtons = () => {
      if (donorHasUser) {
        return (
          <div className={Styles.buttonsContainer}>
            {website &&
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={`${Styles.button} ${Styles.website}`}
                href={addProtocol(website)}
                onClick={() => fireGaEvent('donorWebsite')}
              />
            }
            {phone && <PhoneBox phone={phone} name={person} />}
            {email &&
              <a
                className={`${Styles.button} ${Styles.email}`}
                href={emailLink(email)}
                onClick={() => fireGaEvent('donorEmail')}
              />
            }
          </div>
        )
      }
      return (
        <div
          onClick={() => modal('donorCreateAccount', { donorName: name, donorId: id })}
          className={Styles.verifyButton}
        >
          Encárgate de este perfil
        </div>
      )
    }

    const transparent = actions.length > 0 && actions.every(a => a.level >= 2)

    return (
      <React.Fragment>
        <div className="wrapper-lg wrapper-md wrapper-sm">
          <DonorBreadcrumb name={name} />

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
                  <span className={Styles.transparencyInfo}>DONADOR TRANSPARENTE</span>
                  <Icon
                    src="/assets/img/moreinfo.svg"
                    alt="Proyecto transparente"
                    height={16}
                    ttText="Todos los proyectos de este donador son transparentes, de acuerdo con criterios mínimos de transparencia establecidos en conjunto con Alternativas y Capacidades A.C."
                    ttTop={-64}
                    ttWidth={400}
                    ttLeft={-192}
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
                    <span className={Styles.fieldLabel}>Estatus</span>
                    <span
                      className={`${Styles.fieldValue} ${donorHasUser ? Styles.verifiedLabel : Styles.unverifiedLabel}`}
                    >
                      {donorHasUser ? 'Verificado' : 'No verificado'}
                    </span>
                  </div>
                  <div className={Styles.fieldContainer}>
                    <span className={Styles.fieldLabel}>Web</span>
                    {website &&
                      <span className={`${Styles.fieldValue} ${Styles.ellipsis}`}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={addProtocol(website)}
                          onClick={() => fireGaEvent('donorWebsite')}
                        >
                          {website}
                        </a>
                      </span>
                    }
                    {!website && <span style={{ color: '#9F9F9F' }} className={Styles.fieldValue}>No disponible</span>}
                  </div>
                  <div className={Styles.fieldContainer}>
                    <span className={Styles.fieldLabel}>Sector</span>
                    {sector && <span className={Styles.fieldValue}>{sectorByValue[sector] || sector}</span>}
                    {!sector && <span className={Styles.fieldValue} style={{ color: '#9F9F9F' }}>No disponible</span>}
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-8 col-xs-4 gutter">
                <p className={Styles.mission}>{renderLinks(desc)}</p>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-7 col-xs-4 xs-gutter">
                <div className={Styles.metricsContainer}>
                  <div className={metrics.total_donated > 0 ? Styles.metric : Styles.emptyMetric}>
                    <span className={Styles.metricLabel}>Donativos<br />comprometidos</span>
                    <span className={Styles.metricValue}>
                      {fmtBudget(metrics.total_donated)}
                    </span>
                  </div>
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Reconstructores<br />apoyados</span>
                    <span className={Styles.metricValue}>{metrics.org_count}</span>
                  </div>
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Proyectos<br />apoyados</span>
                    <span className={Styles.metricValue}>{metrics.action_count}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-lg-offset-2 col-md-3 col-md-offset-1 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-xs-4 center-xs gutter">
                  {contactButtons()}
                </div>
                {donorHasUser &&
                  <div className="col-lg-12 col-md-12 col-sm-3 col-xs-4 gutter">
                    <div className={Styles.hq}>
                      <p className={Styles.subtitle}>¿Dónde estamos?</p>
                      {address && this.renderAddress(address)}
                    </div>
                  </div>
                }
                <div className="col-lg-12 col-md-12 col-sm-4 col-xs-4 gutter">
                  <div className={Styles.ops}>
                    <p className={Styles.subtitle}>¿Dónde donamos?</p>
                    {this.renderMap(actions)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <HelpWanted
          help={donating}
          helpDesc={donatingDesc}
          groupId={id}
          email={email}
          type="donation"
        />

        {actions.length > 0 &&
          <StickyContainer className={`${Styles.actionsContainer} row`}>
            <div className={`${Styles.actionListContainer} col-lg-7 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter`}>
              <ActionList
                screen="donor"
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

        {this.props.myDonor && <DonorProfileStrengthPublic />}
        {this.renderCarousel()}
      </React.Fragment>
    )
  }
}

DonorScreenView.propTypes = {
  donor: PropTypes.object.isRequired,
  myDonor: PropTypes.bool.isRequired,
  donations: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  modal: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(DonorScreenView))
