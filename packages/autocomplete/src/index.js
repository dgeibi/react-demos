import React, { Component } from 'react'
import PropTypes from 'prop-types'
import escapeStringRegexp from 'escape-string-regexp'
import classnames from 'classnames'
import noop from 'no-op'
import './Autocomplete.css'

class Autocomplete extends Component {
  state = {
    value: this.props.value,
    cursor: 0,
    open: false,
    hover: false,
    placeholder: this.props.placeholder,
  }

  static defaultProps = {
    onChange: noop,
    onSelect: noop,
    value: '',
    placeholder: '',
    prefixCls: '',
    className: '',
  }

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
  }

  setValue({ value, select }) {
    this.setState({ value, cursor: 0, open: !select })
    this.props.onChange(value)
    if (select) {
      this.props.onSelect(value)
    }
  }

  isOpen() {
    return this.state.open && this.ul
  }

  handleInput = e => {
    const value = e.target.value
    this.setValue({
      value,
      select: false,
    })
  }

  handleClick = e => {
    if (!e.target.matches('li')) return
    const value = e.target.textContent
    this.setValue({
      value,
      select: true,
    })
  }

  handleKeyDown = event => {
    if (event.keyCode === 38) {
      this.up()
    } else if (event.keyCode === 40) {
      this.down()
    } else if (event.keyCode === 13) {
      this.select()
    }
  }

  down() {
    const { cursor } = this.state
    if (this.isOpen()) {
      this.setState({
        cursor: (cursor + 1) % this.length,
      })
    }
  }

  up() {
    const { cursor } = this.state
    if (this.isOpen()) {
      this.setState({
        cursor: (cursor - 1 + this.length) % this.length,
      })
    }
  }

  select() {
    const { cursor } = this.state
    if (this.ul) {
      const value = this.ul.childNodes[cursor].textContent
      this.setValue({
        value,
        select: true,
      })
    }
  }

  saveList = ul => {
    this.ul = ul
  }

  handleFocus = () => {
    this.setState({
      open: true,
    })
  }

  handleBlur = () => {
    if (!this.state.hover && this.state.open) {
      this.setState({
        open: false,
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
    if (this.isOpen()) {
      const { clientHeight, scrollTop } = this.ul
      const { offsetTop: activeTop, offsetHeight: childHeight } = this.ul.childNodes[
        cursor
      ]
      return (
        activeTop >= scrollTop &&
        Math.round(activeTop + childHeight - (scrollTop + clientHeight)) <= 0
      )
    }
    return false
  }

  componentDidUpdate(prevProps, prevState) {
    const { cursor } = this.state
    if (prevState.cursor !== cursor && this.isOpen() && !this.cursorInView(cursor)) {
      const { clientHeight } = this.ul
      const node = this.ul.childNodes[cursor]
      const { offsetTop } = node
      if (prevState.cursor < cursor) {
        const { offsetHeight } = node
        this.ul.scrollTop = offsetTop - clientHeight + offsetHeight
      } else {
        this.ul.scrollTop = offsetTop
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.placeholder !== this.props.placeholder) {
      this.setState({ placeholder: nextProps.placeholder })
    }
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value, cursor: 0 })
    }
  }

  renderList() {
    const { value, cursor } = this.state
    const { prefixCls, dataSource } = this.props
    const regex = new RegExp(escapeStringRegexp(String(value)), 'i')
    const items = dataSource.filter(x => regex.test(x))
    this.length = items.length
    const ulClasses = classnames({
      [`${prefixCls}autocomplete__list`]: true,
      [`${prefixCls}autocomplete__list--hidden`]: !this.state.open || this.length <= 0,
    })
    const itemCls = `${prefixCls}autocomplete__item`
    const itemActiveCls = `${itemCls} ${prefixCls}autocomplete__item--active`

    return (
      <ul
        ref={this.saveList}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={ulClasses}
      >
        {items.map((item, index) => (
          <li key={index} className={index === cursor ? itemActiveCls : itemCls}>
            {item}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const { value, placeholder } = this.state
    const { prefixCls, className } = this.props
    const cls = classnames({
      [`${prefixCls}autocomplete`]: true,
      className: Boolean(className),
    })
    return (
      <div className={cls}>
        <input
          type="search"
          value={value}
          placeholder={placeholder}
          onInput={this.handleInput}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className={`${prefixCls}autocomplete__input`}
        />
        {this.renderList()}
      </div>
    )
  }
}

export default Autocomplete
