import React from 'react'
import PropTypes from 'prop-types'

import { withRouter, Redirect, Link } from 'react-router-dom'
import { Sticky, StickyContainer } from 'react-sticky'

import LocalityDamageMap from 'components/LocalityDamageMap'
import Carousel from 'components/Carousel'
import ActionMap from 'components/FeatureMap/ActionMap'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import MapErrorBoundary from 'components/MapErrorBoundary'
import { fmtBudget, fmtBudgetPlain, renderLinks } from 'tools/string'
import { fireGaEvent, transparencyLevel } from 'tools/other'
import { projectTypeByValue } from 'src/choices'
import OrganizationBreadcrumb from 'screens/OrganizationScreen/OrganizationBreadcrumb'
import PhotoGallery from './PhotoGallery'
import Styles from './ActionScreenView.css'


class ActionScreenView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  setDocumentMeta = (projectType, name, description) => {
    if (this._documentTitle) return
    const title = `${projectType}, ${name} - Brigada`
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

  handleClickItem = (e, { photo }) => {
    this.setState({ carousel: { initialUrl: photo.url } })
  }

  handleMouseEnterItem = (item) => {
    this.setState({ focused: item })
  }

  handleClickItemFeature = (feature) => {
    const { lat, lng } = feature.properties
    this.setState({ carousel: { lat, lng } })
  }

  handleEnterItemFeature = (feature) => {
    this.setState({ focused: JSON.parse(feature.properties.action) })
  }

  handleCarouselClose = () => {
    this.setState({ carousel: undefined })
  }

  renderCarousel = () => {
    const { action: { data } } = this.props
    if (!data || !this.state.carousel) return null
    const { lat, lng, initialUrl } = this.state.carousel

    return (
      <Carousel onClose={this.handleCarouselClose} actionId={data.id} lat={lat} lng={lng} initialUrl={initialUrl} />
    )
  }

  renderMap = (action) => {
    const { location: { lat, lng }, meta: { total }, id } = action.locality
    const features = [
      {
        type: 'Feature',
        properties: { id, total, locality: action.locality },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    ]

    return (
      <div className={Styles.opsMap}>
        <MapErrorBoundary>
          <LocalityDamageMap
            dragPan={window.innerWidth >= 980}
            zoomControl={false}
            features={features}
            onClickFeature={this.handleClickFeature}
            initialZoom={4}
          />
        </MapErrorBoundary>
      </div>
    )
  }

  render() {
    const { action: { loading, data, status }, myAction } = this.props
    if (status === 404) return <Redirect to="/reconstructores" />
    if (loading || !data) return <LoadingIndicatorCircle />

    const {
      organization: { sector, name, id: organizationId },
      image_count: numPhotos,
      donations,
      locality: { meta: { margGrade, total }, name: localityName, state_name: stateName },
      submissions,
      action_type: actionType,
      start_date: startDate,
      end_date: endDate,
      target,
      progress,
      unit_of_measurement: unit,
      budget = 0,
      desc,
      key,
    } = data

    const projectType = projectTypeByValue[actionType] || actionType

    this.setDocumentMeta(projectType, name, desc)
    const { focused } = this.state

    const dates = () => {
      return (
        <div className={Styles.datesContainer}>
          <span className={Styles.label}>FECHAS</span>
          <span className={Styles.dates}>
            {(startDate || '?').replace(/-/g, '.')} - {(endDate || '?').replace(/-/g, '.')}
          </span>
        </div>
      )
    }

    const getProgress = () => {
      return (
        <div className={Styles.datesContainer}>
          <span className={Styles.label}>AVANCE</span>
          <span className={Styles.dates}>{`${progress} de ${target} ${unit}`.toLowerCase()}</span>
        </div>
      )
    }

    const getDonations = () => {
      if (donations.length === 0) return null

      const rows = donations.sort((a, b) => {
        if (!a.received_date) return 1
        if (!b.received_date) return -1
        if (a.received_date < b.received_date) return 1
        if (a.received_date > b.received_date) return -1
        return 0
      }).map(({ amount, donor: { id: donorId, name: donorName } }, i) => {
        return (
          <tr key={i}>
            <th><Link className={Styles.donorLink} to={`/donadores/${donorId}`}>{donorName}</Link></th>
            <th>{fmtBudgetPlain(amount)}</th>
          </tr>
        )
      })

      return (
        <div className={Styles.donationContainer}>
          <span className={Styles.label}>DONATIVOS (MXN)</span>
          <table className={Styles.donations}>
            <tbody>{rows}</tbody>
          </table>
        </div>
      )
    }

    const actionMap = (
      <ActionMap
        actions={[data]}
        selectedId={focused && focused.id}
        onClickFeature={this.handleClickItemFeature}
        onEnterFeature={this.handleEnterItemFeature}
      />
    )

    const { level: transLevel, label: transLabel } = transparencyLevel(data)
    const transparencyStyles = [Styles.lowTransparency, Styles.midTransparency, Styles.highTransparency]

    return (
      <React.Fragment>
        <div className="wrapper-lg wrapper-md wrapper-sm">
          <OrganizationBreadcrumb name={name} sector={sector} id={organizationId} projectType={projectType} />

          <div className="row">

            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className={`${Styles.transparency} col-lg-12 col-md-12 col-sm-6 col-xs-4 gutter`}>
                <span className={transparencyStyles[transLevel]} />
                <span>{`PROYECTO ${transLabel}`.toUpperCase()}</span>
                {(myAction) && <Link to={`/cuenta/proyectos/${key}`}>{transLevel < 2 ? 'MEJORAR' : 'EDITAR'}</Link>}
              </div>

              <div className="col-lg-12 col-md-12 col-sm-6 col-xs-4 gutter">
                <div className={Styles.name}>{projectType}</div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-7 col-xs-4 xs-gutter">
                <div className={Styles.metricsContainer}>
                  <div className={budget > 0 ? Styles.metric : Styles.emptyMetric}>
                    <span className={Styles.metricLabel}>Inversión<br />comprometida</span>
                    <span className={Styles.metricValue}>{fmtBudget(budget)}</span>
                  </div>
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Donativos<br />documentados</span>
                    <span className={Styles.metricValue}>{donations.length}</span>
                  </div>
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Fotos<br />capturadas</span>
                    <span className={Styles.metricValue}>{numPhotos}</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-8 col-xs-4 gutter">
                <p className={Styles.mission}>{renderLinks(desc)}</p>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-8 col-xs-4 gutter row">
                {getDonations()}
                {getProgress()}
                {dates()}
              </div>
            </div>

            <div className="col-lg-3 col-lg-offset-2 col-md-3 col-md-offset-1 col-sm-8 sm-gutter col-xs-4 xs-gutter">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-4 col-xs-4 gutter">
                  <div className={Styles.ops}>
                    <p className={Styles.subtitle}>{`${localityName}, ${stateName}`}</p>
                    {this.renderMap(data)}
                  </div>
                </div>
              </div>

              <div className={`${Styles.mapMeta} row middle between`}>
                <div>
                  <div>{total}</div>
                  <div>VIVIENDAS DAÑADAS</div>
                </div>

                <div>
                  <div>{margGrade}</div>
                  <div>REZAGO SOCIAL</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <StickyContainer className={`${Styles.actionsContainer} row`}>
          <div className={`${Styles.actionListContainer} col-lg-7 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter`}>
            <PhotoGallery
              submissions={submissions}
              onClickItem={this.handleClickItem}
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

ActionScreenView.propTypes = {
  action: PropTypes.object.isRequired,
  myAction: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ActionScreenView)
