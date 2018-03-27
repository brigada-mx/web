/* eslint-disable react/prop-types */
import React from 'react'

import ReactGA from 'react-ga'
import Raven from 'raven-js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import reducers from 'src/reducers/index'
import { localStorage } from 'tools/storage'
import SnackBar from 'components/SnackBar'
import Nav from 'components/Nav'
import ModalSelector from 'components/Modal/ModalSelector'
import AccountNav from 'components/AccountNav'
import LiveChat from 'components/LiveChat'
import MapScreen from 'screens/MapScreen'
import LocalityScreen from 'screens/LocalityScreen'
import OrganizationListScreen from 'screens/OrganizationListScreen'
import OrganizationScreen from 'screens/OrganizationScreen'
import SetPasswordWithTokenScreen from 'screens/account/SetPasswordWithTokenScreen'
import CreateAccountScreen from 'screens/account/CreateAccountScreen'
import protectedScreen from 'screens/account/ProtectedScreen'
import ActionScreen from 'screens/account/ActionScreen'
import ProfileScreen from 'screens/account/ProfileScreen'
import HomeScreen from 'screens/account/HomeScreen'
import AccountCreated from 'screens/account/AccountCreated'
import env from 'src/env'
import Styles from 'src/Global.css'


const LocalityScreenWrapper = ({ match }) => {
  return <LocalityScreen id={Number.parseInt(match.params.id, 10)} />
}

const OrganizationScreenWrapper = ({ match }) => {
  return <OrganizationScreen id={Number.parseInt(match.params.id, 10)} />
}

const ActionScreenWrapper = ({ match }) => {
  return <ActionScreen actionKey={Number.parseInt(match.params.key, 10)} />
}

const SetPasswordWithTokenScreenWrapper = () => {
  return <SetPasswordWithTokenScreen className={Styles.modalScreenWrapper} />
}

const CreateAccountScreenWrapper = () => {
  return <CreateAccountScreen className={Styles.modalScreenWrapper} />
}

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

ReactGA.initialize('UA-108487748-1', { testMode: env.env === 'dev' })

if (env.env === 'prod') {
  Raven.config('https://3036725f3ff84d689133e21736eaca9a@sentry.io/306469').install()
}

const gaLogPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
  return null
}

const App = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <Router>
          <div>
            <Route path="/" component={gaLogPageView} />
            <LiveChat />
            <SnackBar />
            <ModalSelector />

            <Route exact path="/" component={Nav} />
            <Route path="/(comunidades|organizaciones)" component={Nav} />
            <Route path="/cuenta" component={AccountNav} />

            <Switch>
              <Route exact path="/test" component={AccountCreated} />
              <Route exact path="/" component={MapScreen} />
              <Route exact path="/comunidades/:id" component={LocalityScreenWrapper} />

              <Route exact path="/organizaciones" component={OrganizationListScreen} />
              <Route exact path="/organizaciones/:id" component={OrganizationScreenWrapper} />

              <Route path="/establecer" component={SetPasswordWithTokenScreenWrapper} />
              <Route exact path="/crear/cuenta" component={CreateAccountScreenWrapper} />
              <Route exact path="/cuenta" component={protectedScreen(HomeScreen)} />
              <Route exact path="/cuenta/perfil" component={protectedScreen(ProfileScreen)} />
              <Route exact path="/cuenta/fotos" component={protectedScreen(ActionScreen)} />
              <Route exact path="/cuenta/proyectos/:key" component={protectedScreen(ActionScreenWrapper)} />
              <Redirect from="/cuenta" to="/cuenta" />
              <Redirect to="/" />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    </Provider>
  )
}

export default App
export { store }
