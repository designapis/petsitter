import React from 'react'
import { connect } from 'react-redux'
import { clearError } from './duck-error'
import { RootState } from './types'
import { Notification } from 'grommet-controls'
import styled from 'styled-components'

const NotificationStyled = styled(Notification)`
position: absolute;
top: 15px;
right: 15px;
width: 80%;
`

interface Props {
  error?: string
  clearError: Function;
}
export function Notifications (props: Props) {
  const { error, clearError } = props
  if(!error)
    return null
  
  return (
    <NotificationStyled
      message={error}
      status="error"
      onClose={() => clearError() } />
  )

}


export default connect((state: RootState) => ({
  error: state.error.error
}), {

  clearError
})(Notifications)
