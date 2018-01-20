import React from 'react'
import Autocomplete from '@dgeibi/autocomplete'
import '@dgeibi/autocomplete/dist/@dgeibi/autocomplete.css'

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
