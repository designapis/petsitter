import React from 'react'
import { createGlobalStyle } from 'styled-components'
import {usePath, navigate, useRoutes, useInterceptor} from 'hookrouter';

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

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    min-height: 100vh;
  }
`

const theme = {

}

const PageNotFound = () => (
  <Heading level={2}> Page not found </Heading>
)

interface Props {
  user: User;
  logout: Function;
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

function App(props: Props) {

  const routes = {
    '/': () => <Home user={props.user}/>,
    '/login': () => <Login/>,
    '/logout': () => {
      props.logout()
      navigate('/')
      return null
    },
    '/jobs': () => <JobsPage/>,
    '/jobs/mine': () => <MyJobsPage/>,
    '/job-applications': () => <JobApplicationsPage/>,
    '/jobs-new': () => <JobPage />,
    '/jobs/:id': ({id}: any) => <JobPage jobId={id} />,
    '/profile': () => <ProfilePage/>,
  } // End of Routes

  useInterceptor((currentPath: string, nextPath: string) => {
    if(nextPath === '/logout') {
      props.logout()
      return '/'
    }
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
            {route || <PageNotFound/>}
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
  logout
})(App)
