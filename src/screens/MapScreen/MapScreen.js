import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'

import service, { getBackoffComponent } from 'api/service'
import FilterHeader, { parseFilterQueryParams } from 'components/FilterHeader'
import SearchInput from 'components/SearchInput'
import LocalityListItem from 'components/LocalityListItem'
import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import LocalityLegend from 'components/LocalityDamageMap/LocalityLegend'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import MapErrorBoundary from 'components/MapErrorBoundary'
import { tokenMatch } from 'tools/string'
import { dmgGrade, fitBoundsFromCoords, itemFromScrollEvent } from 'tools/other'
import { localStorage } from 'tools/storage'
import env from 'src/env'
import Styles from './MapScreen.css'


const { mapbox: { sourceOptions, sourceLayer } } = env

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
  maxItems = () => {
    return window.innerWidth >= 980 ? 250 : 30
  }

  handleScroll = (e) => {
    this.props.onScroll(e, this.props.localities.slice(0, this.maxItems()))
  }

  render() {
    const { localities, focusedId, ...rest } = this.props
    const items = localities.slice(0, this.maxItems()).map((l) => {
      const { cvegeo, id } = l
      return (
        <LocalityListItem
          key={cvegeo}
          locality={l}
          to={`/comunidades/${id}`}
          {...rest}
          focused={focusedId === id && id !== undefined}
        />
      )
    })
    return <div onScroll={this.handleScroll} className={Styles.listContainer}>{items}</div>
  }
}

LocalityList.propTypes = {
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onScroll: PropTypes.func.isRequired,
  focusedId: PropTypes.number,
}

class MapScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      localities: {
        loading: true,
      },
      localityByCvegeo: {},
      filtered: [],
      fitBounds: [],
      layerFilter: null,
      popup: null,
      locSearch: '',
      filtersVisible: false,
    }
    this.handleLocalitySearchKeyUp = _.debounce(this.handleLocalitySearchKeyUp, 150)
    this.filterFields = ['state', 'muni', 'marg', 'numActions']
  }

  componentDidMount() {
    document.title = 'Brigada'
    this._mounted = true

    getBackoffComponent(this, 'localities', service.getLocalities, ({ data }) => {
      if (!data) return
      const localityByCvegeo = {}
      const coords = []
      data.results = data.results.map((r) => { // eslint-disable-line no-param-reassign
        coords.push(r.location)
        localityByCvegeo[r.cvegeo] = r
        return { ...r, dmgGrade: dmgGrade(r) }
      })
      const fitBounds = fitBoundsFromCoords(coords)
      localStorage.setItem('719s:fitBounds', JSON.stringify(fitBounds))
      this.setState({ localityByCvegeo })
    })
  }

  componentWillUnmount() {
    this._mounted = false
  }

  componentDidUpdate(prevProps, prevState) {
    const filterKeys = ['valState', 'valMuni', 'valMarg', 'valNumActions']
    const keys = ['localities', 'locSearch']
    const locKeys = ['valState', 'valMuni']

    if (!keys.some(k => prevState[k] !== this.state[k]) &&
      !filterKeys.some(k => prevProps[k] !== this.props[k])) return

    const { localities: { data = {} } } = this.state
    if (!data.results || data.results.length === 0) return

    const filtered = this.filterLocalities(data.results).sort(compareLocalities)
    const layerFilter = ['in', 'cvegeo'].concat(filtered.map((l) => {
      const { cvegeo } = l
      if (cvegeo.startsWith('0')) return cvegeo
      return Number.parseInt(cvegeo, 10)
    }))

    if (locKeys.some(k => prevProps[k] !== this.props[k]) || this.state.fitBounds.length === 0) {
      const fitBounds = fitBoundsFromCoords(filtered.map(l => l.location))
      this.setState({ filtered, layerFilter, fitBounds })
    } else {
      this.setState({ filtered, layerFilter })
    }
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

  handleEnterListItem = (item) => {
    this.setState({ popup: item })
  }

  handleLeaveListItem = () => {
    this.setState({ popup: null })
  }

  handleScroll = (e, localities) => {
    if (window.innerWidth >= 980) return
    this.setState({ popup: itemFromScrollEvent(e, localities) })
  }

  handleToggleFilters = () => {
    this.setState({ filtersVisible: !this.state.filtersVisible })
  }

  filterLocalities = (results) => {
    const { locSearch } = this.state
    const { valState, valMuni, valMarg, valNumActions } = this.props

    const rangeByValNumActions = {
      0: [null, 0],
      1: [1, 9],
      2: [10, 49],
      3: [50, null],
    }

    return results.filter((l) => {
      const {
        name, state_name: stateName, cvegeo = '', action_count: actions, meta: { margGrade },
      } = l

      const matchesSearch = tokenMatch(`${name} ${stateName}`, locSearch)

      const cvegeos = valState.map(v => v.value).concat(valMuni.map(v => v.value))
      const matchesCvegeo = cvegeos.length === 0 || cvegeos.some(v => cvegeo.startsWith(v))

      const margs = valMarg.map(v => v.value)
      const matchestMarg = margs.length === 0 ||
        margs.some(v => v === (margGrade || '').replace(/ /g, '_').toLowerCase())

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
    const {
      popup,
      localities: { data = {}, loading, error },
      filtered,
      layerFilter,
      fitBounds,
      filtersVisible,
    } = this.state
    const { valState, valMuni, valMarg, valNumActions } = this.props

    const filter = (style = {}) => {
      return (
        <FilterHeader
          fields={this.filterFields}
          style={style}
          localities={data.results || []}
          valState={valState}
          valMuni={valMuni}
          valMarg={valMarg}
          valNumActions={valNumActions}
        />
      )
    }

    return (
      <React.Fragment>
        <div className="row middle between wrapper sm-hidden xs-hidden">
          {filter()}
          <SearchInput numResults={filtered.length} onKeyUp={this.handleLocalitySearchKeyUp} />
        </div>

        <div className={`${Styles.search} md-hidden lg-hidden`}>
          <SearchInput numResults={filtered.length} onKeyUp={this.handleLocalitySearchKeyUp} />
        </div>

        <div className="row baseline between wrapper lg-hidden md-hidden">
          <span className={Styles.filterButton} onClick={this.handleToggleFilters}>FILTROS</span>
          <LocalityLegend localities={filtered} legendTitle="Nivel de daño" />
        </div>

        {filtersVisible &&
          <React.Fragment>
            <div className={`${Styles.filtersSmallScreen} lg-hidden md-hidden`}>{filter({ maxWidth: '100vw' })}</div>
            <span className={`${Styles.updateButton} lg-hidden md-hidden`} onClick={this.handleToggleFilters}>
              Actualizar resultados
            </span>
          </React.Fragment>
        }

        <div className={`${Styles.container} row`}>
          <div className={`${Styles.flexOverflow} col-lg-3 col-md-3 col-sm-8 col-xs-4 gutter last-sm last-xs`}>
            {loading && <LoadingIndicatorCircle className={Styles.loader} />}
            {!loading &&
              <LocalityList
                localities={filtered}
                onScroll={this.handleScroll}
                onMouseEnter={this.handleEnterListItem}
                onMouseLeave={this.handleLeaveListItem}
                focusedId={popup ? popup.id : null}
              />
            }
          </div>
          <div className={`${Styles.flexOverflowTwo} col-lg-9 col-md-9 col-sm-8 col-xs-4`}>
            <div className={Styles.mapContainer}>
              <MapErrorBoundary>
                <LocalityDamageMap
                  filter={layerFilter}
                  popup={popup ? <LocalityPopup locality={popup} screen="loc" /> : null}
                  sourceOptions={sourceOptions}
                  sourceLayer={sourceLayer}
                  onClickFeature={this.handleClickFeature}
                  onEnterFeature={this.handleEnterFeature}
                  onLeaveFeature={this.handleLeaveFeature}
                  fitBounds={fitBounds.length > 0 ? fitBounds : undefined}
                />
                <div className="sm-hidden xs-hidden">
                  <LocalityLegend localities={filtered} legendTitle="Nivel de daño" />
                </div>
              </MapErrorBoundary>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

MapScreen.propTypes = {
  history: PropTypes.object.isRequired,
  valState: PropTypes.array.isRequired,
  valMuni: PropTypes.array.isRequired,
  valMarg: PropTypes.array.isRequired,
  valNumActions: PropTypes.array.isRequired,
}

MapScreen.defaultProps = {
  valState: [],
  valMuni: [],
  valMarg: [],
  valNumActions: [],
}

const mapStateToProps = (state, { location }) => {
  const { valState, valMuni, valMarg, valNumActions } = parseFilterQueryParams(location)
  return { valState, valMuni, valMarg, valNumActions }
}

export default withRouter(connect(mapStateToProps, null)(MapScreen))
