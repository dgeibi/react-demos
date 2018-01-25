import React, { Component } from 'react'
import bezier from 'bezier-easing'
import Carousel from '@dgeibi/carousel'
import '@dgeibi/carousel/dist/index.css'
import './App.css'

export default class App extends Component {
  state = {
    count: 4,
  }

  render() {
    const { count } = this.state

    return (
      <div
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '0 10px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            this.setState({
              count: count + 1,
            })
          }}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => {
            this.setState({
              count: Math.max(count - 1, 0),
            })
          }}
        >
          -
        </button>
        <Carousel
          autoPlay
          style={{
            marginTop: '16px',
          }}
        >
          {Array.from(Array(count), (v, k) => (
            <div key={k}>
              <h3 className="slice">{k + 1}</h3>
            </div>
          ))}
        </Carousel>

        <Carousel
          autoPlay
          timing={bezier(0.77, 0.09, 0.23, 0.73)}
          style={{
            marginTop: '16px',
          }}
        >
          {Array.from(Array(count), (v, k) => (
            <div key={k}>
              <h3 className="slice">{k + 1}</h3>
            </div>
          ))}
        </Carousel>
      </div>
    )
  }
}
