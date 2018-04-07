import React, { Component } from 'react'
import { Timer, TimerProvider } from '@dgeibi/react-timer'
import linkState from './linkState'
import convertMS from './convertMS'
import './App.css'

const style = {
  maxWidth: 700,
  margin: '0 auto',
  padding: '0 10px',
  fontFamily: 'Consola, monospace',
}

function renderTimer({
  name,
  timer: { timeout, running, end, start, pause, reset, stop, disabled },
}) {
  if (disabled) return <div> disabled </div>
  return (
    <div>
      {name} {convertMS(timeout)}
      {!end &&
        (running ? (
          <button type="button" onClick={pause}>
            pause
          </button>
        ) : (
          <button type="button" onClick={start}>
            start
          </button>
        ))}
      {end ? (
        <button type="button" onClick={reset}>
          reset
        </button>
      ) : (
        <button type="button" onClick={stop}>
          stop
        </button>
      )}
    </div>
  )
}

export default class App extends Component {
  state = {
    bTimeout: 40,
    resetAllWhenTimeoutsChange: false,
    dynamicTimeouts: [],
    newTimeout: '',
  }
  link = linkState(this)

  createNewTimer = () => {
    let { newTimeout } = this.state
    newTimeout = Math.floor(newTimeout)
    if (Number.isFinite(newTimeout) && newTimeout > 0) {
      this.setState({
        dynamicTimeouts: [...this.state.dynamicTimeouts, newTimeout],
      })
    }
  }

  handleEnter = e => {
    if (e.keyCode === 13) {
      this.createNewTimer()
    }
  }

  render() {
    const { bTimeout, resetAllWhenTimeoutsChange, dynamicTimeouts } = this.state

    return (
      <div style={style}>
        <section>
          <h1>Whether to Reset All Timers When Timeouts Change</h1>
          <label>
            change b's timeout:{' '}
            <input placeholder="x second" {...this.link('bTimeout')} />
          </label>
          <div>
            <label>
              reset all when timeouts change:{' '}
              <input
                type="checkbox"
                {...this.link('resetAllWhenTimeoutsChange', 'checked')}
              />
            </label>
          </div>
          <TimerProvider
            timeouts={{
              a: 30,
              b: Number.isFinite(Number(bTimeout)) ? bTimeout : -1,
            }}
            resetAllWhenTimeoutsChange={resetAllWhenTimeoutsChange}
          >
            <Timer name="a" render={renderTimer} />
            <Timer name="b" render={renderTimer} />
          </TimerProvider>
        </section>

        <section>
          <h1>Create New Timers Dynamically</h1>
          <label>
            New Timer:{' '}
            <input
              onKeyDown={this.handleEnter}
              {...this.link('newTimeout')}
              placeholder="x second"
            />
          </label>
          <button type="button" onClick={this.createNewTimer}>
            add
          </button>
          <TimerProvider
            timeouts={dynamicTimeouts}
            resetAllWhenTimeoutsChange={resetAllWhenTimeoutsChange}
          >
            {dynamicTimeouts.map((x, i) => {
              const key = String(i)
              return <Timer key={key} name={key} render={renderTimer} />
            })}
          </TimerProvider>
        </section>
      </div>
    )
  }
}
