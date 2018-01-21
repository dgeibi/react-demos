import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import animate from './utils/animate'
import getWidth from './utils/getWidth'

const LEFT = false
const RIGHT = true

export default class Carousel extends Component {
  static defaultProps = {
    autoPlay: false,
    autoplayInterval: 1000,
    animateDuration: 500,
    timing: p => p,
  }

  _touchStartX = 0
  _touching = false
  state = {
    x: 0,
    currentIndex: 0,
    slideWidth: 0,
    direction: null,
  }

  componentWillReceiveProps(nextProps) {
    const oldCount = React.Children.count(this.props.children)
    const newCount = React.Children.count(nextProps.children)
    if (oldCount > newCount && newCount <= -this.getRealIndex(this.state.currentIndex)) {
      this.cancelAnimate()
      this.setState({
        currentIndex: 0,
        x: 0,
      })
    }
    if (!this.timeoutId && nextProps.autoPlay) {
      this.play(nextProps.autoplayInterval)
    } else if (!nextProps.autoPlay) {
      this.pause()
    }
  }

  componentDidMount() {
    this.update()
    window.addEventListener('resize', this.onWindowResized)
  }

  getSlideWidth() {
    const element = ReactDOM.findDOMNode(this)
    return Math.max(Math.floor(getWidth(element)), 0)
  }

  onWindowResized = () => {
    this.cancelAnimate()
    this.update()
  }

  fitX() {
    const rindex = this.getRealIndex(this.state.currentIndex)
    const width = this.getSlideWidth()
    this.setState({
      currentIndex: rindex,
      slideWidth: width,
      x: rindex * width,
    })
  }

  update() {
    this.fitX()
    if (this.props.autoPlay) {
      this.play()
    }
  }

  componentWillUnmount() {
    this.cancelAnimate()
    this.pause()
    window.removeEventListener('resize', this.onWindowResized)
  }

  onTouchStart = event => {
    if (this._cancelAnimate) return
    this.pause()
    this._touchStartX = event.touches[0].clientX
    this._touching = true
  }

  onTouchMove = event => {
    if (!this._cancelAnimate && event.touches[0]) {
      const { slideWidth: width } = this.state
      this.pause()
      this._touching = true
      let delteX = event.touches[0].clientX - this._touchStartX
      if (Math.abs(delteX) > width) {
        delteX = delteX < 0 ? -width : width
      }
      this.setState({
        x: delteX + this.state.currentIndex * width,
        direction: delteX > 0 ? RIGHT : LEFT,
      })
    }
  }

  onTouchEnd = () => {
    if (this._cancelAnimate) return
    const { slideWidth: width } = this.state

    this._touching = false
    const fator = this.state.direction === LEFT ? -0.25 : 0.25
    const index = Math.round(this.state.x / width + fator)
    const distance = index * width - this.state.x
    this.moveTo({ distance, index })
  }

  moveTo({ distance, index }) {
    if (this._cancelAnimate) return
    const lastX = this.state.x
    this._cancelAnimate = animate({
      duration: this.props.animateDuration,
      timing: this.props.timing,
      draw: p => {
        const x = lastX + p * distance
        this.setState({
          x,
          currentIndex: index,
        })
      },
      onEnd: () => {
        this._cancelAnimate = null
        const rindex = this.getRealIndex(index)
        const { slideWidth: width } = this.state

        this.setState({
          x: width * rindex,
          currentIndex: rindex,
        })
        if (this.props.autoPlay) {
          this.play()
        }
      },
    })
  }

  goTo(index) {
    if (this._cancelAnimate) return
    const { currentIndex } = this.state
    const { slideWidth: width } = this.state

    const distance = (index - currentIndex) * width
    if (distance !== 0) {
      this.moveTo({
        distance,
        index,
      })
    }
  }

  next = () => {
    const { currentIndex } = this.state
    if (currentIndex > -this.childCount) {
      this.goTo(currentIndex - 1)
    }
  }

  prev = () => {
    const { currentIndex } = this.state
    if (currentIndex <= 0) {
      this.goTo(currentIndex + 1)
    }
  }

  getRealIndex(index) {
    if (index < 1 - this.childCount) {
      return 0
    } else if (index > 0) {
      return 1 - this.childCount
    }
    return index
  }

  cancelAnimate() {
    if (this._cancelAnimate) {
      this._cancelAnimate()
      this._cancelAnimate = null
    }
  }

  play(interval = this.props.autoplayInterval) {
    this.pause()
    if (this._touching) return
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null
      this.next()
    }, interval)
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  wrapChild = child => (
    <div
      style={{
        width: this.state.slideWidth,
        float: 'left',
      }}
      className="carousel-child"
    >
      {child}
    </div>
  )

  render() {
    const children = React.Children.toArray(this.props.children)
    const head = children[0]
    const tail = children[children.length - 1]
    this.childCount = children.length

    const index = this.getRealIndex(this.state.currentIndex)
    return (
      <div
        style={{
          overflow: 'hidden',
        }}
      >
        <div
          className="Carousel-wrapper"
          style={{
            width: (children.length + 2) * this.state.slideWidth,
            transform: `translateX(${this.state.x - this.state.slideWidth}px)`,
          }}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
        >
          {this.wrapChild(tail)}
          {React.Children.map(this.props.children, this.wrapChild)}
          {this.wrapChild(head)}
        </div>
        {this.childCount > 0 &&
          Array.from(Array(this.childCount), (v, k) => (
            <button
              key={k}
              onClick={() => this.goTo(-k)}
              type="button"
              style={{
                background: k === -index ? '#00ee11' : 'grey',
                border: 0,
              }}
            >
              {k + 1}
            </button>
          ))}
        <div>
          <button type="button" onClick={this.prev}>
            prev
          </button>
          <button type="button" onClick={this.next}>
            next
          </button>
        </div>
      </div>
    )
  }
}
