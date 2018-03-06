/* eslint-disable react/prop-types */
import React from 'react'

import ReactGA from 'react-ga'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import reducers from 'src/reducers/index'
import { localStorage } from 'tools/storage'
import SnackBar from 'components/SnackBar'
import Nav from 'components/Nav'
import AccountNav from 'components/AccountNav'
import MapScreen from 'screens/MapScreen'
import LocalityScreen from 'screens/LocalityScreen'
import OrganizationListScreen from 'screens/OrganizationListScreen'
import OrganizationScreen from 'screens/OrganizationScreen'
import PasswordEmailScreen from 'screens/account/PasswordEmailScreen'
import SetPasswordWithTokenScreen from 'screens/account/SetPasswordWithTokenScreen'
import protectedScreen from 'screens/account/ProtectedScreen'
import ActionScreen from 'screens/account/ActionScreen'
import ProfileScreen from 'screens/account/ProfileScreen'
import HomeScreen from 'screens/account/HomeScreen'


const LocalityScreenWrapper = ({ match }) => {
  return <LocalityScreen id={Number.parseInt(match.params.id, 10)} />
}

const OrganizationScreenWrapper = ({ match }) => {
  return <OrganizationScreen id={Number.parseInt(match.params.id, 10)} />
}

const ActionScreenWrapper = ({ match }) => {
  return <ActionScreen actionKey={Number.parseInt(match.params.key, 10)} />
}

const AboutScreen = () => (
  <div>
    <h2>Nosotros</h2>
  </div>
)


const appReducer = combineReducers({
  ...reducers,
  form: formReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'AUTH_UNSET') {
    state = undefined // eslint-disable-line no-param-reassign
  }

  return appReducer(state, action)
}

const initialStore = { auth: JSON.parse(localStorage.getItem('719s:auth')) || {} }
const store = createStore(rootReducer, initialStore)

ReactGA.initialize('UA-108487748-1')

const gaLogPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
  return null
}

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Route path="/" component={gaLogPageView} />
          <Route exact path="/" component={Nav} />
          <Route path="/(comunidades|organizaciones|nosotros)" component={Nav} />

          <Route exact path="/" component={MapScreen} />
          <Route exact path="/comunidades/:id" component={LocalityScreenWrapper} />

          <Route exact path="/organizaciones" component={OrganizationListScreen} />
          <Route exact path="/organizaciones/:id" component={OrganizationScreenWrapper} />

          <Route exact path="/nosotros" component={AboutScreen} />

          <MuiThemeProvider>
            <React.Fragment>
              <Route path="/cuenta" component={AccountNav} />
              <Route exact path="/restablecer/email" component={PasswordEmailScreen} />
              <Route path="/establecer" component={SetPasswordWithTokenScreen} />
              <Route exact path="/cuenta" component={protectedScreen(HomeScreen)} />
              <Route exact path="/cuenta/perfil" component={protectedScreen(ProfileScreen)} />
              <Route exact path="/cuenta/fotos" component={protectedScreen(ActionScreen)} />
              <Route exact path="/cuenta/proyectos/:key" component={protectedScreen(ActionScreenWrapper)} />
              <SnackBar />
            </React.Fragment>
          </MuiThemeProvider>

        </div>
      </Router>
    </Provider>
  )
}

export default App
export { store }
