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
      context: timerController.context,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { timerController } = prevState
    const { timeouts, resetAllWhenTimeoutsChange } = nextProps
    timerController.update({ timeouts, resetAllWhenTimeoutsChange })
    return null
  }

  componentDidMount() {
    this.state.timerController.init(context => {
      this.setState({
        context,
      })
    })
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
