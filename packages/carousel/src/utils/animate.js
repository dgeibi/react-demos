/**
 * copy from http://javascript.info/js-animation
 */
export default function animate({ timing, draw, duration, onEnd }) {
  const start = performance.now()
  let handle = requestAnimationFrame(function step(time) {
    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration
    if (timeFraction > 1) timeFraction = 1

    // calculate the current animation state
    const progress = timing(timeFraction)

    draw(progress) // draw it

    if (timeFraction < 1) {
      handle = requestAnimationFrame(step)
    } else if (onEnd) {
      onEnd()
    }
  })

  return () => {
    cancelAnimationFrame(handle)
  }
}
