import React from 'react'

import Header from 'components/Header'
import Map from 'components/Map'

import { tokenMatch } from 'tools/string'


const LocalityList = (localities) => {
  return localities.map((l) => {
    return null
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
    return (
      <div>
        <Header
          localities={this.state.localities}
          onStateChange={this.handleStateChange}
          onMuniChange={this.handleMuniChange}
          onMargChange={this.handleMargChange}
        />
        <Map localities={localities} onLoad={this.handleLoad} />
      </div>
    )
  }
}

export default MapScreen
