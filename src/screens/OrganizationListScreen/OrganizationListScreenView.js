import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import _ from 'lodash'

import FilterHeader from 'components/FilterHeader'
import OrganizationListItem from 'components/OrganizationListItem'
import Map from 'components/Map'
import LocalityPopup from 'components/Map/LocalityPopup'
import LocalityLegend from 'components/Map/LocalityLegend'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { tokenMatch } from 'tools/string'
import Styles from './OrganizationListScreenView.css'


const compareOrganizations = (a, b) => {
  return b.action_count - a.action_count
}

class OrganizationList extends React.PureComponent {
  render() {
    const { organizations, ...rest } = this.props
    const items = organizations.sort(compareOrganizations).map((o) => {
      const { id } = o
      return (
        <OrganizationListItem
          key={id}
          organization={o}
          {...rest}
        />
      )
    })
    return <div className={Styles.orgsContainer}>{items}</div>
  }
}

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.object).isRequired,
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
      popup: {},
      focused: null,
      organizationSearch: '',
      valState,
      valMuni,
      valNumActions: [],
    }
    this.handleOrganizationSearchKeyUp = _.debounce(
      this.handleOrganizationSearchKeyUp, 150
    )
  }

  componentDidMount() {
    this.props.history.replace({
      pathname: '/organizaciones',
      state: {},
    })
  }

  handleStateChange = (v) => {
    this.setState({ valState: v })
  }

  handleMuniChange = (v) => {
    this.setState({ valMuni: v })
  }

  handleNumActionsChange = (v) => {
    this.setState({ valNumActions: v })
  }

  handleOrganizationSearchKeyUp = (organizationSearch) => {
    this.setState({ organizationSearch })
  }

  handleClickFeature = (feature) => {
    this.props.history.push(`/comunidades/${feature.id}`)
  }

  handleEnterFeature = (feature) => {
    const locality = this.props.localityById[feature.properties.id]
    this.setState({ popup: { locality, organization: this.state.focused } })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: {} })
  }

  handleListItemClick = (item) => {
    this.props.history.push(`/organizaciones/${item.id}`)
  }

  handleListItemEnter = (item) => {
    this.setState({ focused: item })
  }

  filterOrganizations = (results) => {
    const { organizationSearch, valState, valMuni, valNumActions } = this.state

    const rangeByValNumActions = {
      0: [0, 9],
      1: [10, 49],
      2: [50, 249],
      3: [250, null],
    }

    return results.filter((o) => {
      const { name, desc, action_count: actions, actionCvegeos } = o

      const matchesSearch = tokenMatch(`${name} ${desc}`, organizationSearch)

      const cvegeos = valState.map(v => v.value).concat(valMuni.map(v => v.value))
      const matchesCvegeo = cvegeos.length === 0 || cvegeos.some(v => actionCvegeos.has(v))

      const numActions = valNumActions.map(v => rangeByValNumActions[v.value])
      const matchesActions = numActions.length === 0 ||
        numActions.some((range) => {
          const [minActions, maxActions] = range
          return (minActions === null || actions >= minActions) &&
            (maxActions === null || actions <= maxActions)
        })

      return matchesSearch && matchesCvegeo && matchesActions
    })
  }


  render() {
    const {
      localityById,
      localities: { data: locData, loading: locLoading, error: locError },
      organizations: { data: orgData, loading: orgLoading, error: orgError },
    } = this.props
    const { popup, focused, valState, valMuni, valNumActions } = this.state

    let features = []
    const localities = []
    if (focused) {
      features = (focused.actions).map((action) => {
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
    }

    const organizations = this.filterOrganizations(orgData ? orgData.results : [])

    return (
      <div>
        <FilterHeader
          localities={locData ? locData.results : []}
          numResults={organizations.length}
          onStateChange={this.handleStateChange}
          onMuniChange={this.handleMuniChange}
          onNumActionsChange={this.handleNumActionsChange}
          onKeyUp={this.handleOrganizationSearchKeyUp}
          valState={valState}
          valMuni={valMuni}
          valNumActions={valNumActions}
        />
        <div className={`${Styles.container} row`}>
          <div className={Styles.temporary}>
            <div className="wrapper-lg wrapper-md">
              <div className="col-lg-6 col-md-6 col-sm-8 col-xs-4">
                {orgLoading && <LoadingIndicatorCircle classNameCustom={Styles.loader} />}
                {!orgLoading &&
                  <OrganizationList
                    organizations={organizations}
                    onClick={this.handleListItemClick}
                    onMouseEnter={this.handleListItemEnter}
                    onMouseLeave={this.handleListItemLeave}
                  />
                }
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-8 col-xs-4">
            <div className={Styles.mapContainer}>
              <Map
                features={features}
                popup={popup ? <LocalityPopup
                  locality={popup.locality}
                  organization={popup.organization}
                  screen="org"
                /> : null}
                onClickFeature={this.handleClickFeature}
                onEnterFeature={this.handleEnterFeature}
                onLeaveFeature={this.handleLeaveFeature}
              />
              <LocalityLegend localities={localities} />
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
  localityById: PropTypes.object.isRequired,
  localities: PropTypes.object.isRequired,
  organizations: PropTypes.object.isRequired,
}

export default withRouter(OrganizationListScreenView)
