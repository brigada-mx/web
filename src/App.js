import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Nav from 'components/Nav'
import MapScreen from 'screens/MapScreen'
import sendToApi from 'api/request'


const OrganizationScreen = () => (
  <div>
    <h2>Organizaciones</h2>
  </div>
)

const BestPracticesScreen = () => (
  <div>
    <h2>Mejores Prácticas</h2>
  </div>
)

const AboutScreen = () => (
  <div>
    <h2>Nosotros</h2>
  </div>
)

const App = () => {
  return (
    <Router>
      <div>
        <Nav />

        <Route exact path="/" component={MapScreen} />
        <Route path="/organizaciones" component={OrganizationScreen} />
        <Route path="/practicas" component={BestPracticesScreen} />
        <Route path="/nosotros" component={AboutScreen} />
      </div>
    </Router>
  )
}
export default App
