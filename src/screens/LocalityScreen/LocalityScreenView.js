import React from 'react'
import PropTypes from 'prop-types'

import { withRouter, Redirect } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, LabelList } from 'recharts'
import { Sticky, StickyContainer } from 'react-sticky'

import FeatureMap from 'components/FeatureMap'
import MetricsBar from 'components/MetricsBar'
import StackedMetricsBar from 'components/StackedMetricsBar'
import ActionList from 'components/ActionList'
import ActionMap from 'components/FeatureMap/ActionMap'
import Carousel from 'components/Carousel'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import DirectionsButton from 'components/DirectionsButton'
import EstablishmentPopup from 'components/FeatureMap/EstablishmentPopup'
import EstablishmentLegend, { metaByScianGroup } from 'components/FeatureMap/EstablishmentLegend'
import { dmgGrade, metaByDmgGrade, projectStatus, itemFromScrollEvent } from 'tools/other'
import { fmtNum, fmtBudget } from 'tools/string'
import LocalityBreadcrumb from './LocalityBreadcrumb'
import Styles from './LocalityScreenView.css'


const DmgBarChart = ({ destroyed, habit, notHabit }) => {
  if (destroyed === 0 && habit === 0 && notHabit === 0) return null

  const data = [
    { name: 'PÉRDIDA TOTAL', num: destroyed },
    { name: 'DAÑO PARCIAL', num: habit },
    { name: 'REUBICACIÓN', num: notHabit },
  ]

  return (
    <ResponsiveContainer width="100%" height={166}>
      <BarChart
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        barCategoryGap="1%"
        unit="viviendas"
      >
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={
            { fontSize: 10,
              fontFamily: 'nunito-sans',
              letterSpacing: 0.16,
              lineHeight: 20,
              fill: '#9F9F9F',
              width: 74 }
          }
        />
        <CartesianGrid vertical={false} stroke="#E4E7EB" horizontalPoints={[0, 26, 52, 78, 104]} />
        <Bar dataKey="num" fill="#3DC59F" isAnimationActive={false} >
          <LabelList
            dataKey="num"
            position="insideTop"
            fontSize="10"
            fontFamily="nunito-sans"
            fill="#C5EDE2"
            offset={11}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

DmgBarChart.propTypes = {
  destroyed: PropTypes.number.isRequired,
  habit: PropTypes.number.isRequired,
  notHabit: PropTypes.number.isRequired,
}

const establishmentMapInitialZoom = 13

const establishmentMapLayer = {
  type: 'circle',
  paint: {
    'circle-color': {
      property: 'group',
      type: 'categorical',
      stops: Object.keys(metaByScianGroup).map(
        key => [parseInt(key, 10), metaByScianGroup[key].color]
      ),
    },
    'circle-opacity': 0.85,
    'circle-radius': {
      stops: [
        [establishmentMapInitialZoom, 4],
        [20, 70],
      ],
      base: 2,
    },
  },
}

class LocalityScreenView extends React.Component {
  state = {
    popup: null,
    focused: null,
    carousel: {},
  }

  static getDerivedStateFromProps({ actions }, { focused: _focused }) {
    const { data } = actions
    if (!_focused && data) {
      const [focused] = data.results
      return { focused }
    }
    return null
  }

  setDocumentTitle = (name) => {
    if (this._documentTitle) return
    const title = `${name} - Brigada`
    document.title = title
    this._documentTitle = title
  }

  handleEnterFeature = (feature) => {
    this.setState({ popup: JSON.parse(feature.properties.f) })
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
    const newFocused = JSON.parse(feature.properties.action)
    if (this.state.focused && this.state.focused.id === newFocused.id) return
    this.setState({ focused: newFocused })
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

  renderLocalitySection = () => {
    const { locality: { loading, data, error, status } } = this.props
    if (status === 404) return <Redirect to="/" />
    if (loading) return <LoadingIndicatorCircle />

    if (data) {
      this.setDocumentTitle(data.name)
      const {
        name, municipality_name: munName, state_name: stateName, cvegeo, location, meta,
      } = data
      const {
        analfabet,
        dropout,
        noPrimary,
        noHealth,
        dirtFloor,
        noToilet,
        noPlumb,
        noDrain,
        noElec,
        noWasher,
        noFridge,
        margGrade,
        destroyed,
        habit,
        notHabit,
        total,
      } = meta
      const { lat, lng } = location
      const dmgMeta = metaByDmgGrade(dmgGrade(data))

      const labels = [
        { value: analfabet, label: 'Analfabetismo' },
        { value: dropout, label: 'Deserción escolar' },
        { value: noPrimary, label: 'Primaria incompleta' },
        { value: noHealth, label: 'Sin servicios de salud' },
        { value: dirtFloor, label: 'Piso de tierra' },
        { value: noToilet, label: 'Sin excusado' },
        { value: noPlumb, label: 'Sin agua entubada' },
        { value: noDrain, label: 'Sin drenaje' },
        { value: noElec, label: 'Sin electricidad' },
        { value: noWasher, label: 'Sin lavadora' },
        { value: noFridge, label: 'Sin refrigerador' },
      ]
      const bars = labels.map(({ value: v, label }, i) => {
        return (
          <div key={i} className={Styles.margMetrics}>
            <span className={Styles.margLabel}>{label}</span>
            <span className={Styles.margBar}>{v ? <MetricsBar severity value={v} max={100} /> : '-'}</span>
          </div>
        )
      })

      return (
        <div className="wrapper">
          <LocalityBreadcrumb
            cvegeo={cvegeo}
            munName={munName}
            stateName={stateName}
            name={name}
          />

          <div className="row">
            <div className="col-lg-offset-1 col-lg-7 col-md-offset-1 col-md-7 col-sm-8 col-xs-4">
              <div className={Styles.dmgLevel}>
                <span className={Styles.circle} style={{ backgroundColor: dmgMeta.color }} />
                <span className={Styles.label} style={{ color: dmgMeta.color }}>{`DAÑO ${dmgMeta.label}`}</span>
              </div>
              <div className={Styles.placeName}>{name}, {munName}, {stateName}</div>
            </div>
            <div className="col-lg-3 col-md-3 end-lg end-md sm-hidden xs-hidden">
              <DirectionsButton lat={lat} lng={lng} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-offset-1 col-lg-3 col-md-offset-1 col-md-3 col-sm-8 col-xs-4 lg-gutter md-gutter">
              <div className={Styles.headerSourceWrap}>
                <div className={Styles.vizHeader}>
                  <span className={Styles.vizLabel}>VIVIENDAS<br />DAÑADAS</span>
                  <span className={Styles.vizCount}>{fmtNum(total)}</span>
                </div>
                <div className={Styles.source}>Fuente: SEDATU</div>
              </div>
              <div className={Styles.dmgChartContainer}>
                <DmgBarChart
                  destroyed={destroyed || 0}
                  habit={habit || 0}
                  notHabit={notHabit || 0}
                />
              </div>
            </div>
            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-6 col-sm-8 col-xs-4">
              <div className={Styles.headerSourceWrap}>
                <div className={Styles.vizHeader}>
                  <span className={Styles.vizLabel}>REZAGO<br />SOCIAL</span>
                  <span className={Styles.vizCount}>{margGrade}</span>
                </div>
                <div className={Styles.source}>Fuente: CONEVAL</div>
              </div>
              <div className={Styles.margContainer}>
                <div className={Styles.margColumn}>{bars.slice(0, 6)}</div>
                <div className={Styles.margColumn}>{bars.slice(6, 11)}</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return <LoadingIndicatorCircle />
  }

  renderEstablishmentsSection = () => {
    const { establishments: { loading, data, error } } = this.props
    const { locality: { data: locData } } = this.props
    if (loading || !locData || !data) return <LoadingIndicatorCircle />

    const features = data.results.map((f) => {
      const { scian_group: group, location: { lat, lng } } = f
      const meta = metaByScianGroup[group]
      return {
        type: 'Feature',
        properties: {
          group, icon: meta ? meta.icon : metaByScianGroup[1].icon, f,
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }
    })
    const { popup } = this.state
    const { location: { lat, lng } } = locData

    return (
      <div className={`${Styles.map} row`}>
        <div className={`${Styles.directions} lg-hidden md-hidden`}>
          <DirectionsButton lat={lat} lng={lng} />
        </div>
        <FeatureMap
          dragPan={window.innerWidth >= 980}
          initialZoom={establishmentMapInitialZoom}
          sourceId="establishments"
          features={features}
          layer={establishmentMapLayer}
          coordinates={[lng, lat]}
          onEnterFeature={this.handleEnterFeature}
          onLeaveFeature={this.handleLeaveFeature}
          popup={popup ? <EstablishmentPopup establishment={popup} /> : null}
          legend={<EstablishmentLegend establishments={data.results} />}
        />
      </div>
    )
  }

  renderActionsSection = () => {
    const { actions: { loading, data, error } } = this.props
    if (loading || !data) return <LoadingIndicatorCircle />

    const { results: actions } = data
    const { focused } = this.state

    let budget = 0
    const orgs = {}
    const labels = ['Por iniciar', 'En progreso', 'Completados']
    const status = [0, 0, 0]

    for (const a of actions) {
      status[projectStatus(a.start_date, a.end_date)] += 1
      budget += (a.budget || 0)
      orgs[a.organization.id] = true
    }

    const actionMap = (
      <ActionMap
        actions={actions}
        selectedId={focused && focused.id}
        onClickFeature={this.handleClickActionFeature}
        onEnterFeature={this.handleEnterActionFeature}
      />
    )

    const actionMetrics = (
      <div className={Styles.actionMetricsContainer}>
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-xs-4 flex between gutter bottom-xs">
            <div className={Styles.vizHeader}>
              <span className={Styles.vizLabel}>PROYECTOS DE<br />RECONSTRUCCIÓN</span>
              <span className={Styles.vizCount}>{actions.length}</span>
            </div>
            <div className={Styles.vizHeader}>
              <span className={Styles.vizLabel}>RECONSTRUCTORES<br />COMPROMETIDOS</span>
              <span className={Styles.vizCount}>{Object.keys(orgs).length}</span>
            </div>
            <div className={Styles.vizHeader}>
              <span className={Styles.vizLabel}>INVERSIÓN<br />ESTIMADA</span>
              <span className={Styles.vizCount}>{fmtBudget(budget)}</span>
            </div>
          </div>
        </div>
        <div className={`${Styles.actionProgress} row`}>
          <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-xs-4">
            <span className={Styles.vizLabel}>AVANCE</span>
            <StackedMetricsBar labels={labels} values={status} />
          </div>
        </div>
      </div>
    )

    if (actions.length === 0) return actionMetrics

    return (
      <div>
        {actionMetrics}

        <StickyContainer className={`${Styles.actionsContainer} row`}>
          <div className="col-lg-7 col-md-7 col-sm-8 sm-gutter col-xs-4 xs-gutter">
            <ActionList
              screen="loc"
              containerStyle={Styles.cardsContainer}
              actions={actions}
              onScroll={this.handleScroll}
              focusedId={focused && focused.id}
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
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderLocalitySection()}
        {this.renderEstablishmentsSection()}
        {this.renderActionsSection()}
        {this.renderCarousel()}
      </div>
    )
  }
}

LocalityScreenView.propTypes = {
  locality: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  establishments: PropTypes.object.isRequired,
}

export default withRouter(LocalityScreenView)
