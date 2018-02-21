/* eslint-disable react/prop-types */
import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import env from 'src/env'
import reducers from 'src/reducers/index'
import TestScreen from 'screens/TestScreen'
import { localStorage } from 'tools/storage'
import Nav from 'components/Nav'
import MapScreen from 'screens/MapScreen'
import LocalityScreen from 'screens/LocalityScreen'
import OrganizationListScreen from 'screens/OrganizationListScreen'
import OrganizationScreen from 'screens/OrganizationScreen'
import AccountScreen from 'screens/AccountScreen'
import ActionSubmissionsScreen from 'screens/ActionSubmissionsScreen'
import SetPasswordScreen from 'screens/SetPasswordScreen'


const LocalityScreenWrapper = ({ match }) => {
  return <LocalityScreen id={Number.parseInt(match.params.id, 10)} />
}

const OrganizationScreenWrapper = ({ match }) => {
  return <OrganizationScreen id={Number.parseInt(match.params.id, 10)} />
}

const ActionSubmissionsScreenWrapper = ({ match }) => {
  return <ActionSubmissionsScreen key={Number.parseInt(match.params.key, 10)} />
}

const AboutScreen = () => (
  <div>
    <h2>Nosotros</h2>
  </div>
)


const allReducers = combineReducers({
  ...reducers,
})

const initialStore = {}
const store = createStore(allReducers, initialStore)
initialStore.auth = JSON.parse(localStorage.getItem('719s:auth')) || {}

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

          <Route exact path="/nosotros" component={AboutScreen} />
          <Route exact path="/set_password" component={SetPasswordScreen} />

          <Route exact path="/cuenta" component={AccountScreen} />
          <Route exact path="/cuenta/formularios" component={ActionSubmissionsScreen} />
          <Route exact path="/cuenta/proyectos/:id" component={ActionSubmissionsScreenWrapper} />

        </div>
      </Router>
    </Provider>
  )
}

export default App
export { store }
