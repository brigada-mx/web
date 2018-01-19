import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import _ from 'lodash'

import FilterHeader from 'components/FilterHeader'
import SearchInput from 'components/SearchInput'
import OrganizationListItem from 'components/OrganizationListItem'
import LocalityDamageMap from 'components/LocalityDamageMap'
import LocalityPopup from 'components/LocalityDamageMap/LocalityPopup'
import LocalityLegend from 'components/LocalityDamageMap/LocalityLegend'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { tokenMatch } from 'tools/string'
import { localStorage } from 'tools/storage'
import { fitBoundsFromCoords, itemFromScrollEvent } from 'tools/other'
import Styles from './OrganizationListScreenView.css'


class OrganizationList extends React.PureComponent {
  handleScroll = (e) => {
    this.props.onScroll(e, this.props.organizations)
  }

  render() {
    const { organizations, onScroll, focusedId, ...rest } = this.props
    const items = organizations.map((o) => {
      const { id } = o

      return (
        <OrganizationListItem
          key={id}
          organization={o}
          focused={id === focusedId}
          {...rest}
        />
      )
    })
    return <div onScroll={this.handleScroll} className={Styles.orgsContainer}>{items}</div>
  }
}

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onScroll: PropTypes.func.isRequired,
  focusedId: PropTypes.number,
}

class OrganizationListScreenView extends React.Component {
  constructor(props) {
    super(props)

    const { location } = props
    let valState = []
    let valMuni = []
    let valSector = []
    let valActionType = []
    if (location.state) {
      ({ valState = [], valMuni = [], valSector = [], valActionType = [] } = location.state)
    }

    this.state = {
      popup: {},
      focused: null,
      fitBounds: this.defaultFitBounds(),
      organizationSearch: '',
      filtersVisible: false,
      valState,
      valMuni,
      valSector,
      valActionType,
    }
    this.handleOrganizationSearchKeyUp = _.debounce(
      this.handleOrganizationSearchKeyUp, 150
    )
    this._fitBounds = this.defaultFitBounds()
  }

  defaultFitBounds = () => {
    return JSON.parse(localStorage.getItem('719s:fitBounds')) || []
  }

  componentDidMount() {
    this.props.history.replace({
      pathname: '/organizaciones',
      state: {},
    })
    this._fitBounds = this.defaultFitBounds()
  }

  componentDidUpdate(prevProps, prevState) {
    const locKeys = ['valState', 'valMuni']
    if (!locKeys.some(k => prevState[k] !== this.state[k]) && this.state.focused) return

    const { data } = this.props.organizations
    if (!data) return
    const organizations = this.filterOrganizations(data.results)
    const [focused] = organizations

    const state = {}

    if (locKeys.some(k => prevState[k] !== this.state[k])) {
      const { valState, valMuni } = this.state
      if (valState.length === 0 && valMuni.length === 0) {
        state.fitBounds = this._fitBounds
      } else {
        const coords = [].concat(...organizations.map((o) => {
          return o.actions.map(a => a.locality.location)
        }))
        state.fitBounds = fitBoundsFromCoords(coords)
      }
    }

    if (focused && !this.state.focused) state.focused = focused
    this.setState(state)
  }

  handleStateChange = (v) => {
    this.setState({ valState: v })
  }

  handleMuniChange = (v) => {
    this.setState({ valMuni: v })
  }

  handleSectorChange = (v) => {
    this.setState({ valSector: v })
  }

  handleActionTypeChange = (v) => {
    this.setState({ valActionType: v })
  }

  handleOrganizationSearchKeyUp = (organizationSearch) => {
    this.setState({ organizationSearch })
  }

  handleClickFeature = (feature) => {
    this.props.history.push(`/comunidades/${feature.properties.id}`)
  }

