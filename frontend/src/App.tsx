import React from 'react'
import { createGlobalStyle } from 'styled-components'
import {usePath, navigate, useRoutes, useInterceptor, setBasepath} from 'hookrouter';

import { Grommet, Grid, Main, Box, Heading } from 'grommet'
import { Notification } from 'grommet-controls'

import Header from './Header'
import MyJobsPage from './MyJobsPage'
import JobsPage from './JobsPage'
import JobApplicationsPage from './JobApplicationsPage'
import JobPage from './JobPage'
import Login from './Login'
import ProfilePage from './ProfilePage'
import Notifications from './Notifications'
import { logout } from './duck-user'
import { connect } from 'react-redux'
import {RootState, User} from './types'
import { clearError } from './duck-error';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    min-height: 100vh;
  }
`

interface IErrorState {
  error: Error | null
}

class ErrorBoundary extends React.Component<any, IErrorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null
    }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
    localStorage.clear()
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong</h1>
          <pre>{this.state.error.message}</pre>
        </div>
      )
    }

    return this.props.children;
  }
}

const theme = {

}

const PageNotFound = () => (
  <Heading level={2}> Page not found </Heading>
)

interface Props {
  user: User;
  logout: Function;
  clearError: Function;
}

const Home = (props: any) => {
  const path = usePath()
  if(path === '/') {
    if(props.user?.email) {
      navigate('/jobs/mine')
    } else {
      navigate('/login')
    }
  }
  return null
}

setBasepath('/app')

const isLoggedIn = () => {
  return !!localStorage.getItem('user')
}

function requiresAuth(routeFn: Function) {
  return (...args: any[]) => {
    if(isLoggedIn())
      return routeFn(...args)
    return navigate('/login')
  }
}

function App(props: Props) {

  const routes = {
    '': () => <Home user={props.user}/>,
    '/': () => <Home user={props.user}/>,
    '/login': () => <Login/>,
    '/logout': () => {
      props.logout()
      navigate('/login')
      return null
    },
    '/jobs': requiresAuth(() => <JobsPage/>), // TODO: This should require auth??
    '/jobs/mine': requiresAuth(() => <MyJobsPage/>),
    '/job-applications': requiresAuth(() => <JobApplicationsPage/>),
    '/jobs-new': requiresAuth(() => <JobPage />),
    '/jobs/:id': requiresAuth(({id}: any) => <JobPage jobId={id} />),
    '/profile': requiresAuth(() => <ProfilePage/>),
  } // End of Routes

  useInterceptor((currentPath: string, nextPath: string) => {
    props.clearError()
    return nextPath
  })

  const route = useRoutes(routes)

  return (
    <>
      <GlobalStyle/>

      <Grommet plain theme={theme}>
        <Notifications />
        <Grid
          style={{'minHeight': '100vh'}}
          rows={['200px', '1fr', 'xsmall']}
          columns={['flex']}
          gap="small"
          areas={[
            { name: 'header', start: [0, 0], end: [1, 0] },
            { name: 'main', start: [0, 1], end: [1, 1] },
            { name: 'footer', start: [0, 2], end: [1, 2] },
          ]}
        >

          <Box gridArea="header">
            <Header/>
          </Box>

          <Main gridArea="main" direction="row" alignContent="end" gap="small" >
            <ErrorBoundary >
              {route || <PageNotFound/>}
            </ErrorBoundary>
          </Main>
          <Box gridArea="footer" background="light-2" >
          </Box>
        </Grid>
      </Grommet>
    </>
  )
}

export default connect((state: RootState)=>{
  return {
    user: state.user
  }
}, {
  logout,
  clearError,
})(App)
