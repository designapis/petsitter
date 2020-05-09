import React from 'react'
import {Box, Heading } from 'grommet'
import { navigate } from 'hookrouter'
import { connect } from 'react-redux'
import { updateUser, deleteUser } from './duck-user'
import Profile from './Profile'
import { User, RootState } from './types'

interface Props {
  updateUser : Function;
  deleteUser : Function;
  user: User;
}

export function ProfilePage(props: Props) {

  const { user, updateUser, deleteUser } = props

  const onSave = (form: any) => {
    updateUser(form).then(() => {
      navigate('/')
    })
  }

  const onDelete = () => {
    if(window.confirm(`Are you sure you want to delete your user, "${user.full_name}" ?`)) {
      deleteUser().then(() => {
        navigate('/')
      })
    }
  }


  return (
    <Box gap="medium" align="center" fill="horizontal" justify="center" >

      <Heading>Profile</Heading>
      <Profile
        onSave={onSave}
        onDelete={onDelete}
        user={user}
      />

    </Box>
  )
}

export default connect((state: RootState) => {
  return {
    user: state.user,
  }
}, {
  updateUser,
  deleteUser,
})(ProfilePage)
