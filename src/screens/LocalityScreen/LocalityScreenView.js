import React from 'react'
import PropTypes from 'prop-types'

import { NavLink } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

import FeatureMap from 'components/FeatureMap'
import MetricsBar from 'components/MetricsBar'
import StackedMetricsBar from 'components/StackedMetricsBar'
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
      height={200}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
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
        return <div key={i}><span>{barLabels[i]}</span><MetricsBar value={v} max={100} /></div>
      })

      return (
        <div>
          <LocalityBreadcrumb
            cvegeo={cvegeo}
            munName={munName}
            stateName={stateName}
            name={name}
          />
          <span style={{ color: dmgMeta.color }}>{`DAÑO ${dmgMeta.label}`}</span>
          <div>{name}, {munName}, {stateName}</div>
          <DirectionsButton lat={lat} lng={lng} />

          <div>VIVIENDAS DAÑADAS {total}</div>
          <div>MARGINACIÓN SOCIAL {margGrade}</div>

          <DmgBarChart {...{ destroyed, habit, notHabit }} />
          <div className={Styles.metricsContainer}>{bars}</div>

        </div>
      )
    }
    return <LoadingIndicatorCircle />
  }

  renderEstablishmentsSection = () => {
    const { establishments: { loading, data, error } } = this.props
    return null
    return (
      <FeatureMap
        onClickFeature={this.handleClickFeature}
        onEnterFeature={this.handleEnterFeature}
        onLeaveFeature={this.handleLeaveFeature}
      />
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
      const status = {}
      for (const a of actions) {
        budget += (a.budget || 0)
        orgs[a.organization_id] = true
      }

      const labels = ['Por iniciar', 'En progreso', 'Completado']

      return (
        <div>
          <div>ACCIONES DE RECONSTRUCCIÓN {actions.length}</div>
          <div>ORGANIZACIONES COMPROMETIDAS {Object.keys(orgs).length}</div>
          <div>INVERSIÓN ESTIMADA {fmtBudget(budget)}</div>
          <StackedMetricsBar labels={labels} values={[1, 0, 3]} />
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
