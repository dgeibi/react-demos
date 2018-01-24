import React, { Component } from 'react'
import PropTypes from 'prop-types'
import escapeStringRegexp from 'escape-string-regexp'
import './Autocomplete.css'

class Autocomplete extends Component {
  state = {
    value: '',
    cursor: 0,
    shouldShow: false,
    hover: false,
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  setValue(value, shouldShow) {
    this.setState({ value, cursor: 0, shouldShow })
  }

  isShowed() {
    return this.state.shouldShow && this.ul && this.ul.childNodes.length > 0
  }

  handleInput = e => {
    this.setValue(e.target.value, true)
  }

  handleClick = e => {
    if (!e.target.matches('li')) return
    this.setValue(e.target.textContent, false)
  }

  handleKeyDown = event => {
    if (event.keyCode === 38) {
      this.up()
    } else if (event.keyCode === 40) {
      this.down()
    } else if (event.keyCode === 13) {
      this.enter()
    }
  }

  down() {
    const { cursor } = this.state
    if (this.isShowed()) {
      this.setState({
        cursor: (cursor + 1) % this.length,
      })
    }
  }

  up() {
    const { cursor } = this.state
    if (this.isShowed()) {
      this.setState({
        cursor: (cursor - 1 + this.length) % this.length,
      })
    }
  }

  enter() {
    const { cursor } = this.state
    if (this.ul) {
      const value = this.ul.childNodes[cursor].textContent
      this.setValue(value, false)
    }
  }

  handleScroll = () => {
    if (this.cursorInView()) return
    const unitH = this.ul.scrollHeight / this.ul.childNodes.length
    const n = Math.max(Math.ceil(this.ul.scrollTop / unitH), 0)
    this.setState({
      cursor: n,
    })
  }

  saveList = ul => {
    this.ul = ul
  }

  handleFocus = () => {
    this.setState({
      shouldShow: true,
    })
  }

  handleBlur = () => {
    if (!this.state.hover && this.state.shouldShow) {
      this.setState({
        shouldShow: false,
      })
    }
  }

  handleMouseEnter = () => {
    this.setState({
      hover: true,
    })
  }

  handleMouseLeave = () => {
    this.setState({
      hover: false,
    })
  }

  cursorInView(cursor = this.state.cursor) {
    if (this.isShowed()) {
      const { height } = this.ul.getBoundingClientRect()
      const activeTop = this.ul.childNodes[cursor].offsetTop
      const scrollTop = this.ul.scrollTop
      return activeTop >= scrollTop && activeTop < scrollTop + height - 20
    }
    return false
  }

  componentDidUpdate(prevProps, prevState) {
    const { cursor } = this.state
    if (prevState.cursor !== cursor && this.isShowed() && !this.cursorInView(cursor)) {
      this.ul.scrollTop = this.ul.childNodes[cursor].offsetTop
    }
  }

  renderList() {
    if (!this.state.shouldShow) return null
    const { value, cursor } = this.state
    const regex = new RegExp(escapeStringRegexp(value), 'i')
    const items = this.props.items.filter(x => regex.test(x))
    this.length = items.length
    if (this.length === 0) return null
    return (
      <ul
        ref={this.saveList}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onScroll={this.handleScroll}
        className="autocomplete__list"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={
              index === cursor
                ? 'autocomplete__item autocomplete__item--active'
                : 'autocomplete__item'
            }
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const { value } = this.state
    return (
      <div className="autocomplete">
        <input
          type="search"
          value={value}
          onInput={this.handleInput}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="autocomplete__input"
        />
        {this.renderList()}
      </div>
    )
  }
}

export default Autocomplete
