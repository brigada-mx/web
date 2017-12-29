import React from 'react'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Label, CartesianGrid, Tooltip } from 'recharts'
import moment from 'moment'

import FeatureMap from 'components/FeatureMap'
import MetricsBar from 'components/MetricsBar'
import StackedMetricsBar from 'components/StackedMetricsBar'
import ActionListItem from 'components/ActionListItem'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import DirectionsButton from 'components/DirectionsButton'
import { dmgGrade, metaByDmgGrade } from 'tools/other'
import Colors from 'src/colors'
import Styles from './LocalityScreenView.css'


const LocalityBreadcrumb = ({ cvegeo, stateName, munName, name }) => (
  <div className={Styles.breadcrumbLinks}>
    <NavLink to="/">Comunidades</NavLink>
    <NavLink
      to={{ pathname: '/', state: { cvegeo: cvegeo.substring(0, 2) } }}
    >
      {stateName}
    </NavLink>
    <NavLink
      to={{ pathname: '/', state: { cvegeo: cvegeo.substring(0, 5) } }}
    >
      {munName}
    </NavLink>
    <NavLink to="#">{name}</NavLink>
  </div>
)

LocalityBreadcrumb.propTypes = {
  cvegeo: PropTypes.string.isRequired,
  stateName: PropTypes.string.isRequired,
  munName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const DmgBarChart = ({ destroyed, habit, notHabit }) => {
  const data = [
    { name: 'PÉRDIDA TOTAL', num: destroyed },
    { name: 'PARCIAL (HABITABLE)', num: habit },
    { name: 'PARCIAL (INHABITABLE)', num: notHabit },
  ]

  return (
    <BarChart
      width={400}
      height={133}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="name" axisLine={false} tickLine={false} />
      <CartesianGrid vertical={false} />
      <Tooltip />
      <Bar dataKey="num" fill={Colors.brandGreen} />
    </BarChart>
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
  }

  handleClickFeature = (f) => {
    console.log(f)
  }

  handleEnterFeature = (f) => {
    console.log(f)
  }

  handleLeaveFeature = (f) => {
    console.log(f)
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
        'Analfabestismo',
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
          <div key={i} className={Styles.barContainer}>
            <span className={Styles.barLabel}>{barLabels[i]}</span>
            <MetricsBar value={v} max={100} />
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
            <div className="col-lg-offset-1 col-lg-7 col-md-offset-1 col-md-7">
              <span className={Styles.dmgLabel} style={{ color: dmgMeta.color }}>{`DAÑO ${dmgMeta.label}`}</span>
              <div className={Styles.placeName}>{name}, {munName}, {stateName}</div>
            </div>
            <div className="col-lg-3 col-md-3 end-lg end-md">
              <DirectionsButton lat={lat} lng={lng} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-offset-1 col-lg-3 col-md-offset-1 col-md-3 lg-gutter md-gutter">
              <div className={Styles.vizHeader}>
                <span className={Styles.vizLabel}>VIVIENDAS<br />DAÑADAS</span>
                <span className={Styles.vizCount}>{total}</span>
              </div>
              <div className={Styles.dmgChartContainer}>
                <DmgBarChart {...{ destroyed, habit, notHabit }} />
              </div>
            </div>
            <div className="col-lg-offset-1 col-lg-6 col-md-offset-1 col-md-6">
              <div className={Styles.vizHeader}>
                <span className={Styles.vizLabel}>MARGINACIÓN<br />SOCIAL</span>
                <span className={Styles.vizCount}>{margGrade}</span>
              </div>
              <div className={Styles.margMetricsContainer}>
                <div className={Styles.margMetricsColumn}>{bars.slice(0, 4)}</div>
                <div className={Styles.margMetricsColumn}>{bars.slice(4, 8)}</div>
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
    return (
      <div className={`${Styles.map} row`}>
        <FeatureMap
          onClickFeature={this.handleClickFeature}
          onEnterFeature={this.handleEnterFeature}
          onLeaveFeature={this.handleLeaveFeature}
        />
      </div>
    )
  }

  renderActionsSection = () => {
    const { actions: { loading, data, error } } = this.props
    if (loading) return <LoadingIndicatorCircle />

    const fmtBudget = (b) => { // round to 2 decimal places
      const millions = Math.round(b / 10000) / 100
      return `$${millions}M`
    }

    if (data) {
      const { results: actions } = data
      let budget = 0
      const orgs = {}
      const labels = ['Por iniciar', 'En progreso', 'Completado']
      const status = [0, 0, 0]

      const date = moment().format('YYYY-MM-DD')
      for (const a of actions) {
        const { start_date: startDate, end_date: endDate } = a
        if (startDate || startDate < date) status[0] += 1
        else if (!endDate || endDate <= date) status[1] += 1
        else status[2] += 1
        budget += (a.budget || 0)
        orgs[a.organization_id] = true
      }

      const actionList = actions.map((a) => {
        return <ActionListItem action={a} />
      })

      return (
        <div>
          <div className={Styles.actionMetricsContainer}>
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 flex-lg between-lg">
                <div className={Styles.vizHeader}>
                  <span className={Styles.vizLabel}>ACCIONES DE<br />RECONSTRUCCIÓN</span>
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
              <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2">
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
