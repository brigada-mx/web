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
import Styles from './MapScreen.css'


const LocalityList = ({ localities, ...rest }) => {
  const maxItems = 250
  const items = localities.slice(0, maxItems).map((l) => {
    const { cvegeo } = l
    return (
      <LocalityListItem
        key={cvegeo}
        locality={l}
        {...rest}
      />
    )
  })
  if (items.length === 0) return <LoadingIndicatorCircle classNameCustom={Styles.loader} />
  return <div className={Styles.listContainer}>{items}</div>
}

LocalityList.propTypes = {
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
}

class MapScreen extends React.Component {
  constructor(props) {
    super(props)

    const { location } = props
    this.state = {
      localities: {
        loading: true,
      },
      locSearch: '',
      cvegeo: location.state ? location.state.cvegeo || '' : '',
      marg: '',
      popup: null,
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
    getBackoff(this, 'localities', service.getLocalities)
    getBackoff(this, 'localitiesStatic', service.getLocalitiesStatic)
  }

  handleStateChange = (e) => {
    this.setState({ cvegeo: e.target.value.substring(0, 2) })
  }

  handleMuniChange = (e) => {
    this.setState({ cvegeo: e.target.value.substring(0, 5) })
  }

  handleMargChange = (e) => {
    this.setState({ marg: e.target.value })
  }

  handleClickFeature = (feature) => {
    this.props.history.push(`/comunidades/c/${feature.properties.cvegeo}`)
  }

  handleEnterFeature = (feature) => {
    this.setState({ popup: feature })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: null })
  }

  handleListItemClickFeature = (feature) => {
    this.props.history.push(`/comunidades/c/${feature.properties.cvegeo}`)
  }

  handleListItemEnterFeature = (feature) => {
    this.setState({ popup: feature })
  }

  handleListItemLeaveFeature = () => {
    this.setState({ popup: null })
  }

  handleLocalitySearchKeyUp = (locSearch) => {
    this.setState({ locSearch })
  }

  filterLocalities = (results) => {
    if (!results) return []
    const { locSearch, cvegeo: cvegeoSearch, marg } = this.state

    return results.filter((l) => {
      const { name, state_name: stateName, cvegeo, meta: { margGrade } } = l
      const matchesSearch = tokenMatch(`${name} ${stateName}`, locSearch)
      const matchesCvegeo = !cvegeo || cvegeo.startsWith(cvegeoSearch)
      const matchestMarg = !marg || marg === margGrade.replace(/ /g, '_').toLowerCase()
      return matchesSearch && matchesCvegeo && matchestMarg
    })
  }

  render() {
    const { popup, localities: { data = {}, loading, error } } = this.state

    const _popup = popup ? <LocalityPopup locality={popup} /> : null
    const localities = this.filterLocalities(data.results)
    return (
      <div>
        <FilterHeader
          localities={data.results || []}
          numResults={localities.length}
          onStateChange={this.handleStateChange}
          onMuniChange={this.handleMuniChange}
          onMargChange={this.handleMargChange}
          onKeyUp={this.handleLocalitySearchKeyUp}
        />
        <div className={`${Styles.map} row`}>
          <div className="col-lg-3 col-md-3 col-sm-2 col-xs-2">
            <LocalityList
              localities={localities}
              onClick={this.handleListItemClickFeature}
              onMouseEnter={this.handleListItemEnterFeature}
              onMouseLeave={this.handleListItemLeaveFeature}
            />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-2 col-xs-2">
            <Map
              cvegeoFilter={data.results && localities.map(l => l.cvegeo)}
              popup={_popup}
              onClickFeature={this.handleClickFeature}
              onEnterFeature={this.handleEnterFeature}
              onLeaveFeature={this.handleLeaveFeature}
            />
            {/* <LocalityLegend localities={localities} /> */}
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
