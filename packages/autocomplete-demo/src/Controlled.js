import React from 'react'
import Autocomplete from '@dgeibi/autocomplete'
import '@dgeibi/autocomplete/dist/index.css'

const codeA = 'A'.charCodeAt(0)

class App extends React.Component {
  state = {
    value: '',
    placeholder: 'enter here',
  }

  handleChange = v => {
    this.setState({
      value: v,
    })
  }

  handleSelect = v => {
    console.log('selected', v)
  }

  render() {
    const { value, placeholder } = this.state
    return (
      <section>
        placeholder:
        <input
          placeholder="enter placeholder"
          value={placeholder}
          onChange={e => {
            this.setState({ placeholder: e.target.value })
          }}
        />
        <br />
        value:
        <input
          value={value}
          onChange={e => {
            this.setState({ value: e.target.value })
          }}
        />
        <Autocomplete
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          dataSource={Array.from(Array(100), (v, k) =>
            Array.from(Array(Math.ceil(k / 2) + 1), () =>
              String.fromCharCode(codeA + k % 26)
            ).join('')
          )}
        />
      </section>
    )
  }
}

export default App
