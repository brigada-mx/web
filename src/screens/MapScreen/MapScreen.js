import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import FilterHeader from 'components/FilterHeader'
import LocalityListItem from 'components/LocalityListItem'
import Map from 'components/Map'
import LocalityPopup from 'components/Map/LocalityPopup'
import LocalityLegend from 'components/Map/LocalityLegend'
import { tokenMatch } from 'tools/string'
import Styles from './MapScreen.css'


const LocalityList = ({ localities, onKeyUp, ...rest }) => {
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

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar localidades"
        onKeyUp={e => onKeyUp(e.target.value)}
      />
      {items}
    </div>
  )
}

LocalityList.propTypes = {
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onKeyUp: PropTypes.func.isRequired,
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
    console.log(feature)
  }

  handleEnterFeature = (feature) => {
    this.setState({ popup: feature })
  }

  handleLeaveFeature = () => {
    this.setState({ popup: null })
  }

  handleListItemClickFeature = (feature) => {
    console.log(feature)
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
          onStateChange={this.handleStateChange}
          onMuniChange={this.handleMuniChange}
          onMargChange={this.handleMargChange}
        />
        <div className={Styles.map}>
        <Map
          localities={localities}
          onLoad={this.handleLoad}
          popup={_popup}
          onClickFeature={this.handleClickFeature}
          onEnterFeature={this.handleEnterFeature}
          onLeaveFeature={this.handleLeaveFeature}
        />
        <LocalityLegend localities={localities} />
        <LocalityList
          localities={localities}
          onKeyUp={this.handleLocalitySearchKeyUp}
          onClick={this.handleListItemClickFeature}
          onMouseEnter={this.handleListItemEnterFeature}
          onMouseLeave={this.handleListItemLeaveFeature}
        />
      </div>
      </div>
    )
  }
}

export default MapScreen
