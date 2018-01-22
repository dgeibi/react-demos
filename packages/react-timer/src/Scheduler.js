import { Component } from 'react'
import PropTypes from 'prop-types'

class Scheduler extends Component {
  constructor(props, context) {
    super(props, context)
    const { render } = props
    if (typeof render !== 'function') {
      throw Error('<Scheduler>: prop render should be a function')
    }
  }

  static contextTypes = {
    timer: PropTypes.object,
  }

  componentWillMount() {
    this.unsubscribe = this.context.timer.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  computeCustomProps() {
    const { getCustomProps, names, timers } = this.context.timer
    if (getCustomProps) return getCustomProps(timers, names)
    return null
  }

  render() {
    const { timers } = this.context.timer
    return this.props.render({
      ...this.computeCustomProps(),
      timers,
    })
  }
}

export default Scheduler
