import React from 'react'
import ResetAll from './views/ResetAll'
import DynamicallyCreate from './views/DynamicallyCreate'
import ReDeclare from './views/ReDeclare'
import './App.css'

const style = {
  maxWidth: 700,
  margin: '3em auto',
  padding: '0 10px',
  fontFamily: 'Consola, monospace',
}

export default function App() {
  return (
    <div style={style}>
      <ResetAll />
      <DynamicallyCreate />
      <ResetAll inline />
      <DynamicallyCreate inline />
      <ReDeclare />
    </div>
  )
}
