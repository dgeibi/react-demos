import React, { Component } from 'react'

import TimerController from './TimerController'
import TimerContext from './TimerContext'
import Timer from './Timer'
import Scheduler from './Scheduler'

class TimerProvider extends Component {
  static Timer = Timer
  static Scheduler = Scheduler

  constructor(props) {
    super(props)
    const timerController = new TimerController({
      timeouts: props.timeouts,
    })
    this.state = {
      timerController,
      timers: timerController.timers,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { timerController } = prevState
    const { timeouts, resetAllWhenTimeoutsChange } = nextProps
    const timers = timerController.update({ timeouts, resetAllWhenTimeoutsChange })
    return timers ? { timers } : null
  }

  componentDidMount() {
    this.state.timerController.init(timers => {
      this.setState({
        timers,
      })
    })
  }

  componentWillUnmount() {
    this.state.timerController.destory()
  }

  render() {
    return (
      <TimerContext.Provider value={this.state.timers}>
        {this.props.children}
      </TimerContext.Provider>
    )
  }
}

export { Scheduler, Timer, TimerProvider }
