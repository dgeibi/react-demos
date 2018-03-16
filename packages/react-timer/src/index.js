import { Component } from 'react'
import PropTypes from 'prop-types'

import TimerLogic from './utils/Timer'
import unlisten from './utils/unlisten'
import Timer from './Timer'
import Scheduler from './Scheduler'

class TimerProvider extends Component {
  static Timer = Timer
  static Scheduler = Scheduler

  constructor(props, context) {
    super(props, context)
    /** @type {{[x: string]: function }} */
    this.unwatches = {}
    this.subscribes = []

    /** @type {{ [x: string]: TimerLogic }} */
    this.timers = {}

    this.forEachName(name => {
      this.createTimer(name, this.props.timeouts[name])
    })

    if (props.refTimers) {
      props.refTimers(this.timers)
    }
  }

  createTimer(name, timeout) {
    this.timers[name] = new TimerLogic({ timeout: convertSecond(timeout) })
  }

  destoryTimer(name) {
    if (this.timers[name]) {
      this.timers[name].destory()
      delete this.timers[name]
      this.unwatchTimer(name)
    }
  }

  forEachName(fn) {
    Object.keys(this.props.timeouts).forEach(fn)
  }

  componentWillReceiveProps(nextProps) {
    const oldTimeouts = this.props.timeouts
    const nextTimeouts = nextProps.timeouts
    const oldNames = Object.keys(oldTimeouts)
    const nextNames = Object.keys(nextTimeouts)
    let equal = oldNames.length === nextNames.length
    for (let i = 0; i < nextNames.length; i += 1) {
      const name = nextNames[i]
      if (!(name in oldTimeouts)) {
        // init new timer
        this.createTimer(name, nextTimeouts[name])
        this.watchTimer(name)
        equal = false
      } else if (equal && oldTimeouts[name] !== nextTimeouts[name]) {
        equal = false
      }
    }
    if (!equal) {
      for (let i = 0; i < oldNames.length; i += 1) {
        const name = oldNames[i]
        const nextTimeout = nextTimeouts[name]
        const oldTimeout = oldTimeouts[name]

        // cleanup timer
        if (!(name in nextTimeouts)) {
          this.destoryTimer(name)
        } else if (nextProps.resetAllWhenTimeoutsChange || oldTimeout !== nextTimeout) {
          // reset timer
          const timeout = convertSecond(nextTimeout)
          this.timers[name].setup({ timeout })
        }
      }
    }
  }

  componentDidMount() {
    this.forEachName(name => {
      this.watchTimer(name)
    })
  }

  executeSubs = () => {
    this.subscribes.forEach(fn => fn())
  }

  watchTimer(name, fn = this.executeSubs) {
    if (this.timers[name]) {
      this.unwatches[name] = this.timers[name].watch(fn)
    }
  }

  unwatchTimer(name) {
    const fn = this.unwatches[name]
    if (typeof fn === 'function') {
      fn()
    }
    delete this.unwatches[name]
  }

  componentWillUnmount() {
    this.forEachName(name => {
      this.unwatchTimer(name)
    })
  }

  static childContextTypes = {
    timer: PropTypes.object,
  }

  getChildContext() {
    const { timers, subscribe } = this
    const { getCustomProps } = this.props
    return {
      timer: {
        timers,
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
    return this.props.children
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
