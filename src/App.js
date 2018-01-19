/* eslint-disable react/prop-types */
import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import env from 'src/env'
import reducers from 'src/reducers/index'
import TestScreen from 'screens/TestScreen'
import Nav from 'components/Nav'
import MapScreen from 'screens/MapScreen'
import LocalityScreen from 'screens/LocalityScreen'
import OrganizationListScreen from 'screens/OrganizationListScreen'
import OrganizationScreen from 'screens/OrganizationScreen'


const LocalityScreenWrapper = ({ match }) => {
  return <LocalityScreen id={Number.parseInt(match.params.id, 10)} />
}

const OrganizationScreenWrapper = ({ match }) => {
  return <OrganizationScreen id={Number.parseInt(match.params.id, 10)} />
}

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

const initialStore = {}
const allReducers = combineReducers({
  ...reducers,
})

const store = createStore(allReducers, initialStore)

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Nav />

          {env.env === 'dev' && <Route exact path="/test" component={TestScreen} />}

          <Route exact path="/" component={MapScreen} />
          <Route exact path="/comunidades/:id" component={LocalityScreenWrapper} />

          <Route exact path="/organizaciones" component={OrganizationListScreen} />
          <Route exact path="/organizaciones/:id" component={OrganizationScreenWrapper} />

          <Route path="/practicas" component={BestPracticesScreen} />

          <Route path="/nosotros" component={AboutScreen} />

        </div>
      </Router>
    </Provider>
  )
}
export default App
