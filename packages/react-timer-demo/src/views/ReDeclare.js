import React from 'react'
import { Timer, TimerProvider } from '@dgeibi/react-timer'
import renderTimer from '../renderTimer'

export default function ReDeclare() {
  return (
    <section>
      <h1>Re-declare</h1>
      <p>the latter overrides the former</p>
      <TimerProvider>
        <Timer name="a" timeout={10} render={renderTimer} />
        <Timer name="a" timeout={20} render={renderTimer} />
      </TimerProvider>
    </section>
  )
}
