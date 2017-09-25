import React from 'react'
import Autocomplete from 'c-autocomplete'

function App() {
  return (
    <div className="wrapper">
      <section>
        <Autocomplete items={['a', 'b', 'c']} />
      </section>
    </div>
  )
}

export default App
