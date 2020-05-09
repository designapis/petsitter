import React from 'react'
import { connect } from 'react-redux'
import { clearError } from './duck-error'
import { RootState } from './types'

interface Props {
  error?: string
}
export function ErrorComp (props: Props) {
  return (
    <pre style={{color: 'red'}}>
      {props.error}
    </pre>
  )

}


export default connect((state: RootState) => ({
  error: state.error.error
}), {
  clearError
})(ErrorComp)
