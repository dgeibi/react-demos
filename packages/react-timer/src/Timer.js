import React, { Component } from 'react'
import TimerContext from './TimerContext'

class Timer extends Component {
  constructor(props, context) {
    super(props, context)
    const { name, render } = props
    if (typeof render !== 'function') {
      throw Error('<Timer>: prop render should be a function')
    }
    if (!name) throw Error('<Timer>:prop name should be provided')
  }

  getRenderProps(timers) {
    const { name } = this.props
    if (!timers[name]) {
      throw Error('<Timer>: name not providered in provider')
    }
    return {
      timer: timers[name],
      name,
    }
  }

  render() {
    return (
      <TimerContext.Consumer>
        {timers => this.props.render(this.getRenderProps(timers))}
      </TimerContext.Consumer>
    )
  }
}

export default Timer
