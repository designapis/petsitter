import React from 'react'
import { Box } from 'grommet'
import {User} from 'grommet-icons'

export default function Avatar({ ...rest }) {
  return (
    <Box
      height="xxsmall"
      width="xxsmall"
      background="white"
      round="full"
      {...rest}
    >
      <User color="brand" size="large"/>
    </Box>
  )
}
