import React, { Component } from 'react'
import TimerContext from './TimerContext'

class Timer extends Component {
  constructor(props) {
    super(props)
    const { name, render } = props
    if (typeof render !== 'function') {
      throw Error('<Timer>: Prop `render` should be a function')
    }
    if (!name) throw Error('<Timer>: Prop `name` should be provided')

    this.state = {
      name,
      timeout: props.timeout,
      prevProps: this.props,
    }
  }

  validateTimeout(timeout) {
    const _timeout = Math.floor(timeout)
    if (Number.isFinite(_timeout)) {
      return _timeout
    }
    throw Error(
      `<Timer>: Got invalid timeout for timer(${
        this.state.name
      }). "timeout" should be a finit number`
    )
  }

  componentDidMount() {
    const { timeout, name } = this.state
    if (timeout != null) {
      this.context.registerTimer(name, this.validateTimeout(timeout))
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props !== state.prevProps) {
      if (state.name !== props.name) {
        console.error(Error('<Timer>: Name changing is not supported!'))
      }
      return {
        prevProps: props,
        timeout: state.timeout !== props.timeout ? props.timeout : state.timeout,
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    const newTimeout = this.state.timeout
    const prevTimeout = prevState.timeout

    if (newTimeout !== prevTimeout) {
      this.context.resetTimer(this.state.name, this.validateTimeout(newTimeout))
    }
  }

  componentWillUnmount() {
    if (this.state.timeout != null) {
      this.context.destoryTimer(this.state.name)
    }
  }

  getRenderProps(timers) {
    const { name, timeout } = this.state
    if (!timers[name]) {
      if (timeout != null) return null
      throw Error(`<Timer>: Name(${name}) isn't providered in provider`)
    }
    return {
      timer: timers[name],
      name,
    }
  }

  render() {
    return (
      <TimerContext.Consumer>
        {context => {
          this.context = context
          const props = this.getRenderProps(context.timers)
          return props ? this.props.render(props) : null
        }}
      </TimerContext.Consumer>
    )
  }
}

export default Timer
