import { render } from 'react-dom'
import * as React from 'react'
import App from './App'
import { fetchAnalyticEvents } from './actions'
import { ANALYTIC_EVENTS_API } from './const'

const div = document.createElement('div')
document.body.append(div)

fetchAnalyticEvents(ANALYTIC_EVENTS_API)
render(<App />, div)//-
