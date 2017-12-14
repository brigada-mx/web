import React from 'react'

import Header from 'components/Header'
import Map from 'components/Map'

import LocalityListItem from 'components/Map/LocalityListItem'
import { tokenMatch } from 'tools/string'
import LocalityPopup from 'components/Map/LocalityPopup'
import Styles from './MapScreen.css'


const LocalityList = ({ localities }) => {
  const maxItems = 250
  return localities.slice(0, maxItems).map((l) => {
    const { cvegeo } = l.properties
    return <LocalityListItem key={cvegeo} locality={l} />
  })
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
        <Header
          localities={this.state.localities}
          onStateChange={this.handleStateChange}
          onMuniChange={this.handleMuniChange}
          onMargChange={this.handleMargChange}
        />
        <Map
          localities={localities}
          onLoad={this.handleLoad}
          popup={_popup}
          onClickFeature={this.handleClickFeature}
          onEnterFeature={this.handleEnterFeature}
          onLeaveFeature={this.handleLeaveFeature}
        />
        <LocalityList localities={localities} />
      </div>
    )
  }
}

export default MapScreen
