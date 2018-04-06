import TimerLogic from './utils/Timer'

/**
 * @param {number|string} second
 * @returns {number} millisecond
 */
function convertSecond(second) {
  const millisecond = Math.floor(second) * 1e3
  if (Number.isNaN(millisecond)) {
    throw Error('secs should be number')
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
    if (nextTimeouts === oldTimeouts) return false
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
        } else if (resetAllWhenTimeoutsChange || oldTimeout !== nextTimeout) {
          // reset timer
          const timeout = convertSecond(nextTimeout)
          this.timers[name].setup({ timeout })
        }
      }
    }
    this.timeouts = nextTimeouts
    return !equal // changed
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

  init(fn) {
    const update = () => {
      // update ref
      this.context = Object.assign({}, this.context)
      fn(this.context)
    }
    this.forEachName(name => {
      this.watchTimer(name, update)
    })
  }

  destory() {
    this.forEachName(name => {
      this.destoryTimer(name)
    })
  }
}
