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
  constructor({ timeouts }) {
    /** @type {{[x: string]: function }} */
    this.unwatches = {}

    /** @type {{ [x: string]: TimerLogic }} */
    this.timers = {}
    this.timeouts = timeouts
    this.forEachName(name => {
      this.timers[name] = TimerController.createTimer(timeouts[name])
    })
  }

  forEachName(fn) {
    Object.keys(this.timeouts).forEach(fn)
  }

  update({ timeouts, resetAllWhenTimeoutsChange }) {
    const nextTimeouts = timeouts
    const oldTimeouts = this.timeouts
    /* not changed */
    if (nextTimeouts === oldTimeouts) return null
    const oldNames = Object.keys(oldTimeouts)
    const nextNames = Object.keys(nextTimeouts)
    let equal = oldNames.length === nextNames.length
    const newTimers = {}
    for (let i = 0; i < nextNames.length; i += 1) {
      const name = nextNames[i]
      if (!(name in oldTimeouts)) {
        newTimers[name] = TimerController.createTimer(nextTimeouts[name])
        this.watchTimer(newTimers[name], name, this._update)
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
        } else if (resetAllWhenTimeoutsChange || oldTimeout !== nextTimeout) {
          this.resetTimer(name, nextTimeout)
        }
      }
      this._stopWatching = false
    }
    this.timeouts = nextTimeouts
    return !equal ? this.timers : null
  }

  static createTimer(timeout) {
    return new TimerLogic({ timeout: convertSecond(timeout) })
  }

  setNextTimers(newTimers) {
    this.timers = Object.assign({}, this.timers, newTimers)
    return this.timers
  }

  resetTimer(name, timeout) {
    this.timers[name].setup({ timeout: convertSecond(timeout) })
  }

  destoryTimer(name) {
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

  _update = () => {
    if (!this._stopWatching) {
      this._callback(this.setNextTimers())
    }
  }

  init(fn) {
    this._callback = fn
    this.forEachName(name => {
      this.watchTimer(this.timers[name], name, this._update)
    })
  }

  destory() {
    this.forEachName(name => {
      this.destoryTimer(name)
    })
    this._callback = null
  }
}
