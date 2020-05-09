import React from 'react'
import { Anchor, AnchorProps } from 'grommet'
import { setLinkProps } from 'hookrouter'

export default  function Link(props: AnchorProps) {
  let href = props.href || ''
  return <Anchor {...setLinkProps({href})} {...props}/>
}
