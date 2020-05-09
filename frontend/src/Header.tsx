import React from 'react'
import { Box, Heading, Header, Nav } from 'grommet'
import { RootState, User } from './types'
import { Add } from 'grommet-icons'
import { connect } from 'react-redux'
import { navigate, setLinkProps } from 'hookrouter'
import { hasPetOwnerRole } from './duck-user'
import Link from './Link'
import Avatar from './Avatar'

// interface Props {
//   route: string;
// }

export function HeaderComp(props: any) {

  const { user } = props
  const { full_name } = user

  return (
    <Box>
      <Heading onClick={() => navigate('/')} style={{display: 'inline-block'}} textAlign="center" size="medium">
        PetSitter API
      </Heading>

      <Header background="brand" pad="small">
        <Nav background="brand" direction="row" pad="small">
          <Link href="/jobs" label="All Jobs"/>
          <Link href="/jobs/mine" label="My Jobs"/>
          <Link href="/job-applications" label="My Job Applications"/>
          <br/>
          {hasPetOwnerRole(user) ? (
            <Link href="/jobs-new" label={ <span><Add size="small" /> New Job</span>}/>
          ) : null}
          <Link href="/profile" label="Profile"/>
        </Nav>
        {full_name ? (
          <Box direction="row" align="center" gap="small">
            <Link color="white" href="/logout" label="Logout"/>
            <Link color="white" href="/profile" label={full_name}/>
            <Avatar {...setLinkProps({href: '/profile'})}/>
          </Box>
        ) : (
          <Link color="white" href="/login" label="Login"/>
        ) }
      </Header>
    </Box>
  )
}

export default connect(
  (state: RootState) => ({
    user: state.user
  }), {

  }
)(HeaderComp)
