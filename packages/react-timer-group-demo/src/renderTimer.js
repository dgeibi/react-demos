import React from 'react'
import convertMS from './convertMS'

export default function renderTimer({
  name,
  timer: { timeout, running, end, start, pause, reset, stop, disabled },
}) {
  if (disabled) return <div> disabled </div>
  return (
    <div>
      {name} {convertMS(timeout)}
      {!end &&
        (running ? (
          <button type="button" onClick={pause}>
            pause
          </button>
        ) : (
          <button type="button" onClick={start}>
            start
          </button>
        ))}
      {end ? (
        <button type="button" onClick={reset}>
          reset
        </button>
      ) : (
        <button type="button" onClick={stop}>
          stop
        </button>
      )}
    </div>
  )
}
