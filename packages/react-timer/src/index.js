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
    const { timeouts, resetAllWhenTimeoutsChange } = props
    const timerController = new TimerController({
      resetAllWhenTimeoutsChange,
      timeouts,
    })
    this.state = {
      timerController,
      context: timerController.context,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { timerController } = prevState
    const { timeouts, resetAllWhenTimeoutsChange } = nextProps
    const context = timerController.update({ timeouts, resetAllWhenTimeoutsChange })
    return context ? { context } : null
  }

  componentDidMount() {
    const { timerController } = this.state
    timerController.init(context => {
      this.setState({
        context,
      })
    })
    if (timerController.context !== this.state.context) {
      this.setState({
        context: timerController.context,
      })
    }
  }

  componentWillUnmount() {
    this.state.timerController.destory()
  }

  render() {
    return (
      <TimerContext.Provider value={this.state.context}>
        {this.props.children}
      </TimerContext.Provider>
    )
  }
}

export { Scheduler, Timer, TimerProvider }
