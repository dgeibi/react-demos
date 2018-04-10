import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import './index.css'
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
    dots: true,
    prefixCls: '',
    className: '',
  }

  _childLength = 0
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

  fitDOM() {
    const rindex = this.getRealIndex(this.state.currentIndex)
    const width = this.getSlideWidth()
    this.setState({
      currentIndex: rindex,
      slideWidth: width,
      x: rindex * width,
    })
  }

  /* dom update */
  update() {
    this.fitDOM()
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

  goToRealIndexDirectly() {
    const index = this.state.currentIndex
    const rindex = this.getRealIndex(index)
    const { slideWidth: width } = this.state

    this.setState({
      x: width * rindex,
      currentIndex: rindex,
    })
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
        this.goToRealIndexDirectly()
        if (this.props.autoPlay) {
          this.play()
        }
      },
    })
  }

  goTo(index) {
    const { currentIndex } = this.state
    if (this.getRealIndex(currentIndex) !== this.getRealIndex(index)) {
      this.pause()
      this.cancelAnimate()
      const distance = (index - currentIndex) * this.state.slideWidth
      this.moveTo({
        distance,
        index,
      })
    }
  }

  next = () => {
    const { currentIndex } = this.state
    if (currentIndex > -this._childLength) {
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
    if (index < 1 - this._childLength) {
      return 0
    } else if (index > 0) {
      return 1 - this._childLength
    }
    return index
  }

  cancelAnimate() {
    if (this._cancelAnimate) {
      this._cancelAnimate()
      this._cancelAnimate = null
    }
  }

  /**
   * auto slide to the next
   * @param {number} interval
   */
  play(interval = this.props.autoplayInterval) {
    this.pause()
    if (this._touching) return
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null
      this.next()
    }, interval)
  }

  /**
   * cancel autoplay
   */
  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  getPrefixedCls(cls) {
    const { prefixCls } = this.props
    return prefixCls + cls
  }

  getSlideStyle() {
    const width = this.state.slideWidth
    this._slideStyle =
      this._slideStyle && this._slideStyle.width === width
        ? this._slideStyle
        : {
            width,
            float: 'left',
          }
    return this._slideStyle
  }

  renderDots() {
    const index = this.getRealIndex(this.state.currentIndex)
    const dotCls = this.getPrefixedCls('carousel-dot')
    const activeDotCls = classnames([dotCls, this.getPrefixedCls('carousel-dot-active')])
    return (
      <div className={this.getPrefixedCls('carousel-dots')}>
        {this._childLength > 0 &&
          Array.from(Array(this._childLength), (v, k) => (
            <button
              key={k}
              onClick={() => {
                this.goTo(-k)
              }}
              type="button"
              className={k === -index ? activeDotCls : dotCls}
            />
          ))}
      </div>
    )
  }

  renderTrack() {
    const children = React.Children.toArray(this.props.children)
    const head = children[0]
    const tail = children[children.length - 1]
    const length = children.length
    this._childLength = length
    const index = this.getRealIndex(this.state.currentIndex)

    const slideCls = this.getPrefixedCls('carousel-slide')
    const activeSlideCls = classnames([
      slideCls,
      this.getPrefixedCls('carousel-slide-active'),
    ])
    const wrapChild = (child, k) => (
      <div
        style={this.getSlideStyle()}
        className={k === -index ? activeSlideCls : slideCls}
      >
        {child}
      </div>
    )
    const { slideWidth, x } = this.state

    return (
      <div
        className={this.getPrefixedCls('carousel-track')}
        style={{
          width: (length + 2) * slideWidth,
          transform: `translateX(${x - slideWidth}px)`,
        }}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        {wrapChild(tail, length - 1)}
        {React.Children.map(this.props.children, wrapChild)}
        {wrapChild(head, 0)}
      </div>
    )
  }

  render() {
    const className = classnames({
      [this.getPrefixedCls('carousel')]: true,
      [this.props.className]: Boolean(this.props.className),
    })
    return (
      <div className={className} style={this.props.style}>
        {this.renderTrack()}
        {this.props.dots && this.renderDots()}
      </div>
    )
  }
}
