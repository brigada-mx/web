/* eslint-disable react/prop-types */
import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Nav from 'components/Nav'
import MapScreen from 'screens/MapScreen'
import LocalityScreen from 'screens/LocalityScreen'
// import OrganizationListScreen from 'screens/OrganizationListScreen'
// import OrganizationScreen from 'screens/OrganizationScreen'


const LocalityScreenWrapper = ({ match }) => {
  return <LocalityScreen id={Number.parseInt(match.params.id, 10)} />
}

// const OrganizationScreenWrapper = ({ match }) => {
//   return <OrganizationScreen id={Number.parseInt(match.params.id, 10)} />
// }

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
        <Route exact path="/comunidades/:id" component={LocalityScreenWrapper} />

        {/* <Route path="/organizaciones" component={OrganizationListScreen} /> */}
        {/* <Route exact path="/organizaciones/:id" component={OrganizationScreenWrapper} /> */}

        <Route path="/practicas" component={BestPracticesScreen} />

        <Route path="/nosotros" component={AboutScreen} />

      </div>
    </Router>
  )
}
export default App