  handleEnterFeature = (feature) => {
    const locality = this.props.localityById[feature.properties.id]
    this.setState({ popup: { locality, organization: this.state.focused } })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: {} })
  }

  handleClickListItem = (item) => {
    this.props.history.push(`/organizaciones/${item.id}`)
  }

  handleEnterListItem = (item) => {
    this.setState({ focused: item })
  }

  handleScroll = (e, organizations) => {
    if (window.innerWidth >= 980) return
    this.setState({ focused: itemFromScrollEvent(e, organizations) })
  }

  handleToggleFilters = () => {
    this.setState({ filtersVisible: !this.state.filtersVisible })
  }

  filterOrganizations = (results) => {
    const { organizationSearch, valState, valMuni, valSector, valActionType } = this.state

    const compareOrganizations = (a, b) => {
      return b.action_count - a.action_count
    }

    return results.filter((o) => {
      const { name, desc, actionCvegeos } = o

      const matchesSearch = tokenMatch(`${name} ${desc}`, organizationSearch)

      const cvegeos = valState.map(v => v.value).concat(valMuni.map(v => v.value))
      const matchesCvegeo = cvegeos.length === 0 || cvegeos.some(v => actionCvegeos.has(v))

      const sectors = valSector.map(v => v.value)
      const matchesSector = sectors.length === 0 || sectors.some(v => o.sector === v)

      const actionTypes = valActionType.map(v => v.value)
      let matchesActionType = actionTypes.length === 0
      for (const action of o.actions) {
        if (actionTypes.some(v => action.action_type === v)) {
          matchesActionType = true
          break
        }
      }

      return matchesSearch && matchesCvegeo && matchesSector && matchesActionType
    }).sort(compareOrganizations)
  }

  getLocalityFeatures = (organization) => {
    const localities = []
    const features = organization.actions.map((action) => {
      const { location: { lat, lng }, cvegeo, id } = action.locality
      const locality = this.props.localityById[id]
      let total = -1

      if (locality) {
        ({ total } = locality.meta)
        localities.push(locality)
      }

      return {
        type: 'Feature',
        properties: {
          cvegeo,
          id,
          total,
          locality,
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }
    })
    return { localities, features }
  }

  render() {
    const {
      localities: { data: locData, loading: locLoading, error: locError },
      organizations: { data: orgData, loading: orgLoading, error: orgError },
    } = this.props
    const {
      popup,
      focused,
      valState,
      valMuni,
      valSector,
      valActionType,
      filtersVisible,
    } = this.state

    const organizations = this.filterOrganizations(orgData ? orgData.results : [])
    let [_focused] = organizations
    if (focused && organizations.some(o => focused.id === o.id)) _focused = focused

    let localities = []
    let features = []
    if (_focused) ({ localities, features } = this.getLocalityFeatures(_focused))

    const filter = (
      <FilterHeader
        localities={locData ? locData.results : []}
        actions={orgData ? [].concat(...orgData.results.map(o => o.actions)) : []}
        onStateChange={this.handleStateChange}
        onMuniChange={this.handleMuniChange}
        onSectorChange={this.handleSectorChange}
        onActionTypeChange={this.handleActionTypeChange}
        valState={valState}
        valMuni={valMuni}
        valSector={valSector}
        valActionType={valActionType}
      />
    )

    return (
      <React.Fragment>
        <div className={Styles.filterShadow}>
          <div className="row middle between wrapper sm-hidden xs-hidden">
            {filter}
            <SearchInput
              numResults={organizations.length}
              onKeyUp={this.handleOrganizationSearchKeyUp}
            />
          </div>
        </div>

        <div className={`${Styles.search} md-hidden lg-hidden`}>
          <SearchInput
            numResults={organizations.length}
            onKeyUp={this.handleLocalitySearchKeyUp}
          />
        </div>

        <div className="row baseline between wrapper lg-hidden md-hidden">
          <span className={Styles.filterButton} onClick={this.handleToggleFilters}>FILTROS</span>
          <LocalityLegend localities={localities} legendTitle="Nivel de daño" />
        </div>

        {filtersVisible &&
          <div className={`${Styles.filtersSmallScreen} lg-hidden md-hidden`}>{filter}</div>
        }

        <div className={`${Styles.container} row`}>
          <div className="col-lg-6 col-md-6 col-sm-8 col-xs-4 gutter last-sm last-xs">
            {orgLoading && <LoadingIndicatorCircle className={Styles.loader} />}
            {!orgLoading &&
              <OrganizationList
                organizations={organizations}
                onScroll={this.handleScroll}
                focusedId={_focused && _focused.id}
                onClick={this.handleClickListItem}
                onMouseEnter={this.handleEnterListItem}
                onMouseLeave={this.handleLeaveListItem}
              />
            }
          </div>
          <div className="col-lg-6 col-md-6 col-sm-8 col-xs-4">
            <div className={Styles.mapContainer}>
              <LocalityDamageMap
                features={features}
                popup={popup ? <LocalityPopup
                  locality={popup.locality}
                  organization={popup.organization}
                  screen="org"
                /> : null}
                onClickFeature={this.handleClickFeature}
                onEnterFeature={this.handleEnterFeature}
                onLeaveFeature={this.handleLeaveFeature}
                fitBounds={this.state.fitBounds.length > 0 ? this.state.fitBounds : undefined}
              />
              <LocalityLegend className="sm-hidden xs-hidden" localities={localities} legendTitle="¿Dónde opera?" />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

OrganizationListScreenView.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
  localityById: PropTypes.object.isRequired,
  localities: PropTypes.object.isRequired,
  organizations: PropTypes.object.isRequired,
}

export default withRouter(OrganizationListScreenView)
