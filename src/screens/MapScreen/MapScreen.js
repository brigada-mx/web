import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import _ from 'lodash'

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
    const { cvegeo } = l.properties
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
    this.state = {
      localities: [],
      actionSearch: '',
      locSearch: '',
      state: '',
      muni: '',
      marg: '',
      popup: null,
    }
    this.handleLocalitySearchKeyUp = _.debounce(
      this.handleLocalitySearchKeyUp, 150
    )
  }

  handleLoad = (localities) => {
    this.setState({ localities })
  }

  handleStateChange = (e) => {
    this.setState({ state: e.target.value.substring(0, 2) })
  }

  handleMuniChange = (e) => {
    this.setState({ muni: e.target.value.substring(0, 5) })
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

  filterLocalities = () => {
    const { localities, locSearch, marg, muni, state } = this.state

    return localities.filter((l) => {
      const { locName, stateName, margGrade, cvegeoS } = l.properties
      const matchesSearch = tokenMatch(`${locName} ${stateName}`, locSearch)
      const matchesState = !state || state === cvegeoS.substring(0, 2)
      const matchesMuni = !muni || muni === cvegeoS.substring(0, 5)
      const matchestMarg = !marg || marg === margGrade.replace(/ /g, '_').toLowerCase()
      return matchesSearch && matchesState && matchesMuni && matchestMarg
    })
  }

  render() {
    const localities = this.filterLocalities()
    const { popup } = this.state
    const _popup = popup ? <LocalityPopup locality={popup} /> : null
    return (
      <div>
        <FilterHeader
          localities={this.state.localities}
          numResults={localities.length}
          onStateChange={this.handleStateChange}
          onMuniChange={this.handleMuniChange}
          onMargChange={this.handleMargChange}
          onKeyUp={this.handleLocalitySearchKeyUp}
        />
        <div className={`${Styles.map} row`}>
          <div className="col-lg-3 col-md-3 col-sm-8 last-sm col-xs-8">
            <LocalityList
              localities={localities}
              onClick={this.handleListItemClickFeature}
              onMouseEnter={this.handleListItemEnterFeature}
              onMouseLeave={this.handleListItemLeaveFeature}
            />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-8 col-xs-8">
            <Map
              localities={localities}
              onLoad={this.handleLoad}
              popup={_popup}
              onClickFeature={this.handleClickFeature}
              onEnterFeature={this.handleEnterFeature}
              onLeaveFeature={this.handleLeaveFeature}
            />
            <LocalityLegend localities={localities} />
          </div>
        </div>
      </div>
    )
  }
}

MapScreen.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(MapScreen)
