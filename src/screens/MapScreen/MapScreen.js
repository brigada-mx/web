import React from 'react'

import Header from 'components/Header'
import Map from 'components/Map'


class MapScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>
      <Header />
      <Map />
    </div>
  }
}

export default MapScreen
