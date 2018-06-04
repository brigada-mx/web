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
import LiveChat from 'components/LiveChat'
import MapScreen from 'screens/MapScreen'
import LocalityScreen from 'screens/LocalityScreen'
import OrganizationListScreen from 'screens/OrganizationListScreen'
import OrganizationScreen from 'screens/OrganizationScreen'
import ActionScreen from 'screens/ActionScreen'
import SetPasswordWithTokenScreen from 'screens/account/SetPasswordWithTokenScreen'
import ChooseAccountTypeScreen from 'screens/account/CreateAccountScreen/ChooseAccountTypeScreen'
import DonorListScreen from 'screens/DonorListScreen'
import DonorScreen from 'screens/DonorScreen'
import VolunteerOpportunityScreen from 'screens/VolunteerOpportunityScreen'
import DonorCreateAccountScreen from 'screens/account/CreateAccountScreen/DonorCreateAccountScreen'
import CreateAccountScreen from 'screens/account/CreateAccountScreen'

import protectedScreen from 'screens/account/ProtectedScreen'
import DiscourseLoginScreen from 'screens/account/LoginScreen/DiscourseLoginScreen'
import AccountNav from 'components/AccountNav'
import DonorNav from 'components/DonorNav'
import AccountActionScreen from 'screens/account/ActionScreen'
import ProfileScreen from 'screens/account/ProfileScreen'
import DonorProfileScreen from 'screens/account/ProfileScreen/DonorProfileScreen'
import HomeScreen from 'screens/account/HomeScreen'
import DonorHomeScreen from 'screens/account/DonorHomeScreen'
import DonationScreen from 'screens/account/DonationScreen'

import env from 'src/env'
import GlobalStyles from 'src/Global.css'


const LocalityScreenWrapper = ({ match }) => {
  return <LocalityScreen id={Number.parseInt(match.params.id, 10)} />
}

const OrganizationScreenWrapper = ({ match }) => {
  return <OrganizationScreen id={Number.parseInt(match.params.id, 10)} />
}

const DonorScreenWrapper = ({ match }) => {
  return <DonorScreen id={Number.parseInt(match.params.id, 10)} />
}

const ActionScreenWrapper = ({ match }) => {
  return <ActionScreen id={Number.parseInt(match.params.id, 10)} />
}

const AccountActionScreenWrapper = ({ match }) => {
  return <AccountActionScreen actionKey={Number.parseInt(match.params.key, 10)} />
}

const DonationScreenWrapper = ({ match }) => {
  return <DonationScreen id={Number.parseInt(match.params.id, 10)} />
}

const VolunteerOpportunityScreenWrapper = ({ match }) => {
  return <VolunteerOpportunityScreen id={Number.parseInt(match.params.id, 10)} />
}

const SetPasswordWithTokenScreenWrapper = () => {
  return <SetPasswordWithTokenScreen className={GlobalStyles.modalScreenWrapper} />
}

const ChooseAccountTypeScreenWrapper = () => {
  return <ChooseAccountTypeScreen className={GlobalStyles.modalScreenWrapper} />
}

const CreateAccountScreenWrapper = () => {
  return <CreateAccountScreen className={GlobalStyles.modalScreenWrapper} />
}

const DonorCreateAccountScreenWrapper = () => {
  return <DonorCreateAccountScreen className={GlobalStyles.modalScreenWrapper} />
}

const DiscourseLoginScreenWrapper = () => {
  return <DiscourseLoginScreen type="discourse" className={GlobalStyles.modalScreenWrapper} />
}

const appReducer = combineReducers({
  ...reducers,
  form: formReducer,
})

const rootReducer = (state, action) => {
  // clean other branches of state tree on logout to prevent leakage of (possibly sensitive) info
  return appReducer(action.type === 'AUTH_UNSET' ? { auth: state.auth } : state, action)
}

const initialStore = { auth: {
  org: JSON.parse(localStorage.getItem('719s:auth-org')) || {},
  donor: JSON.parse(localStorage.getItem('719s:auth-donor')) || {},
  brigada: JSON.parse(localStorage.getItem('719s:auth-brigada')) || {},
} }
const store = createStore(rootReducer, initialStore)

ReactGA.initialize('UA-108487748-1', { testMode: env.env === 'dev' })

if (env.env === 'prod') {
  Raven.config(
    'https://3036725f3ff84d689133e21736eaca9a@sentry.io/306469',
    { release: env.gitHashRelease },
  ).install()
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
            <Route path="/(comunidades|reconstructores|donadores|proyectos|voluntariado)" component={Nav} />
            <Route path="/cuenta" component={AccountNav} />
            <Route path="/donador" component={DonorNav} />

            <Switch>
              <Redirect exact from="/organizaciones" to="/reconstructores" />
              <Route
                exact
                path="/organizaciones/:id"
                render={({ match }) => <Redirect to={`/reconstructores/${match.params.id}`} />}
              />

              <Route exact path="/" component={MapScreen} />
              <Route exact path="/comunidades/:id" component={LocalityScreenWrapper} />

              <Route exact path="/reconstructores" component={OrganizationListScreen} />
              <Route exact path="/reconstructores/:id" component={OrganizationScreenWrapper} />
              <Route exact path="/proyectos/:id" component={ActionScreenWrapper} />

              <Route exact path="/donadores" component={DonorListScreen} />
              <Route exact path="/donadores/:id" component={DonorScreenWrapper} />

              <Route exact path="/voluntariado/:id" component={VolunteerOpportunityScreenWrapper} />

              <Route exact path="/foro/sso" component={DiscourseLoginScreenWrapper} />
              <Route path="/establecer" component={SetPasswordWithTokenScreenWrapper} />
              <Route exact path="/crear/cuenta" component={ChooseAccountTypeScreenWrapper} />
              <Route exact path="/crear/cuenta/reconstructor" component={CreateAccountScreenWrapper} />
              <Route exact path="/crear/cuenta/donador" component={DonorCreateAccountScreenWrapper} />
              <Route exact path="/cuenta" component={protectedScreen(HomeScreen, 'org')} />
              <Route exact path="/cuenta/perfil" component={protectedScreen(ProfileScreen, 'org')} />
              <Route exact path="/cuenta/proyectos/:key" component={protectedScreen(AccountActionScreenWrapper, 'org')} />

              <Route exact path="/donador" component={protectedScreen(DonorHomeScreen, 'donor')} />
              <Route exact path="/donador/perfil" component={protectedScreen(DonorProfileScreen, 'donor')} />
              <Route exact path="/donador/donativos/:id" component={protectedScreen(DonationScreenWrapper, 'donor')} />

              <Redirect from="/cuenta" to="/cuenta" />
              <Redirect from="/donador" to="/donador" />
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
