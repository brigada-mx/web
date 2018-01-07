import React from 'react'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip, LabelList } from 'recharts'
import moment from 'moment'
import { fmtNum, fmtBudget } from 'tools/string'

import FeatureMap from 'components/FeatureMap'
import MetricsBar from 'components/MetricsBar'
import StackedMetricsBar from 'components/StackedMetricsBar'
import ActionListItem from 'components/ActionListItem'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import DirectionsButton from 'components/DirectionsButton'
import EstablishmentPopup from 'components/FeatureMap/EstablishmentPopup'
import { dmgGrade, metaByDmgGrade } from 'tools/other'
import Colors from 'src/colors'
import Styles from './LocalityScreenView.css'


const LocalityBreadcrumb = ({ cvegeo, stateName, munName, name }) => (
  <div className={Styles.breadcrumbLinks}>
    <span className={Styles.communities}><NavLink to="/">Comunidades</NavLink></span>
    <span className={Styles.state}>
      <NavLink
        to={{ pathname: '/',
          state: { valState: [{ value: cvegeo.substring(0, 2), label: stateName }] } }}
      >
        {stateName}
      </NavLink>
    </span>
    <span className={Styles.muni}>
      <NavLink
        to={{ pathname: '/',
          state: { valMuni: [{ value: cvegeo.substring(0, 5), label: munName }] } }}
      >
        {munName}
      </NavLink>
    </span>
    <span className={Styles.loc}>
      <NavLink to="#">{name}</NavLink>
    </span>
  </div>
)

LocalityBreadcrumb.propTypes = {
  cvegeo: PropTypes.string.isRequired,
  stateName: PropTypes.string.isRequired,
  munName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const DmgBarChart = ({ destroyed, habit, notHabit }) => {
  if (destroyed === 0 && habit === 0 && notHabit === 0) return null

  const data = [
    { name: 'PÉRDIDA TOTAL', num: destroyed },
    { name: 'PARCIAL (HABITABLE)', num: habit },
    { name: 'PARCIAL (INHABITABLE)', num: notHabit },
  ]

  return (
    <ResponsiveContainer width="100%" height={134}>
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
        <Bar dataKey="num" fill={Colors.blueGreen} isAnimationActive={false} >
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

class LocalityScreenView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      popup: null,
    }
  }

  handleClickFeature = (f) => {
  }

  handleEnterFeature = (f) => {
    clearTimeout(this._timer)
    this.setState({ popup: f })
  }

  handleLeaveFeature = (f) => {
    this._timer = setTimeout(() => {
      this.setState({ popup: null })
    }, 200)
  }

  renderLocalitySection = () => {
    const { locality: { loading, data, error } } = this.props

    if (loading) return <LoadingIndicatorCircle />
    if (data) {
      const {
        name, municipality_name: munName, state_name: stateName, cvegeo, location, meta,
      } = data
      const {
        analfabet,
        noPrimary,
        noToilet,
        noElec,
        noPlumb,
        noFridge,
        dirtFloor,
        roomOccup,
        margGrade,
        destroyed,
        habit,
        notHabit,
        total,
      } = meta
      const { lat, lng } = location
      const dmgMeta = metaByDmgGrade(dmgGrade(data))

      const barLabels = [
        'Analfabetismo',
        'Primaria incompleta',
        'Falta excusado',
        'Falta electricidad',
        'Falta agua entubada',
        'Falta refrigerador',
        'Piso de tierra',
        'Ocupantes por cuarto',
      ]
      const bars = [
        analfabet, noPrimary, noToilet, noElec, noPlumb, noFridge, dirtFloor, roomOccup,
      ].map((v, i) => {
        return (
          <div key={i} className={Styles.margMetrics}>
            <span className={Styles.margLabel}>{barLabels[i]}</span>
            <span className={Styles.margBar}><MetricsBar value={v} max={100} /></span>
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
              <div className={Styles.vizHeader}>
                <span className={Styles.vizLabel}>VIVIENDAS<br />DAÑADAS</span>
                <span className={Styles.vizCount}>{fmtNum(total)}</span>
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
              <div className={Styles.vizHeader}>
                <span className={Styles.vizLabel}>MARGINACIÓN<br />SOCIAL</span>
                <span className={Styles.vizCount}>{margGrade}</span>
              </div>
              <div className={Styles.margContainer}>
                <div className={Styles.margColumn}>{bars.slice(0, 4)}</div>
                <div className={Styles.margColumn}>{bars.slice(4, 8)}</div>
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
    if (loading || !locData) return <LoadingIndicatorCircle />

    const { popup } = this.state

    const { location: { lat, lng } } = locData
    if (data) {
      return (
        <div className={`${Styles.map} row`}>
          <div className={`${Styles.directions} lg-hidden md-hidden`}>
            <DirectionsButton lat={lat} lng={lng} />
          </div>
          <FeatureMap
            onClickFeature={this.handleClickFeature}
            onEnterFeature={this.handleEnterFeature}
            onLeaveFeature={this.handleLeaveFeature}
            features={data.results}
            coordinates={[lng, lat]}
            popup={popup ? <EstablishmentPopup establishment={popup} /> : null}
          />
        </div>
      )
    }
    return <LoadingIndicatorCircle />
  }

  renderActionsSection = () => {
    const { actions: { loading, data, error } } = this.props
    if (loading) return <LoadingIndicatorCircle />

    if (data) {
      const { results: actions } = data
      let budget = 0
      const orgs = {}
      const labels = ['Por iniciar', 'En progreso', 'Completados']
      const status = [0, 0, 0]

      const date = moment().format('YYYY-MM-DD')
      for (const a of actions) {
        const { start_date: startDate, end_date: endDate } = a
        if (startDate && date < startDate) status[0] += 1
        else if (!endDate || date <= endDate) status[1] += 1
        else status[2] += 1
        budget += (a.budget || 0)
        orgs[a.organization_id] = true
      }

      const actionList = actions.map((a) => {
        return <ActionListItem key={a.id} action={a} screen="loc" />
      })

      return (
        <div>
          <div className={Styles.actionMetricsContainer}>
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-xs-4 flex between gutter bottom-xs">
                <div className={Styles.vizHeader}>
                  <span className={Styles.vizLabel}>PROYECTOS DE<br />RECONSTRUCCIÓN</span>
                  <span className={Styles.vizCount}>{actions.length}</span>
                </div>
                <div className={Styles.vizHeader}>
                  <span className={Styles.vizLabel}>ORGANIZACIONES<br />COMPROMETIDAS</span>
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
          <div className={Styles.actionCardsContainer}>
            {actionList}
          </div>
        </div>
      )
    }

    return <LoadingIndicatorCircle />
  }

  render() {
    return (
      <div>
        {this.renderLocalitySection()}
        {this.renderEstablishmentsSection()}
        {this.renderActionsSection()}
      </div>
    )
  }
}

LocalityScreenView.propTypes = {
  locality: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  establishments: PropTypes.object.isRequired,
}

export default LocalityScreenView
