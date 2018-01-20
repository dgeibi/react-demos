import React from 'react'
import { Provider } from 'react-redux'

import store from './store'
import { view as Watch } from './watch'

export default () => (
  <Provider store={store}>
    <div>
      <Watch timeout={20} id={1} />
      <Watch timeout={30} id={2} />
    </div>
  </Provider>
)
