import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import debounce from 'lodash/debounce'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import FilterHeader, { parseFilterQueryParams } from 'components/FilterHeader'
import SearchInput from 'components/SearchInput'
import LocalityListItem from 'components/LocalityListItem'
import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import LocalityLegend from 'components/LocalityDamageMap/LocalityLegend'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { tokenMatch } from 'tools/string'
import { dmgGrade, fitBoundsFromCoords, itemFromScrollEvent } from 'tools/other'
import { localStorage } from 'tools/storage'
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
    const { localities, focusedId, onScroll, ...rest } = this.props

    const maxItems = window.innerWidth >= 980 ? 250 : 30
    const _localities = localities.slice(-maxItems).reverse()

    const handleScroll = (e) => { onScroll(e, _localities) }

    const items = _localities.map((l) => {
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
    return <div onScroll={handleScroll} className={Styles.listContainer}>{items}</div>
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
      popup: null,
      filtersVisible: false,
    }
    this.handleLocalitySearchKeyUp = debounce(this.handleLocalitySearchKeyUp, 150)
    this.filterFields = ['state', 'muni', 'marg', 'numActions']
    this._localityById = {}
  }

  componentWillUnmount() {
    this.props.onSearch('locSearch', '')
  }

  handleLocalitySearchKeyUp = (locSearch) => {
    this.props.onSearch('locSearch', locSearch)
  }

  handleClickFeature = (feature) => {
    const locality = this._localityById[feature.properties.id]
    if (!locality) return
    this.props.history.push(`/comunidades/${locality.id}`)
  }

  handleEnterFeature = (feature) => {
    this.setState({ popup: this._localityById[feature.properties.id] })
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

  render() {
    const { popup, filtersVisible } = this.state
    const { valState, valMuni, valMarg, valNumActions, localities, filtered, fitBounds } = this.props

    const filter = (style = {}) => {
      return (
        <FilterHeader
          fields={this.filterFields}
          style={style}
          localities={localities}
          valState={valState}
          valMuni={valMuni}
          valMarg={valMarg}
          valNumActions={valNumActions}
        />
      )
    }

    const features = filtered.map((l) => {
      const { location: { lat, lng }, meta: { total }, id } = l

      return {
        type: 'Feature',
        properties: { id, total },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }
    })

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
            {localities.length === 0 && <LoadingIndicatorCircle className={Styles.loader} />}
            {localities.length > 0 &&
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
              <LocalityDamageMap
                popup={popup ? <LocalityPopup locality={popup} screen="loc" /> : null}
                features={features}
                onClickFeature={this.handleClickFeature}
                onEnterFeature={this.handleEnterFeature}
                onLeaveFeature={this.handleLeaveFeature}
                fitBounds={fitBounds.length > 0 ? fitBounds : undefined}
              />
              <div className="sm-hidden xs-hidden">
                <LocalityLegend localities={filtered} legendTitle="Nivel de daño" />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

MapScreen.propTypes = {
  onSearch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  valState: PropTypes.array.isRequired,
  valMuni: PropTypes.array.isRequired,
  valMarg: PropTypes.array.isRequired,
  valNumActions: PropTypes.array.isRequired,
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  filtered: PropTypes.arrayOf(PropTypes.object).isRequired,
  fitBounds: PropTypes.array.isRequired,
}

MapScreen.defaultProps = {
  valState: [],
  valMuni: [],
  valMarg: [],
  valNumActions: [],
  localities: [],
  filtered: [],
  fitBounds: [],
}

// THIS IS AN ANTI-PATTERN, because it will rerender map screen on any change to redux store
const mapStateToProps = (state, { location }) => {
  const { locSearch } = state.search
  const { valState, valMuni, valMarg, valNumActions } = parseFilterQueryParams(location)
  return { valState, valMuni, valMarg, valNumActions }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSearch: (key, value) => Actions.searchSet(dispatch, { key, value }),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapScreen))
