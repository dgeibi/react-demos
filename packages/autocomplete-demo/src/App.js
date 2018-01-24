import React from 'react'
import Autocomplete from '@dgeibi/autocomplete'
import '@dgeibi/autocomplete/dist/@dgeibi/autocomplete.css'

const codeA = 'A'.charCodeAt(0)

function App() {
  return (
    <div className="wrapper">
      <section>
        <Autocomplete
          items={Array.from(Array(100), (v, k) =>
            Array.from(Array(Math.ceil(k / 2) + 1), () =>
              String.fromCharCode(codeA + k % 26)
            ).join('')
          )}
        />
      </section>
    </div>
  )
}

export default App
