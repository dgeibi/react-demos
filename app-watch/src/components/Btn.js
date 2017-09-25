import React from 'react'
import styled from 'react-emotion'

const Link = styled.a`
  display: inline-block;
  margin: 0 5px;
  padding: 0.3em 0.4em;
  border-radius: 3px;
  border: 1px solid #eee;
  text-decoration: none;
  &.hide {
    display: none;
  }
`

export default function Btn(props) {
  const { onClick, children, show } = props
  return (
    <Link onClick={onClick} href="#" className={`${show ? '' : 'hide'}`}>
      {children}
    </Link>
  )
}
