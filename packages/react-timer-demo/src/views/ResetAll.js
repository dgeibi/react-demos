import React from 'react'
import { Timer, TimerProvider } from '@dgeibi/react-timer'
import linkState from '../linkState'
import renderTimer from '../renderTimer'

export default class ResetAll extends React.Component {
  state = {
    bTimeout: 40,
    resetAllWhenTimeoutsChange: false,
  }
  link = linkState(this)

  renderTimers() {
    const { bTimeout, resetAllWhenTimeoutsChange } = this.state
    const { inline } = this.props

    return inline ? (
      <TimerProvider resetAllWhenTimeoutsChange={resetAllWhenTimeoutsChange}>
        <Timer name="a" timeout={30} render={renderTimer} />
        <Timer
          name="b"
          timeout={Number.isFinite(Number(bTimeout)) ? bTimeout : -1}
          render={renderTimer}
        />
      </TimerProvider>
    ) : (
      <TimerProvider
        timeouts={{
          a: 30,
          b: Number.isFinite(Number(bTimeout)) ? bTimeout : -1,
        }}
        resetAllWhenTimeoutsChange={resetAllWhenTimeoutsChange}
      >
        <Timer name="a" render={renderTimer} />
        <Timer name="b" render={renderTimer} />
      </TimerProvider>
    )
  }

  render() {
    const { inline } = this.props

    return (
      <section>
        <h1>
          {inline ? '[inline] ' : ''}Whether to Reset All Timers When Timeouts Change
        </h1>
        <label>
          change b's timeout: <input placeholder="x second" {...this.link('bTimeout')} />
        </label>
        <div>
          <label>
            reset all when timeouts change:{' '}
            <input
              type="checkbox"
              {...this.link('resetAllWhenTimeoutsChange', 'checked')}
            />
          </label>
        </div>
        {this.renderTimers()}
      </section>
    )
  }
}
