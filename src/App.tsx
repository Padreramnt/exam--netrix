import * as React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import AnalyticEvents from './AnalyticEvents'
import VideoPlayer from './VideoPlayer'

export default function App() {
	return (
		<Provider store={store}>
			<main className='main'>
				<VideoPlayer />
				<AnalyticEvents />
			</main>
		</Provider>
	)
}
