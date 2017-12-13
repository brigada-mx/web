import React from 'react'

import ReactMapboxGl, { Layer, Feature, ZoomControl } from 'react-mapbox-gl'


const Mapbox = ReactMapboxGl({
  accessToken: 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA',
  scrollZoom: false,
})

class Map extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Mapbox
      style="mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk"
      zoom={[6]}
      center={[-95.9042505, 17.1073688]}
      containerStyle={{
        height: '100vh',
        width: '100vw',
      }}>
      <ZoomControl position="top-left" />
      <Layer
        type="symbol"
        id="marker"
        layout={{ 'icon-image': 'marker-15' }}
      >
        <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
      </Layer>
    </Mapbox>
  }
}

export default Map
