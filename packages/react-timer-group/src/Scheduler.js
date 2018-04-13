import React, { Component } from 'react'
import TimerContext from './TimerContext'

class Scheduler extends Component {
  constructor(props, context) {
    super(props, context)
    const { render } = props
    if (typeof render !== 'function') {
      throw Error('<Scheduler>: Prop `render` should be a function')
    }
  }

  render() {
    return (
      <TimerContext.Consumer>
        {({ timers }) => this.props.render({ timers })}
      </TimerContext.Consumer>
    )
  }
}

export default Scheduler
