import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import _ from 'lodash'

import service, { getBackoff } from 'api/service'
import FilterHeader from 'components/FilterHeader'
import LocalityListItem from 'components/LocalityListItem'
import Map from 'components/Map'
import LocalityPopup from 'components/Map/LocalityPopup'
import LocalityLegend from 'components/Map/LocalityLegend'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { tokenMatch } from 'tools/string'
import { dmgGrade } from 'tools/other'
import Styles from './MapScreen.css'


const compareLocalities = (a, b) => {
  const { total: ta } = a.meta
  const { total: tb } = b.meta
  if (Number.isNaN(ta)) {
    if (Number.isNaN(tb)) return 0
    return 1
  } else if (Number.isNaN(tb)) return -1
  return tb - ta
}

class LocalityList extends React.PureComponent {
  render() {
    const { localities, ...rest } = this.props
    const maxItems = 250
    const items = localities.sort(compareLocalities).slice(0, maxItems).map((l) => {
      const { cvegeo } = l
      return (
        <LocalityListItem
          key={cvegeo}
          locality={l}
          {...rest}
        />
      )
    })
    return <div className={Styles.listContainer}>{items}</div>
  }
}

LocalityList.propTypes = {
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
}

class MapScreen extends React.Component {
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
      locSearch: '',
      valState,
      valMuni,
      valMarg: [],
      valNumActions: [],
    }
    this.handleLocalitySearchKeyUp = _.debounce(
      this.handleLocalitySearchKeyUp, 150
    )
  }

  componentDidMount() {
    this.props.history.replace({
      pathname: '/',
      state: {},
    })

    getBackoff(this, 'localities', service.getLocalitiesStatic, {
      onData: (data) => {
        const localityByCvegeo = {}
        data.results = data.results.map((r) => { // eslint-disable-line no-param-reassign
          localityByCvegeo[r.cvegeo] = r
          return { ...r, dmgGrade: dmgGrade(r) }
        })
        this.setState({ localityByCvegeo })
      },
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const keys = ['localities', 'locSearch', 'valState', 'valMuni', 'valMarg', 'valNumActions']
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

  handleLocalitySearchKeyUp = (locSearch) => {
    this.setState({ locSearch })
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

  handleListItemClickFeature = (feature) => {
    this.props.history.push(`/comunidades/${feature.id}`)
  }

  handleListItemEnterFeature = (feature) => {
    this.setState({ popup: feature })
  }

  handleListItemLeaveFeature = () => {
    this.setState({ popup: null })
  }

  filterLocalities = (results) => {
    if (!results) return []
    const { locSearch, valState, valMuni, valMarg, valNumActions } = this.state

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

      const matchesSearch = tokenMatch(`${name} ${stateName}`, locSearch)

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
              <LocalityList
                localities={filtered}
                onClick={this.handleListItemClickFeature}
                onMouseEnter={this.handleListItemEnterFeature}
                onMouseLeave={this.handleListItemLeaveFeature}
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

MapScreen.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
}

export default withRouter(MapScreen)
