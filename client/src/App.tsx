import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import 'normalize.css'
import './App.css'

import { LocalStorage } from './utils/Storage'

import AppRoot, { Props as AppRootProps, AppStorage } from './AppRoot'

export interface Props {
  storage?: AppRootProps['storage']
}

const App = ({ storage = new LocalStorage<AppStorage>() }) => (
  <BrowserRouter>
    <AppRoot storage={storage} />
  </BrowserRouter>
)

export default App
