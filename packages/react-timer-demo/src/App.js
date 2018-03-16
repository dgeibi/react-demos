import React, { Component } from 'react'
import { Timer, TimerProvider } from '@dgeibi/react-timer'
import './App.css'

export default class App extends Component {
  state = {
    input: 40,
    resetAllWhenTimeoutsChange: false,
  }

  render() {
    const { input, resetAllWhenTimeoutsChange } = this.state

    return (
      <div
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '0 10px',
        }}
      >
        <label>
          set timeout:{' '}
          <input
            value={input}
            onChange={e => {
              this.setState({
                input: e.target.value,
              })
            }}
          />
        </label>
        <div>
          <label>
            reset all when timeouts change:{' '}
            <input
              type="checkbox"
              checked={resetAllWhenTimeoutsChange}
              onChange={e => {
                this.setState({
                  resetAllWhenTimeoutsChange: e.target.checked,
                })
              }}
            />
          </label>
        </div>
        <TimerProvider
          timeouts={{
            a: 30,
            b: !Number.isNaN(Number(input)) ? input : -1,
          }}
          resetAllWhenTimeoutsChange={resetAllWhenTimeoutsChange}
        >
          <Timer name="b" render={renderTimer} />
          <Timer name="a" render={renderTimer} />
        </TimerProvider>
      </div>
    )
  }
}

function renderTimer({
  timer: { timeout, running, end, start, pause, reset, stop, disabled },
}) {
  if (disabled) return <div> disabled </div>
  return (
    <div>
      {convertMS(timeout)}
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

function convertMS(ms) {
  if (ms < 0) return 0
  const s = ms / 1e3
  let sec = Math.ceil(s % 60)
  let min = Math.floor(s / 60)
  if (sec === 60) {
    min += 1
    sec = 0
  }

  min = min.toString().padStart(2, '0')
  sec = sec.toString().padStart(2, '0')

  return `${min}:${sec}`
}
