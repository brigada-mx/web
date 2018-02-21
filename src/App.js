/* eslint-disable react/prop-types */
import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import env from 'src/env'
import reducers from 'src/reducers/index'
import TestScreen from 'screens/TestScreen'
import { localStorage } from 'tools/storage'
import Nav from 'components/Nav'
import AccountNav from 'components/AccountNav'
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
initialStore.auth = JSON.parse(localStorage.getItem('719s:auth')) || {}
const store = createStore(allReducers, initialStore)

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Route exact path="/" component={Nav} />
          <Route path="/(comunidades|organizaciones|nosotros)" component={Nav} />

          {env.env === 'dev' && <Route exact path="/test" component={TestScreen} />}

          <Route exact path="/" component={MapScreen} />
          <Route exact path="/comunidades/:id" component={LocalityScreenWrapper} />

          <Route exact path="/organizaciones" component={OrganizationListScreen} />
          <Route exact path="/organizaciones/:id" component={OrganizationScreenWrapper} />

          <Route exact path="/nosotros" component={AboutScreen} />

          <MuiThemeProvider>
            <React.Fragment>
              <Route path="/(set_password|cuenta)" component={AccountNav} />
              <Route exact path="/set_password" component={SetPasswordScreen} />
              <Route exact path="/cuenta" component={AccountScreen} />
              <Route exact path="/cuenta/formularios" component={ActionSubmissionsScreen} />
              <Route exact path="/cuenta/proyectos/:id" component={ActionSubmissionsScreenWrapper} />
            </React.Fragment>
          </MuiThemeProvider>

        </div>
      </Router>
    </Provider>
  )
}

export default App
export { store }
