import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import 'normalize.css'
import './App.css'

import AppRoot from './AppRoot'

const App = () => (
  <BrowserRouter>
    <AppRoot />
  </BrowserRouter>
)

export default App
