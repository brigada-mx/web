/* eslint-disable react/prop-types */
import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Nav from 'components/Nav'
import MapScreen from 'screens/MapScreen'
import LocalityScreen from 'screens/LocalityScreen'


const LocalityScreenWrapper = ({ match }) => {
  return <LocalityScreen id={Number.parseInt(match.params.id, 10)} />
}

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

        <Route exact path="/comunidades/:id" component={LocalityScreenWrapper} />
      </div>
    </Router>
  )
}
export default App
