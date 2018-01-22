import { Component } from 'react'
import PropTypes from 'prop-types'

class Timer extends Component {
  constructor(props, context) {
    super(props, context)
    const { name, render } = props
    if (typeof render !== 'function') {
      throw Error('<Timer>: prop render should be a function')
    }
    if (!name) throw Error('<Timer>:prop name should be provided')
    const { names, timers } = context.timer
    if (names.indexOf(name) < 0) {
      throw Error('<Timer>: name not providered in provider')
    }
    this.timer = timers[name]
  }

  static contextTypes = {
    timer: PropTypes.object,
  }

  getControlFns = () => {
    const { timer } = this
    this.fnsCache =
      this.fnsCache ||
      (function tryGetControlFns() {
        const { start, reset, stop, pause } = timer
        return { start, reset, stop, pause }
      })()
    return this.fnsCache
  }

  componentWillMount() {
    this.unsubscribe = this.context.timer.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  computeCustomProps() {
    const { getCustomProps, names, timers } = this.context.timer
    if (getCustomProps) return getCustomProps(timers, names)
    return null
  }

  getRenderProps() {
    const { getControlFns, timer } = this
    const { name } = this.props
    return {
      ...this.computeCustomProps(),
      timer,
      getControlFns,
      name,
    }
  }

  render() {
    return this.props.render(this.getRenderProps())
  }
}

export default Timer
