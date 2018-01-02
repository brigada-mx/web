import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import _ from 'lodash'

import service, { getBackoff } from 'api/service'
import FilterHeader from 'components/FilterHeader'
import OrganizationListItem from 'components/OrganizationListItem'
import Map from 'components/Map'
import LocalityPopup from 'components/Map/LocalityPopup'
import LocalityLegend from 'components/Map/LocalityLegend'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { tokenMatch } from 'tools/string'
import { dmgGrade } from 'tools/other'
import Styles from './OrganizationListScreenView.css'


const compareOrganizations = (a, b) => {
  const { total: ta } = a.meta
  const { total: tb } = b.meta
  if (Number.isNaN(ta)) {
    if (Number.isNaN(tb)) return 0
    return 1
  } else if (Number.isNaN(tb)) return -1
  return tb - ta
}

class OrganizationList extends React.PureComponent {
  render() {
    const { localities, ...rest } = this.props
    const maxItems = 250
    const items = localities.sort(compareOrganizations).slice(0, maxItems).map((l) => {
      const { cvegeo } = l
      return (
        <OrganizationListItem
          key={cvegeo}
          locality={l}
          {...rest}
        />
      )
    })
    return <div className={Styles.listContainer}>{items}</div>
  }
}

OrganizationList.propTypes = {
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
}

class OrganizationListScreenView extends React.Component {
  constructor(props) {
    super(props)

    const { location } = props
    let valState = []
    let valMuni = []
    if (location.state) {
      ({ valState = [], valMuni = [] } = location.state)
    }

    this.state = {
      localities: {
        loading: true,
      },
      localityByCvegeo: {},
      filtered: [],
      layerFilter: null,
      popup: null,
      focused: null,
      organizationSearch: '',
      valState,
      valMuni,
      valNumActions: [],
    }
    this.handleLocalitySearchKeyUp = _.debounce(
      this.handleLocalitySearchKeyUp, 150
    )
  }

  componentDidMount() {
    this.props.history.replace({
      pathname: '/organizations',
      state: {},
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const keys = ['localities', 'organizationSearch', 'valState', 'valMuni', 'valMarg', 'valNumActions']
    if (keys.some(k => prevState[k] !== this.state[k])) {
      const { localities: { data = {} } } = this.state
      if (!data.results) return

      const filtered = this.filterLocalities(data.results)
      const layerFilter = ['in', 'cvegeo'].concat(filtered.map((l) => {
        const { cvegeo } = l
        if (cvegeo.startsWith('0')) return cvegeo
        return Number.parseInt(cvegeo, 10)
      }))

      this.setState({ filtered, layerFilter })
    }
  }

  handleStateChange = (v) => {
    this.setState({ valState: v })
  }

  handleMuniChange = (v) => {
    this.setState({ valMuni: v })
  }

  handleMargChange = (v) => {
    this.setState({ valMarg: v })
  }

  handleNumActionsChange = (v) => {
    this.setState({ valNumActions: v })
  }

  handleLocalitySearchKeyUp = (organizationSearch) => {
    this.setState({ organizationSearch })
  }

  handleClickFeature = (feature) => {
    const locality = this.state.localityByCvegeo[feature.properties.cvegeo]
    if (!locality) return
    this.props.history.push(`/comunidades/${locality.id}`)
  }

  handleEnterFeature = (feature) => {
    const { localityByCvegeo } = this.state
    this.setState({ popup: localityByCvegeo[feature.properties.cvegeo] })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: null })
  }

  handleListItemClick = (item) => {
    this.props.history.push(`/organizaciones/${item.id}`)
  }

  handleListItemEnter = (item) => {
    this.setState({ focused: item })
  }

  handleListItemLeave = () => {
    this.setState({ popup: null })
  }

  filterLocalities = (results) => {
    if (!results) return []
    const { organizationSearch, valState, valMuni, valMarg, valNumActions } = this.state

    const rangeByValNumActions = {
      0: [0, 9],
      1: [10, 49],
      2: [50, 249],
      3: [250, null],
    }

    return results.filter((l) => {
      const {
        name, state_name: stateName, cvegeo = '', action_count: actions, meta: { margGrade = '' },
      } = l

      const matchesSearch = tokenMatch(`${name} ${stateName}`, organizationSearch)

      const cvegeos = valState.map(v => v.value).concat(valMuni.map(v => v.value))
      const matchesCvegeo = cvegeos.length === 0 || cvegeos.some(v => cvegeo.startsWith(v))

      const margs = valMarg.map(v => v.value)
      const matchestMarg = margs.length === 0 ||
        margs.some(v => v === margGrade.replace(/ /g, '_').toLowerCase())

      const numActions = valNumActions.map(v => rangeByValNumActions[v.value])
      const matchesActions = numActions.length === 0 ||
        numActions.some((range) => {
          const [minActions, maxActions] = range
          return (minActions === null || actions >= minActions) &&
            (maxActions === null || actions <= maxActions)
        })

      return matchesSearch && matchesCvegeo && matchestMarg && matchesActions
    })
  }

  render() {
    const { popup, localities: { data = {}, loading, error }, filtered, layerFilter } = this.state

    const { valState, valMuni, valMarg, valNumActions } = this.state
    return (
      <div>
        <FilterHeader
          localities={data.results || []}
          numResults={filtered.length}
          onStateChange={this.handleStateChange}
          onMuniChange={this.handleMuniChange}
          onMargChange={this.handleMargChange}
          onNumActionsChange={this.handleNumActionsChange}
          onKeyUp={this.handleLocalitySearchKeyUp}
          valState={valState}
          valMuni={valMuni}
          valMarg={valMarg}
          valNumActions={valNumActions}
        />
        <div className={`${Styles.container} row`}>
          <div className="col-lg-3 col-md-3 col-sm-8 col-xs-4 lg-gutter md-gutter sm-gutter xs-gutter last-sm last-xs">
            {loading && <LoadingIndicatorCircle classNameCustom={Styles.loader} />}
            {!loading &&
              <OrganizationList
                localities={filtered}
                onClick={this.handleListItemClick}
                onMouseEnter={this.handleListItemEnter}
                onMouseLeave={this.handleListItemLeave}
              />
            }
          </div>
          <div className="col-lg-9 col-md-9 col-sm-8 col-xs-4">
            <div className={Styles.mapContainer}>
              <Map
                filter={layerFilter}
                popup={popup ? <LocalityPopup locality={popup} /> : null}
                onClickFeature={this.handleClickFeature}
                onEnterFeature={this.handleEnterFeature}
                onLeaveFeature={this.handleLeaveFeature}
              />
              <LocalityLegend localities={filtered} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

OrganizationListScreenView.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
}

export default withRouter(OrganizationListScreenView)
