import React, { Component } from 'react'
import { Timer, TimerProvider } from '@dgeibi/react-timer'
import linkState from '../linkState'
import convertMS from '../convertMS'

const floatLeft = {
  float: 'left',
  minWidth: '80px',
}

export default class Dynamically extends Component {
  uid = 0
  getUID = () => {
    this.uid += 1
    return this.uid
  }
  state = {
    dynamicTimeouts: {},
    newTimeout: '',
  }
  link = linkState(this)

  createNewTimer = () => {
    let { newTimeout } = this.state
    newTimeout = Math.floor(newTimeout)
    if (Number.isFinite(newTimeout) && newTimeout > 0) {
      this.setState({
        dynamicTimeouts: { ...this.state.dynamicTimeouts, [this.getUID()]: newTimeout },
      })
    }
  }

  handleEnter = e => {
    if (e.keyCode === 13) {
      this.createNewTimer()
    }
  }

  removeTimer(name) {
    const dynamicTimeouts = Object.assign({}, this.state.dynamicTimeouts)
    delete dynamicTimeouts[name]
    this.setState({
      dynamicTimeouts,
    })
  }

  renderTimer = ({
    name,
    timer: { timeout, running, end, start, pause, reset, stop, disabled },
  }) => {
    const removeBtn = (
      <button
        type="button"
        onClick={() => {
          this.removeTimer(name)
        }}
      >
        remove
      </button>
    )
    if (disabled) return <div> disabled {removeBtn} </div>
    return (
      <div>
        <span style={floatLeft}>
          {name} {convertMS(timeout)}
        </span>
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
        {removeBtn}
      </div>
    )
  }

  renderTimers() {
    const { inline } = this.props
    const { dynamicTimeouts } = this.state

    return inline ? (
      <TimerProvider>
        {Object.entries(dynamicTimeouts).map(([key, timeout]) => (
          <Timer key={key} name={key} timeout={timeout} render={this.renderTimer} />
        ))}
      </TimerProvider>
    ) : (
      <TimerProvider timeouts={dynamicTimeouts}>
        {Object.keys(dynamicTimeouts).map(key => (
          <Timer key={key} name={key} render={this.renderTimer} />
        ))}
      </TimerProvider>
    )
  }

  render() {
    const { inline } = this.props

    return (
      <section>
        <h1>{inline ? '[inline] ' : ''}Create New Timers Dynamically</h1>
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
        {this.renderTimers()}
      </section>
    )
  }
}
