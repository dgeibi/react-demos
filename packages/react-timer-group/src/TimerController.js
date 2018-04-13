import TimerLogic from './utils/Timer'

/**
 * @param {number|string} second
 * @returns {number} millisecond
 */
function convertSecond(second) {
  const millisecond = Math.floor(second) * 1e3
  if (!Number.isFinite(millisecond)) {
    throw Error('sec should be a finite number')
  }
  return millisecond
}

export default class TimerController {
  constructor({ timeouts, resetAllWhenTimeoutsChange }) {
    /** @type {{[x: string]: function }} */
    this.unwatches = {}

    /** @type {{ [x: string]: TimerLogic }} */
    this.timers = {}
    this.resetAllWhenTimeoutsChange = resetAllWhenTimeoutsChange

    this._callback = () => {}
    if (timeouts != null) {
      this.hoistedTimeouts = timeouts
      // create hoisted timers
      Object.keys(this.hoistedTimeouts).forEach(name => {
        this.timers[name] = TimerController.createTimer(timeouts[name])
      })
    }

    this.context = {
      timers: this.timers,
      registerTimer: (name, timeout) => {
        if (this.timers[name]) {
          this.resetTimer(name, timeout)
        } else {
          this.timers = this.registerTimer(name, timeout)
        }
        this._callback(this.getContext())
      },
      resetTimer: (name, timeout) => {
        this.resetTimer(name, timeout)
        if (this.resetAllWhenTimeoutsChange) {
          Object.keys(this.timers).forEach(k => {
            if (k !== name) {
              this.timers[k].reset()
            }
          })
        }
      },
      destoryTimer: this.destoryTimer,
    }
  }

  registerTimer = (name, timeout, timers) => {
    const _timers = timers || Object.assign({}, this.timers)
    _timers[name] = TimerController.createTimer(timeout)
    this.watchTimer(_timers[name], name, this._update)
    return _timers
  }

  getContext = () => {
    const { timers } = this
    if (this.context.timers !== timers) {
      this.context = Object.assign({}, this.context, { timers })
    }
    return this.context
  }

  update({ timeouts, resetAllWhenTimeoutsChange }) {
    this.resetAllWhenTimeoutsChange = resetAllWhenTimeoutsChange
    const noop = {}
    const nextTimeouts = timeouts || noop
    const oldTimeouts = this.hoistedTimeouts || noop
    /* not changed */
    if (nextTimeouts === oldTimeouts) return null
    const oldNames = Object.keys(oldTimeouts)
    const nextNames = Object.keys(nextTimeouts)
    let equal = oldNames.length === nextNames.length
    const newTimers = {}
    for (let i = 0; i < nextNames.length; i += 1) {
      const name = nextNames[i]
      if (!(name in oldTimeouts)) {
        this.registerTimer(name, nextTimeouts[name], newTimers)
        equal = false
      } else if (equal && oldTimeouts[name] !== nextTimeouts[name]) {
        equal = false
      }
    }
    if (!equal) {
      this.setNextTimers(newTimers)
      this._stopWatching = true
      for (let i = 0; i < oldNames.length; i += 1) {
        const name = oldNames[i]
        const nextTimeout = nextTimeouts[name]
        const oldTimeout = oldTimeouts[name]

        if (!(name in nextTimeouts)) {
          this.destoryTimer(name)
        } else if (oldTimeout !== nextTimeout) {
          this.resetTimer(name, nextTimeout)
        } else if (resetAllWhenTimeoutsChange) {
          this.timers[name].reset()
        }
      }
      this._stopWatching = false
    }
    this.hoistedTimeouts = nextTimeouts
    return !equal ? this.getContext() : null
  }

  static createTimer(timeout) {
    return new TimerLogic({ timeout: convertSecond(timeout) })
  }

  setNextTimers(newTimers) {
    this.timers = Object.assign({}, this.timers, newTimers)
    return this.timers
  }

  resetTimer = (name, timeout) => {
    this.timers[name].setup({ timeout: convertSecond(timeout) })
  }

  destoryTimer = name => {
    if (this.timers[name]) {
      this.timers[name].destory()
      delete this.timers[name]
      this.unwatchTimer(name)
    }
  }

  watchTimer(timer, name, fn) {
    this.unwatches[name] = timer.watch(fn)
  }

  unwatchTimer(name) {
    const fn = this.unwatches[name]
    if (typeof fn === 'function') {
      fn()
    }
    delete this.unwatches[name]
  }

  /* a timer's time update */
  _update = () => {
    if (!this._stopWatching) {
      this.setNextTimers()
      this._callback(this.getContext())
    }
  }

  init(fn) {
    this._callback = fn
    if (this.hoistedTimeouts != null) {
      Object.keys(this.hoistedTimeouts).forEach(name => {
        this.watchTimer(this.timers[name], name, this._update)
      })
    }
  }

  destory() {
    this._stopWatching = true
    Object.keys(this.timers).forEach(name => {
      this.destoryTimer(name)
    })
    this._callback = null
  }
}
