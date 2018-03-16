import { Component } from 'react'
import PropTypes from 'prop-types'

import TimerLogic from './utils/Timer'
import shallowEqual from './utils/shallowEqual'
import unlisten from './utils/unlisten'
import Timer from './Timer'
import Scheduler from './Scheduler'

class TimerProvider extends Component {
  static Timer = Timer
  static Scheduler = Scheduler

  constructor(props, context) {
    super(props, context)
    const { names } = props

    if (!names || names.length < 1) throw Error('prop names should has at least element')

    /** @type {function[]} */
    this.unwatches = []
    this.subscribes = []

    /** @type {{ [x: string]: TimerLogic }} */
    this.timers = names.reduce((ret, name) => {
      const timer = new TimerLogic({ timeout: convertSecond(props.timeouts[name]) })
      ret[name] = timer // eslint-disable-line
      return ret
    }, {})

    if (props.refTimers) {
      props.refTimers(this.timers)
    }
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

  componentDidMount() {
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
