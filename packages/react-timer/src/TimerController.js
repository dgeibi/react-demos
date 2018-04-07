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
    this.context = { timers: this.timers }
    this.forEachName(name => {
      this.createTimer(name, timeouts[name])
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
    for (let i = 0; i < nextNames.length; i += 1) {
      const name = nextNames[i]
      if (!(name in oldTimeouts)) {
        // init new timer
        this.createTimer(name, nextTimeouts[name])
        this.watchTimer(name, this._update)
        equal = false
      } else if (equal && oldTimeouts[name] !== nextTimeouts[name]) {
        equal = false
      }
    }
    if (!equal) {
      this._stopWatching = true
      for (let i = 0; i < oldNames.length; i += 1) {
        const name = oldNames[i]
        const nextTimeout = nextTimeouts[name]
        const oldTimeout = oldTimeouts[name]

        // cleanup timer
        if (!(name in nextTimeouts)) {
          this.destoryTimer(name)
        } else if (resetAllWhenTimeoutsChange || oldTimeout !== nextTimeout) {
          // reset timer
          const timeout = convertSecond(nextTimeout)
          this.timers[name].setup({ timeout })
        }
      }
      this._stopWatching = false
    }
    this.timeouts = nextTimeouts
    return !equal ? this._setNewContext() : null
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

  _setNewContext() {
    // update ref
    this.context = Object.assign({}, this.context)
    return this.context
  }

  watchTimer(name, fn) {
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

  _update = () => {
    if (!this._stopWatching) {
      this._callback(this._setNewContext())
    }
  }

  init(fn) {
    this._callback = fn
    this.forEachName(name => {
      this.watchTimer(name, this._update)
    })
  }

  destory() {
    this.forEachName(name => {
      this.destoryTimer(name)
    })
    this._callback = null
  }
}
