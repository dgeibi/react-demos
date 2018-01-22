import { Component, Children } from 'react'
import PropTypes from 'prop-types'

import TimerLogic from './utils/Timer'
import shallowEqual from './utils/shallowEqual'
import unlisten from './utils/unlisten'
import Timer from './Timer'
import Scheduler from './Scheduler'

if (process.env.NODE_ENV !== 'production' && module.hot) {
  global.timers = global.timers || {}
}

class TimerProvider extends Component {
  static Timer = Timer
  static Scheduler = Scheduler

  constructor(props, context) {
    super(props, context)
    const { names, children } = props

    if (!names || names.length < 1) throw Error('prop names should has at least element')
    if (children && Children.count(children) > 1) {
      throw Error('should have only one children')
    }

    /** @type {function[]} */
    this.unwatches = []
    this.subscribes = []

    const timersInit = global.timers || {}

    /** @type {{ [x: string]: TimerLogic }} */
    this.timers = this.mapName((oldTimer, name) => {
      const timeout = convertSecond(props.timeouts[name])
      const timer = TimerLogic.isTimer(oldTimer) ? oldTimer : new TimerLogic({ timeout })
      if (oldTimer === timer) {
        if (timer.totalTime !== timeout) {
          timer.setup({ timeout })
        }
      }
      return timer
    }, timersInit)

    if (props.refTimers) {
      props.refTimers(this.timers)
    }
  }

  mapName(fn, init) {
    return this.props.names.reduce((ret, key) => {
      ret[key] = fn(ret[key], key) // eslint-disable-line
      return ret
    }, init || {})
  }

  forEachName(fn) {
    this.props.names.forEach(fn)
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.timeouts, this.props.timeouts)) {
      this.forEachName(name => {
        const timeout = convertSecond(nextProps.timeouts[name])
        const timer = this.timers[name]
        timer.setup({ timeout })
      })
    }
  }

  componentWillMount() {
    const update = () => {
      this.subscribes.forEach(fn => fn())
    }
    this.forEachName(name => {
      this.unwatches.push(this.timers[name].watch(update))
    })
  }

  componentWillUnmount() {
    this.unwatches.forEach(fn => fn())
  }

  static childContextTypes = {
    timer: PropTypes.object,
  }

  getChildContext() {
    const { timers, subscribe } = this
    const { names, getCustomProps } = this.props
    return {
      timer: {
        timers,
        names,
        subscribe,
        getCustomProps,
      },
    }
  }

  subscribe = fn => {
    if (typeof fn !== 'function') throw Error('should pass a function')
    this.subscribes.push(fn)
    return unlisten(this.subscribes, fn)
  }

  render() {
    const { children } = this.props
    return children && Children.only(children)
  }
}

/**
 * @param {number|string} second
 * @returns {number} millisecond
 */
function convertSecond(second) {
  const millisecond = Math.floor(second) * 1e3
  if (Number.isNaN(millisecond)) {
    throw Error('<TimerProvider timeouts={{ [name]: number }} >')
  }
  return millisecond
}

export { convertSecond, Scheduler, Timer, TimerProvider }
